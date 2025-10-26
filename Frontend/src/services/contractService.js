import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, ERC20_ABI, DEFAULT_STABLECOIN } from '../utils/constants';
import EscrowABI from '../abi/EscrowContract.json';

class ContractService {
  constructor() {
    this.contractAddress = CONTRACT_ADDRESS;
  }

  // Get contract instance
  getContract(signerOrProvider) {
    return new ethers.Contract(this.contractAddress, EscrowABI.abi, signerOrProvider);
  }

  // Get token contract
  getTokenContract(tokenAddress, signerOrProvider) {
    return new ethers.Contract(tokenAddress, ERC20_ABI, signerOrProvider);
  }

  // Create a new task
  async createTask(signer, params) {
    try {
      const contract = this.getContract(signer);
      
      const tx = await contract.createTask(
        params.name,
        params.description,
        params.stablecoinToken,
        params.amount,
        params.deadline,
        params.originalCurrency,
        params.originalAmount
      );

      return await tx.wait();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  // Accept a task
  async acceptTask(signer, taskId) {
    try {
      const contract = this.getContract(signer);
      const tx = await contract.acceptTask(taskId);
      return await tx.wait();
    } catch (error) {
      console.error('Error accepting task:', error);
      throw error;
    }
  }

  // Submit a task
  async submitTask(signer, taskId) {
    try {
      const contract = this.getContract(signer);
      const tx = await contract.submitTask(taskId);
      return await tx.wait();
    } catch (error) {
      console.error('Error submitting task:', error);
      throw error;
    }
  }

  // Approve a task
  async approveTask(signer, taskId) {
    try {
      const contract = this.getContract(signer);
      const tx = await contract.approveTask(taskId);
      return await tx.wait();
    } catch (error) {
      console.error('Error approving task:', error);
      throw error;
    }
  }

  // Reject a task
  async rejectTask(signer, taskId, reason) {
    try {
      const contract = this.getContract(signer);
      const tx = await contract.rejectTask(taskId, reason);
      return await tx.wait();
    } catch (error) {
      console.error('Error rejecting task:', error);
      throw error;
    }
  }

  // Raise dispute by doer
  async raiseDisputeByDoer(signer, taskId) {
    try {
      const contract = this.getContract(signer);
      const tx = await contract.raiseDisputeByDoer(taskId);
      return await tx.wait();
    } catch (error) {
      console.error('Error raising dispute:', error);
      throw error;
    }
  }

  // Raise dispute by creator
  async raiseDisputeByCreator(signer, taskId) {
    try {
      const contract = this.getContract(signer);
      const tx = await contract.raiseDisputeByCreator(taskId);
      return await tx.wait();
    } catch (error) {
      console.error('Error raising dispute:', error);
      throw error;
    }
  }

  // Resolve dispute (admin only)
  async resolveDispute(signer, taskId, favorDoer) {
    try {
      const contract = this.getContract(signer);
      const tx = await contract.resolveDispute(taskId, favorDoer);
      return await tx.wait();
    } catch (error) {
      console.error('Error resolving dispute:', error);
      throw error;
    }
  }

  // Cancel a task
  async cancelTask(signer, taskId) {
    try {
      const contract = this.getContract(signer);
      const tx = await contract.cancelTask(taskId);
      return await tx.wait();
    } catch (error) {
      console.error('Error cancelling task:', error);
      throw error;
    }
  }

  // Get task details
  async getTask(provider, taskId) {
    try {
      const contract = this.getContract(provider);
      return await contract.getTask(taskId);
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  // Get all tasks
  async getAllTasks(provider) {
    try {
      const contract = this.getContract(provider);
      return await contract.getAllTasks();
    } catch (error) {
      console.error('Error fetching all tasks:', error);
      throw error;
    }
  }

  // Get creator tasks
  async getCreatorTasks(provider, creatorAddress) {
    try {
      const contract = this.getContract(provider);
      const taskIds = await contract.getCreatorTasks(creatorAddress);
      
      const tasks = await Promise.all(
        taskIds.map(async (id) => await contract.getTask(id))
      );
      
      return tasks;
    } catch (error) {
      console.error('Error fetching creator tasks:', error);
      throw error;
    }
  }

  // Get doer tasks
  async getDoerTasks(provider, doerAddress) {
    try {
      const contract = this.getContract(provider);
      const taskIds = await contract.getDoerTasks(doerAddress);
      
      const tasks = await Promise.all(
        taskIds.map(async (id) => await contract.getTask(id))
      );
      
      return tasks;
    } catch (error) {
      console.error('Error fetching doer tasks:', error);
      throw error;
    }
  }

  // Approve token spending
  async approveToken(signer, tokenAddress, spenderAddress, amount) {
    try {
      const tokenContract = this.getTokenContract(tokenAddress, signer);
      const tx = await tokenContract.approve(spenderAddress, amount);
      return await tx.wait();
    } catch (error) {
      console.error('Error approving token:', error);
      throw error;
    }
  }

  // Check token allowance
  async checkAllowance(provider, tokenAddress, ownerAddress, spenderAddress) {
    try {
      const tokenContract = this.getTokenContract(tokenAddress, provider);
      return await tokenContract.allowance(ownerAddress, spenderAddress);
    } catch (error) {
      console.error('Error checking allowance:', error);
      throw error;
    }
  }

  // Get token balance
  async getTokenBalance(provider, tokenAddress, accountAddress) {
    try {
      const tokenContract = this.getTokenContract(tokenAddress, provider);
      return await tokenContract.balanceOf(accountAddress);
    } catch (error) {
      console.error('Error fetching token balance:', error);
      throw error;
    }
  }

  // Get token decimals
  async getTokenDecimals(provider, tokenAddress) {
    try {
      const tokenContract = this.getTokenContract(tokenAddress, provider);
      return await tokenContract.decimals();
    } catch (error) {
      console.error('Error fetching token decimals:', error);
      throw error;
    }
  }
}

const contractService = new ContractService();
export default contractService;