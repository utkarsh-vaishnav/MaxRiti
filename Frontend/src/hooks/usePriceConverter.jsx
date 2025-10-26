import { useState, useEffect } from 'react';
import pythService from '../services/pythService';
import { SUPPORTED_CURRENCIES } from '../utils/constants';

export const usePriceConverter = (currency, amount) => {
  const [usdValue, setUsdValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const convertToUSD = async () => {
      if (!currency || !amount || amount <= 0) {
        setUsdValue(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // If already a stablecoin, return 1:1
        if (currency === 'USDC' || currency === 'USDT' || currency === 'DAI') {
          setUsdValue(parseFloat(amount));
          setLoading(false);
          return;
        }

        // Get price from Pyth
        const priceData = await pythService.convertPrice(
          parseFloat(amount),
          currency,
          'USD'
        );

        if (priceData) {
          setUsdValue(priceData);
        } else {
          setError('Failed to fetch price');
        }

        setLoading(false);
      } catch (err) {
        console.error('Price conversion error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    convertToUSD();
  }, [currency, amount]);

  return { usdValue, loading, error };
};