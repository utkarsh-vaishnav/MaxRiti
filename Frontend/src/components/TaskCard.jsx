import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useContract } from '../hooks/useContract';
import {
  formatAddress,
  formatTokenAmount,
  formatDate,
  getDaysRemaining,
  truncateText,
} from '../utils/helpers';
import { TASK_STATUS, STATUS_COLORS } from '../utils/constants';

const TaskCard = ({ task, onUpdate }) => {
  const { account, isConnected } = useWallet();
  const { getEscrowContract } = useContract();
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const canAccept = isConnected && task.status === 0 && task.creator !== account;
  const canSubmit = isConnected && task.status === 1 && task.doer === account;
  const canApprove = isConnected && task.status === 2 && task.creator === account;
  const canReject = isConnected && task.status === 2 && task.creator === account;

  const handleAccept = async () => {
    try {
      setLoading(true);
      const contract = getEscrowContract();
      const tx = await contract.acceptTask(task.id);
      await tx.wait();
      onUpdate();
    } catch (error) {
      console.error('Error accepting task:', error);
      alert('Failed to accept task');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const contract = getEscrowContract();
      const tx = await contract.submitTask(task.id);
      await tx.wait();
      onUpdate();
    } catch (error) {
      console.error('Error submitting task:', error);
      alert('Failed to submit task');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setLoading(true);
      const contract = getEscrowContract();
      const tx = await contract.approveTask(task.id);
      await tx.wait();
      onUpdate();
    } catch (error) {
      console.error('Error approving task:', error);
      alert('Failed to approve task');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      setLoading(true);
      const contract = getEscrowContract();
      const tx = await contract.rejectTask(task.id, reason);
      await tx.wait();
      onUpdate();
    } catch (error) {
      console.error('Error rejecting task:', error);
      alert('Failed to reject task');
    } finally {
      setLoading(false);
    }
  };

  const statusText = TASK_STATUS[task.status];
  const statusColor = STATUS_COLORS[statusText];
  const daysRemaining = getDaysRemaining(task.deadline);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {task.name}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {statusText}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
        {truncateText(task.description, 100)}
      </p>

      {/* Task Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Amount:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatTokenAmount(task.amount, 6)} USDC
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Original:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatTokenAmount(task.originalAmount)} {task.originalCurrency}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Creator:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatAddress(task.creator)}
          </span>
        </div>
        {task.doer !== '0x0000000000000000000000000000000000000000' && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Doer:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatAddress(task.doer)}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Deadline:</span>
          <span className={`font-medium ${daysRemaining < 3 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
            {daysRemaining} days left
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {canAccept && (
          <button
            onClick={handleAccept}
            disabled={loading}
            className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Accept Task'}
          </button>
        )}

        {canSubmit && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Submit Task'}
          </button>
        )}

        {canApprove && (
          <div className="flex space-x-2">
            <button
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Approve'}
            </button>
            <button
              onClick={handleReject}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Reject'}
            </button>
          </div>
        )}

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
        >
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>
      </div>

      {/* Extended Details */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Full Description:</span>
              <p className="text-gray-900 dark:text-white mt-1">{task.description}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Created:</span>
              <p className="text-gray-900 dark:text-white">{formatDate(task.createdAt)}</p>
            </div>
            {task.acceptedAt > 0 && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Accepted:</span>
                <p className="text-gray-900 dark:text-white">{formatDate(task.acceptedAt)}</p>
              </div>
            )}
            {task.submittedAt > 0 && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Submitted:</span>
                <p className="text-gray-900 dark:text-white">{formatDate(task.submittedAt)}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;