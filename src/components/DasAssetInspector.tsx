import React, { useEffect, useState } from 'react';
import { Database, ExternalLink, RefreshCw, Layers } from 'lucide-react';
import { useNightlyWallet } from '../hooks/useNightlyWallet';
import {
  fetchDasAssets,
  COOKIE_DAS_ENDPOINT,
  COOKIESWAP_URL,
  COOKIE_EXPLORER_BASE,
} from '../services/cookieChain';
import type { DasAssetItem } from '../services/cookieChain';

interface DasAssetInspectorProps {
  wallet: ReturnType<typeof useNightlyWallet>;
}

export const DasAssetInspector: React.FC<DasAssetInspectorProps> = ({ wallet }) => {
  const [loading, setLoading] = useState(false);
  const [operational, setOperational] = useState(true);
  const [assets, setAssets] = useState<DasAssetItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const checkDas = async (address?: string | null) => {
    setLoading(true);
    try {
      const target = address || wallet.address || '11111111111111111111111111111111';
      const result = await fetchDasAssets(target);
      setOperational(result.operational);
      setAssets(result.items);
      setTotalCount(result.total);
    } catch (err) {
      console.warn('Error querying DAS:', err);
      setOperational(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDas(wallet.address);
  }, [wallet.address]);

  return (
    <div className="das-inspector-card">
      <div className="das-inspector-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div className="das-badge-icon">
            <Database size={16} color="var(--cookie-gold)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Cookie DAS API</span>
              <span className={`status-tag ${operational ? 'online' : 'offline'}`}>
                {operational ? (
                  <>
                    <span className="dot-pulse" />
                    Live ({COOKIE_DAS_ENDPOINT.replace('https://', '')})
                  </>
                ) : (
                  'Offline'
                )}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Digital Asset Standard query layer for compressed NFTs & Token-2022
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
            onClick={() => checkDas(wallet.address)}
            disabled={loading}
            title="Refresh DAS index"
          >
            <RefreshCw size={12} className={loading ? 'spin' : ''} />
            <span>Sync</span>
          </button>

          <a
            href={COOKIESWAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', textDecoration: 'none' }}
          >
            <span>Cookieswap</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div className="das-inspector-body">
        {wallet.connected && wallet.address ? (
          <div className="das-stats-row">
            <div className="das-stat-col">
              <span className="das-stat-label">On-Chain Assets</span>
              <span className="das-stat-val">{totalCount}</span>
            </div>

            <div className="das-stat-col">
              <span className="das-stat-label">Wallet Standard</span>
              <span className="das-stat-val mono" style={{ fontSize: '0.85rem' }}>
                SVM / Nightly
              </span>
            </div>

            <div className="das-stat-col">
              <span className="das-stat-label">Explorer Token Accounts</span>
              <a
                href={`${COOKIE_EXPLORER_BASE}/address/${wallet.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="tx-link"
                style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <span>View on Cookiescan</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ) : (
          <div className="das-empty-prompt">
            <Layers size={18} color="var(--text-muted)" />
            <span>Connect Nightly to inspect DAS assets & tokens on Cookie Chain</span>
          </div>
        )}

        {assets.length > 0 && (
          <div className="das-assets-list">
            {assets.map((asset) => (
              <div key={asset.id} className="das-asset-pill">
                <span>{asset.content?.metadata?.name || asset.id.slice(0, 8)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
