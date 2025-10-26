import { ethers } from 'ethers';

// Format address to short version
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Format token amount
export const formatTokenAmount = (amount, decimals = 18) => {
  try {
    return ethers.utils.formatUnits(amount, decimals);
  } catch (error) {
    console.error('Error formatting token amount:', error);
    return '0';
  }
};

// Parse token amount
export const parseTokenAmount = (amount, decimals = 18) => {
  try {
    return ethers.utils.parseUnits(amount.toString(), decimals);
  } catch (error) {
    console.error('Error parsing token amount:', error);
    return ethers.BigNumber.from(0);
  }
};

// Format date
export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Calculate days remaining
export const getDaysRemaining = (deadline) => {
  if (!deadline) return 0;
  const now = Math.floor(Date.now() / 1000);
  const diff = deadline - now;
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60)));
};

// Check if deadline passed
export const isDeadlinePassed = (deadline) => {
  const now = Math.floor(Date.now() / 1000);
  return now > deadline;
};

// Format USD amount
export const formatUSD = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Validate Ethereum address
export const isValidAddress = (address) => {
  return ethers.utils.isAddress(address);
};

// Get network name by chain ID
export const getNetworkName = (chainId) => {
  const networks = {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet',
    421614: 'Arbitrum Sepolia',
    42161: 'Arbitrum One',
  };
  return networks[chainId] || 'Unknown Network';
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Convert timestamp to date input value
export const timestampToDateInput = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toISOString().split('T')[0];
};

// Convert date input to timestamp
export const dateInputToTimestamp = (dateString) => {
  return Math.floor(new Date(dateString).getTime() / 1000);
};

// Calculate percentage
export const calculatePercentage = (part, total) => {
  if (total === 0) return 0;
  return ((part / total) * 100).toFixed(2);
};