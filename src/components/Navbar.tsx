import React, { useState } from 'react';
import { Wallet, Check, Copy, ExternalLink, Compass, LogOut } from 'lucide-react';
import { useNightlyWallet } from '../hooks/useNightlyWallet';
import { getExplorerAccountUrl } from '../services/cookieChain';

interface NavbarProps {
  wallet: ReturnType<typeof useNightlyWallet>;
  onOpenQuickstart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ wallet, onOpenQuickstart }) => {
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
          <span className="brand-badge">SVM</span>
        </div>
      </a>

      {/* Nav Center: Unified Network & Mode Switch + Guide */}
      <div className="nav-center">
        <button
          type="button"
          onClick={() => wallet.setDemoMode(!wallet.isDemoMode)}
          className={`nav-status-pill ${wallet.isDemoMode ? 'sandbox' : 'live'}`}
          title={wallet.isDemoMode ? "In Sandbox Mode. Click to switch to Live." : "In Live Mode. Click to switch to Sandbox."}
        >
          <span className="network-dot"></span>
          <span>Cookie Chain</span>
          <span className="status-separator">•</span>
          {wallet.isDemoMode ? (
            <span className="status-mode-label sandbox">🧪 Sandbox</span>
          ) : (
            <span className="status-mode-label live">Live</span>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenQuickstart}
          className="btn-quickstart-nav"
          title="Open Cookie Chain onboarding & bridge guide"
        >
          <Compass size={13} color="var(--cookie-gold)" />
          <span>Guide</span>
        </button>
      </div>

      {/* Wallet Actions */}
      <div className="nav-actions">
        {wallet.connected && wallet.address ? (
          <div className="wallet-connected-capsule">
            <div
              className={`capsule-balance ${wallet.isDemoMode ? 'sandbox-bal' : ''}`}
              title={wallet.isDemoMode ? "Sandbox Balance (deducts on tips & fortunes)" : "Live on-chain COOK balance"}
            >
              <span className="balance-val">{wallet.balanceCook.toFixed(2)}</span>
              <span className="balance-unit">COOK</span>
            </div>

            <button
              onClick={handleCopy}
              className="capsule-address-btn"
              title="Click to copy address"
            >
              {copied ? <Check size={12} color="var(--neon-emerald)" /> : <Copy size={12} />}
              <span>{truncateAddress(wallet.address)}</span>
            </button>

            <a
              href={getExplorerAccountUrl(wallet.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="capsule-action-btn"
              title="View on Cookiescan"
            >
              <ExternalLink size={13} />
            </a>

            <button
              onClick={wallet.disconnect}
              className="capsule-action-btn disconnect"
              title="Disconnect Wallet"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={wallet.connect}
            disabled={wallet.connecting}
            className="btn-wallet"
            id="connect-nightly-btn"
          >
            <Wallet size={16} />
            <span>
              {wallet.connecting ? 'Connecting...' : 'Connect Nightly'}
            </span>
          </button>
        )}
      </div>
    </header>
  );
};
