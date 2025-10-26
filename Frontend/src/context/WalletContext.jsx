import { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { createAppKit } from '@reown/appkit/react';
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5';
import { arbitrumSepolia, sepolia } from '@reown/appkit/networks';
import { REOWN_PROJECT_ID } from '../utils/constants';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    // Initialize Reown AppKit
    const initModal = async () => {
      try {
        const appKit = createAppKit({
          adapters: [new Ethers5Adapter()],
          networks: [arbitrumSepolia, sepolia],
          projectId: REOWN_PROJECT_ID,
          features: {
            analytics: true,
          },
          metadata: {
            name: 'Escrow DApp',
            description: 'Decentralized Escrow Platform',
            url: window.location.origin,
            icons: ['https://avatars.githubusercontent.com/u/37784886'],
          },
        });

        setModal(appKit);

        // Subscribe to account changes
        appKit.subscribeAccount((state) => {
          if (state.address) {
            setAccount(state.address);
            initProvider();
          } else {
            setAccount(null);
            setProvider(null);
            setSigner(null);
          }
        });

        // Subscribe to network changes
        appKit.subscribeChainId((id) => {
          setChainId(id);
        });
      } catch (error) {
        console.error('Error initializing AppKit:', error);
      }
    };

    initModal();
  }, []);

  const initProvider = async () => {
    if (window.ethereum) {
      try {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const web3Signer = web3Provider.getSigner();
        setProvider(web3Provider);
        setSigner(web3Signer);

        const network = await web3Provider.getNetwork();
        setChainId(network.chainId);
      } catch (error) {
        console.error('Error initializing provider:', error);
      }
    }
  };

  const connectWallet = async () => {
    try {
      if (modal) {
        await modal.open();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (modal) {
        await modal.disconnect();
        setAccount(null);
        setProvider(null);
        setSigner(null);
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const switchNetwork = async (targetChainId) => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${targetChainId.toString(16)}` }],
        });
      } catch (error) {
        console.error('Error switching network:', error);
      }
    }
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        provider,
        signer,
        chainId,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        isConnected: !!account,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};