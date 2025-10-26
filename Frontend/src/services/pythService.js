import axios from 'axios';
import { PYTH_PRICE_FEEDS } from '../utils/constants';

class PythService {
  constructor() {
    this.endpoint = import.meta.env.VITE_PYTH_ENDPOINT || 'https://hermes.pyth.network';
  }

  // Get latest price for a feed
  async getLatestPrice(feedId) {
    try {
      const response = await axios.get(
        `${this.endpoint}/api/latest_price_feeds`,
        {
          params: {
            ids: [feedId],
          },
        }
      );

      if (response.data && response.data.length > 0) {
        const priceData = response.data[0];
        return this.parsePriceData(priceData);
      }

      throw new Error('No price data available');
    } catch (error) {
      console.error('Error fetching Pyth price:', error);
      throw error;
    }
  }

  // Parse Pyth price data
  parsePriceData(priceData) {
    const price = priceData.price.price;
    const expo = priceData.price.expo;
    const conf = priceData.price.conf;

    // Calculate actual price
    const actualPrice = price * Math.pow(10, expo);
    const confidence = conf * Math.pow(10, expo);

    return {
      price: actualPrice,
      confidence: confidence,
      publishTime: priceData.price.publish_time,
      expo: expo,
    };
  }

  // Get ETH/USD price
  async getETHPrice() {
    try {
      return await this.getLatestPrice(PYTH_PRICE_FEEDS['ETH/USD']);
    } catch (error) {
      console.error('Error getting ETH price:', error);
      return null;
    }
  }

  // Get USDC/USD price
  async getUSDCPrice() {
    try {
      return await this.getLatestPrice(PYTH_PRICE_FEEDS['USDC/USD']);
    } catch (error) {
      console.error('Error getting USDC price:', error);
      return null;
    }
  }

  // Convert amount from one currency to another
  async convertPrice(amount, fromCurrency, toCurrency = 'USD') {
    try {
      const feedId = PYTH_PRICE_FEEDS[`${fromCurrency}/${toCurrency}`];
      if (!feedId) {
        throw new Error(`No price feed for ${fromCurrency}/${toCurrency}`);
      }

      const priceData = await this.getLatestPrice(feedId);
      return amount * priceData.price;
    } catch (error) {
      console.error('Error converting price:', error);
      return null;
    }
  }

  // Get multiple prices at once
  async getMultiplePrices(feedIds) {
    try {
      const response = await axios.get(
        `${this.endpoint}/api/latest_price_feeds`,
        {
          params: {
            ids: feedIds,
          },
        }
      );

      if (response.data && response.data.length > 0) {
        return response.data.map((priceData) => this.parsePriceData(priceData));
      }

      return [];
    } catch (error) {
      console.error('Error fetching multiple Pyth prices:', error);
      return [];
    }
  }
}

const pythService = new PythService();
export default pythService;