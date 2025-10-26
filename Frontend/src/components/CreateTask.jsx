import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';
import { useContract } from '../hooks/useContract';
import { useSwap } from '../hooks/useSwap';
import { usePriceConverter } from '../hooks/usePriceConverter';
import {
  SUPPORTED_CURRENCIES,
  DEFAULT_STABLECOIN,
  TOKEN_ADDRESSES,
} from '../utils/constants';
import { formatUSD, parseTokenAmount } from '../utils/helpers';

const CreateTask = () => {
  const { account, isConnected } = useWallet();
  const { getEscrowContract, getTokenContract } = useContract();
  const { swapETHToStablecoin, swapTokenToStablecoin, loading: swapLoading } = useSwap();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    currency: 'ETH',
    amount: '',
    deadline: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { usdValue, loading: priceLoading } = usePriceConverter(
    formData.currency,
    formData.amount
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      setError('Please connect your wallet');
      return;
    }

    if (!formData.name || !formData.amount || !formData.deadline) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const selectedCurrency = SUPPORTED_CURRENCIES.find(
        (c) => c.symbol === formData.currency
      );

      let stablecoinAmount;
      let txHash;

      // If native token (ETH), swap to stablecoin
      if (selectedCurrency.isNative) {
        const result = await swapETHToStablecoin(formData.amount);
        
        if (!result.success) {
          throw new Error(result.error || 'Swap failed');
        }
        
        stablecoinAmount = result.buyAmount;
        txHash = result.txHash;
      } 
      // If already stablecoin, use directly
      else if (formData.currency === 'USDC' || formData.currency === 'USDT' || formData.currency === 'DAI') {
        const tokenContract = getTokenContract(selectedCurrency.address);
        const decimals = await tokenContract.decimals();
        stablecoinAmount = parseTokenAmount(formData.amount, decimals);
        
        // Approve token spending
        const escrowContract = getEscrowContract();
        const allowance = await tokenContract.allowance(account, escrowContract.address);
        
        if (allowance.lt(stablecoinAmount)) {
          const approveTx = await tokenContract.approve(
            escrowContract.address,
            ethers.constants.MaxUint256
          );
          await approveTx.wait();
        }
      }
      // If other token, swap to stablecoin
      else {
        const result = await swapTokenToStablecoin(
          selectedCurrency.address,
          formData.amount
        );
        
        if (!result.success) {
          throw new Error(result.error || 'Swap failed');
        }
        
        stablecoinAmount = result.buyAmount;
        txHash = result.txHash;
      }

      // Approve stablecoin spending if needed
      const stablecoinContract = getTokenContract(DEFAULT_STABLECOIN);
      const escrowContract = getEscrowContract();
      
      const allowance = await stablecoinContract.allowance(
        account,
        escrowContract.address
      );
      
      if (allowance.lt(stablecoinAmount)) {
        const approveTx = await stablecoinContract.approve(
          escrowContract.address,
          ethers.constants.MaxUint256
        );
        await approveTx.wait();
      }

      // Create task on contract
      const deadlineTimestamp = Math.floor(new Date(formData.deadline).getTime() / 1000);
      
      const tx = await escrowContract.createTask(
        formData.name,
        formData.description,
        DEFAULT_STABLECOIN,
        stablecoinAmount,
        deadlineTimestamp,
        formData.currency,
        parseTokenAmount(formData.amount, 18)
      );

      await tx.wait();

      setSuccess(`Task created successfully! Transaction: ${tx.hash}`);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        currency: 'ETH',
        amount: '',
        deadline: '',
      });
    } catch (err) {
      console.error('Create task error:', err);
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create New Task
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter task name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describe the task requirements"
              required
            />
          </div>

          {/* Currency Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency *
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {SUPPORTED_CURRENCIES.map((currency) => (
                <option key={currency.symbol} value={currency.symbol}>
                  {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              step="0.000001"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="0.0"
              required
            />
            {usdValue && !priceLoading && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                ≈ {formatUSD(usdValue)}
              </p>
            )}
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deadline *
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || swapLoading || !isConnected}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading || swapLoading ? 'Creating Task...' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;