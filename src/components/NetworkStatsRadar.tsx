import React, { useEffect, useState } from 'react';
import { Activity, Zap, ShieldCheck, DollarSign } from 'lucide-react';
import { getNetworkStats } from '../services/cookieChain';
import type { NetworkStats } from '../services/cookieChain';

export const NetworkStatsRadar: React.FC = () => {
  const [stats, setStats] = useState<NetworkStats>({
    slot: 25871500,
    blockHeight: 25426200,
    latencyMs: 95,
    health: 'healthy',
    averageFeeCook: 0.000005,
  });

  useEffect(() => {
    let mounted = true;
    const updateStats = async () => {
      const data = await getNetworkStats();
      if (mounted) {
        setStats(data);
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 4000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="radar-bar">
      <div className="radar-stat-card">
        <div className="radar-icon">
          <Activity size={20} />
        </div>
        <div className="radar-content">
          <span className="radar-label">Slot Height</span>
          <span className="radar-value">
            {stats.slot.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="radar-stat-card">
        <div className="radar-icon" style={{ color: 'var(--neon-emerald)' }}>
          <Zap size={20} />
        </div>
        <div className="radar-content">
          <span className="radar-label">RPC Latency</span>
          <span className="radar-value">
            {stats.latencyMs} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>ms</span>
          </span>
        </div>
      </div>

      <div className="radar-stat-card">
        <div className="radar-icon" style={{ color: 'var(--neon-cyan)' }}>
          <ShieldCheck size={20} />
        </div>
        <div className="radar-content">
          <span className="radar-label">Network Fee</span>
          <span className="radar-value">
            &lt; 0.00001 <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>COOK</span>
          </span>
        </div>
      </div>

      <div className="radar-stat-card">
        <div className="radar-icon" style={{ color: 'var(--cookie-gold)' }}>
          <DollarSign size={20} />
        </div>
        <div className="radar-content">
          <span className="radar-label">Gas Saved / Tx</span>
          <span className="radar-value">
            ~$4.85 <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>vs L1</span>
          </span>
        </div>
      </div>
    </div>
  );
};
