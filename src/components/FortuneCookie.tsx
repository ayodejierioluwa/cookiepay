import React, { useState } from 'react';
import { Sparkles, Cookie, ExternalLink, RefreshCw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNightlyWallet } from '../hooks/useNightlyWallet';
import { createFortuneTransaction, getExplorerTxUrl } from '../services/cookieChain';
import type { TransactionRecord } from '../services/cookieChain';

interface FortuneCookieProps {
  wallet: ReturnType<typeof useNightlyWallet>;
  onFortuneCracked: (tx: TransactionRecord) => void;
}

export const FortuneCookie: React.FC<FortuneCookieProps> = ({ wallet, onFortuneCracked }) => {
  const [cracking, setCracking] = useState(false);
  const [revealedFortune, setRevealedFortune] = useState<string | null>(null);
  const [lastSignature, setLastSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const crackCookie = async () => {
    setError(null);
    if (!wallet.connected || !wallet.publicKey) {
      setError('Please connect your Nightly Wallet first.');
      return;
    }

    try {
      setCracking(true);
      const seed = Math.floor(100000 + Math.random() * 900000).toString();

      // Build micro-action on Cookie Chain
      const { transaction, fortuneText } = await createFortuneTransaction(wallet.publicKey, seed);

      // Sign & Submit via Nightly
      const signature = await wallet.signAndSend(transaction);

      setLastSignature(signature);
      setRevealedFortune(fortuneText);

      // Trigger massive confetti
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#fbbf24', '#10b981', '#6366f1', '#ec4899'],
      });

      // Record transaction
      const record: TransactionRecord = {
        id: signature,
        signature,
        type: 'fortune',
        from: wallet.address || '',
        to: wallet.address || '',
        amountCook: 0.000001,
        memo: `Fortune #${seed}: ${fortuneText}`,
        timestamp: Date.now(),
        status: 'confirmed',
      };
      onFortuneCracked(record);
    } catch (err: unknown) {
      console.error('Crack fortune error:', err);
      const msg = err instanceof Error ? err.message : 'Transaction was rejected or failed.';
      setError(msg);
    } finally {
      setCracking(false);
    }
  };

  const reset = () => {
    setRevealedFortune(null);
    setLastSignature(null);
    setError(null);
  };

  return (
    <div className="card-glass">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <Cookie size={22} color="var(--cookie-gold)" />
            <span>On-Chain Fortune Cookie</span>
          </h2>
          <p className="card-desc">
            Experience Cookie Chain's sub-second finality. Crack a cookie and stamp your Web3 fortune on-chain.
          </p>
        </div>
      </div>

      <div className="fortune-container">
        {/* Animated Cookie Graphic */}
        <div
          className={`fortune-cookie-graphic ${cracking ? 'cracking' : ''}`}
          onClick={!cracking ? crackCookie : undefined}
          title="Click to crack!"
          style={{ fontSize: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {revealedFortune ? '🥠' : '🍪'}
        </div>

        {/* Revealed Paper */}
        {revealedFortune ? (
          <div className="fortune-paper">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#b45309', marginBottom: '0.4rem' }}>
              <Trophy size={16} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                On-Chain Fortune Verified
              </span>
            </div>
            <p className="fortune-quote">
              "{revealedFortune}"
            </p>
            {lastSignature && (
              <div style={{ marginTop: '0.75rem' }}>
                <a
                  href={getExplorerTxUrl(lastSignature)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tx-link"
                  style={{ justifyContent: 'center', color: '#b45309' }}
                >
                  <span>View Proof on Cookiescan</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            )}
          </div>
        ) : (
          <div style={{ margin: '1rem 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {cracking ? (
              <span style={{ color: 'var(--cookie-gold)' }}>
                Cracking cookie & stamping on Cookie Chain...
              </span>
            ) : (
              <span>
                Cost: ~0.000001 COOK • Sub-second confirmation
              </span>
            )}
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: 'var(--neon-rose)',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Buttons */}
        <div style={{ width: '100%', maxWidth: '320px' }}>
          {revealedFortune ? (
            <button
              type="button"
              onClick={reset}
              className="btn-secondary"
              style={{ width: '100%' }}
            >
              <RefreshCw size={16} />
              <span>Crack Another Cookie</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={crackCookie}
              disabled={cracking || !wallet.connected}
              className="btn-primary"
              id="crack-cookie-btn"
            >
              {cracking ? (
                <>
                  <Sparkles size={18} className="animate-spin" />
                  <span>Stamping On-Chain...</span>
                </>
              ) : !wallet.connected ? (
                <span>Connect Nightly to Crack</span>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Crack Fortune Cookie</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
