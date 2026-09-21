import React, { useState } from 'react';
import { Send, Coffee, Sparkles, ExternalLink, CheckCircle2, AlertCircle, Compass, Zap } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';
import confetti from 'canvas-confetti';
import { useNightlyWallet } from '../hooks/useNightlyWallet';
import {
  createTransferTransaction,
  isValidPublicKey,
  getExplorerTxUrl,
  DEMO_RECIPIENTS,
} from '../services/cookieChain';
import type { TransactionRecord } from '../services/cookieChain';

interface SendTipCardProps {
  wallet: ReturnType<typeof useNightlyWallet>;
  onTransactionSuccess: (tx: TransactionRecord) => void;
  onOpenQuickstart?: () => void;
  prefilledTo?: string;
  prefilledAmount?: number;
  prefilledMemo?: string;
}

export const SendTipCard: React.FC<SendTipCardProps> = ({
  wallet,
  onTransactionSuccess,
  onOpenQuickstart,
  prefilledTo = '',
  prefilledAmount,
  prefilledMemo = '',
}) => {
  const [recipient, setRecipient] = useState(prefilledTo);
  const [amount, setAmount] = useState<string>(prefilledAmount ? prefilledAmount.toString() : '5');
  const [memo, setMemo] = useState(prefilledMemo);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successTx, setSuccessTx] = useState<string | null>(null);

  const presets = ['1', '5', '25', '100'];

  const handlePreset = (val: string) => {
    setAmount(val);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessTx(null);

    if (!wallet.connected || !wallet.publicKey) {
      setErrorMessage('Please connect your Nightly wallet first.');
      return;
    }

    const trimmedRecipient = recipient.trim();
    if (!trimmedRecipient || !isValidPublicKey(trimmedRecipient)) {
      setErrorMessage('Please enter a valid Cookie Chain / Solana Base58 recipient address.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage('Please enter a valid positive amount of $COOK.');
      return;
    }

    if (!wallet.isDemoMode && wallet.balanceCook > 0 && numericAmount > wallet.balanceCook) {
      setErrorMessage(`Insufficient $COOK balance. You have ${wallet.balanceCook.toFixed(4)} COOK.`);
      return;
    }

    try {
      setLoading(true);
      setStatusText(wallet.isDemoMode ? 'Preparing sandbox transaction...' : 'Building transaction...');

      const toPubkey = new PublicKey(trimmedRecipient);
      const tx = await createTransferTransaction(
        wallet.publicKey,
        toPubkey,
        numericAmount,
        memo
      );

      setStatusText(wallet.isDemoMode ? 'Confirming in Nightly Sandbox...' : 'Approve transaction in Nightly...');
      const signature = await wallet.signAndSend(tx, numericAmount);

      setStatusText(wallet.isDemoMode ? 'Confirmed on Cookie Chain (Sandbox)!' : 'Confirmed on Cookie Chain!');
      setSuccessTx(signature);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#10b981', '#ffffff'],
      });

      // Record transaction
      const record: TransactionRecord = {
        id: signature,
        signature,
        type: 'tip',
        from: wallet.address || '',
        to: trimmedRecipient,
        amountCook: numericAmount,
        memo: memo.trim() || undefined,
        timestamp: Date.now(),
        status: 'confirmed',
      };
      onTransactionSuccess(record);

      // Reset form
      setMemo('');
    } catch (err: unknown) {
      console.error('Transfer failed:', err);
      const msg = err instanceof Error ? err.message : 'Transaction failed or rejected by wallet.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
      setStatusText('');
    }
  };

  return (
    <div className="card-glass">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <Coffee size={22} color="var(--cookie-gold)" />
            <span>Send Instant Tip / Payment</span>
          </h2>
          <p className="card-desc">
            Direct peer-to-peer transfer with sub-second finality and on-chain memo.
          </p>
        </div>
      </div>

      {wallet.isDemoMode && (
        <div className="sandbox-info-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Sparkles size={15} color="var(--cookie-gold)" />
            <span style={{ fontWeight: 600, color: 'var(--cookie-gold)' }}>Demo Sandbox Active:</span>
            <span>Testing with 100 COOK demo balance & zero real gas fees.</span>
          </div>
          <button
            type="button"
            className="btn-text-refill"
            onClick={wallet.resetSandboxBalance}
            title="Reset sandbox balance back to 100 COOK"
          >
            Refill (100 COOK)
          </button>
        </div>
      )}

      <form onSubmit={handleSend}>
        {/* Recipient Address */}
        <div className="form-group">
          <label className="form-label" htmlFor="recipient-input">
            <span>Recipient Address</span>
            {wallet.connected && (
              <button
                type="button"
                onClick={() => wallet.address && setRecipient(wallet.address)}
                className="btn-secondary"
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
              >
                Send to Self (Test)
              </button>
            )}
          </label>
          <div className="form-input-wrapper">
            <input
              id="recipient-input"
              type="text"
              className="form-input mono"
              placeholder="Base58 public key (e.g. 7Y3z...4K8p)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>

          {/* Quick Demo Recipient Chips */}
          <div className="recipient-chips-row">
            <span className="chips-label">Quick Test:</span>
            {wallet.connected && wallet.address && (
              <button
                type="button"
                className={`chip-btn ${recipient === wallet.address ? 'active' : ''}`}
                onClick={() => {
                  setRecipient(wallet.address || '');
                  setMemo('Loopback test on Cookie Chain');
                }}
              >
                👤 Self
              </button>
            )}
            {DEMO_RECIPIENTS.map((demo) => (
              <button
                key={demo.id}
                type="button"
                className={`chip-btn ${recipient === demo.address ? 'active' : ''}`}
                onClick={() => {
                  setRecipient(demo.address);
                  setAmount(demo.defaultAmount);
                  setMemo(demo.defaultMemo);
                }}
                title={`Set recipient to ${demo.name}`}
              >
                {demo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="amount-input">
            <span>Amount ($COOK)</span>
            {wallet.connected && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Balance: {wallet.balanceCook.toFixed(4)} COOK
              </span>
            )}
          </label>
          <div className="form-input-wrapper">
            <input
              id="amount-input"
              type="number"
              step="any"
              min="0.000001"
              className="form-input mono"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <span className="input-adornment">COOK</span>
          </div>
        </div>

        {/* Quick Amount Presets */}
        <div className="presets-grid">
          {presets.map((val) => (
            <button
              key={val}
              type="button"
              className={`preset-btn ${amount === val ? 'selected' : ''}`}
              onClick={() => handlePreset(val)}
            >
              +{val} COOK
            </button>
          ))}
        </div>

        {/* On-Chain Memo / Note */}
        <div className="form-group">
          <label className="form-label" htmlFor="memo-input">
            <span>On-Chain Memo (Optional)</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Visible on Cookiescan
            </span>
          </label>
          <div className="form-input-wrapper">
            <input
              id="memo-input"
              type="text"
              maxLength={128}
              className="form-input"
              placeholder="e.g. Coffee on Cookie Chain 🍪 or Bounty Reward"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>
        </div>

        {/* Zero or Low Balance Help Banner */}
        {wallet.connected && wallet.balanceCook < 0.0001 && (
          <div className="zero-balance-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Zap size={15} color="var(--cookie-gold)" />
              <span>Need $COOK gas to test transactions?</span>
            </div>
            {onOpenQuickstart && (
              <button
                type="button"
                onClick={onOpenQuickstart}
                className="bridge-link-btn"
              >
                <span>Bridge & Faucet Guide</span>
                <Compass size={12} />
              </button>
            )}
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: 'var(--neon-rose)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !wallet.connected}
          className="btn-primary"
          id="send-tip-submit-btn"
        >
          {loading ? (
            <>
              <Sparkles size={18} className="animate-spin" />
              <span>{statusText}</span>
            </>
          ) : !wallet.connected ? (
            <span>Connect Nightly to Pay</span>
          ) : (
            <>
              <Send size={18} />
              <span>Send {amount} COOK Now</span>
            </>
          )}
        </button>
      </form>

      {/* Success Modal */}
      {successTx && (
        <div className="modal-backdrop" onClick={() => setSuccessTx(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-success">
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Transfer Confirmed!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Your transaction was successfully processed on Cookie Chain with sub-second finality.
            </p>

            <div
              style={{
                background: 'var(--bg-input)',
                padding: '0.75rem',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                wordBreak: 'break-all',
                color: 'var(--cookie-gold)',
                marginBottom: '1.5rem',
              }}
            >
              {successTx}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <a
                href={getExplorerTxUrl(successTx)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ width: 'auto', padding: '0.65rem 1.25rem' }}
              >
                <span>View on Explorer</span>
                <ExternalLink size={16} />
              </a>
              <button
                type="button"
                onClick={() => setSuccessTx(null)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
