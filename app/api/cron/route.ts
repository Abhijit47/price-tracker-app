import Product from '@/lib/models/products.model';
import { connectToDB } from '@/lib/mongoose';
import { generateEmailBody, sendEmail } from '@/lib/nodemailer';
import { scrapeAmazonProduct } from '@/lib/scraper';
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice,
} from '@/lib/utils';
import { NextResponse } from 'next/server';

// export const maxDuration = 10;
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    connectToDB();
    const products = await Product.find({}).lean();

    if (!products) throw new Error('No products found');

    // 1. SCRAPE LATEST PRODUCT DETAILS & UPDATE TO DB
    const updatedProducts = await Promise.all(
      products.map(async (currentProduct: any) => {
        const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);

        if (!scrapedProduct) throw new Error('Error scraping product');

        const updatedPriceHistory = [
          ...currentProduct.priceHistory,
          { price: scrapedProduct.currentPrice },
        ];

        // Update the product
        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        // Create a new product
        const updatedProduct = await Product.findOneAndUpdate(
          { url: product.url },
          product
        );

        // 2. Check each products status and SEND NOTIFICATIONS TO USERS
        const emailNotifType = getEmailNotifType(
          scrapedProduct,
          currentProduct
        );

        if (emailNotifType && updatedProduct.users.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
          };

          const emailContent = await generateEmailBody(
            productInfo,
            emailNotifType
          );
          // Send email to each user

          const userEmails = updatedProduct.users.map(
            (user: any) => user.email
          );

          await sendEmail(emailContent, userEmails);
        }

        return updatedProduct;
      })
    );

    return NextResponse.json(
      {
        message: 'Successfully updated products',
        products: updatedProducts,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    throw new Error('Error in GET /api/cron');
  }
}
