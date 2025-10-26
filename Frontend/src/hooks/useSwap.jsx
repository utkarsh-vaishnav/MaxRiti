import { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';
import zeroXService from '../services/zeroXService';
import { TOKEN_ADDRESSES, DEFAULT_STABLECOIN } from '../utils/constants';
import { useContract } from './useContract';

export const useSwap = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { account, signer } = useWallet();
  const { getTokenContract } = useContract();

  const swapETHToStablecoin = async (ethAmount) => {
    setLoading(true);
    setError(null);

    try {
      // Convert ETH amount to Wei
      const sellAmount = ethers.utils.parseEther(ethAmount.toString());

      // Get swap quote from 0x
      const quote = await zeroXService.getSwapQuote({
        sellToken: 'ETH',
        buyToken: DEFAULT_STABLECOIN,
        sellAmount: sellAmount.toString(),
        takerAddress: account,
      });

      // Execute swap transaction
      const tx = await signer.sendTransaction({
        to: quote.to,
        data: quote.data,
        value: quote.value,
        gasLimit: quote.estimatedGas,
      });

      await tx.wait();

      setLoading(false);
      return {
        success: true,
        buyAmount: quote.buyAmount,
        txHash: tx.hash,
      };
    } catch (err) {
      console.error('Swap error:', err);
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const swapTokenToStablecoin = async (tokenAddress, amount) => {
    setLoading(true);
    setError(null);

    try {
      const tokenContract = getTokenContract(tokenAddress);
      
      // Get decimals
      const decimals = await tokenContract.decimals();
      const sellAmount = ethers.utils.parseUnits(amount.toString(), decimals);

      // Check allowance
      const allowance = await tokenContract.allowance(account, zeroXService.baseUrl);
      
      if (allowance.lt(sellAmount)) {
        // Approve token
        const approveTx = await tokenContract.approve(
          zeroXService.baseUrl,
          ethers.constants.MaxUint256
        );
        await approveTx.wait();
      }

      // Get swap quote
      const quote = await zeroXService.getSwapQuote({
        sellToken: tokenAddress,
        buyToken: DEFAULT_STABLECOIN,
        sellAmount: sellAmount.toString(),
        takerAddress: account,
      });

      // Execute swap
      const tx = await signer.sendTransaction({
        to: quote.to,
        data: quote.data,
        value: '0',
        gasLimit: quote.estimatedGas,
      });

      await tx.wait();

      setLoading(false);
      return {
        success: true,
        buyAmount: quote.buyAmount,
        txHash: tx.hash,
      };
    } catch (err) {
      console.error('Token swap error:', err);
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const estimateSwapOutput = async (sellToken, amount, isNative = false) => {
    try {
      let sellAmount;
      
      if (isNative) {
        sellAmount = ethers.utils.parseEther(amount.toString());
      } else {
        const tokenContract = getTokenContract(sellToken);
        const decimals = await tokenContract.decimals();
        sellAmount = ethers.utils.parseUnits(amount.toString(), decimals);
      }

      const price = await zeroXService.getSwapPrice({
        sellToken: isNative ? 'ETH' : sellToken,
        buyToken: DEFAULT_STABLECOIN,
        sellAmount: sellAmount.toString(),
      });

      return {
        buyAmount: price.buyAmount,
        price: price.price,
      };
    } catch (err) {
      console.error('Estimate error:', err);
      return null;
    }
  };

  return {
    swapETHToStablecoin,
    swapTokenToStablecoin,
    estimateSwapOutput,
    loading,
    error,
  };
};