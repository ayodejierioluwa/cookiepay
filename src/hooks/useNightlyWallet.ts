import { useState, useEffect, useCallback } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { getCookBalance, cookieConnection } from '../services/cookieChain';

// Extend window interface for Nightly & Solana wallets
declare global {
  interface Window {
    nightly?: {
      solana?: {
        publicKey: { toString(): string; toBase58(): string } | null;
        connect: () => Promise<{ publicKey: { toString(): string; toBase58(): string } }>;
        disconnect: () => Promise<void>;
        signTransaction: (tx: Transaction) => Promise<Transaction>;
        signAndSendTransaction: (tx: Transaction) => Promise<{ signature: string }>;
        on?: (event: string, callback: (...args: unknown[]) => void) => void;
      };
    };
    solana?: {
      isNightly?: boolean;
      publicKey: { toString(): string; toBase58(): string } | null;
      connect: () => Promise<{ publicKey: { toString(): string; toBase58(): string } }>;
      disconnect: () => Promise<void>;
      signTransaction: (tx: Transaction) => Promise<Transaction>;
      signAndSendTransaction: (tx: Transaction) => Promise<{ signature: string }>;
      on?: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

export interface WalletState {
  connected: boolean;
  publicKey: PublicKey | null;
  address: string | null;
  balanceCook: number;
  realBalanceCook: number;
  isNightlyInstalled: boolean;
  connecting: boolean;
  walletName: string;
  isDemoMode: boolean;
  sandboxBalance: number;
}

export function useNightlyWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    publicKey: null,
    address: null,
    balanceCook: 100,
    realBalanceCook: 0,
    isNightlyInstalled: false,
    connecting: false,
    walletName: 'Nightly',
    isDemoMode: true,
    sandboxBalance: 100,
  });

  // Detect available provider (prioritize window.nightly.solana)
  const getProvider = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (window.nightly?.solana) {
      return { provider: window.nightly.solana, name: 'Nightly Wallet' };
    }
    if (window.solana?.isNightly) {
      return { provider: window.solana, name: 'Nightly Wallet' };
    }
    if (window.solana) {
      return { provider: window.solana, name: 'Solana Wallet (Fallback)' };
    }
    return null;
  }, []);

  // Check wallet installation state
  useEffect(() => {
    const checkInstallation = () => {
      const isNightly = Boolean(window.nightly?.solana || window.solana?.isNightly);
      setWalletState(prev => ({
        ...prev,
        isNightlyInstalled: isNightly,
        walletName: isNightly ? 'Nightly Wallet' : (window.solana ? 'Solana Wallet' : 'Nightly Wallet'),
      }));
    };

    checkInstallation();
    window.addEventListener('load', checkInstallation);
    return () => window.removeEventListener('load', checkInstallation);
  }, []);

  // Fetch balance
  const refreshBalance = useCallback(async (pubkey: PublicKey) => {
    try {
      const realBalance = await getCookBalance(pubkey.toBase58());
      setWalletState(prev => {
        const nextIsDemo = prev.isDemoMode || realBalance === 0;
        return {
          ...prev,
          realBalanceCook: realBalance,
          isDemoMode: nextIsDemo,
          balanceCook: nextIsDemo ? prev.sandboxBalance : realBalance,
        };
      });
    } catch (err) {
      console.error('Balance refresh error:', err);
    }
  }, []);

  // Connect Wallet
  const connect = useCallback(async () => {
    const providerInfo = getProvider();
    if (!providerInfo) {
      window.open('https://nightly.app/download', '_blank');
      return;
    }

    try {
      setWalletState(prev => ({ ...prev, connecting: true }));
      const response = await providerInfo.provider.connect();
      const rawPubkey = response.publicKey || providerInfo.provider.publicKey;

      if (!rawPubkey) {
        throw new Error('No public key returned from wallet');
      }

      const pubkey = new PublicKey(rawPubkey.toString());
      const address = pubkey.toBase58();

      setWalletState(prev => ({
        ...prev,
        connected: true,
        publicKey: pubkey,
        address,
        connecting: false,
        walletName: providerInfo.name,
      }));

      // Fetch initial balance
      await refreshBalance(pubkey);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setWalletState(prev => ({ ...prev, connecting: false }));
    }
  }, [getProvider, refreshBalance]);

  // Disconnect Wallet
  const disconnect = useCallback(async () => {
    const providerInfo = getProvider();
    if (providerInfo && providerInfo.provider.disconnect) {
      try {
        await providerInfo.provider.disconnect();
      } catch (err) {
        console.warn('Disconnect notification error:', err);
      }
    }
    setWalletState(prev => ({
      ...prev,
      connected: false,
      publicKey: null,
      address: null,
      balanceCook: prev.isDemoMode ? prev.sandboxBalance : 0,
      realBalanceCook: 0,
    }));
  }, [getProvider]);

  // Toggle Sandbox Mode
  const setDemoMode = useCallback((enabled: boolean) => {
    setWalletState(prev => ({
      ...prev,
      isDemoMode: enabled,
      balanceCook: enabled ? prev.sandboxBalance : prev.realBalanceCook,
    }));
  }, []);

  // Reset Sandbox Balance
  const resetSandboxBalance = useCallback(() => {
    setWalletState(prev => ({
      ...prev,
      sandboxBalance: 100,
      balanceCook: prev.isDemoMode ? 100 : prev.realBalanceCook,
    }));
  }, []);

  // Sign and submit transaction
  const signAndSend = useCallback(async (transaction: Transaction, amountToDeduct: number = 0): Promise<string> => {
    const providerInfo = getProvider();
    if (!providerInfo || !walletState.publicKey) {
      throw new Error('Wallet not connected');
    }

    // Demo Sandbox Mode: Fast sub-second simulated finality without triggering Nightly 0-balance simulation error
    if (walletState.isDemoMode) {
      // Realistic sub-second confirmation delay (350ms)
      await new Promise(resolve => setTimeout(resolve, 350));

      // Realistic 88-char base58 transaction signature
      const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      const signature = Array.from({ length: 88 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

      if (amountToDeduct > 0) {
        setWalletState(prev => {
          const nextBal = Math.max(0, parseFloat((prev.sandboxBalance - amountToDeduct).toFixed(6)));
          return {
            ...prev,
            sandboxBalance: nextBal,
            balanceCook: nextBal,
          };
        });
      }

      return signature;
    }

    // Live execution
    if (providerInfo.provider.signAndSendTransaction) {
      const res = await providerInfo.provider.signAndSendTransaction(transaction);
      if (res && res.signature) {
        await refreshBalance(walletState.publicKey);
        return res.signature;
      }
    }

    // Fallback: signTransaction then sendRawTransaction to Cookie Chain RPC
    if (providerInfo.provider.signTransaction) {
      const signedTx = await providerInfo.provider.signTransaction(transaction);
      const rawTx = signedTx.serialize();
      const signature = await cookieConnection.sendRawTransaction(rawTx, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      });
      await cookieConnection.confirmTransaction(signature, 'confirmed');
      await refreshBalance(walletState.publicKey);
      return signature;
    }

    throw new Error('Wallet does not support transaction signing');
  }, [getProvider, walletState.publicKey, walletState.isDemoMode, refreshBalance]);

  return {
    ...walletState,
    connect,
    disconnect,
    refreshBalance,
    signAndSend,
    setDemoMode,
    resetSandboxBalance,
  };
}
