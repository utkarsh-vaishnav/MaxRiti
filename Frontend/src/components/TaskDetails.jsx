import { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { useContract } from '../hooks/useContract';
import {
  formatAddress,
  formatTokenAmount,
  formatDate,
  getDaysRemaining,
  formatUSD,
} from '../utils/helpers';
import { TASK_STATUS, STATUS_COLORS } from '../utils/constants';

const TaskDetails = ({ taskId, onClose }) => {
  const { account, isConnected } = useWallet();
  const { getEscrowContract } = useContract();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const contract = getEscrowContract();
      const taskData = await contract.getTask(taskId);
      setTask(taskData);
    } catch (error) {
      console.error('Error fetching task details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRaiseDispute = async () => {
    if (!window.confirm('Are you sure you want to raise a dispute?')) return;

    try {
      setActionLoading(true);
      const contract = getEscrowContract();
      
      let tx;
      if (task.doer === account) {
        tx = await contract.raiseDisputeByDoer(taskId);
      } else if (task.creator === account) {
        tx = await contract.raiseDisputeByCreator(taskId);
      }
      
      await tx.wait();
      alert('Dispute raised successfully!');
      fetchTaskDetails();
    } catch (error) {
      console.error('Error raising dispute:', error);
      alert('Failed to raise dispute');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading task details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4">
          <p className="text-center text-gray-600 dark:text-gray-400">Task not found</p>
          <button
            onClick={onClose}
            className="mt-4 w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const statusText = TASK_STATUS[task.status];
  const statusColor = STATUS_COLORS[statusText];
  const daysRemaining = getDaysRemaining(task.deadline);
  const canRaiseDispute = 
    isConnected && 
    (task.creator === account || task.doer === account) &&
    (task.status === 1 || task.status === 2) &&
    !task.disputeRaisedByCreator &&
    !task.disputeRaisedByDoer;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4 my-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Task Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColor}`}>
            {statusText}
          </span>
        </div>

        {/* Task Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {task.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {task.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Task ID</p>
              <p className="text-gray-900 dark:text-white font-medium">
                #{task.id.toString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount</p>
              <p className="text-gray-900 dark:text-white font-medium">
                {formatTokenAmount(task.amount, 6)} USDC
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Original Amount</p>
              <p className="text-gray-900 dark:text-white font-medium">
                {formatTokenAmount(task.originalAmount)} {task.originalCurrency}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Deadline</p>
              <p className={`font-medium ${daysRemaining < 3 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                {daysRemaining} days left
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Creator</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatAddress(task.creator)}
                </span>
              </div>
              {task.doer !== '0x0000000000000000000000000000000000000000' && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Doer</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {formatAddress(task.doer)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Created</span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(task.createdAt)}
                </span>
              </div>
              {task.acceptedAt > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Accepted</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatDate(task.acceptedAt)}
                  </span>
                </div>
              )}
              {task.submittedAt > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Submitted</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatDate(task.submittedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Dispute Status */}
          {(task.disputeRaisedByCreator || task.disputeRaisedByDoer) && (
            <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                ⚠️ Dispute Raised
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                This task is under review by the admin.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4">
            {canRaiseDispute && (
              <button
                onClick={handleRaiseDispute}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Raise Dispute'}
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;