import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Check, ExternalLink, Download, Share2 } from 'lucide-react';
import { useNightlyWallet } from '../hooks/useNightlyWallet';

interface InvoiceGeneratorProps {
  wallet: ReturnType<typeof useNightlyWallet>;
  onTestInvoice: (to: string, amount: number, memo: string) => void;
}

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ wallet, onTestInvoice }) => {
  const [payee, setPayee] = useState(wallet.address || '');
  const [amount, setAmount] = useState('10');
  const [memo, setMemo] = useState('Web3 Services & Cookie Tip');
  const [copiedLink, setCopiedLink] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keep payee updated if wallet connects/changes
  useEffect(() => {
    if (wallet.address && !payee) {
      setPayee(wallet.address);
    }
  }, [wallet.address, payee]);

  // Construct standard payment URI
  const generatePaymentUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams();
    if (payee) params.set('to', payee);
    if (amount) params.set('amount', amount);
    if (memo) params.set('memo', memo);
    return `${origin}/?${params.toString()}`;
  };

  // Generate QR Code
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const paymentUrl = generatePaymentUrl();
    QRCode.toCanvas(
      canvas,
      paymentUrl,
      {
        width: 190,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      },
      (error) => {
        if (error) console.error('QR code render error:', error);
      }
    );
  }, [payee, amount, memo]);

  const handleCopyLink = () => {
    const url = generatePaymentUrl();
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.download = `cookiepay-invoice-${amount}COOK.png`;
    a.href = url;
    a.click();
  };

  const handlePreviewPayment = () => {
    const numericAmount = parseFloat(amount) || 1;
    onTestInvoice(payee, numericAmount, memo);
  };

  return (
    <div className="card-glass">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <QrCode size={22} color="var(--cookie-gold)" />
            <span>Dynamic QR Invoice & Pay Link</span>
          </h2>
          <p className="card-desc">
            Request $COOK payments with zero-click shareable links & scan-to-pay QR.
          </p>
        </div>
      </div>

      {/* Invoice Inputs */}
      <div className="form-group">
        <label className="form-label" htmlFor="payee-input">
          <span>Payee Address (Your Wallet)</span>
          {wallet.address && payee !== wallet.address && (
            <button
              type="button"
              onClick={() => setPayee(wallet.address || '')}
              className="btn-secondary"
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
            >
              Use My Address
            </button>
          )}
        </label>
        <div className="form-input-wrapper">
          <input
            id="payee-input"
            type="text"
            className="form-input mono"
            placeholder="Base58 address to receive funds"
            value={payee}
            onChange={(e) => setPayee(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="invoice-amount">
            <span>Requested Amount</span>
          </label>
          <div className="form-input-wrapper">
            <input
              id="invoice-amount"
              type="number"
              min="0.0001"
              step="any"
              className="form-input mono"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <span className="input-adornment">COOK</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="invoice-memo">
            <span>Memo / Invoice Ref</span>
          </label>
          <div className="form-input-wrapper">
            <input
              id="invoice-memo"
              type="text"
              className="form-input"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* QR Display Card */}
      <div className="qr-container">
        <div className="qr-canvas-wrapper">
          <canvas ref={canvasRef}></canvas>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
            Scan to Pay {amount || '0'} COOK
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Instant settlement on Cookie Chain
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <button
          type="button"
          onClick={handleCopyLink}
          className="btn-secondary"
          style={{ width: '100%' }}
        >
          {copiedLink ? <Check size={16} color="var(--neon-emerald)" /> : <Share2 size={16} />}
          <span>{copiedLink ? 'Link Copied!' : 'Copy Payment Link'}</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadQR}
          className="btn-secondary"
          style={{ width: '100%' }}
        >
          <Download size={16} />
          <span>Download QR PNG</span>
        </button>
      </div>

      <button
        type="button"
        onClick={handlePreviewPayment}
        className="btn-primary"
        style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: '1px solid #34d399', color: '#fff' }}
      >
        <span>Test & Pay This Invoice Now</span>
        <ExternalLink size={17} />
      </button>
    </div>
  );
};
