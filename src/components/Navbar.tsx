import React, { useState } from 'react';
import { Wallet, Check, Copy, ExternalLink, Compass, LogOut, Sparkles } from 'lucide-react';
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

      {/* Nav Center: Network & Mode Pill Cluster */}
      <div className="nav-center">
        <div className="nav-pill-cluster">
          <div className="network-pill" title="Live connection to https://rpc.cookiescan.io">
            <span className="network-dot"></span>
            <span>Cookie Chain</span>
          </div>

          <button
            type="button"
            onClick={() => wallet.setDemoMode(!wallet.isDemoMode)}
            className={`mode-toggle-btn ${wallet.isDemoMode ? 'sandbox-active' : 'live-active'}`}
            title={wallet.isDemoMode ? "In Demo Sandbox (100 COOK). Click to switch to Live Mode." : "In Live Mode. Click to switch to Demo Sandbox."}
          >
            {wallet.isDemoMode ? (
              <>
                <Sparkles size={13} color="var(--cookie-gold)" />
                <span>Sandbox (100 COOK)</span>
              </>
            ) : (
              <>
                <span className="mode-badge-dot live"></span>
                <span>Live Mode</span>
              </>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenQuickstart}
          className="btn-quickstart-nav"
          title="Open Cookie Chain onboarding & bridge guide"
        >
          <Compass size={14} color="var(--cookie-gold)" />
          <span>Bridge & Guide</span>
        </button>
      </div>

      {/* Wallet Actions */}
      <div className="nav-actions">
        {wallet.connected && wallet.address ? (
          <div className="wallet-connected-capsule">
            <div
              className={`capsule-balance ${wallet.isDemoMode ? 'sandbox-bal' : ''}`}
              title={wallet.isDemoMode ? "Demo Sandbox Balance (deducts on tips & fortunes)" : "Live on-chain COOK balance"}
            >
              <span className="balance-val">{wallet.balanceCook.toFixed(2)}</span>
              <span className="balance-unit">COOK</span>
              {wallet.isDemoMode && <span className="capsule-demo-tag">Demo</span>}
            </div>

            <button
              onClick={handleCopy}
              className="capsule-address-btn"
              title="Click to copy address"
            >
              {copied ? <Check size={13} color="var(--neon-emerald)" /> : <Copy size={13} />}
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
