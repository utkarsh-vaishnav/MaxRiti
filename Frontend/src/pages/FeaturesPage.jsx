import Features from '../components/Features';

const FeaturesPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Platform Features
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Discover the powerful features that make our escrow platform secure, efficient, and user-friendly.
        </p>
      </div>

      <Features />

      {/* Additional Technical Details */}
      <div className="mt-16 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Technical Stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Blockchain & Smart Contracts
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Arbitrum Sepolia Testnet</li>
              <li>• Solidity Smart Contracts</li>
              <li>• ERC-20 Token Standard</li>
              <li>• On-chain Task Management</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              DeFi Integrations
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• 0x Protocol for Token Swaps</li>
              <li>• Pyth Network Price Feeds</li>
              <li>• Multi-currency Support</li>
              <li>• Automatic Stablecoin Conversion</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Frontend Technologies
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• React + Vite</li>
              <li>• Tailwind CSS</li>
              <li>• Ethers.js v5.7.2</li>
              <li>• Reown AppKit (Wallet Connection)</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Security Features
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Smart Contract Escrow</li>
              <li>• Time-locked Payments</li>
              <li>• Dispute Resolution System</li>
              <li>• Transparent On-chain Records</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;