import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { driver } from 'driver.js';
import {
  Activity,
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  BookOpen,
  Brain,
  Building2,
  CalendarDays,
  CircleCheck,
  CircleDollarSign,
  Compass,
  Download,
  FileText,
  Github,
  GraduationCap,
  Landmark,
  Layers,
  LineChart,
  LockKeyhole,
  Minus,
  Moon,
  PiggyBank,
  Plus,
  Printer,
  ReceiptText,
  RefreshCcw,
  Scale,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  WalletCards,
} from 'lucide-react';
import 'driver.js/dist/driver.css';
import './styles.css';

const startingData = {
  currentAssets: [
    { id: 'cash', label: 'Cash and equivalents', amount: 42500 },
    { id: 'receivables', label: 'Accounts receivable', amount: 18200 },
    { id: 'inventory', label: 'Inventory', amount: 26750 },
  ],
  nonCurrentAssets: [
    { id: 'equipment', label: 'Equipment', amount: 68400 },
    { id: 'accumulated-depreciation', label: 'Less: accumulated depreciation', amount: -12000 },
  ],
  currentLiabilities: [
    { id: 'payables', label: 'Accounts payable', amount: 19850 },
    { id: 'accruals', label: 'Accrued expenses', amount: 9400 },
  ],
  nonCurrentLiabilities: [
    { id: 'debt', label: 'Long-term debt', amount: 54800 },
  ],
  equity: [
    { id: 'capital', label: 'Contributed capital', amount: 50000 },
    { id: 'retained', label: 'Retained earnings', amount: 9800 },
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
      currentAssets: [
        { id: 'cash', label: 'Cash and equivalents', amount: 37500 },
        { id: 'receivables', label: 'Accounts receivable', amount: 24400 },
        { id: 'inventory', label: 'Inventory', amount: 43200 },
      ],
      nonCurrentAssets: [
        { id: 'equipment', label: 'Equipment', amount: 122000 },
        { id: 'accumulated-depreciation', label: 'Less: accumulated depreciation', amount: -22000 },
      ],
      currentLiabilities: [
        { id: 'payables', label: 'Accounts payable', amount: 28600 },
        { id: 'accruals', label: 'Accrued expenses', amount: 13800 },
      ],
      nonCurrentLiabilities: [
        { id: 'debt', label: 'Long-term debt', amount: 108500 },
      ],
      equity: [
        { id: 'capital', label: 'Contributed capital', amount: 52000 },
        { id: 'retained', label: 'Retained earnings', amount: 2200 },
      ],
    },
  },
  mismatch: {
    label: 'Needs Review',
    data: {
      currentAssets: [
        { id: 'cash', label: 'Cash and equivalents', amount: 58300 },
        { id: 'receivables', label: 'Accounts receivable', amount: 21400 },
        { id: 'inventory', label: 'Inventory', amount: 29100 },
      ],
      nonCurrentAssets: [
        { id: 'equipment', label: 'Equipment', amount: 75500 },
        { id: 'accumulated-depreciation', label: 'Less: accumulated depreciation', amount: -15000 },
      ],
      currentLiabilities: [
        { id: 'payables', label: 'Accounts payable', amount: 22100 },
        { id: 'accruals', label: 'Accrued expenses', amount: 11800 },
      ],
      nonCurrentLiabilities: [
        { id: 'debt', label: 'Long-term debt', amount: 49600 },
      ],
      equity: [
        { id: 'capital', label: 'Contributed capital', amount: 58500 },
        { id: 'retained', label: 'Retained earnings', amount: 18600 },
      ],
    },
  },
};

const sectionMeta = {
  currentAssets: {
    title: 'Current Assets',
    singular: 'current asset',
    icon: WalletCards,
    addLabel: 'Add current asset',
    accent: 'green',
    lesson: 'Current assets are resources expected to turn into cash, be sold, or be used within one year or one operating cycle.',
    examples: ['Cash', 'Receivables', 'Inventory', 'Prepaid expenses'],
  },
  nonCurrentAssets: {
    title: 'Non-Current Assets',
    singular: 'non-current asset',
    icon: Building2,
    addLabel: 'Add non-current asset',
    accent: 'green',
    lesson: 'Non-current assets support the business beyond the next year. Depreciation is commonly shown as a contra-asset that reduces equipment or property value.',
    examples: ['Equipment', 'Accumulated depreciation', 'Vehicles', 'Long-term investments'],
  },
  currentLiabilities: {
    title: 'Current Liabilities',
    singular: 'current liability',
    icon: ReceiptText,
    addLabel: 'Add current liability',
    accent: 'rose',
    lesson: 'Current liabilities are obligations normally due within one year or one operating cycle.',
    examples: ['Payables', 'Accrued expenses', 'Short-term loans'],
  },
  nonCurrentLiabilities: {
    title: 'Non-Current Liabilities',
    singular: 'non-current liability',
    icon: Landmark,
    addLabel: 'Add non-current liability',
    accent: 'rose',
    lesson: 'Non-current liabilities are obligations that are not due in the next year, such as long-term borrowing.',
    examples: ['Long-term debt', 'Lease obligations', 'Deferred tax liabilities'],
  },
  equity: {
    title: 'Equity',
    singular: 'equity',
    icon: PiggyBank,
    addLabel: 'Add equity',
    accent: 'blue',
    lesson: 'Equity is the owner claim after liabilities are subtracted from assets. It includes invested capital and accumulated profits kept in the business.',
    examples: ['Owner capital', 'Common stock', 'Retained earnings'],
  },
};

const ledgerSections = ['currentAssets', 'nonCurrentAssets', 'currentLiabilities', 'nonCurrentLiabilities', 'equity'];

const reportGroups = [
  {
    title: 'Assets',
    totalLabel: 'Total assets',
    totalKey: 'assets',
    sections: [
      { key: 'currentAssets', subtotalLabel: 'Total current assets' },
      { key: 'nonCurrentAssets', subtotalLabel: 'Total non-current assets' },
    ],
  },
  {
    title: 'Liabilities',
    totalLabel: 'Total liabilities',
    totalKey: 'liabilities',
    sections: [
      { key: 'currentLiabilities', subtotalLabel: 'Total current liabilities' },
      { key: 'nonCurrentLiabilities', subtotalLabel: 'Total non-current liabilities' },
    ],
  },
  {
    title: 'Equity',
    totalLabel: 'Total equity',
    totalKey: 'equity',
    sections: [{ key: 'equity', subtotalLabel: null }],
  },
];

const lessons = [
  {
    key: 'snapshot',
    icon: BookOpen,
    title: 'A balance sheet is a snapshot',
    body: 'It shows what an organization owns, what it owes, and what is left for owners at one point in time. A standard format separates near-term items from long-term items.',
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
    title: 'Current vs. non-current matters',
    body: 'Current items are expected to be collected, used, or paid within about one year. Non-current items usually last longer than one year.',
    takeaway: 'Working capital = current assets - current liabilities.',
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
  { code: 'IRR', label: 'Iranian Rial', locale: 'fa-IR' },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function cloneData(data) {
  return Object.fromEntries(
    Object.entries(data).map(([key, rows]) => [key, rows.map((row) => ({ ...row }))]),
  );
}

function total(rows) {
  return rows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
}

function formatNumberInput(value) {
  const number = Number(value || 0);

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(number);
}

function parseFormattedNumber(value) {
  const parsed = Number(String(value).replace(/,/g, ''));

  return Number.isFinite(parsed) ? parsed : 0;
}

function currency(value, selectedCurrency) {
  const option = currencyOptions.find(({ code }) => code === selectedCurrency) ?? currencyOptions[0];

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: option.code,
    maximumFractionDigits: 0,
  }).format(value);
}

function displayDate(value) {
  if (!value) return 'Not dated';

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function percent(value) {
  if (!Number.isFinite(value)) return '0%';
  return `${Math.round(value * 100)}%`;
}

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  const savedTheme = window.localStorage.getItem('balance-sheet-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function App() {
  const [sheet, setSheet] = useState(() => cloneData(startingData));
  const [tolerance, setTolerance] = useState(0);
  const [activeScenario, setActiveScenario] = useState('balanced');
  const [activeLesson, setActiveLesson] = useState('snapshot');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [companyName, setCompanyName] = useState('Example Company');
  const [reportDate, setReportDate] = useState(todayISO);
  const [theme, setTheme] = useState(getInitialTheme);

  const darkMode = theme === 'dark';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('balance-sheet-theme', theme);
  }, [theme]);

  const metrics = useMemo(() => {
    const currentAssets = total(sheet.currentAssets);
    const nonCurrentAssets = total(sheet.nonCurrentAssets);
    const currentLiabilities = total(sheet.currentLiabilities);
    const nonCurrentLiabilities = total(sheet.nonCurrentLiabilities);
    const assets = currentAssets + nonCurrentAssets;
    const liabilities = currentLiabilities + nonCurrentLiabilities;
    const equity = total(sheet.equity);
    const funding = liabilities + equity;
    const variance = assets - funding;
    const balanced = Math.abs(variance) <= tolerance;
    const workingCapital = currentAssets - currentLiabilities;
    const debtRatio = assets === 0 ? 0 : liabilities / assets;
    const equityRatio = assets === 0 ? 0 : equity / assets;

    return {
      currentAssets,
      nonCurrentAssets,
      currentLiabilities,
      nonCurrentLiabilities,
      assets,
      liabilities,
      equity,
      funding,
      variance,
      balanced,
      workingCapital,
      debtRatio,
      equityRatio,
    };
  }, [sheet, tolerance]);

  const maxTotal = Math.max(metrics.assets, metrics.liabilities, metrics.equity, 1);

  function updateRow(section, id, field, value) {
    setSheet((current) => ({
      ...current,
      [section]: current[section].map((row) =>
        row.id === id
          ? { ...row, [field]: field === 'amount' ? parseFormattedNumber(value) : value }
          : row,
      ),
    }));
    setActiveScenario('custom');
  }

  function addRow(section) {
    const item = {
      id: `${section}-${Date.now()}`,
      label: `New ${sectionMeta[section].singular} line`,
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

  function exportReport() {
    const reportHtml = buildReportHtml({
      companyName,
      reportDate,
      sheet,
      metrics,
      selectedCurrency,
    });
    const safeCompanyName = companyName.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'balance-sheet';
    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${safeCompanyName}-balance-sheet-${reportDate || 'undated'}.html`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function printReport() {
    window.print();
  }

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
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
          element: '[data-tour="report-setup"]',
          popover: {
            title: 'Name the report',
            description: 'Add the company name and balance sheet date before exporting or printing.',
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
          element: '[data-tour="theme"]',
          popover: {
            title: 'Switch the theme',
            description: 'Use dark mode when you want a calmer workspace. Your choice is saved for next time.',
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
          {ledgerSections.map((key) => {
            const meta = sectionMeta[key];
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

      <section className="report-setup" data-tour="report-setup">
        <div>
          <span className="section-kicker">
            <FileText size={16} />
            Report details
          </span>
          <h2>Prepare a clean balance sheet report.</h2>
        </div>
        <div className="report-fields">
          <label>
            <Building2 size={17} />
            Company
            <input
              aria-label="Company name"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              placeholder="Company name"
            />
          </label>
          <label>
            <CalendarDays size={17} />
            Date
            <input
              aria-label="Balance sheet date"
              type="date"
              value={reportDate}
              onChange={(event) => setReportDate(event.target.value)}
            />
          </label>
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
              inputMode="decimal"
              type="text"
              value={formatNumberInput(tolerance)}
              onChange={(event) => setTolerance(parseFormattedNumber(event.target.value))}
            />
          </label>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-pressed={darkMode}
            data-tour="theme"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            {darkMode ? 'Light mode' : 'Dark mode'}
          </button>
          <button type="button" onClick={() => loadScenario('balanced')}>
            <RefreshCcw size={17} />
            Reset
          </button>
          <button type="button" onClick={startTour}>
            <Compass size={17} />
            Tour
          </button>
          <button type="button" onClick={printReport}>
            <Printer size={17} />
            Print
          </button>
          <button type="button" className="primary" onClick={exportReport}>
            <Download size={17} />
            Export report
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
          {ledgerSections.map((section) => (
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
              Current assets and current liabilities explain short-term liquidity. The full
              balance still depends on total assets equaling total liabilities plus equity.
            </p>
          </div>
        </aside>
      </section>

      <ReportPreview
        companyName={companyName}
        reportDate={reportDate}
        sheet={sheet}
        metrics={metrics}
        selectedCurrency={selectedCurrency}
      />
    </main>
  );
}

function buildReportHtml({ companyName, reportDate, sheet, metrics, selectedCurrency }) {
  const renderRows = (rows) =>
    rows
      .map(
        (row) => `
          <tr>
            <td>${escapeHtml(row.label)}</td>
            <td>${escapeHtml(currency(row.amount, selectedCurrency))}</td>
          </tr>
        `,
      )
      .join('');

  const renderGroup = (group) => `
    <div>
      <h2>${escapeHtml(group.title)}</h2>
      <table>
        ${group.sections
          .map(({ key, subtotalLabel }) => {
            const rows = sheet[key];
            const sectionTotal = total(rows);
            return `
              <tr class="section-heading"><td colspan="2">${escapeHtml(sectionMeta[key].title)}</td></tr>
              ${renderRows(rows)}
              ${
                subtotalLabel
                  ? `<tr class="subtotal"><td>${escapeHtml(subtotalLabel)}</td><td>${escapeHtml(currency(sectionTotal, selectedCurrency))}</td></tr>`
                  : ''
              }
            `;
          })
          .join('')}
        <tr class="total"><td>${escapeHtml(group.totalLabel)}</td><td>${escapeHtml(currency(metrics[group.totalKey], selectedCurrency))}</td></tr>
      </table>
    </div>
  `;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(companyName || 'Balance Sheet')} - Balance Sheet</title>
    <style>
      body { background: #f6f3ed; color: #0b1f3a; font-family: Inter, Arial, sans-serif; margin: 0; padding: 40px; }
      .report { background: #fff; border: 1px solid #ddd8cd; box-shadow: 0 24px 70px rgba(42, 50, 44, 0.12); margin: 0 auto; max-width: 900px; padding: 44px; }
      .header { border-bottom: 3px solid #0b1f3a; display: flex; justify-content: space-between; gap: 24px; padding-bottom: 24px; }
      .kicker { color: #39745d; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
      h1 { font-size: 36px; line-height: 1; margin: 8px 0; }
      .date { color: #263e5c; font-weight: 700; }
      .status { align-self: start; border-radius: 999px; color: #fff; font-weight: 800; padding: 10px 14px; }
      .status.ok { background: #2d7b59; }
      .status.warn { background: #a34950; }
      .summary { display: grid; gap: 14px; grid-template-columns: repeat(3, 1fr); margin: 28px 0; }
      .summary div { background: #f6f3ed; border-radius: 14px; padding: 16px; }
      .summary span { color: #263e5c; display: block; font-size: 12px; font-weight: 800; text-transform: uppercase; }
      .summary strong { display: block; font-size: 22px; margin-top: 8px; }
      .grid { display: grid; gap: 22px; grid-template-columns: repeat(3, 1fr); }
      h2 { font-size: 18px; margin: 0 0 12px; }
      table { border-collapse: collapse; width: 100%; }
      td { border-bottom: 1px solid #e8e3d9; padding: 10px 0; }
      td:last-child { font-weight: 800; text-align: right; white-space: nowrap; }
      .section-heading td { border-bottom: 0; color: #39745d; font-size: 12px; font-weight: 900; padding: 16px 0 4px; text-align: left; text-transform: uppercase; white-space: normal; }
      .subtotal td { color: #0b1f3a; font-weight: 900; }
      .total td { border-bottom: 2px solid #0b1f3a; border-top: 2px solid #0b1f3a; font-weight: 900; }
      .equation { background: #0b1f3a; border-radius: 16px; color: #fff; margin-top: 28px; padding: 18px; text-align: center; }
      .footer { color: #263e5c; font-size: 12px; margin-top: 28px; }
      @media print { body { background: #fff; padding: 0; } .report { border: 0; box-shadow: none; } }
    </style>
  </head>
  <body>
    <main class="report">
      <section class="header">
        <div>
          <div class="kicker">Balance Sheet</div>
          <h1>${escapeHtml(companyName || 'Unnamed Company')}</h1>
          <div class="date">As of ${escapeHtml(displayDate(reportDate))}</div>
        </div>
        <div class="status ${metrics.balanced ? 'ok' : 'warn'}">${metrics.balanced ? 'Balanced' : 'Needs review'}</div>
      </section>
      <section class="summary">
        <div><span>Total assets</span><strong>${escapeHtml(currency(metrics.assets, selectedCurrency))}</strong></div>
        <div><span>Liabilities + equity</span><strong>${escapeHtml(currency(metrics.funding, selectedCurrency))}</strong></div>
        <div><span>Variance</span><strong>${escapeHtml(currency(Math.abs(metrics.variance), selectedCurrency))}</strong></div>
      </section>
      <section class="grid">
        ${reportGroups.map(renderGroup).join('')}
      </section>
      <section class="equation">Assets ${escapeHtml(currency(metrics.assets, selectedCurrency))} = Liabilities + Equity ${escapeHtml(currency(metrics.funding, selectedCurrency))}</section>
      <p class="footer">Generated by Balance Sheet Simulator. Built by Elham Aboutorabi.</p>
    </main>
  </body>
</html>`;
}

function ReportPreview({ companyName, reportDate, sheet, metrics, selectedCurrency }) {
  return (
    <section className="report-preview print-report">
      <div className="report-paper">
        <header className="report-header">
          <div>
            <span>Balance Sheet</span>
            <h2>{companyName || 'Unnamed Company'}</h2>
            <p>As of {displayDate(reportDate)}</p>
          </div>
          <strong className={metrics.balanced ? 'report-status balanced' : 'report-status warning'}>
            {metrics.balanced ? 'Balanced' : 'Needs review'}
          </strong>
        </header>

        <div className="report-summary">
          <ReportStat label="Total assets" value={currency(metrics.assets, selectedCurrency)} />
          <ReportStat label="Liabilities + equity" value={currency(metrics.funding, selectedCurrency)} />
          <ReportStat label="Variance" value={currency(Math.abs(metrics.variance), selectedCurrency)} />
        </div>

        <div className="report-columns">
          {reportGroups.map((group) => (
            <ReportTable
              key={group.title}
              group={group}
              metrics={metrics}
              sheet={sheet}
              selectedCurrency={selectedCurrency}
            />
          ))}
        </div>

        <div className="report-equation">
          Assets {currency(metrics.assets, selectedCurrency)} = Liabilities + Equity {currency(metrics.funding, selectedCurrency)}
        </div>
      </div>
    </section>
  );
}

function ReportStat({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ReportTable({ group, metrics, sheet, selectedCurrency }) {
  return (
    <article>
      <h3>{group.title}</h3>
      <table>
        <tbody>
          {group.sections.map(({ key, subtotalLabel }) => {
            const rows = sheet[key];
            return (
              <React.Fragment key={key}>
                <tr className="section-heading">
                  <td colSpan="2">{sectionMeta[key].title}</td>
                </tr>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.label}</td>
                    <td>{currency(row.amount, selectedCurrency)}</td>
                  </tr>
                ))}
                {subtotalLabel && (
                  <tr className="subtotal-row">
                    <td>{subtotalLabel}</td>
                    <td>{currency(total(rows), selectedCurrency)}</td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
          <tr className="total-row">
            <td>{group.totalLabel}</td>
            <td>{currency(metrics[group.totalKey], selectedCurrency)}</td>
          </tr>
        </tbody>
      </table>
    </article>
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
              className="amount-input"
              inputMode="decimal"
              type="text"
              value={formatNumberInput(row.amount)}
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
