import { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';
import { TASK_STATUS, STATUS_COLORS } from '../utils/constants';
import { formatAddress, formatTokenAmount, formatDate } from '../utils/helpers';

const TaskStatus = ({ taskId }) => {
  const { getEscrowContract } = useContract();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const contract = getEscrowContract();
      const taskData = await contract.getTask(taskId);
      setTask(taskData);
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-400">Task not found</p>
      </div>
    );
  }

  const statusText = TASK_STATUS[task.status];
  const statusColor = STATUS_COLORS[statusText];

  const statusTimeline = [
    { label: 'Created', timestamp: task.createdAt, completed: true },
    { 
      label: 'Accepted', 
      timestamp: task.acceptedAt, 
      completed: task.status >= 1 
    },
    { 
      label: 'Submitted', 
      timestamp: task.submittedAt, 
      completed: task.status >= 2 
    },
    { 
      label: 'Completed', 
      timestamp: 0, 
      completed: task.status === 3 
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Task #{task.id.toString()}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {statusText}
        </span>
      </div>

      {/* Task Details */}
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Task Name</p>
          <p className="text-gray-900 dark:text-white font-medium">{task.name}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount</p>
            <p className="text-gray-900 dark:text-white font-medium">
              {formatTokenAmount(task.amount, 6)} USDC
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Creator</p>
            <p className="text-gray-900 dark:text-white font-medium">
              {formatAddress(task.creator)}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
        <div className="space-y-6">
          {statusTimeline.map((step, index) => (
            <div key={index} className="relative flex items-start">
              <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                step.completed 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {step.completed ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <div className="w-3 h-3 rounded-full bg-current"></div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <p className={`font-medium ${
                  step.completed 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.label}
                </p>
                {step.timestamp > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(step.timestamp)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispute Info */}
      {task.status === 4 && (
        <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200 font-medium">
            ⚠️ This task is under dispute review
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskStatus;