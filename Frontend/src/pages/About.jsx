const About = () => {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          About EscrowDApp
        </h1>
  
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            EscrowDApp is a decentralized platform that revolutionizes task-based payments by leveraging blockchain technology. We provide a trustless, transparent, and secure environment where creators and doers can collaborate with confidence.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Our platform eliminates the need for intermediaries, reduces transaction costs, and ensures that payments are only released when work is completed satisfactorily. With built-in dispute resolution and automatic stablecoin conversion, we make freelancing and task-based work safer and more efficient.
          </p>
        </div>
  
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                1. Task Creation
              </h3>
              <p>
                Creators post tasks with detailed requirements and payment amounts. They can pay in ETH or stablecoins like USDC, USDT, or DAI. The platform automatically swaps non-stablecoin payments to ensure doers receive stable value.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                2. Task Acceptance
              </h3>
              <p>
                Doers browse available tasks and accept ones that match their skills. Once accepted, the funds are held securely in the smart contract escrow.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                3. Work Submission
              </h3>
              <p>
                After completing the task, doers submit their work for review. Creators can approve the work and release payment, or reject it with feedback for revision.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                4. Dispute Resolution
              </h3>
              <p>
                If disagreements arise, either party can raise a dispute. An admin reviews the case and makes a fair decision, ensuring both parties are protected.
              </p>
            </div>
          </div>
        </div>
  
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Key Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                For Creators
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Pay only for completed work</li>
                <li>• Request revisions if needed</li>
                <li>• Transparent tracking of all tasks</li>
                <li>• Protection against fraud</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                For Doers
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Guaranteed payment for work done</li>
                <li>• Receive payments in stablecoins</li>
                <li>• Dispute resolution available</li>
                <li>• No payment processing delays</li>
              </ul>
            </div>
          </div>
        </div>
  
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Built on Arbitrum Sepolia
          </h2>
          <p className="mb-4">
            We leverage Arbitrum's Layer 2 scaling solution for fast, low-cost transactions while maintaining Ethereum's security guarantees.
          </p>
          <p className="text-sm opacity-90">
            Platform Fee: 2% | Dispute Fee: 5% (only if dispute resolved)
          </p>
        </div>
      </div>
    );
  };
  
  export default About;