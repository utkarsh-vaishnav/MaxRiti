// Token addresses for Arbitrum Sepolia
export const TOKEN_ADDRESSES = {
    USDC: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d', // Arbitrum Sepolia USDC
    USDT: '0xf2d1d9f6F7c3e8E4F0c3e3f3e3e3e3e3e3e3e3e3', // Example USDT
    DAI: '0xf3d2d9f6F7c3e8E4F0c3e3f3e3e3e3e3e3e3e3e3', // Example DAI
  };
  
  // Supported currencies for task creation
  export const SUPPORTED_CURRENCIES = [
    { symbol: 'ETH', name: 'Ethereum', isNative: true },
    { symbol: 'USDC', name: 'USD Coin', address: TOKEN_ADDRESSES.USDC, isNative: false },
    { symbol: 'USDT', name: 'Tether USD', address: TOKEN_ADDRESSES.USDT, isNative: false },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: TOKEN_ADDRESSES.DAI, isNative: false },
  ];
  
  // Default stablecoin for receiving payments
  export const DEFAULT_STABLECOIN = TOKEN_ADDRESSES.USDC;
  
  // Pyth Price Feed IDs (Arbitrum)
  export const PYTH_PRICE_FEEDS = {
    'ETH/USD': '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
    'USDC/USD': '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
    'USDT/USD': '0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b',
    'DAI/USD': '0xb0948a5e5313200c632b51bb5ca32f6de0d36e9950a942d19751e833f70dabfd',
  };
  
  // Contract addresses
  export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';
  
  // Network configuration
  export const NETWORK_CONFIG = {
    chainId: 421614,
    chainName: 'Arbitrum Sepolia',
    rpcUrl: import.meta.env.VITE_RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc',
    blockExplorer: 'https://sepolia.arbiscan.io',
  };
  
  // 0x API configuration
  export const ZEROX_API_CONFIG = {
    baseUrl: 'https://arbitrum.api.0x.org',
    apiKey: import.meta.env.VITE_ZEROX_API_KEY || '',
  };
  
  // Reown Project ID
  export const REOWN_PROJECT_ID = import.meta.env.VITE_REOWN_PROJECT_ID || '';
  
  // Task status enum
  export const TASK_STATUS = {
    0: 'Created',
    1: 'Accepted',
    2: 'Submitted',
    3: 'Completed',
    4: 'Disputed',
    5: 'Resolved',
    6: 'Cancelled',
  };
  
  // Task status colors
  export const STATUS_COLORS = {
    Created: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Accepted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Submitted: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Disputed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Resolved: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    Cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };
  
  // ERC20 ABI (minimal for approve and transfer)
  export const ERC20_ABI = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function allowance(address owner, address spender) public view returns (uint256)",
    "function balanceOf(address account) public view returns (uint256)",
    "function transfer(address recipient, uint256 amount) public returns (bool)",
    "function decimals() public view returns (uint8)",
    "function symbol() public view returns (string)",
  ];