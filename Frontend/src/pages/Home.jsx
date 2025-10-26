import { Link } from 'react-router-dom';
import Features from '../components/Features';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">
              Decentralized Escrow Platform
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Secure task-based payments powered by smart contracts. Create tasks, get them done, and pay with confidence using blockchain technology.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/create"
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Create Task
              </Link>
              <Link
                to="/view"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Browse Tasks
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                100%
              </div>
              <div className="text-gray-600 dark:text-gray-400">Secure</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                2%
              </div>
              <div className="text-gray-600 dark:text-gray-400">Platform Fee</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                24/7
              </div>
              <div className="text-gray-600 dark:text-gray-400">Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Features />
      </div>

      {/* How It Works */}
      <div className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Create Task
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Post your task with details and payment amount in any supported currency.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Accept & Work
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Doers accept tasks and complete the work according to requirements.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Review & Approve
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Creator reviews the submitted work and approves payment.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Get Paid
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Payment automatically releases to the doer in stablecoins.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Join our decentralized escrow platform today and experience secure, trustless task-based payments.
          </p>
          <Link
            to="/create"
            className="px-8 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg inline-block"
          >
            Create Your First Task
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;