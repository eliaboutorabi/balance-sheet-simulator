import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  BadgeDollarSign,
  BarChart3,
  CircleCheck,
  CircleDollarSign,
  Download,
  Landmark,
  LineChart,
  LockKeyhole,
  Minus,
  PiggyBank,
  Plus,
  RefreshCcw,
  Scale,
  Sparkles,
  TrendingUp,
  WalletCards,
} from 'lucide-react';
import './styles.css';

const startingData = {
  assets: [
    { id: 'cash', label: 'Cash and equivalents', amount: 42500 },
    { id: 'receivables', label: 'Accounts receivable', amount: 18200 },
    { id: 'inventory', label: 'Inventory', amount: 26750 },
    { id: 'equipment', label: 'Property and equipment', amount: 68400 },
  ],
  liabilities: [
    { id: 'payables', label: 'Accounts payable', amount: 19850 },
    { id: 'debt', label: 'Long-term debt', amount: 54800 },
    { id: 'accruals', label: 'Accrued expenses', amount: 9400 },
  ],
  equity: [
    { id: 'capital', label: 'Contributed capital', amount: 50000 },
    { id: 'retained', label: 'Retained earnings', amount: 21800 },
  ],
};

const scenarios = {
  balanced: {
    label: 'Balanced',
    data: startingData,
  },
  leveraged: {
    label: 'Leveraged Growth',
    data: {
      assets: [
        { id: 'cash', label: 'Cash and equivalents', amount: 37500 },
        { id: 'receivables', label: 'Accounts receivable', amount: 24400 },
        { id: 'inventory', label: 'Inventory', amount: 43200 },
        { id: 'equipment', label: 'Property and equipment', amount: 122000 },
      ],
      liabilities: [
        { id: 'payables', label: 'Accounts payable', amount: 28600 },
        { id: 'debt', label: 'Long-term debt', amount: 108500 },
        { id: 'accruals', label: 'Accrued expenses', amount: 13800 },
      ],
      equity: [
        { id: 'capital', label: 'Contributed capital', amount: 52000 },
        { id: 'retained', label: 'Retained earnings', amount: 24200 },
      ],
    },
  },
  mismatch: {
    label: 'Needs Review',
    data: {
      assets: [
        { id: 'cash', label: 'Cash and equivalents', amount: 58300 },
        { id: 'receivables', label: 'Accounts receivable', amount: 21400 },
        { id: 'inventory', label: 'Inventory', amount: 29100 },
        { id: 'equipment', label: 'Property and equipment', amount: 75500 },
      ],
      liabilities: [
        { id: 'payables', label: 'Accounts payable', amount: 22100 },
        { id: 'debt', label: 'Long-term debt', amount: 49600 },
        { id: 'accruals', label: 'Accrued expenses', amount: 11800 },
      ],
      equity: [
        { id: 'capital', label: 'Contributed capital', amount: 58500 },
        { id: 'retained', label: 'Retained earnings', amount: 33600 },
      ],
    },
  },
};

const sectionMeta = {
  assets: {
    title: 'Assets',
    icon: WalletCards,
    addLabel: 'Add asset',
    accent: 'green',
  },
  liabilities: {
    title: 'Liabilities',
    icon: Landmark,
    addLabel: 'Add liability',
    accent: 'rose',
  },
  equity: {
    title: 'Equity',
    icon: PiggyBank,
    addLabel: 'Add equity',
    accent: 'blue',
  },
};

function cloneData(data) {
  return Object.fromEntries(
    Object.entries(data).map(([key, rows]) => [key, rows.map((row) => ({ ...row }))]),
  );
}

function total(rows) {
  return rows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
}

function currency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function percent(value) {
  if (!Number.isFinite(value)) return '0%';
  return `${Math.round(value * 100)}%`;
}

function App() {
  const [sheet, setSheet] = useState(() => cloneData(startingData));
  const [tolerance, setTolerance] = useState(0);
  const [activeScenario, setActiveScenario] = useState('balanced');

  const metrics = useMemo(() => {
    const assets = total(sheet.assets);
    const liabilities = total(sheet.liabilities);
    const equity = total(sheet.equity);
    const funding = liabilities + equity;
    const variance = assets - funding;
    const balanced = Math.abs(variance) <= tolerance;
    const workingCapital = assets - liabilities;
    const debtRatio = assets === 0 ? 0 : liabilities / assets;
    const equityRatio = assets === 0 ? 0 : equity / assets;

    return { assets, liabilities, equity, funding, variance, balanced, workingCapital, debtRatio, equityRatio };
  }, [sheet, tolerance]);

  const maxTotal = Math.max(metrics.assets, metrics.liabilities, metrics.equity, 1);

  function updateRow(section, id, field, value) {
    setSheet((current) => ({
      ...current,
      [section]: current[section].map((row) =>
        row.id === id
          ? { ...row, [field]: field === 'amount' ? Number(value) : value }
          : row,
      ),
    }));
    setActiveScenario('custom');
  }

  function addRow(section) {
    const item = {
      id: `${section}-${Date.now()}`,
      label: `New ${sectionMeta[section].title.slice(0, -1).toLowerCase()} line`,
      amount: 0,
    };
    setSheet((current) => ({ ...current, [section]: [...current[section], item] }));
    setActiveScenario('custom');
  }

  function removeRow(section, id) {
    setSheet((current) => ({ ...current, [section]: current[section].filter((row) => row.id !== id) }));
    setActiveScenario('custom');
  }

  function loadScenario(key) {
    setSheet(cloneData(scenarios[key].data));
    setActiveScenario(key);
  }

  function exportJson() {
    const payload = JSON.stringify({ sheet, metrics, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'balance-sheet-simulation.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={16} />
            Live financial modeling studio
          </div>
          <h1>Balance Sheet Simulator</h1>
          <p>
            Enter assets, liabilities, and equity to test the accounting equation in real time,
            explore scenarios, and spot gaps before they become reporting headaches.
          </p>
        </div>
        <div className={`balance-orb ${metrics.balanced ? 'is-balanced' : 'is-off'}`}>
          <Scale size={42} />
          <span>{metrics.balanced ? 'Balanced' : 'Out of balance'}</span>
          <strong>{currency(Math.abs(metrics.variance))}</strong>
          <small>{metrics.balanced ? 'Within tolerance' : metrics.variance > 0 ? 'Assets exceed funding' : 'Funding exceeds assets'}</small>
        </div>
      </section>

      <section className="command-bar">
        <div className="scenario-tabs" aria-label="Scenario presets">
          {Object.entries(scenarios).map(([key, scenario]) => (
            <button
              className={activeScenario === key ? 'active' : ''}
              key={key}
              onClick={() => loadScenario(key)}
              type="button"
            >
              {scenario.label}
            </button>
          ))}
        </div>
        <div className="actions">
          <label className="tolerance">
            <LockKeyhole size={16} />
            Tolerance
            <input
              min="0"
              step="100"
              type="number"
              value={tolerance}
              onChange={(event) => setTolerance(Number(event.target.value))}
            />
          </label>
          <button type="button" onClick={() => loadScenario('balanced')}>
            <RefreshCcw size={17} />
            Reset
          </button>
          <button type="button" className="primary" onClick={exportJson}>
            <Download size={17} />
            Export
          </button>
        </div>
      </section>

      <section className="dashboard">
        <Metric icon={CircleDollarSign} label="Total assets" value={currency(metrics.assets)} />
        <Metric icon={BadgeDollarSign} label="Liabilities + equity" value={currency(metrics.funding)} />
        <Metric icon={Activity} label="Working capital" value={currency(metrics.workingCapital)} />
        <Metric icon={TrendingUp} label="Debt ratio" value={percent(metrics.debtRatio)} />
      </section>

      <section className="workspace">
        <div className="ledger-grid">
          {Object.keys(sectionMeta).map((section) => (
            <LedgerSection
              key={section}
              maxTotal={maxTotal}
              rows={sheet[section]}
              section={section}
              sectionTotal={total(sheet[section])}
              onAdd={() => addRow(section)}
              onRemove={(id) => removeRow(section, id)}
              onUpdate={(id, field, value) => updateRow(section, id, field, value)}
            />
          ))}
        </div>

        <aside className="analysis-panel">
          <div className="panel-heading">
            <BarChart3 size={22} />
            <div>
              <h2>Balance analysis</h2>
              <p>Assets must equal liabilities plus equity.</p>
            </div>
          </div>

          <div className="equation">
            <div>
              <span>Assets</span>
              <strong>{currency(metrics.assets)}</strong>
            </div>
            <span className="operator">=</span>
            <div>
              <span>Liabilities + Equity</span>
              <strong>{currency(metrics.funding)}</strong>
            </div>
          </div>

          <div className={`verdict ${metrics.balanced ? 'success' : 'warning'}`}>
            {metrics.balanced ? <CircleCheck size={24} /> : <LineChart size={24} />}
            <div>
              <h3>{metrics.balanced ? 'The sheet balances.' : 'Reconciliation needed.'}</h3>
              <p>
                {metrics.balanced
                  ? 'The accounting equation is aligned for the current entries.'
                  : `Adjust entries by ${currency(Math.abs(metrics.variance))} to bring the sheet back into balance.`}
              </p>
            </div>
          </div>

          <div className="ratio-stack">
            <Ratio label="Debt funded" value={metrics.debtRatio} />
            <Ratio label="Equity funded" value={metrics.equityRatio} />
          </div>
        </aside>
      </section>
    </main>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="metric">
      <Icon size={22} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function LedgerSection({ maxTotal, rows, section, sectionTotal, onAdd, onRemove, onUpdate }) {
  const meta = sectionMeta[section];
  const Icon = meta.icon;

  return (
    <article className={`ledger-card ${meta.accent}`}>
      <header>
        <div>
          <Icon size={22} />
          <h2>{meta.title}</h2>
        </div>
        <strong>{currency(sectionTotal)}</strong>
      </header>
      <div className="total-bar">
        <span style={{ width: `${Math.max(3, (sectionTotal / maxTotal) * 100)}%` }} />
      </div>
      <div className="rows">
        {rows.map((row) => (
          <div className="entry-row" key={row.id}>
            <input
              aria-label={`${meta.title} label`}
              value={row.label}
              onChange={(event) => onUpdate(row.id, 'label', event.target.value)}
            />
            <input
              aria-label={`${row.label} amount`}
              min="0"
              step="100"
              type="number"
              value={row.amount}
              onChange={(event) => onUpdate(row.id, 'amount', event.target.value)}
            />
            <button aria-label={`Remove ${row.label}`} type="button" onClick={() => onRemove(row.id)}>
              <Minus size={16} />
            </button>
          </div>
        ))}
      </div>
      <button className="add-line" type="button" onClick={onAdd}>
        <Plus size={16} />
        {meta.addLabel}
      </button>
    </article>
  );
}

function Ratio({ label, value }) {
  return (
    <div className="ratio">
      <div>
        <span>{label}</span>
        <strong>{percent(value)}</strong>
      </div>
      <div className="ratio-track">
        <span style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }} />
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
