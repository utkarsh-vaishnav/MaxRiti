import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';
import { CONTRACT_ADDRESS, ERC20_ABI } from '../utils/constants';
import EscrowABI from '../abi/EscrowContract.json';

export const useContract = () => {
  const { signer, provider } = useWallet();

  const getEscrowContract = () => {
    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured');
    }
    
    if (signer) {
      return new ethers.Contract(CONTRACT_ADDRESS, EscrowABI.abi, signer);
    } else if (provider) {
      return new ethers.Contract(CONTRACT_ADDRESS, EscrowABI.abi, provider);
    }
    
    throw new Error('No provider available');
  };

  const getTokenContract = (tokenAddress) => {
    if (signer) {
      return new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    } else if (provider) {
      return new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    }
    
    throw new Error('No provider available');
  };

  return { getEscrowContract, getTokenContract };
};