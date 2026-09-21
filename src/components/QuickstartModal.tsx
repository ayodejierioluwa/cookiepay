import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Compass, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import {
  COOKIE_RPC_ENDPOINT,
  COOKIE_EXPLORER_BASE,
  COOKIESWAP_URL,
  COOKIE_DOCS_URL,
  COOKIE_TELEGRAM_URL,
} from '../services/cookieChain';

interface QuickstartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTestAddress?: (address: string, memo: string, amount: string) => void;
}

export const QuickstartModal: React.FC<QuickstartModalProps> = ({
  isOpen,
  onClose,
  onSelectTestAddress,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="modal-icon-badge">
              <Compass size={20} color="var(--cookie-gold)" />
            </div>
            <div>
              <h3 className="modal-title">Cookie Chain Quickstart & Bridge</h3>
              <p className="modal-subtitle">
                Everything judges and builders need to test CookiePay in seconds
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Step 1: Nightly Setup */}
          <div className="guide-step-card">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Add Cookie Chain to Nightly Wallet</h4>
              <p>
                Open your <strong>Nightly Wallet</strong> extension, switch network to <strong>Cookie Chain</strong> (or add custom SVM RPC).
              </p>

              <div className="rpc-param-list">
                <div className="rpc-param-item">
                  <span className="param-label">RPC Endpoint:</span>
                  <code className="param-value">{COOKIE_RPC_ENDPOINT}</code>
                  <button
                    className="copy-chip-btn"
                    onClick={() => handleCopy(COOKIE_RPC_ENDPOINT, 'rpc')}
                    title="Copy RPC"
                  >
                    {copiedKey === 'rpc' ? <Check size={13} color="var(--neon-emerald)" /> : <Copy size={13} />}
                  </button>
                </div>

                <div className="rpc-param-item">
                  <span className="param-label">Explorer:</span>
                  <code className="param-value">{COOKIE_EXPLORER_BASE}</code>
                  <button
                    className="copy-chip-btn"
                    onClick={() => handleCopy(COOKIE_EXPLORER_BASE, 'explorer')}
                    title="Copy Explorer"
                  >
                    {copiedKey === 'explorer' ? <Check size={13} color="var(--neon-emerald)" /> : <Copy size={13} />}
                  </button>
                </div>

                <div className="rpc-param-item">
                  <span className="param-label">Gas Token:</span>
                  <code className="param-value">$COOK (9 decimals, SVM compatible)</code>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Bridge & Swap */}
          <div className="guide-step-card">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Get $COOK on Cookieswap & Official Bridge</h4>
              <p>
                Cookie Chain transaction fees are negligible (<strong>&lt;0.00001 COOK</strong>, ~$0.00001). Even a fraction of 1 COOK supports hundreds of tips!
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.75rem' }}>
                <a
                  href={COOKIESWAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                >
                  <span>Swap on Cookieswap</span>
                  <ExternalLink size={13} />
                </a>

                <a
                  href={COOKIE_DOCS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                >
                  <span>Official Bridge Docs</span>
                  <ExternalLink size={13} />
                </a>

                <a
                  href={COOKIE_TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                >
                  <span>Cookie Chain Telegram</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>

          {/* Step 3: Zero-Friction Testing */}
          <div className="guide-step-card">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Instant Testing Options</h4>
              <p>
                Don't have a second wallet? CookiePay includes built-in test flows so judges can evaluate full on-chain confirmation immediately:
              </p>

              <div className="test-actions-list">
                <div className="test-action-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                    <ShieldCheck size={16} color="var(--neon-emerald)" />
                    <span>Loopback Test (Send to Self)</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.25rem 0' }}>
                    Sends funds back to your own address while proving the sub-second confirmation and SPL Memo inscription on Cookiescan.
                  </p>
                </div>

                <div className="test-action-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                    <Zap size={16} color="var(--cookie-gold)" />
                    <span>Fortune Cookie Micro-Action</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.25rem 0' }}>
                    Cracks a fortune cookie for only 0.000001 COOK, signs the transaction in Nightly, and permanently stamps your fortune memo on-chain!
                  </p>
                </div>

                {onSelectTestAddress && (
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                    onClick={() => {
                      onSelectTestAddress(
                        '11111111111111111111111111111111',
                        'CookiePay Test Tip on Cookie Chain',
                        '1'
                      );
                      onClose();
                    }}
                  >
                    <span>Auto-Fill Test Form & Close</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Cookie Chain SVM • Sub-second finality • Sub-cent fees
          </span>
          <button className="btn-accent" onClick={onClose} style={{ padding: '0.45rem 1.25rem' }}>
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
