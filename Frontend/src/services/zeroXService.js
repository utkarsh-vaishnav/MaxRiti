import axios from 'axios';
import { ZEROX_API_CONFIG, TOKEN_ADDRESSES } from '../utils/constants';

class ZeroXService {
  constructor() {
    this.baseUrl = ZEROX_API_CONFIG.baseUrl;
    this.apiKey = ZEROX_API_CONFIG.apiKey;
  }

  // Get swap quote
  async getSwapQuote(params) {
    try {
      const { sellToken, buyToken, sellAmount, takerAddress } = params;

      const queryParams = new URLSearchParams({
        sellToken,
        buyToken,
        sellAmount,
        takerAddress,
        slippagePercentage: '0.01', // 1% slippage
      });

      const response = await axios.get(
        `${this.baseUrl}/swap/v1/quote?${queryParams}`,
        {
          headers: {
            '0x-api-key': this.apiKey,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching swap quote:', error);
      throw new Error('Failed to get swap quote');
    }
  }

  // Get swap price (without executing)
  async getSwapPrice(params) {
    try {
      const { sellToken, buyToken, sellAmount } = params;

      const queryParams = new URLSearchParams({
        sellToken,
        buyToken,
        sellAmount,
      });

      const response = await axios.get(
        `${this.baseUrl}/swap/v1/price?${queryParams}`,
        {
          headers: {
            '0x-api-key': this.apiKey,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching swap price:', error);
      throw new Error('Failed to get swap price');
    }
  }

  // Execute swap (get transaction data)
  async getSwapTransaction(params) {
    try {
      const { sellToken, buyToken, sellAmount, takerAddress } = params;

      const queryParams = new URLSearchParams({
        sellToken,
        buyToken,
        sellAmount,
        takerAddress,
        slippagePercentage: '0.01',
      });

      const response = await axios.get(
        `${this.baseUrl}/swap/v1/quote?${queryParams}`,
        {
          headers: {
            '0x-api-key': this.apiKey,
          },
        }
      );

      return {
        to: response.data.to,
        data: response.data.data,
        value: response.data.value,
        estimatedGas: response.data.estimatedGas,
        buyAmount: response.data.buyAmount,
      };
    } catch (error) {
      console.error('Error getting swap transaction:', error);
      throw new Error('Failed to get swap transaction');
    }
  }

  // Convert ETH to USDC amount estimate
  async convertETHtoUSDC(ethAmount) {
    try {
      const sellAmount = ethAmount; // Wei amount

      const price = await this.getSwapPrice({
        sellToken: 'ETH',
        buyToken: TOKEN_ADDRESSES.USDC,
        sellAmount: sellAmount.toString(),
      });

      return {
        usdcAmount: price.buyAmount,
        price: price.price,
        estimatedGas: price.estimatedGas,
      };
    } catch (error) {
      console.error('Error converting ETH to USDC:', error);
      return null;
    }
  }

  // Get supported tokens
  async getSupportedTokens() {
    try {
      const response = await axios.get(`${this.baseUrl}/swap/v1/tokens`, {
        headers: {
          '0x-api-key': this.apiKey,
        },
      });

      return response.data.records;
    } catch (error) {
      console.error('Error fetching supported tokens:', error);
      return [];
    }
  }
}

const zeroXService = new ZeroXService();
export default zeroXService;