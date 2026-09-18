import React, { useState } from 'react';
import { Wallet, Check, Copy, ExternalLink } from 'lucide-react';
import { useNightlyWallet } from '../hooks/useNightlyWallet';
import { getExplorerAccountUrl } from '../services/cookieChain';

interface NavbarProps {
  wallet: ReturnType<typeof useNightlyWallet>;
}

export const Navbar: React.FC<NavbarProps> = ({ wallet }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <header className="navbar">
      {/* Brand */}
      <a href="/" className="nav-brand">
        <div className="brand-icon-wrapper">
          <span>🍪</span>
        </div>
        <div className="brand-title">
          CookiePay
          <span className="brand-badge">SVM cApp</span>
        </div>
      </a>

      {/* Network Status */}
      <div className="nav-center">
        <div className="network-pill" title="Live connection to https://rpc.cookiescan.io">
          <span className="network-dot"></span>
          <span>Cookie Chain SVM</span>
        </div>
      </div>

      {/* Wallet Actions */}
      <div className="nav-actions">
        {wallet.connected && wallet.address ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="wallet-balance-pill">
              {wallet.balanceCook.toFixed(4)} COOK
            </div>
            
            <button
              onClick={handleCopy}
              className="btn-wallet connected"
              title="Click to copy address"
            >
              {copied ? <Check size={16} color="var(--neon-emerald)" /> : <Copy size={16} />}
              <span>{truncateAddress(wallet.address)}</span>
            </button>

            <a
              href={getExplorerAccountUrl(wallet.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ padding: '0.55rem' }}
              title="View on Cookiescan"
            >
              <ExternalLink size={15} />
            </a>

            <button
              onClick={wallet.disconnect}
              className="btn-secondary"
              style={{ padding: '0.55rem 0.85rem', fontSize: '0.8rem' }}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={wallet.connect}
            disabled={wallet.connecting}
            className="btn-wallet"
            id="connect-nightly-btn"
          >
            <Wallet size={18} />
            <span>
              {wallet.connecting ? 'Connecting...' : 'Connect Nightly'}
            </span>
          </button>
        )}
      </div>
    </header>
  );
};
