'use server';
import { revalidatePath } from 'next/cache';
import Product from '../models/products.model';
import { connectToDB } from '../mongoose';
import { scrapeAmazonProduct } from '../scraper';
import { getAveragePrice, getHighestPrice, getLowestPrice } from '../utils';
import { User } from '@/types';
import { generateEmailBody, sendEmail } from '../nodemailer';

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    connectToDB();

    const scrapedProduct = await scrapeAmazonProduct(productUrl);

    if (!scrapedProduct) return;

    let product = scrapedProduct;

    // Check if the product already exists in the database
    const existingProduct = await Product.findOne({ url: productUrl });

    // If the product exists, update priceHistory
    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];

      // Update the product
      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    // Create a new product
    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

    // Revalidate the product page
    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getProductByID(productID: string) {
  try {
    //EDGE Functionality
    connectToDB();

    //
    const product = await Product.findOne({ _id: productID });

    // check if product exists in database or not
    if (!product) return null;

    return product;
  } catch (error: any) {
    throw new Error(`Failed to get product: ${error.message}`);
  }
}

export async function getAllProducts() {
  try {
    connectToDB();

    const products = await Product.find({});

    return products;
  } catch (error: any) {
    throw new Error(`Failed to get products: ${error.message}`);
  }
}

export async function getSimilarProducts(productID: string) {
  try {
    connectToDB();

    const currentProduct = await Product.findById(productID);

    if (!currentProduct) return null;

    const similarProducts = await Product.find({
      category: currentProduct.category,
      _id: { $ne: currentProduct._id },
    }).limit(3);

    return similarProducts;
  } catch (error: any) {
    throw new Error(`Failed to get products: ${error.message}`);
  }
}

export async function addUserEmailToProduct(
  productID: string,
  userEmail: string
) {
  try {
    const product = await Product.findById(productID);

    if (!product) return null;

    const userExists = product.users.some(
      (user: User) => user.email === userEmail
    );

    if (!userExists) {
      product.users.push({ email: userEmail });

      await product.save();

      const emailContent = await generateEmailBody(product, 'WELCOME');

      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error: any) {
    throw new Error(`Failed to add user email to product: ${error.message}`);
  }
}
