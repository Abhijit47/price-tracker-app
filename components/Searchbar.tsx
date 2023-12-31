'use client';
import { scrapeAndStoreProduct } from '@/lib/actions';
import { useState, FormEvent } from 'react';

const isValidAmazonProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if (
      hostname.includes('amazon.com') ||
      hostname.includes('amazon.') ||
      hostname.endsWith('amazon')
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
};

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(searchPrompt);

    if (!isValidLink) return alert('Please provide a valid Amazon link.');

    try {
      setIsLoading(true);

      // Scrape the product page
      await scrapeAndStoreProduct(searchPrompt);
      setSearchPrompt('');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSubmit}>
      <input
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        type='text'
        id='searchbar'
        name='searchbar'
        autoComplete='off'
        placeholder='Enter Product Link'
        className='searchbar-input'
      />
      <button
        type='submit'
        className='searchbar-btn'
        disabled={searchPrompt === ''}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};

export default Searchbar;
