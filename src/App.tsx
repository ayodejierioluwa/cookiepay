import React, { useState, useEffect } from 'react';
import { Send, QrCode, Cookie, Sparkles, Layers, ExternalLink } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { NetworkStatsRadar } from './components/NetworkStatsRadar';
import { DasAssetInspector } from './components/DasAssetInspector';
import { QuickstartModal } from './components/QuickstartModal';
import { SendTipCard } from './components/SendTipCard';
import { InvoiceGenerator } from './components/InvoiceGenerator';
import { FortuneCookie } from './components/FortuneCookie';
import { RecentTransactions } from './components/RecentTransactions';
import { useNightlyWallet } from './hooks/useNightlyWallet';
import type { TransactionRecord } from './services/cookieChain';
import './styles/app.css';

export const App: React.FC = () => {
  const wallet = useNightlyWallet();
  const [activeTab, setActiveTab] = useState<'tip' | 'invoice' | 'fortune' | 'all'>('tip');
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [showQuickstart, setShowQuickstart] = useState(false);

  // Prefill state from URL query parameters (e.g. ?to=...&amount=...&memo=...)
  const [prefilledTo, setPrefilledTo] = useState('');
  const [prefilledAmount, setPrefilledAmount] = useState<number | undefined>();
  const [prefilledMemo, setPrefilledMemo] = useState('');

  // Read URL query params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const to = params.get('to') || params.get('payee');
      const amount = params.get('amount');
      const memo = params.get('memo');

      if (to) setPrefilledTo(to);
      if (amount && !isNaN(parseFloat(amount))) setPrefilledAmount(parseFloat(amount));
      if (memo) setPrefilledMemo(memo);

      // If user arrived with payment params, open Send Tip tab
      if (to || amount) {
        setActiveTab('tip');
      }

      // Load transactions from localStorage
      const saved = localStorage.getItem('cookiepay_tx_history');
      if (saved) {
        try {
          setTransactions(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing transaction history:', e);
        }
      }
    }
  }, []);

  const handleTransactionSuccess = (tx: TransactionRecord) => {
    setTransactions((prev) => {
      const updated = [tx, ...prev].slice(0, 20); // Keep latest 20
      localStorage.setItem('cookiepay_tx_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleTestInvoice = (to: string, amount: number, memo: string) => {
    setPrefilledTo(to);
    setPrefilledAmount(amount);
    setPrefilledMemo(memo);
    setActiveTab('tip');
  };

  return (
    <div className="app-container">
      {/* Top Navbar with Nightly Connector & Quickstart */}
      <Navbar wallet={wallet} onOpenQuickstart={() => setShowQuickstart(true)} />

      {/* Hero Header */}
      <section className="hero-section">
        <div className="hero-tag">
          <Sparkles size={14} />
          <span>Powered by Cookie Chain SVM</span>
        </div>
        <h1 className="hero-title">
          Sub-Second Payments & Invoicing on <span>Cookie Chain</span>
        </h1>
        <p className="hero-subtitle">
          Send micro-tips with on-chain memos, generate zero-click QR invoices, and experience real-time finality with your Nightly Wallet.
        </p>

        {/* Live Network Radar Bar */}
        <NetworkStatsRadar />

        {/* Cookie DAS API & Ecosystem Status */}
        <DasAssetInspector wallet={wallet} />
      </section>

      {/* Navigation Tabs */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'tip' ? 'active' : ''}`}
          onClick={() => setActiveTab('tip')}
        >
          <Send size={16} />
          <span>Send Tip / Pay</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'invoice' ? 'active' : ''}`}
          onClick={() => setActiveTab('invoice')}
        >
          <QrCode size={16} />
          <span>QR Invoice</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'fortune' ? 'active' : ''}`}
          onClick={() => setActiveTab('fortune')}
        >
          <Cookie size={16} />
          <span>Fortune Cookie</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <Layers size={16} />
          <span>Split View</span>
        </button>
      </div>

      {/* Dynamic Tab Views */}
      {activeTab === 'tip' && (
        <div className="single-column-grid">
          <SendTipCard
            wallet={wallet}
            onTransactionSuccess={handleTransactionSuccess}
            onOpenQuickstart={() => setShowQuickstart(true)}
            prefilledTo={prefilledTo}
            prefilledAmount={prefilledAmount}
            prefilledMemo={prefilledMemo}
          />
        </div>
      )}

      {activeTab === 'invoice' && (
        <div className="single-column-grid">
          <InvoiceGenerator wallet={wallet} onTestInvoice={handleTestInvoice} />
        </div>
      )}

      {activeTab === 'fortune' && (
        <div className="single-column-grid">
          <FortuneCookie wallet={wallet} onFortuneCracked={handleTransactionSuccess} />
        </div>
      )}

      {activeTab === 'all' && (
        <div className="main-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <SendTipCard
              wallet={wallet}
              onTransactionSuccess={handleTransactionSuccess}
              onOpenQuickstart={() => setShowQuickstart(true)}
              prefilledTo={prefilledTo}
              prefilledAmount={prefilledAmount}
              prefilledMemo={prefilledMemo}
            />
            <FortuneCookie wallet={wallet} onFortuneCracked={handleTransactionSuccess} />
          </div>
          <div>
            <InvoiceGenerator wallet={wallet} onTestInvoice={handleTestInvoice} />
          </div>
        </div>
      )}

      {/* Recent On-Chain Transactions */}
      <RecentTransactions transactions={transactions} />

      {/* Footer */}
      <footer
        style={{
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🍪 CookiePay</span>
          <span>•</span>
          <span>Built for Cookie Chain Superteam Earn Bounty</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <a
            href="https://docs.cookiechain.wtf"
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span>Docs</span>
            <ExternalLink size={12} />
          </a>
          <a
            href="https://cookiescan.io"
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span>Cookiescan</span>
            <ExternalLink size={12} />
          </a>
          <a
            href="https://nightly.app"
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span>Nightly Wallet</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </footer>

      {/* Quickstart & Bridge Guide Modal */}
      <QuickstartModal
        isOpen={showQuickstart}
        onClose={() => setShowQuickstart(false)}
        onSelectTestAddress={(to, memo, amount) => {
          setPrefilledTo(to);
          setPrefilledMemo(memo);
          setPrefilledAmount(parseFloat(amount));
          setActiveTab('tip');
        }}
      />
    </div>
  );
};

export default App;
