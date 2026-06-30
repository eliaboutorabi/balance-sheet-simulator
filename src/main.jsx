import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { driver } from 'driver.js';
import {
  Activity,
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  BookOpen,
  Brain,
  CircleCheck,
  CircleDollarSign,
  Compass,
  Download,
  Github,
  GraduationCap,
  Landmark,
  Layers,
  LineChart,
  LockKeyhole,
  Minus,
  PiggyBank,
  Plus,
  ReceiptText,
  RefreshCcw,
  Scale,
  Sparkles,
  Target,
  TrendingUp,
  WalletCards,
} from 'lucide-react';
import 'driver.js/dist/driver.css';
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
    lesson: 'Assets are resources the organization controls. They are the things the business can use, sell, collect, or convert into cash.',
    examples: ['Cash', 'Receivables', 'Inventory', 'Equipment'],
  },
  liabilities: {
    title: 'Liabilities',
    icon: Landmark,
    addLabel: 'Add liability',
    accent: 'rose',
    lesson: 'Liabilities are obligations. They represent money, goods, or services the organization still owes to lenders, suppliers, employees, or tax authorities.',
    examples: ['Payables', 'Loans', 'Accrued expenses'],
  },
  equity: {
    title: 'Equity',
    icon: PiggyBank,
    addLabel: 'Add equity',
    accent: 'blue',
    lesson: 'Equity is the owner claim after liabilities are subtracted from assets. It includes invested capital and accumulated profits kept in the business.',
    examples: ['Owner capital', 'Common stock', 'Retained earnings'],
  },
};

const lessons = [
  {
    key: 'snapshot',
    icon: BookOpen,
    title: 'A balance sheet is a snapshot',
    body: 'It shows what an organization owns, what it owes, and what is left for owners at one point in time. Unlike an income statement, it is not about activity over a period.',
    takeaway: 'Think: financial position today.',
  },
  {
    key: 'equation',
    icon: Scale,
    title: 'The equation must always hold',
    body: 'Every asset has to be funded somehow. Funding comes from either outside parties, called liabilities, or owners, called equity.',
    takeaway: 'Assets = Liabilities + Equity.',
  },
  {
    key: 'double-entry',
    icon: ReceiptText,
    title: 'Every transaction touches two places',
    body: 'If the company borrows cash, assets rise and liabilities rise. If it uses cash to buy equipment, one asset goes down while another asset goes up.',
    takeaway: 'Balanced transactions have two sides.',
  },
];

const exercises = [
  {
    title: 'Healthy starting point',
    description: 'Load a clean balance sheet and notice how total assets equal the claims against those assets.',
    action: 'balanced',
  },
  {
    title: 'Debt-funded expansion',
    description: 'A company buys more equipment using debt. Assets grow, but the debt ratio climbs too.',
    action: 'leveraged',
  },
  {
    title: 'Find the missing entry',
    description: 'This case is intentionally out of balance. Use the variance to decide which side needs attention.',
    action: 'mismatch',
  },
];

const currencyOptions = [
  { code: 'USD', label: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', label: 'Euro', locale: 'de-DE' },
  { code: 'GBP', label: 'British Pound', locale: 'en-GB' },
  { code: 'CAD', label: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'AUD', label: 'Australian Dollar', locale: 'en-AU' },
  { code: 'JPY', label: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'INR', label: 'Indian Rupee', locale: 'en-IN' },
  { code: 'AED', label: 'UAE Dirham', locale: 'en-AE' },
];

function cloneData(data) {
  return Object.fromEntries(
    Object.entries(data).map(([key, rows]) => [key, rows.map((row) => ({ ...row }))]),
  );
}

function total(rows) {
  return rows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
}

function currency(value, selectedCurrency) {
  const option = currencyOptions.find(({ code }) => code === selectedCurrency) ?? currencyOptions[0];

  return new Intl.NumberFormat(option.locale, {
    style: 'currency',
    currency: option.code,
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
  const [activeLesson, setActiveLesson] = useState('snapshot');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

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
    const payload = JSON.stringify(
      { currency: selectedCurrency, sheet, metrics, exportedAt: new Date().toISOString() },
      null,
      2,
    );
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'balance-sheet-simulation.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  function startTour() {
    const tour = driver({
      showProgress: true,
      animate: true,
      nextBtnText: 'Next',
      prevBtnText: 'Back',
      doneBtnText: 'Finish',
      popoverClass: 'tour-popover',
      steps: [
        {
          element: '[data-tour="hero"]',
          popover: {
            title: 'Start with the big idea',
            description: 'A balance sheet is a snapshot of what a business owns, owes, and has left for owners.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '[data-tour="lessons"]',
          popover: {
            title: 'Learn before calculating',
            description: 'Use these short lessons to understand the purpose of each part of the sheet before editing numbers.',
            side: 'bottom',
          },
        },
        {
          element: '[data-tour="scenarios"]',
          popover: {
            title: 'Try guided scenarios',
            description: 'Switch between examples to see how financing choices and missing entries change the balance.',
            side: 'bottom',
          },
        },
        {
          element: '[data-tour="currency"]',
          popover: {
            title: 'Choose your currency',
            description: 'Pick the currency symbol and formatting style you want to use for the entire simulator.',
            side: 'bottom',
          },
        },
        {
          element: '[data-tour="metrics"]',
          popover: {
            title: 'Read the quick signals',
            description: 'These totals and ratios translate the ledger into fast financial clues, like working capital and debt funding.',
            side: 'bottom',
          },
        },
        {
          element: '[data-tour="ledger"]',
          popover: {
            title: 'Edit the ledger',
            description: 'Change labels, adjust amounts, add lines, or remove lines. The whole page updates immediately.',
            side: 'right',
          },
        },
        {
          element: '[data-tour="analysis"]',
          popover: {
            title: 'Check the equation',
            description: 'This panel tells you whether Assets equal Liabilities plus Equity and how far off the sheet is.',
            side: 'left',
          },
        },
      ],
    });

    tour.drive();
  }

  return (
    <main className="app-shell">
      <section className="hero" data-tour="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={16} />
            Interactive accounting classroom
          </div>
          <h1>Balance Sheet Simulator</h1>
          <p>
            Learn what a balance sheet means, then edit the numbers to see the accounting
            equation react in real time.
          </p>
          <div className="hero-actions">
            <button className="primary cta" type="button" onClick={startTour}>
              <Compass size={18} />
              Start guided tour
            </button>
            <a href="#learn" className="text-link">
              <GraduationCap size={18} />
              Learn the basics
            </a>
            <a
              href="https://github.com/eliaboutorabi/balance-sheet-simulator"
              className="text-link"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={18} />
              GitHub
            </a>
          </div>
          <p className="builder-credit">Built by Elham Aboutorabi.</p>
        </div>
        <div className={`balance-orb ${metrics.balanced ? 'is-balanced' : 'is-off'}`}>
          <Scale size={42} />
          <span>{metrics.balanced ? 'Balanced' : 'Out of balance'}</span>
          <strong>{currency(Math.abs(metrics.variance), selectedCurrency)}</strong>
          <small>{metrics.balanced ? 'Within tolerance' : metrics.variance > 0 ? 'Assets exceed funding' : 'Funding exceeds assets'}</small>
        </div>
      </section>

      <section className="learning-lab" id="learn" data-tour="lessons">
        <div className="learning-copy">
          <span className="section-kicker">
            <Brain size={16} />
            Balance sheet fundamentals
          </span>
          <h2>First learn the story, then change the numbers.</h2>
          <p>
            A balance sheet is less mysterious when you treat it as a funding map:
            every resource on the left is paid for by creditors or owners on the right.
          </p>
        </div>

        <div className="lesson-tabs" aria-label="Balance sheet lessons">
          {lessons.map((lesson) => {
            const Icon = lesson.icon;
            return (
              <button
                className={activeLesson === lesson.key ? 'active' : ''}
                key={lesson.key}
                onClick={() => setActiveLesson(lesson.key)}
                type="button"
              >
                <Icon size={18} />
                {lesson.title}
              </button>
            );
          })}
        </div>

        <LessonCard lesson={lessons.find((lesson) => lesson.key === activeLesson)} />

        <div className="concept-grid">
          {Object.entries(sectionMeta).map(([key, meta]) => {
            const Icon = meta.icon;
            return (
              <article className={`concept-card ${meta.accent}`} key={key}>
                <Icon size={24} />
                <h3>{meta.title}</h3>
                <p>{meta.lesson}</p>
                <div className="chip-row">
                  {meta.examples.map((example) => (
                    <span key={example}>{example}</span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="exercise-strip" data-tour="scenarios">
        <div>
          <span className="section-kicker">
            <Target size={16} />
            Guided practice
          </span>
          <h2>Try a scenario and explain what changed.</h2>
        </div>
        <div className="exercise-grid">
          {exercises.map((exercise) => (
            <button
              className={activeScenario === exercise.action ? 'exercise-card active' : 'exercise-card'}
              key={exercise.title}
              onClick={() => loadScenario(exercise.action)}
              type="button"
            >
              <span>{exercise.title}</span>
              <p>{exercise.description}</p>
              <ArrowRight size={18} />
            </button>
          ))}
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
          <label className="currency-picker" data-tour="currency">
            <CircleDollarSign size={16} />
            Currency
            <select
              aria-label="Currency"
              value={selectedCurrency}
              onChange={(event) => setSelectedCurrency(event.target.value)}
            >
              {currencyOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.code} - {option.label}
                </option>
              ))}
            </select>
          </label>
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
          <button type="button" onClick={startTour}>
            <Compass size={17} />
            Tour
          </button>
          <button type="button" className="primary" onClick={exportJson}>
            <Download size={17} />
            Export
          </button>
        </div>
      </section>

      <section className="dashboard" data-tour="metrics">
        <Metric icon={CircleDollarSign} label="Total assets" value={currency(metrics.assets, selectedCurrency)} />
        <Metric icon={BadgeDollarSign} label="Liabilities + equity" value={currency(metrics.funding, selectedCurrency)} />
        <Metric icon={Activity} label="Working capital" value={currency(metrics.workingCapital, selectedCurrency)} />
        <Metric icon={TrendingUp} label="Debt ratio" value={percent(metrics.debtRatio)} />
      </section>

      <section className="workspace">
        <div className="ledger-grid" data-tour="ledger">
          {Object.keys(sectionMeta).map((section) => (
            <LedgerSection
              key={section}
              maxTotal={maxTotal}
              rows={sheet[section]}
              section={section}
              sectionTotal={total(sheet[section])}
              selectedCurrency={selectedCurrency}
              onAdd={() => addRow(section)}
              onRemove={(id) => removeRow(section, id)}
              onUpdate={(id, field, value) => updateRow(section, id, field, value)}
            />
          ))}
        </div>

        <aside className="analysis-panel" data-tour="analysis">
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
              <strong>{currency(metrics.assets, selectedCurrency)}</strong>
            </div>
            <span className="operator">=</span>
            <div>
              <span>Liabilities + Equity</span>
              <strong>{currency(metrics.funding, selectedCurrency)}</strong>
            </div>
          </div>

          <div className={`verdict ${metrics.balanced ? 'success' : 'warning'}`}>
            {metrics.balanced ? <CircleCheck size={24} /> : <LineChart size={24} />}
            <div>
              <h3>{metrics.balanced ? 'The sheet balances.' : 'Reconciliation needed.'}</h3>
              <p>
                {metrics.balanced
                  ? 'The accounting equation is aligned for the current entries.'
                  : `Adjust entries by ${currency(Math.abs(metrics.variance), selectedCurrency)} to bring the sheet back into balance.`}
              </p>
            </div>
          </div>

          <div className="ratio-stack">
            <Ratio label="Debt funded" value={metrics.debtRatio} />
            <Ratio label="Equity funded" value={metrics.equityRatio} />
          </div>

          <div className="coach-note">
            <Layers size={20} />
            <p>
              When the sheet does not balance, look for a missing second side of a transaction.
              For example, borrowing cash adds both cash and debt.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

function LessonCard({ lesson }) {
  const Icon = lesson.icon;

  return (
    <article className="lesson-card">
      <Icon size={26} />
      <div>
        <h3>{lesson.title}</h3>
        <p>{lesson.body}</p>
      </div>
      <strong>{lesson.takeaway}</strong>
    </article>
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

function LedgerSection({ maxTotal, rows, section, sectionTotal, selectedCurrency, onAdd, onRemove, onUpdate }) {
  const meta = sectionMeta[section];
  const Icon = meta.icon;

  return (
    <article className={`ledger-card ${meta.accent}`}>
      <header>
        <div>
          <Icon size={22} />
          <h2>{meta.title}</h2>
        </div>
        <strong>{currency(sectionTotal, selectedCurrency)}</strong>
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
