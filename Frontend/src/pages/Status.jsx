import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { useContract } from '../hooks/useContract';
import TaskCard from '../components/TaskCard';

const Status = () => {
  const { account, isConnected } = useWallet();
  const { getEscrowContract } = useContract();
  const [createdTasks, setCreatedTasks] = useState([]);
  const [acceptedTasks, setAcceptedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('created'); // created, accepted

  useEffect(() => {
    if (isConnected && account) {
      fetchMyTasks();
    }
  }, [isConnected, account]);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const contract = getEscrowContract();
      
      // Get tasks created by user
      const createdTaskIds = await contract.getCreatorTasks(account);
      const createdTasksData = await Promise.all(
        createdTaskIds.map(async (id) => await contract.getTask(id))
      );
      
      // Get tasks accepted by user
      const acceptedTaskIds = await contract.getDoerTasks(account);
      const acceptedTasksData = await Promise.all(
        acceptedTaskIds.map(async (id) => await contract.getTask(id))
      );
      
      setCreatedTasks(createdTasksData);
      setAcceptedTasks(acceptedTasksData);
    } catch (error) {
      console.error('Error fetching my tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Connect Your Wallet
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please connect your wallet to view your tasks
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        My Tasks
      </h1>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('created')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'created'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Created ({createdTasks.length})
        </button>
        <button
          onClick={() => setActiveTab('accepted')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'accepted'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Accepted ({acceptedTasks.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tasks...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'created' ? (
            createdTasks.length > 0 ? (
              createdTasks.map((task) => (
                <TaskCard key={task.id.toString()} task={task} onUpdate={fetchMyTasks} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-600 dark:text-gray-400">
                No created tasks yet
              </div>
            )
          ) : (
            acceptedTasks.length > 0 ? (
              acceptedTasks.map((task) => (
                <TaskCard key={task.id.toString()} task={task} onUpdate={fetchMyTasks} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-600 dark:text-gray-400">
                No accepted tasks yet
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Status;