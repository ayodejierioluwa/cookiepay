import React from 'react';
import { History, ExternalLink, ArrowUpRight, Sparkles } from 'lucide-react';
import { getExplorerTxUrl } from '../services/cookieChain';
import type { TransactionRecord } from '../services/cookieChain';

interface RecentTransactionsProps {
  transactions: TransactionRecord[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  return (
    <div className="card-glass" style={{ marginTop: '1.5rem' }}>
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <History size={20} color="var(--cookie-gold)" />
            <span>Recent Activity Feed</span>
          </h2>
          <p className="card-desc">
            Live on-chain ledger of tips, invoices, and fortunes confirmed on Cookie Chain.
          </p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '0.95rem' }}>No transactions recorded yet in this session.</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
            Send a tip or crack a fortune cookie above to see your transaction recorded live!
          </p>
        </div>
      ) : (
        <div className="tx-list">
          {transactions.map((tx) => (
            <div key={tx.id} className="tx-item">
              <div className="tx-left">
                <div className="tx-icon">
                  {tx.type === 'fortune' ? (
                    <Sparkles size={16} />
                  ) : (
                    <ArrowUpRight size={16} />
                  )}
                </div>
                <div className="tx-info">
                  <div className="tx-memo">
                    {tx.memo || (tx.type === 'fortune' ? 'Fortune Cookie' : 'Payment')}
                  </div>
                  <div className="tx-time">
                    {new Date(tx.timestamp).toLocaleTimeString()} •{' '}
                    <span style={{ color: 'var(--text-secondary)' }}>
                      To: {tx.to ? `${tx.to.slice(0, 4)}...${tx.to.slice(-4)}` : 'Self'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="tx-amount">
                  +{tx.amountCook.toFixed(4)} COOK
                </div>
                <a
                  href={getExplorerTxUrl(tx.signature)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tx-link"
                  title="View on Cookiescan"
                >
                  <ExternalLink size={15} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
