'use strict';

const SCREEN_ORDER = ['template', 'candidate', 'compensation', 'hire', 'terms', 'review', 'sent'];
const canonicalScreen = screen => screen === 'role' ? 'candidate' : screen;
const SECTIONS = [
  { id: 'candidate', label: 'Candidate & role', icon: 'user' },
  { id: 'compensation', label: 'Compensation', icon: 'wallet' },
  { id: 'hire', label: 'Hire setup', icon: 'shield' },
  { id: 'terms', label: 'Offer terms', icon: 'file' },
];
const META = {
  template: ['Choose a template', 'Start with the right letter.', 'Choose who you’re hiring and how much detail your letter needs.'],
  candidate: ['Candidate & role', 'A new person. Familiar details.', 'Type their name, email and job title. Reuse a saved role setup, or choose the details yourself.'],
  compensation: ['Compensation', 'Make the numbers clear.', 'Set their pay and any extras. The letter shows exactly what you enter.'],
  hire: ['Hire setup', 'Set them up for a good start.', 'These details help set up the hire after signing. They do not appear in the letter.'],
  terms: ['Offer terms', 'Add the finishing touches.', 'Choose the deadline, sender and an optional personal message.'],
  review: ['Review & send', 'A little review. A lot of confidence.', 'Check the letter and summary. You can fix any detail right here.'],
  sent: ['Sent', 'Offer sent', ''],
  saved: ['Draft saved', 'Pick up right where you left off.', ''],
};
const ICONS = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  back: '<path d="M19 12H5m6-6-6 6 6 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 3h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  edit: '<path d="m15 4 5 5M4 20l5-1L21 7a2.1 2.1 0 0 0-5-5L4 14Z"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M8 13h8m-8 4h6"/>',
  user: '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2"/>',
  briefcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3M3 12c5 4 13 4 18 0m-9 0v4"/>',
  wallet: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 7V5a2 2 0 0 1 2-2h13m3 7h-5a2 2 0 0 0 0 5h5m-5-2.5h.01"/>',
  shield: '<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6Z"/><path d="m8 12 3 3 5-6"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7L22 6"/>',
  send: '<path d="m22 2-7 20-4-9L2 9Zm0 0L11 13"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12l4 4v12a2 2 0 0 1-2 2ZM7 3v6h10V3M7 21v-8h10v8"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  building: '<path d="M4 22V2h12v20M16 8h4v14M8 6h4M8 10h4M8 14h4M8 18h4M2 22h20"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
};
const icon = (name, size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const btn = (label, action, style = 'secondary', attributes = '') => `<button type="button" class="btn btn-${style}" data-action="${action}" ${attributes}>${label}</button>`;
const STORAGE_KEY = 'bolto-offer-visual-draft-v1';
const DEMO_DATE = '2026-05-18';
const FIELDS = {
  firstName: 'First name', lastName: 'Last name', email: 'Email address',
  jobTitle: 'Job title', startDate: 'Start date', employment: 'Employment type', endDate: 'Contract end date',
  manager: 'Reports to', department: 'Department', arrangement: 'Work arrangement', workplace: 'Workplace',
  payType: 'Pay type', amount: 'Pay amount', bonusAmount: 'Signing bonus', repayment: 'Bonus repayment terms',
  repaymentMonths: 'Repayment window', equityShares: 'Number of shares', equityVestingMonths: 'Vesting period',
  equityDetails: 'Equity details', flsa: 'FLSA classification', i9: 'I-9 requirement', payroll: 'Payroll group',
  expiry: 'Offer expiry date', sender: 'Sender', note: 'Personal note',
};
const STRUCTURED_TERM_FIELDS = ['repaymentMonths', 'equityShares', 'equityVestingMonths'];
const COMPANY_MANAGERS = {
  'Jordan Lee': ['Engineering', 'Design'],
  'Taylor Brooks': ['Operations', 'People'],
};
const WORKPLACES = ['New York office', 'San Francisco office'];
const CANDIDATE_ROLE_FIELDS = ['firstName', 'lastName', 'email', 'jobTitle', 'employment', 'startDate', 'endDate', 'manager', 'department', 'arrangement', 'workplace'];
const ROLE_REUSE_FIELDS = ['employment', 'manager', 'department', 'arrangement', 'workplace'];
const SAVED_ROLE_SETUPS = [
  {
    id: 'engineering-remote', name: 'Engineering · Remote · Full-time', worker: 'employee',
    values: { employment: 'Full-time', manager: 'Jordan Lee', department: 'Engineering', arrangement: 'Remote', workplace: '' },
  },
  {
    id: 'operations-hybrid', name: 'Operations · Hybrid · Full-time', worker: 'employee',
    values: { employment: 'Full-time', manager: 'Taylor Brooks', department: 'Operations', arrangement: 'Hybrid', workplace: 'New York office' },
  },
  {
    id: 'design-contractor', name: 'Design · Hybrid · Contractor', worker: 'contractor',
    values: { manager: 'Jordan Lee', department: 'Design', arrangement: 'Hybrid', workplace: 'New York office' },
  },
];
function departmentChoices(manager = state.data.manager) {
  return COMPANY_MANAGERS[manager] || [];
}
const BLANK = {
  firstName: '', lastName: '', email: '', jobTitle: '', startDate: '', employment: '', endDate: '',
  manager: '', department: '', arrangement: '', workplace: '', payType: '', amount: '',
  bonusEnabled: false, bonusAmount: '', repaymentMonths: '', equityEnabled: false, equityShares: '', equityVestingMonths: '',
  // Preserve custom wording from older drafts as a read-only reference, not as the new clause.
  repayment: '', equityDetails: '',
  flsa: '', i9: '', payroll: '', autoInvite: true, expiry: '', sender: '', note: '',
};
function sampleData(sample) {
  const contractor = sample === 'priya';
  return {
    ...BLANK,
    firstName: contractor ? 'Priya' : 'Alex', lastName: contractor ? 'Shah' : 'Rivera',
    email: contractor ? 'priya.shah@example.com' : 'alex.rivera@example.com',
    jobTitle: contractor ? 'Product designer' : 'Senior full-stack engineer',
    employment: contractor ? '' : 'Full-time',
    startDate: contractor ? '2026-07-01' : '2026-06-15', endDate: contractor ? '2026-12-31' : '',
    manager: 'Jordan Lee', department: contractor ? 'Design' : 'Engineering',
    arrangement: contractor ? 'Hybrid' : 'Remote', workplace: contractor ? 'New York office' : '',
    payType: contractor ? 'hourly' : 'salary', amount: contractor ? '95' : '150000',
    bonusEnabled: !contractor, bonusAmount: contractor ? '' : '10000',
    repaymentMonths: contractor ? '' : '12',
    flsa: contractor ? '' : 'Exempt', i9: contractor ? '' : 'Required', payroll: contractor ? '' : 'US Salaried',
    expiry: contractor ? '2026-06-20' : '2026-06-01', sender: 'Sam Patel',
    note: contractor ? 'Priya, we’re looking forward to working with you.' : 'Alex, the team loved meeting you. We’re excited to build together.',
  };
}
function candidateEntryData(sample) {
  const personal = sampleData(sample);
  return { ...BLANK, ...Object.fromEntries(CANDIDATE_ROLE_FIELDS.map(key => [key, personal[key]])) };
}
const params = new URLSearchParams(location.search);
const initialSample = params.get('sample') === 'priya' ? 'priya' : 'alex';
const initialScreen = SCREEN_ORDER.includes(canonicalScreen(params.get('screen'))) ? canonicalScreen(params.get('screen')) : 'template';
const initialPreset = ['empty', 'partial', 'invalid', 'ready'].includes(params.get('preset')) ? params.get('preset') : null;
const state = {
  sample: initialSample, worker: initialSample === 'priya' ? 'contractor' : 'employee', format: 'standard',
  data: initialPreset ? initialScreen === 'candidate' ? candidateEntryData(initialSample) : sampleData(initialSample) : { ...BLANK }, screen: initialScreen,
  preset: initialPreset || 'empty', checks: [], touched: new Set(), showAllErrors: false, editor: null,
  mobilePanel: 'details', templateLibrary: 'bolto', templateNotice: '', savedAt: null, dirty: false,
  lastScreen: 'candidate', sent: null, templateGuide: { control: '', relationship: '' }, guideOpen: false,
  previewHighlights: true,
  roleSetupId: null,
  visited: new Set(SECTIONS.some(section => section.id === initialScreen) ? [initialScreen] : []),
};
const app = document.getElementById('app');
const dialog = document.getElementById('dialog');
const mobileQuery = matchMedia('(max-width: 760px)');
let dialogOpener = null;
let pendingTemplate = null;
let pendingRoleSetupId = null;
let noticeTimer;
const announcementTimers = new Map();
let lastAnnouncedIssues = '';
// Fields the user has typed in; leaving an untouched empty field is not an error.
let editedFields = new Set();
let lastStatusAnnounced = '';
function sectionStatus() { return state.screen === 'candidate' ? candidateEntryStatus() : issueSummary(); }
function announceStatusIfChanged() {
  const status = sectionStatus();
  if (status === lastStatusAnnounced) return;
  lastStatusAnnounced = status;
  announce(`${status}.`);
}
let savedSnapshot = null;
let pointerActionTarget = null;
const footerObserver = new ResizeObserver(entries => {
  const height = entries[0]?.target.getBoundingClientRect().height || 0;
  document.documentElement.style.setProperty('--footer-clearance', `${height + 20}px`);
});

function isContractor() { return state.worker === 'contractor'; }
function candidateName(data = state.data) { return [data.firstName, data.lastName].filter(Boolean).join(' ') || 'your new hire'; }
function templateName(worker = state.worker, format = state.format) {
  return `${format === 'concise' ? 'Concise' : 'Standard'} ${worker === 'contractor' ? 'Contractor' : 'W-2'} offer`;
}
function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(Number(value));
}
function displayDate(value) {
  if (!value) return '';
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function announce(message, error = false) {
  lastAnnouncedIssues = issueSummary();
  const id = `${dialog.open ? 'dialog-' : ''}${error ? 'error-announcer' : 'announcer'}`;
  const node = document.getElementById(id);
  if (!node) throw new Error(`The announcement region is missing: ${id}`);
  node.textContent = '';
  clearTimeout(announcementTimers.get(id));
  announcementTimers.set(id, setTimeout(() => {
    if (node.isConnected && (!id.startsWith('dialog-') || dialog.open)) node.textContent = message;
    announcementTimers.delete(id);
  }, 60));
}
function clearAnnouncements() {
  for (const timer of announcementTimers.values()) clearTimeout(timer);
  announcementTimers.clear();
  for (const node of document.querySelectorAll('#announcer, #error-announcer, #dialog-announcer, #dialog-error-announcer')) node.textContent = '';
}
function toast(message, error = false) {
  const node = document.getElementById('toast');
  node.textContent = message;
  node.hidden = false;
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => { node.hidden = true; }, 5000);
  announce(message, error);
}
function requiredFields(section) {
  const d = state.data;
  const role = ['jobTitle', 'startDate', isContractor() ? 'endDate' : 'employment', 'manager', 'department', 'arrangement', ...(['Hybrid', 'On-site'].includes(d.arrangement) ? ['workplace'] : [])];
  const groups = {
    candidate: ['firstName', 'lastName', 'email', ...role],
    compensation: ['payType', 'amount', ...(d.bonusEnabled ? ['bonusAmount', 'repaymentMonths'] : []), ...(d.equityEnabled ? ['equityShares', 'equityVestingMonths'] : [])],
    hire: isContractor() ? [] : ['flsa', 'i9', 'payroll'],
    terms: ['expiry', 'sender'],
  };
  if (section === 'role') return role;
  return section ? groups[section] || [] : Object.values(groups).flat();
}
function inputProblem(key, data = state.data) {
  const value = data[key];
  if (typeof value !== 'string' || !value.trim()) return `Enter ${FIELDS[key].toLowerCase()}.`;
  if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter an email like alex.rivera@example.com.';
  if (key === 'employment' && !['Full-time', 'Part-time'].includes(value)) return 'Choose Full-time or Part-time for an employee.';
  if (key === 'payType' && !['salary', 'hourly'].includes(value)) return 'Choose Salary or Hourly.';
  if (key === 'arrangement' && !['Remote', 'Hybrid', 'On-site'].includes(value)) return 'Choose Remote, Hybrid or On-site.';
  if (key === 'manager' && !Object.hasOwn(COMPANY_MANAGERS, value)) return 'Choose a manager from the company list.';
  if (key === 'department' && !departmentChoices(data.manager).includes(value)) return 'Choose a department for the selected manager.';
  if (key === 'workplace' && !WORKPLACES.includes(value)) return 'Choose a workplace from the company list.';
  if (['amount', 'bonusAmount'].includes(key) && (!Number.isFinite(Number(value)) || Number(value) <= 0)) return 'Enter an amount greater than $0.';
  if (STRUCTURED_TERM_FIELDS.includes(key) && !positiveWholeNumber(value)) return `Enter a positive whole number of ${key === 'equityShares' ? 'shares' : 'months'}.`;
  if (['startDate', 'endDate', 'expiry'].includes(key)) {
    const date = new Date(`${value}T12:00:00`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(date.getTime())) return 'Choose a valid date.';
    if (value < DEMO_DATE) return 'Choose a date on or after May 18, 2026, the demo date.';
  }
  if (key === 'endDate' && data.startDate && value <= data.startDate) return 'Choose an end date after the start date.';
  return '';
}
function issues(section) {
  return requiredFields(section).flatMap(key => {
    const error = inputProblem(key);
    if (error) return [{ key, type: state.data[key].trim() ? 'invalid' : 'missing', message: error }];
    if (state.checks.includes(key)) return [{ key, type: 'check', message: checkMessage(key) }];
    return [];
  });
}
function issueSummary(section, all = issues(section)) {
  const missing = all.filter(item => item.type === 'missing').length;
  const invalid = all.filter(item => item.type === 'invalid').length;
  const check = all.filter(item => item.type === 'check').length;
  return [
    missing ? `${missing} ${missing === 1 ? 'field' : 'fields'} missing` : '',
    invalid ? `${invalid} ${invalid === 1 ? 'error' : 'errors'} to fix` : '',
    check ? `${check} ${check === 1 ? 'detail' : 'details'} to check` : '',
  ].filter(Boolean).join(' · ') || 'Everything is ready';
}
function sectionProgress(section) {
  const required = requiredFields(section);
  if (!required.length) return { status: 'not-required', label: 'Not required' };
  const all = issues(section);
  if (!all.length) return { status: 'complete', label: 'Complete' };
  const visible = all.filter(issue => state.showAllErrors || state.touched.has(issue.key) || issue.type === 'check');
  if (visible.length) return {
    status: visible.some(issue => issue.type === 'invalid') ? 'invalid' : visible.some(issue => issue.type === 'missing') ? 'missing' : 'check',
    label: issueSummary(section, visible),
  };
  return required.some(key => state.data[key].trim())
    ? { status: 'in-progress', label: 'In progress' }
    : { status: 'not-started', label: 'Not started' };
}
function candidateEntryStatus() {
  const progress = sectionProgress('candidate');
  return progress.status === 'complete' ? 'Candidate & role ready' : progress.label;
}
function checkMessage(key) {
  if (key === 'amount') return 'Pay type changed. Check this amount and its unit before continuing.';
  if (key === 'flsa') return 'Pay type changed. Confirm the FLSA classification still applies; pay type alone does not determine it.';
  return 'The template changed. Review this detail before sending.';
}
function markChanged() { state.dirty = true; state.preset = 'custom'; }
function setValue(key, value) {
  if (!Object.hasOwn(BLANK, key)) throw new Error(`Unknown offer field: ${key}`);
  const old = state.data[key];
  state.data[key] = value;
  if (key === 'manager' && old !== value && state.data.department && !departmentChoices(value).includes(state.data.department)) {
    state.data.department = '';
    state.touched.delete('department');
    announce('Manager changed. Choose a department from their available departments.');
  }
  if (key === 'payType' && old && old !== value && state.data.amount) {
    state.checks = [...new Set([...state.checks, 'amount', ...(!isContractor() && state.data.flsa ? ['flsa'] : [])])];
    announce('Pay type changed. Check the amount and, for an employee, the FLSA classification.');
  }
  markChanged();
}
function field(key, label = FIELDS[key], options = {}) {
  const { type = 'text', placeholder = '', hint = '', full = false, choices, readonly = false, disabled = false, suffix = '' } = options;
  const id = `field-${key}`;
  const isRequired = requiredFields().includes(key);
  const showError = (state.touched.has(key) || state.showAllErrors) && isRequired;
  const error = showError ? inputProblem(key) : '';
  const value = state.data[key];
  const currency = ['amount', 'bonusAmount'].includes(key);
  const unit = key === 'amount' && state.data.payType ? `USD per ${state.data.payType === 'hourly' ? 'hour' : 'year'}` : 'USD';
  const attributes = `id="${id}" name="${key}" data-field="${key}" aria-invalid="${Boolean(error)}" aria-describedby="${id}-error${hint ? ` ${id}-hint` : ''}${currency ? ` ${id}-unit` : ''}" ${isRequired ? 'aria-required="true"' : ''}`;
  let control;
  if (choices) {
    const unavailable = value && !choices.includes(value) ? `<option value="${esc(value)}" selected disabled>${esc(value)} (not available)</option>` : '';
    control = `<select ${attributes}${disabled ? ' disabled' : ''}><option value="">${esc(placeholder || `Select ${label.toLowerCase()}`)}</option>${unavailable}${choices.map(choice => `<option value="${esc(choice)}" ${value === choice ? 'selected' : ''}>${esc(choice)}</option>`).join('')}</select>`;
  } else if (type === 'textarea') {
    control = `<textarea ${attributes} rows="3" placeholder="${esc(placeholder)}">${esc(value)}</textarea>`;
  } else {
    const numberAttributes = STRUCTURED_TERM_FIELDS.includes(key) ? 'step="1" min="1" inputmode="numeric"' : 'step="0.01" min="0.01" inputmode="decimal"';
    control = `<input ${attributes} type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}" ${readonly ? 'readonly' : ''} ${type === 'number' ? numberAttributes : ''} ${type === 'date' ? `min="${key === 'endDate' && state.data.startDate ? state.data.startDate : DEMO_DATE}"` : ''} ${key === 'email' ? 'autocomplete="email"' : key === 'firstName' ? 'autocomplete="given-name"' : key === 'lastName' ? 'autocomplete="family-name"' : 'autocomplete="off"'}>`;
  }
  if (currency) {
    const payUnit = state.data.payType === 'hourly' ? '/ hour' : state.data.payType === 'salary' ? '/ year' : '';
    control = `<div class="input-wrap"><span class="input-prefix" aria-hidden="true">$</span>${control}<span class="sr-only" id="${id}-unit">${unit}</span>${key === 'amount' && payUnit ? `<span class="input-suffix" aria-hidden="true">${payUnit}</span>` : ''}</div>`;
  } else if (suffix) {
    control = `<div class="input-wrap suffix-only">${control}<span class="input-suffix" aria-hidden="true">${esc(suffix)}</span></div>`;
  }
  return `<div class="field${full ? ' full' : ''}">
    <label class="field-label" for="${id}">${esc(label)}${isRequired ? '<span class="sr-only"> (required)</span>' : '<small>Optional</small>'}</label>
    ${control}${hint ? `<p class="field-hint" id="${id}-hint">${esc(hint)}</p>` : ''}
    <p class="field-error" id="${id}-error">${error ? `${icon('alert', 14)}<span>${esc(error)}</span>` : ''}</p>
  </div>`;
}
function radioField(key, label, options) {
  const required = requiredFields().includes(key);
  const error = (state.touched.has(key) || state.showAllErrors) && required ? inputProblem(key) : '';
  return `<fieldset class="full" aria-describedby="field-${key}-error"><legend>${esc(label)}${required ? '<span class="sr-only"> (required)</span>' : ''}</legend>
    <div class="radio-options">${options.map(([value, name]) => `<label class="radio-option"><input id="field-${key}-${value}" type="radio" name="${key}" data-field="${key}" value="${esc(value)}" ${state.data[key] === value ? 'checked' : ''} ${required ? 'required' : ''} aria-invalid="${Boolean(error)}" aria-describedby="field-${key}-error"> ${esc(name)}</label>`).join('')}</div>
    <p class="field-error" id="field-${key}-error">${error ? `${icon('alert', 14)}<span>${esc(error)}</span>` : ''}</p>
  </fieldset>`;
}
function toggle(key, title, description) {
  return `<div class="toggle-row"><div class="toggle-copy"><b id="toggle-${key}-label">${esc(title)}</b><p id="toggle-${key}-hint">${esc(description)}</p></div>
    <label class="switch"><input type="checkbox" role="switch" data-field="${key}" name="${key}" aria-labelledby="toggle-${key}-label" aria-describedby="toggle-${key}-hint" ${state.data[key] ? 'checked' : ''}><span class="switch-track"></span></label></div>`;
}
function checkCallout(key) {
  return state.checks.includes(key) ? `<div class="check-message" data-check-for="${key}">${icon('alert', 16)}<div>${esc(checkMessage(key))}${state.screen !== 'review' ? `<br><button type="button" class="btn-text" data-action="confirm-field" data-key="${key}">I’ve checked this ${key === 'amount' ? 'amount' : 'classification'}</button>` : ''}</div></div>` : '';
}
function candidateFields() {
  return `<fieldset class="candidate-group"><legend>Personalize this offer</legend>
    <p class="group-hint">Only their name, email and job title need typing.</p>
    <div class="field-grid">${field('firstName', 'First name', { placeholder: 'Enter first name' })}${field('lastName', 'Last name', { placeholder: 'Enter last name' })}
      ${field('email', 'Email address', { type: 'email', full: true, placeholder: 'name@example.com', hint: 'The offer will be sent here.' })}
      ${field('jobTitle', 'Job title', { full: true, placeholder: 'Enter job title' })}
    </div></fieldset>
    <fieldset class="candidate-group"><legend>Choose role details</legend>
      <p class="group-hint">Apply company-saved details together, or choose each answer below.</p>
      <div class="role-reuse-action">
        ${btn(`${icon('briefcase', 16)} Use saved role details`, 'open-role-setup', 'primary', 'id="use-role-setup" aria-haspopup="dialog" aria-controls="dialog"')}
        <p>Optional · no candidate details, dates or pay are copied.</p>
      </div>
      ${roleReuseReceipt()}
      ${roleFields()}
    </fieldset>`;
}
function roleSetup(id, worker = state.worker) {
  const setup = SAVED_ROLE_SETUPS.find(item => item.id === id && item.worker === worker);
  if (!setup) throw new Error('Choose a saved role setup for this worker type.');
  return setup;
}
function roleReuseReceipt() {
  if (!state.roleSetupId) return '';
  const setup = roleSetup(state.roleSetupId);
  const edits = Object.entries(setup.values).filter(([key, value]) => state.data[key] !== value).length;
  return `<div class="role-reuse-receipt" data-role-setup-applied="${setup.id}">
    ${icon('check', 18)}<div><strong>Applied: ${esc(setup.name)}</strong>
    <p>${edits ? `${edits} ${edits === 1 ? 'detail has' : 'details have'} been changed since applying.` : 'All applied details are editable below.'} Candidate details, dates and pay were kept.</p></div></div>`;
}
function roleSetupChanges(id, data = state.data) {
  const setup = roleSetup(id);
  return Object.entries(setup.values).map(([key, value]) => ({
    key, label: FIELDS[key], before: data[key], after: value, changed: data[key] !== value,
  }));
}
function roleSetupValue(key, value, arrangement) {
  return key === 'workplace' && arrangement === 'Remote'
    ? value ? `Not used for Remote; stored choice: ${value}` : 'Not needed for Remote'
    : value || 'Not selected';
}
function roleSetupPreview() {
  if (!pendingRoleSetupId) return '<p class="role-setup-empty">Choose a saved setup to preview exactly what it will fill or replace.</p>';
  const setup = roleSetup(pendingRoleSetupId), changes = roleSetupChanges(setup.id);
  const count = changes.filter(item => item.changed).length;
  return `<h3 id="role-setup-changes-heading">${count ? `${count} ${count === 1 ? 'detail will' : 'details will'} change` : 'These details already match'}</h3>
    <p class="field-hint">Only the fields below can change. Nothing is applied until you confirm.</p>
    <table class="role-setup-comparison" aria-labelledby="role-setup-changes-heading">
      <thead><tr><th scope="col">Detail</th><th scope="col">Current</th><th scope="col">Saved setup</th></tr></thead>
      <tbody>${changes.map(item => `<tr data-changed="${item.changed}"><th scope="row">${esc(item.label)}</th><td>${esc(roleSetupValue(item.key, item.before, state.data.arrangement))}</td><td>${esc(roleSetupValue(item.key, item.after, setup.values.arrangement))}${item.changed ? '<span class="sr-only"> (will change)</span>' : '<small>Unchanged</small>'}</td></tr>`).join('')}</tbody>
    </table>`;
}
function showRoleSetupDialog(opener) {
  if (state.screen !== 'candidate') throw new Error('Saved role details can only be applied in Candidate & role.');
  pendingRoleSetupId = null;
  const setups = SAVED_ROLE_SETUPS.filter(item => item.worker === state.worker);
  openDialog(`<div class="dialog-header"><div><h2 id="dialog-heading">Use saved role details</h2>
    <p id="dialog-description">Choose an existing company setup. Preview what changes before applying it.</p></div>
    <button type="button" class="icon-button" data-action="close-dialog" aria-label="Close saved role details">${icon('close')}</button></div>
    <fieldset class="role-setup-options"><legend>Company-saved setups</legend>${setups.map(setup => `<label class="role-setup-option">
      <input type="radio" name="saved-role-setup" value="${setup.id}" data-role-setup="${setup.id}" aria-controls="role-setup-preview">
      <span><b>${esc(setup.name)}</b><small>Reports to ${esc(setup.values.manager)}${setup.values.workplace ? ` · ${esc(setup.values.workplace)}` : ''}</small></span></label>`).join('')}</fieldset>
    <div id="role-setup-preview">${roleSetupPreview()}</div>
    <p class="role-setup-limit">Your candidate’s name, email, job title, dates, pay and hire setup stay as they are. Saved setups are maintained outside this flow; these are dummy company examples.</p>
    <div class="dialog-actions">${btn('Cancel', 'close-dialog', 'secondary')}${btn('Apply role details', 'apply-role-setup', 'primary', 'disabled')}</div>`, opener);
  dialog.classList.add('role-setup-dialog');
}
function refreshRoleSetupPreview(id) {
  roleSetup(id);
  pendingRoleSetupId = id;
  const preview = document.getElementById('role-setup-preview');
  if (!preview) throw new Error('The saved role preview is not open.');
  preview.innerHTML = roleSetupPreview();
  dialog.querySelector('[data-action="apply-role-setup"]').disabled = false;
  const count = roleSetupChanges(id).filter(item => item.changed).length;
  announce(`${roleSetup(id).name} selected. ${count} ${count === 1 ? 'detail will' : 'details will'} change. Nothing applied yet. Candidate details, dates and pay are kept.`);
}
function applySavedRoleSetup(id) {
  if (state.screen !== 'candidate') throw new Error('Apply saved role details from Candidate & role.');
  const setup = roleSetup(id), candidate = { ...state.data, ...setup.values };
  for (const [key] of Object.entries(setup.values)) {
    if (!ROLE_REUSE_FIELDS.includes(key)) throw new Error('Saved role setup contains a non-reusable field: ' + key);
    if (key !== 'workplace' || candidate.arrangement !== 'Remote') {
      const error = inputProblem(key, candidate);
      if (error) throw new Error('Saved role setup needs correction: ' + error);
    }
  }
  state.data = candidate;
  state.roleSetupId = setup.id;
  state.checks = state.checks.filter(key => !Object.hasOwn(setup.values, key));
  Object.keys(setup.values).forEach(key => state.touched.delete(key));
  markChanged();
}
function roleFields() {
  return `<div class="field-grid">
    ${!isContractor() ? field('employment', 'Employment type', { choices: ['Full-time', 'Part-time'] }) : ''}
    ${field('startDate', 'Start date', { type: 'date', hint: 'Choose a date from the calendar.' })}
    ${isContractor() ? field('endDate', 'Contract end date', { type: 'date', hint: 'After the start date.' }) : ''}
    ${isContractor() ? `<div class="field-support full">${icon('lock', 16)}<div><strong>Contractor</strong>Set by your contractor template. Full-time and part-time are not asked in this example.</div></div>` : ''}
    ${field('manager', 'Reports to', { choices: Object.keys(COMPANY_MANAGERS), placeholder: 'Choose a manager' })}
    ${field('department', 'Department', { choices: departmentChoices(), disabled: !state.data.manager, placeholder: state.data.manager ? 'Choose a department' : 'Choose a manager first', hint: state.data.manager ? 'Departments for this manager.' : 'Choose who they report to, then their department.' })}
    ${radioField('arrangement', 'Work arrangement', [['Remote', 'Remote'], ['Hybrid', 'Hybrid'], ['On-site', 'On-site']])}
    ${['Hybrid', 'On-site'].includes(state.data.arrangement) ? field('workplace', 'Workplace', { choices: WORKPLACES, full: true, placeholder: 'Choose a workplace' }) : ''}
  </div>`;
}
function positiveWholeNumber(value) {
  return typeof value === 'string' && value.trim() !== '' && Number.isSafeInteger(Number(value)) && Number(value) > 0;
}
function termQuantity(value, singular, placeholder) {
  if (!positiveWholeNumber(value)) return `[${placeholder}] ${singular}s`;
  const count = Number(value);
  return `${count.toLocaleString('en-US')} ${singular}${count === 1 ? '' : 's'}`;
}
function clauseParts(kind) {
  if (kind === 'repayment') return [
    'You must repay the signing bonus if you leave within ',
    { key: 'repaymentMonths', unit: 'month', label: 'Repayment window' },
    ' of your start date.',
  ];
  if (kind === 'equity') return [
    'You’ll receive ', { key: 'equityShares', unit: 'share', label: 'Number of shares' },
    ', vesting over ', { key: 'equityVestingMonths', unit: 'month', label: 'Vesting period' }, '.',
  ];
  throw new Error(`Unknown compensation clause: ${kind}`);
}
function clauseText(kind, data = state.data) {
  return clauseParts(kind).map(part => typeof part === 'string' ? part : termQuantity(data[part.key], part.unit, part.label)).join('');
}
function clauseHTML(kind, data = state.data, interactive = false) {
  return clauseParts(kind).map(part => {
    if (typeof part === 'string') return esc(part);
    const value = previewValue(part.key, part.label, data, raw => termQuantity(raw, part.unit, part.label), interactive);
    return value + (inputProblem(part.key, data) ? ` ${part.unit}s` : '');
  }).join('');
}
function clausePreview(kind) {
  return `<div class="clause-preview"><span class="clause-caption">${icon('file', 14)} Template wording</span><p data-clause-preview="${kind}">${clauseHTML(kind)}</p></div>`;
}
function previousClause(key) {
  if (!state.data[key]) return '';
  return `<div class="previous-clause"><strong>Earlier draft wording kept for reference</strong><p>We haven’t converted custom text automatically. Check the template sentence against your earlier wording before sending.</p><blockquote>${esc(state.data[key])}</blockquote></div>`;
}
function bonusFields() {
  return `<div class="conditional-fields clause-fields">
    <div class="field-grid">
      ${field('bonusAmount', 'Bonus amount', { type: 'number', full: true, placeholder: 'Enter bonus amount' })}
      ${field('repaymentMonths', 'Repay if they leave within (months)', { type: 'number', full: true, suffix: 'months', placeholder: 'Enter a number', hint: 'Measured from their start date. Only the time period is editable.' })}
    </div>${clausePreview('repayment')}${previousClause('repayment')}
  </div>`;
}
function equityFields() {
  return `<div class="conditional-fields clause-fields">
    <p class="field-hint">Fill in the grant and vesting period. The sentence is written for you.</p>
    <div class="field-grid">
      ${field('equityShares', 'Number of shares', { type: 'number', suffix: 'shares' })}
      ${field('equityVestingMonths', 'Vesting period (months)', { type: 'number', suffix: 'months' })}
    </div>${clausePreview('equity')}${previousClause('equityDetails')}
  </div>`;
}
function compensationFields() {
  return `<div class="field-grid">${radioField('payType', 'How will they be paid?', [['salary', 'Salary'], ['hourly', 'Hourly']])}
    ${field('amount', state.data.payType === 'hourly' ? 'Hourly rate' : state.data.payType === 'salary' ? 'Annual salary' : 'Pay amount', { type: 'number', full: true, placeholder: 'Enter an amount', hint: state.data.payType ? 'USD · the unit is always shown in the letter.' : 'Choose Salary or Hourly to set the unit.' })}</div>
    ${checkCallout('amount')}<hr class="form-divider"><h3>Something extra?</h3>
    <p class="field-hint">Only the extras you choose will appear in the letter.</p>
    ${toggle('bonusEnabled', 'Signing bonus', 'Set the bonus amount and the repayment window.')}
    ${state.data.bonusEnabled ? bonusFields() : ''}
    ${toggle('equityEnabled', 'Equity', 'Set the number of shares and how long they take to vest.')}
    ${state.data.equityEnabled ? equityFields() : ''}`;
}
// Federal minimum salary for exempt status ($684/week) after the 2024 rule was vacated.
const FLSA_SALARY_MIN = 35568;
function addBusinessDays(value, days) {
  const date = new Date(`${value}T12:00:00`);
  while (days > 0) {
    date.setDate(date.getDate() + 1);
    if (![0, 6].includes(date.getDay())) days--;
  }
  return date.toISOString().slice(0, 10);
}
function flsaRecommendation(data = state.data) {
  const amount = Number(data.amount);
  if (!['salary', 'hourly'].includes(data.payType) || !(amount > 0)) return { value: '', reason: 'Add pay in Compensation to see a recommendation.' };
  if (data.payType === 'hourly') return { value: 'Non-exempt', reason: 'Hourly employees are usually non-exempt. They’re paid overtime (1.5×) for hours over 40 in a week.' };
  if (amount < FLSA_SALARY_MIN) return { value: 'Non-exempt', reason: 'Under federal rules, salaries below $35,568 a year ($684 a week) can’t be exempt.' };
  const title = data.jobTitle.trim();
  const example = title ? `as for ${/^[aeiou]/i.test(title) ? 'an' : 'a'} ${title}` : 'for example, an engineer or a manager';
  return { value: 'Exempt', reason: `If most of their work is professional, managerial or administrative, ${example}. Otherwise, choose Non-exempt.` };
}
function i9Recommendation(data = state.data) {
  const name = data.firstName.trim() || 'The employee';
  const start = data.startDate && !inputProblem('startDate', data) ? data.startDate : '';
  const when = start
    ? `${esc(name)} completes Section 1 by their first day (${displayDate(start)}). You check their documents and complete Section 2 within 3 business days (by ${displayDate(addBusinessDays(start, 3))}).`
    : `${esc(name)} completes Section 1 by their first day. You check their documents and complete Section 2 within 3 business days of it.`;
  return { value: 'Required', reason: 'Every employee you hire to work in the US needs a Form I-9, including US citizens.', when };
}
const OFFICIAL_GUIDANCE = {
  flsa: { href: 'https://www.dol.gov/agencies/whd/fact-sheets/17a-overtime', label: 'Department of Labor’s guidance on exemptions' },
  i9: { href: 'https://www.uscis.gov/i-9-central/completing-form-i-9', label: 'USCIS guidance on completing Form I-9' },
};
function guidanceLink(key) {
  const { href, label } = OFFICIAL_GUIDANCE[key];
  return `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}<span aria-hidden="true"> ↗</span><span class="sr-only"> (opens in a new tab)</span></a>`;
}
function recommendationHelp(key) {
  const rec = key === 'flsa' ? flsaRecommendation() : i9Recommendation();
  const heading = rec.value ? `<p class="recommendation-value"><b>Recommended: ${rec.value}</b></p>` : '';
  const details = key === 'flsa'
    ? `<p>${esc(rec.reason)}</p><p><b>Non-exempt:</b> paid overtime for hours over 40 in a week. <b>Exempt:</b> no overtime; paid a salary of at least $35,568 a year for mainly professional, managerial or administrative work.</p><p class="recommendation-note">Based on federal rules. Some states, like California, New York and Washington, set a higher salary level.</p>`
    : `<p>${esc(rec.reason)} It confirms their identity and that they can work in the US. Contractors don’t need one.</p><p><b>When:</b> ${rec.when}</p>`;
  const reminder = rec.value
    ? `<p class="recommendation-note">This is a recommendation, not legal advice. Check the ${guidanceLink(key)} before you confirm.</p>`
    : `<p class="recommendation-note">See the ${guidanceLink(key)}.</p>`;
  const action = !rec.value ? ''
    : state.data[key] === rec.value
      ? `<p class="recommendation-match">${icon('check', 14)} Your choice matches the recommendation.</p>`
      : btn(`Use ${rec.value}`, 'use-recommendation', 'secondary', `data-key="${key}" data-value="${rec.value}" aria-label="Use recommendation: ${rec.value}"`);
  return `${heading}${details}${reminder}${action}`;
}
const ROW_HELP = {
  flsa: { label: 'What should I choose for FLSA?', get html() { return recommendationHelp('flsa'); } },
  i9: { label: 'When is an I-9 needed?', get html() { return recommendationHelp('i9'); } },
};
const openRowHelp = new Set();
const openExplanations = new Set();
// A button with aria-expanded, because Safari + VoiceOver doesn't announce expanded/collapsed for <details>.
function disclosure({ id, open, label, body, attrs = '', extraClass = '' }) {
  return `<div class="explanation${extraClass}" id="${id}" ${attrs} data-open="${open}"><button type="button" class="explanation-toggle" data-action="toggle-disclosure" aria-expanded="${open}" aria-controls="${id}-content">${icon('info', 16)} <span>${label}</span> ${icon('chevron', 14)}</button>
    <div class="explanation-content" id="${id}-content"${open ? '' : ' hidden'}>${body}</div></div>`;
}
function setDisclosure(wrapper, open) {
  wrapper.dataset.open = String(open);
  wrapper.querySelector(':scope > .explanation-toggle').setAttribute('aria-expanded', String(open));
  wrapper.querySelector(':scope > .explanation-content').hidden = !open;
  if (wrapper.dataset.explanation) {
    if (open) openExplanations.add(wrapper.dataset.explanation);
    else openExplanations.delete(wrapper.dataset.explanation);
  }
  if (wrapper.dataset.guideScope) state.guideOpen = open;
  reportView();
}
function explanation(key, summary) {
  return disclosure({ id: `${key}-explanation`, open: openExplanations.has(key), label: summary, body: ROW_HELP[key].html, attrs: `data-explanation="${key}"` });
}
function flsaHelp() {
  return explanation('flsa', 'What should I choose?');
}
function hireFields() {
  const inputs = isContractor()
    ? `<div class="field-support">${icon('shield', 20)}<div><strong>Only what applies to a contractor</strong>FLSA classification and I-9 are not asked. For this design example, payroll group is also skipped.</div></div>
      <div class="next-event">${icon('check', 18)}<div><b>No employee payroll questions to complete</b><p>Your contractor’s role, rate and end date are already in the offer.</p></div></div>`
    : `<div class="field-grid">${field('flsa', 'FLSA classification', { choices: ['Exempt', 'Non-exempt'], full: true })}</div>
      ${checkCallout('flsa')}${flsaHelp()}<hr class="form-divider">
      ${field('i9', 'Will an I-9 be required?', { choices: ['Required', 'Not required'] })}
      ${explanation('i9', 'When is an I-9 needed?')}
      <hr class="form-divider">${field('payroll', 'Payroll group', { choices: ['US Salaried', 'US Hourly'], hint: 'Choose from the groups already set up by your company.' })}`;
  return `${inputs}<hr class="form-divider">${toggle('autoInvite', 'Auto-invite to Bolto after signing', 'Already on. The hire receives an account invitation after signing. Turn it off if you’ll invite them separately.')}
    <div class="field-support muted-support">${icon('eye', 16)}<div>Hire setup stays in Bolto. These settings are not included in the offer letter.</div></div>`;
}
function termsFields() {
  return `<div class="field-grid">
    ${field('expiry', 'Offer expires on', { type: 'date', full: true, hint: 'The candidate can sign until this date.' })}
    ${field('sender', 'Offer sender', { choices: ['Sam Patel'], full: true })}
    <div class="field-support muted-support full">${icon('user', 16)}<div><strong>${state.data.sender ? 'Sam Patel · Head of People' : 'Choose the person the offer comes from'}</strong>The sender’s name and title appear in the letter.</div></div>
    ${field('note', 'Personal note', { type: 'textarea', full: true, placeholder: 'A few words to welcome them…', hint: 'Optional message to include with the offer.' })}
  </div>`;
}
const sectionContents = { candidate: candidateFields, compensation: compensationFields, hire: hireFields, terms: termsFields };
function miniPaper(short) {
  return `<div class="template-thumb" aria-hidden="true"><div class="mini-paper"><div class="mini-heading"></div><div class="mini-line"></div><div class="mini-line"></div><div class="mini-line short"></div><div class="mini-gap"></div><div class="mini-line"></div><div class="mini-line short"></div>${short ? '' : '<div class="mini-gap"></div><div class="mini-line"></div><div class="mini-line"></div>'}</div></div>`;
}
const TEMPLATE_GUIDE_QUESTIONS = [
  {
    key: 'control', label: 'Who controls how the work is done?',
    options: [['company', 'We direct and supervise the work'], ['provider', 'They decide how to deliver the work'], ['unsure', 'I’m not sure']],
  },
  {
    key: 'relationship', label: 'What kind of relationship are you setting up?',
    options: [['team', 'An ongoing role on our team'], ['business', 'Services from their own independent business'], ['unsure', 'I’m not sure']],
  },
];
function templateSuggestion() {
  const { control, relationship } = state.templateGuide;
  if (!control || !relationship) return {
    worker: null, title: 'Answer both questions to see a suggested template.', reason: '',
  };
  if (control === 'company' && relationship === 'team') return {
    worker: 'employee', title: 'Suggested template: Employee (W-2)',
    reason: 'Your company directs the work, and the person is joining your team in an ongoing role. Start with the employee letter.',
  };
  if (control === 'provider' && relationship === 'business') return {
    worker: 'contractor', title: 'Suggested template: Contractor (1099)',
    reason: 'They control how they deliver the work through their own independent business. Start with the contractor letter.',
  };
  return {
    worker: null, title: 'Confirm the worker type before picking a letter.',
    reason: control === 'unsure' || relationship === 'unsure'
      ? 'There isn’t enough information for a clear suggestion. Ask your employment adviser to confirm the working relationship.'
      : 'Your answers point in different directions. Ask your employment adviser to confirm whether this is employment or independent contracting.',
  };
}
function templateGuideResult() {
  const result = templateSuggestion();
  return `<div class="guide-recommendation">${icon(result.worker ? 'file' : 'info', 18)}<div>
    <strong>${esc(result.title)}</strong>${result.reason ? `<p>${esc(result.reason)}</p>` : ''}
    ${result.worker ? btn(`Choose ${result.worker === 'employee' ? 'Employee (W-2)' : 'Contractor (1099)'} ${icon('arrow', 16)}`, 'use-template-suggestion', 'primary') : ''}
  </div></div>`;
}
function templateGuide(scope) {
  const body = `<p class="guide-intro">Answer two questions for a suggested starting point.</p>
      ${TEMPLATE_GUIDE_QUESTIONS.map((question, index) => `<fieldset class="guide-question"><legend>${index + 1}. ${question.label}</legend>
        <div class="guide-options">${question.options.map(([value, label]) => `<label class="radio-option">
          <input type="radio" name="${scope}-guide-${question.key}" data-guide-input="${question.key}" value="${value}" ${state.templateGuide[question.key] === value ? 'checked' : ''}>${label}
        </label>`).join('')}</div>
      </fieldset>`).join('')}
      <div data-guide-result>${templateGuideResult()}</div>
      <p class="guide-limit">This suggests a letter, not legal worker status. Classification depends on the full working relationship.
        <a href="https://www.irs.gov/businesses/small-businesses-self-employed/independent-contractor-self-employed-or-employee" target="_blank" rel="noopener noreferrer">Read the classification guidance<span aria-hidden="true"> ↗</span><span class="sr-only"> (opens in a new tab)</span></a>
      </p>`;
  return disclosure({ id: `${scope}-guide`, open: state.guideOpen, label: 'Help me choose employee or contractor', body, attrs: `data-guide-scope="${scope}"`, extraClass: ' template-guide' });
}
function updateTemplateGuide(input) {
  const question = TEMPLATE_GUIDE_QUESTIONS.find(item => item.key === input.dataset.guideInput);
  if (!question?.options.some(([value]) => value === input.value)) throw new Error('Unsupported template-guide answer.');
  state.templateGuide[question.key] = input.value;
  state.guideOpen = true;
  const guide = input.closest('[data-guide-scope]');
  guide.querySelector('[data-guide-result]').innerHTML = templateGuideResult();
  const result = templateSuggestion();
  announce(`${result.title} ${result.reason}`);
  reportView();
}
function templateOptions(worker, format, inDialog = false) {
  const prefix = inDialog ? 'pending' : 'template';
  return `<fieldset><legend>Who are you hiring?</legend><div class="worker-options">
    <label class="worker-card"><input type="radio" name="${prefix}-worker" data-template-worker="employee" aria-labelledby="${prefix}-employee-name" aria-describedby="${prefix}-employee-desc" ${worker === 'employee' ? 'checked' : ''}><span><b id="${prefix}-employee-name">Employee</b><small id="${prefix}-employee-desc">W-2 · full-time or part-time</small></span></label>
    <label class="worker-card"><input type="radio" name="${prefix}-worker" data-template-worker="contractor" aria-labelledby="${prefix}-contractor-name" aria-describedby="${prefix}-contractor-desc" ${worker === 'contractor' ? 'checked' : ''}><span><b id="${prefix}-contractor-name">Contractor</b><small id="${prefix}-contractor-desc">1099 · a defined engagement</small></span></label>
    </div></fieldset>${templateGuide(prefix)}<fieldset><legend>Choose your letter</legend><div class="template-options">
    ${['standard', 'concise'].map(style => `<label class="template-option"><input type="radio" name="${prefix}-format" data-template-format="${style}" aria-labelledby="${prefix}-${style}-name" aria-describedby="${prefix}-${style}-desc ${prefix}-${style}-caption" ${format === style ? 'checked' : ''}>${miniPaper(style === 'concise')}<div class="template-description"><b id="${prefix}-${style}-name">${style === 'standard' ? 'Standard' : 'Concise'}</b><p id="${prefix}-${style}-desc">${style === 'standard' ? 'A detailed letter with room for all the terms.' : 'The same offer details, in fewer words.'}</p><small id="${prefix}-${style}-caption" data-template-caption>${worker === 'contractor' ? 'Contractor agreement' : 'Employee offer'}</small></div></label>`).join('')}
    </div></fieldset>`;
}
function templateScreen() {
  return `<div class="template-tabs" role="group" aria-label="Template library"><button type="button" data-action="library-bolto" aria-pressed="${state.templateLibrary === 'bolto'}">Bolto templates</button><button type="button" data-action="library-company" aria-pressed="${state.templateLibrary === 'company'}">Company templates</button></div>
    ${state.templateLibrary === 'company' ? `<div class="empty-company">${icon('building', 32)}<h2>No company templates yet</h2><p>This demo company uses Bolto’s templates. Creating or editing templates is outside this flow.</p>${btn('Browse Bolto templates', 'library-bolto', 'secondary')}</div>` : templateOptions(state.worker, state.format)}
    <div class="template-helper">
    <p class="field-hint">You can change the template while filling in the offer. Shared details are kept.</p></div>`;
}
function previewValue(key, placeholder = FIELDS[key], data = state.data, formatValue = value => value, interactive = false) {
  const value = data[key];
  const error = inputProblem(key, data);
  const invalid = Boolean(error && typeof value === 'string' && value.trim() !== '');
  const needsCheck = !error && data === state.data && state.checks.includes(key);
  const pending = Boolean(error && data === state.data && state.screen !== 'review' && !state.showAllErrors && !state.touched.has(key));
  const status = pending ? 'pending' : error ? invalid ? 'invalid' : 'missing' : needsCheck ? 'check' : 'valid';
  const highlightClass = pending ? 'preview-pending' : error ? `placeholder${invalid ? ' is-invalid' : ''}` : needsCheck ? 'document-highlight' : '';
  const content = invalid && (key === 'email' || pending) ? esc(value) : error
    ? `${invalid ? '' : `<span class="sr-only">${pending ? 'Not entered' : 'Missing'}: </span>`}[${invalid ? 'Check ' : ''}${esc(placeholder)}]`
    : esc(formatValue(value));
  const message = pending ? '' : error || (needsCheck ? checkMessage(key) : '');
  const attributes = `data-preview-field="${key}" data-preview-state="${status}"`;
  if (interactive && (status !== 'valid' || state.previewHighlights) && letterEditable(key)) {
    const row = summaryRowForField(key);
    if (!row) throw new Error(`No editor exists for letter field: ${key}`);
    const reviewing = state.screen === 'review';
    const label = `${status === 'missing' || (pending && !value) ? 'Add' : 'Edit'} ${FIELDS[key].toLowerCase()} in ${reviewing ? 'summary' : META[row.section][0]}`;
    const controls = reviewing ? ` aria-controls="row-${row.id}" aria-expanded="${state.editor?.id === row.id}"` : '';
    const visibleValue = invalid && (key === 'email' || pending) ? value : error ? `[${invalid ? 'Check ' : ''}${placeholder}]` : formatValue(value);
    const accessibleValue = pending ? 'Not entered yet' : message;
    return `<button type="button" class="letter-field-edit${highlightClass ? ` ${highlightClass}` : ''}" data-action="edit-letter-field" ${attributes}${controls} aria-label="${esc(visibleValue)}. ${esc(label)}${accessibleValue ? `. ${esc(accessibleValue)}` : ''}" title="${esc(message || label)}">${content}</button>`;
  }
  return `<span ${attributes}${highlightClass ? ` class="${highlightClass}"` : ''}${message ? ` title="${esc(message)}"` : ''}>${content}</span>`;
}
function dateValue(key, data = state.data, interactive = false) { return previewValue(key, FIELDS[key], data, displayDate, interactive); }
// Letter values link only to sections already opened, so jumping ahead can't flag unstarted sections.
function letterEditable(key) {
  if (state.screen === 'review') return true;
  const row = summaryRowForField(key);
  return Boolean(row) && state.visited.has(row.section);
}
function workerTypeValue(worker, interactive) {
  const label = worker === 'contractor' ? 'contractor' : 'employee';
  const attributes = 'data-preview-field="workerType" data-preview-state="valid"';
  if (interactive) {
    return `<button type="button" class="letter-field-edit" data-action="change-template" data-template-source="letter" ${attributes} aria-haspopup="dialog" aria-controls="dialog" aria-label="Change worker type and template: ${label}" title="Change worker type and template">${label}</button>`;
  }
  return `<span ${attributes}>${label}</span>`;
}
function letterHTML(data = state.data, worker = state.worker, format = state.format) {
  const interactive = data === state.data && !['sent', 'saved'].includes(state.screen);
  const value = (key, placeholder, formatValue) => previewValue(key, placeholder, data, formatValue, interactive);
  const date = key => dateValue(key, data, interactive);
  const contractor = worker === 'contractor';
  const pay = `${value('amount', 'Pay amount', money)} ${value('payType', 'Pay type', type => type === 'hourly' ? 'per hour' : 'per year')}`;
  const arrangement = value('arrangement', 'Work arrangement', choice => ({ Remote: 'remotely', Hybrid: 'on a hybrid basis', 'On-site': 'on-site' }[choice]));
  const locationCopy = `work ${arrangement}${['Hybrid', 'On-site'].includes(data.arrangement) ? ` ${data.arrangement === 'Hybrid' ? 'from' : 'at'} ${value('workplace')}` : ''}`;
  const workerType = workerTypeValue(worker, interactive && state.previewHighlights && state.screen !== 'template');
  const workingRelationship = contractor ? workerType : `${value('employment', 'Employment type', type => type.toLowerCase())} ${workerType}`;
  return `<article class="document" aria-label="Offer letter preview">
    <div class="document-top"><div class="document-company">Northstar Studio</div><div class="document-caption">${contractor ? 'CONTRACTOR OFFER' : 'OFFER OF EMPLOYMENT'}</div></div>
    <h3>A new chapter, together.</h3><p class="document-date">May 18, 2026</p>
    <p>Dear ${value('firstName', 'First name')} ${value('lastName', 'Last name')},</p>
    <p>We’re pleased to offer you the role of <strong>${value('jobTitle', 'Job title')}</strong> at Northstar Studio as a ${workingRelationship}.</p>
    ${format === 'standard' ? '<p class="document-section">Your role</p>' : ''}
    <p>You’ll start on <strong>${date('startDate')}</strong> in ${value('department', 'Department')}, report to ${value('manager', 'Manager')}, and ${locationCopy}.${contractor ? ` This engagement ends on <strong>${date('endDate')}</strong>.` : ''}</p>
    ${format === 'standard' ? '<p class="document-section">Your compensation</p>' : ''}
    <p>${data.payType === 'hourly' ? 'Your rate' : data.payType === 'salary' ? 'Your annual salary' : 'Your pay'} will be <strong>${pay}</strong>.${format === 'standard' ? ' Payment follows the terms agreed with Northstar Studio.' : ''}</p>
    ${data.bonusEnabled ? `<p>You’ll also receive a signing bonus of <strong>${value('bonusAmount', 'Bonus amount', money)}</strong>. ${clauseHTML('repayment', data, interactive)}</p>` : ''}
    ${data.equityEnabled ? `<p><strong>Equity:</strong> ${clauseHTML('equity', data, interactive)}</p>` : ''}
    ${format === 'standard' ? '<p class="document-section">Next steps</p>' : ''}
    <p>Please sign by <strong>${date('expiry')}</strong> to accept this offer. We look forward to working with you.</p>
    <p>Sincerely,<br><strong class="signature-sender">${value('sender', 'Sender')}</strong><br>${previewValue('sender', 'Sender title', data, () => 'Head of People')}</p>
    <div class="signature-lines"><span>Candidate signature</span><span>Date</span></div>
  </article>`;
}
function recipientHTML() {
  const interactive = !['sent', 'saved'].includes(state.screen);
  return `<span class="recipient-label">${icon('mail', 16)} To</span><span class="recipient-value">${previewValue('email', 'Email address', state.data, String, interactive)}</span>`;
}
function previewColumn() {
  const reviewing = state.screen === 'review';
  return `<aside class="preview-column" data-mobile-pane="letter" data-preview-highlights="${state.previewHighlights}" ${reviewing ? 'data-review-scroll="letter" tabindex="0"' : ''} aria-label="Live letter preview"><div class="preview-heading"><h2>${icon('file', 18)} Letter preview</h2><small><span class="live-dot"></span>Live</small></div>
    <div class="preview-highlight-tools"><button type="button" class="preview-highlight-switch" role="switch" data-action="toggle-preview-highlights" aria-checked="${state.previewHighlights}" aria-labelledby="preview-highlights-label" aria-controls="letter-content preview-recipient" aria-describedby="preview-highlights-note"><span id="preview-highlights-label">Show highlights</span><span class="switch-track" aria-hidden="true"></span><span class="switch-state" aria-hidden="true">${state.previewHighlights ? 'On' : 'Off'}</span></button><span id="preview-highlights-note">${reviewing ? 'Select a highlighted value to edit it in the summary. Employee/contractor opens the template picker.' : state.screen === 'template' ? 'Values fill in as you complete each section.' : 'Select a highlighted value to jump to its field. Sections you haven’t opened yet can’t be selected. Employee/contractor opens the template picker.'}<br>Highlights aren’t part of the sent letter. Missing-value and error warnings stay visible.</span></div>
    <div class="preview-recipient" id="preview-recipient">${recipientHTML()}</div>
    <div id="letter-content">${letterHTML()}</div>
    <p class="preview-footnote">${icon('info', 14)} Illustrative letter. Unchecked, unfilled details stay neutral. Orange marks details to complete or recheck; red marks errors. Email and hire setup are reviewed in the summary.</p></aside>`;
}
function sectionNav() {
  return `<nav class="section-nav" aria-label="Offer sections"><p class="eyebrow">Offer details</p>${SECTIONS.map((section, index) => {
    const { status, label } = sectionProgress(section.id);
    const attention = ['missing', 'invalid', 'check'].includes(status);
    return `<button type="button" class="section-link" data-action="navigate" data-screen="${section.id}" data-status="${status}" ${state.screen === section.id ? 'aria-current="step"' : ''}><span class="nav-number" aria-hidden="true">${status === 'complete' ? icon('check', 14) : index + 1}</span><span class="nav-copy"><b>${section.label}</b><small class="nav-status">${attention ? icon('alert', 12) : ''}<span>${esc(label)}</span></small></span></button>`;
  }).join('')}<p class="nav-caption">Work in any order.<br>Your details stay with you.</p></nav>`;
}
function sectionPanel() {
  const section = SECTIONS.find(item => item.id === state.screen);
  const descriptions = {
    candidate: ['Candidate & role', 'A few personal details. The rest is a selection.'],
    compensation: ['Pay & extras', 'A clear amount, with the right unit.'],
    hire: ['A few important settings', 'Understand each setting before choosing it.'],
    terms: ['Offer terms & message', 'Make the deadline and sender clear.'],
  };
  const [title, description] = descriptions[state.screen];
  return `<section class="panel form-body" data-mobile-pane="details" aria-labelledby="section-heading"><div class="panel-heading"><div><h2 id="section-heading" tabindex="-1">${title}</h2><p>${description}</p></div><div class="section-icon">${icon(section.icon, 20)}</div></div>
    <form id="offer-form" novalidate>${sectionContents[state.screen]()}</form><div class="section-tail"><span>Demo data · ${state.sample === 'priya' ? 'Priya Shah' : 'Alex Rivera'}</span>${state.screen === 'candidate' ? '<span>Candidate details and dates are never copied.</span>' : `<button type="button" class="btn-text" data-action="fill-section">Use example details ${icon('arrow', 14)}</button>`}</div></section>`;
}
function reviewRows() {
  return [
    { section: 'candidate', label: 'Candidate', rows: [
      { id: 'name', label: 'Name', keys: ['firstName', 'lastName'], value: candidateName() },
      { id: 'email', label: 'Email', keys: ['email'], value: state.data.email },
    ] },
    { section: 'role', label: 'Role', rows: [
      { id: 'jobTitle', label: 'Job title', keys: ['jobTitle'], value: state.data.jobTitle },
      { id: 'startDate', label: 'Start date', keys: ['startDate'], value: displayDate(state.data.startDate), costly: true },
      { id: 'workerType', label: 'Worker type', keys: [], value: isContractor() ? 'Contractor (1099)' : 'Employee (W-2)', sub: templateName(), changeTemplate: true },
      { id: isContractor() ? 'endDate' : 'employment', label: isContractor() ? 'End date' : 'Employment', keys: isContractor() ? ['endDate'] : ['employment'], value: isContractor() ? displayDate(state.data.endDate) : state.data.employment, sub: isContractor() ? 'Contractor · set by the template' : '' },
      { id: 'manager', label: 'Reports to', keys: ['manager'], value: state.data.manager },
      { id: 'department', label: 'Department', keys: ['department'], value: state.data.department },
      { id: 'arrangement', label: 'Work location', keys: ['arrangement', ...(['Hybrid', 'On-site'].includes(state.data.arrangement) ? ['workplace'] : [])], value: [state.data.arrangement, ...(['Hybrid', 'On-site'].includes(state.data.arrangement) ? [state.data.workplace] : [])].filter(Boolean).join(' · ') },
    ] },
    { section: 'compensation', label: 'Compensation', rows: [
      { id: 'pay', label: 'Pay', keys: ['payType', 'amount'], value: state.data.amount && Number(state.data.amount) > 0 ? `${money(state.data.amount)} / ${state.data.payType === 'hourly' ? 'hour' : 'year'}` : '', sub: state.data.payType === 'hourly' ? 'Hourly' : state.data.payType === 'salary' ? 'Salary' : '', costly: true },
      { id: 'bonus', label: 'Signing bonus', keys: state.data.bonusEnabled ? ['bonusEnabled', 'bonusAmount', 'repaymentMonths'] : ['bonusEnabled'], value: state.data.bonusEnabled ? state.data.bonusAmount && Number(state.data.bonusAmount) > 0 ? money(state.data.bonusAmount) : '' : 'None', sub: state.data.bonusEnabled ? clauseText('repayment') : '', costly: state.data.bonusEnabled },
      { id: 'equity', label: 'Equity', keys: state.data.equityEnabled ? ['equityEnabled', 'equityShares', 'equityVestingMonths'] : ['equityEnabled'], value: state.data.equityEnabled ? `${termQuantity(state.data.equityShares, 'share', 'Number of shares')} / ${termQuantity(state.data.equityVestingMonths, 'month', 'Vesting period')}` : 'None', costly: state.data.equityEnabled },
    ] },
    { section: 'hire', label: 'Hire setup · not in the letter', rows: [
      ...(!isContractor() ? [
        { id: 'flsa', label: 'FLSA', keys: ['flsa'], value: state.data.flsa, costly: true },
        { id: 'i9', label: 'I-9', keys: ['i9'], value: state.data.i9, costly: true },
        { id: 'payroll', label: 'Payroll group', keys: ['payroll'], value: state.data.payroll, costly: true },
      ] : [{ id: 'contractor-setup', label: 'Employee setup', keys: [], value: 'Not asked for this contractor', sub: 'FLSA, I-9 and payroll group', noEdit: true }]),
      { id: 'autoInvite', label: 'Bolto invitation', keys: ['autoInvite'], value: state.data.autoInvite ? 'Send automatically after signing' : 'Off · invite separately', toggle: true },
    ] },
    { section: 'terms', label: 'Offer terms, sender & note', rows: [
      { id: 'expiry', label: 'Offer expires', keys: ['expiry'], value: displayDate(state.data.expiry) },
      { id: 'sender', label: 'Sender', keys: ['sender'], value: state.data.sender, sub: state.data.sender ? 'Head of People' : '' },
      { id: 'note', label: 'Personal note', keys: ['note'], value: state.data.note || 'No personal note' },
    ] },
  ];
}
function rowById(id) { return reviewRows().flatMap(group => group.rows).find(row => row.id === id); }
function summaryRowForField(key) {
  for (const group of reviewRows()) {
    const row = group.rows.find(item => !item.noEdit && item.keys.includes(key));
    if (row) return { ...row, section: canonicalScreen(group.section) };
  }
}
function editorFields(row) {
  if (row.id === 'name') return `<div class="field-grid">${field('firstName')}${field('lastName')}</div>`;
  if (row.id === 'pay') return `<div class="field-grid">${radioField('payType', 'Pay type', [['salary', 'Salary'], ['hourly', 'Hourly']])}${field('amount', 'Amount', { type: 'number', full: true })}</div>${checkCallout('amount')}`;
  if (row.id === 'arrangement') return `<div class="field-grid">${radioField('arrangement', 'Work arrangement', [['Remote', 'Remote'], ['Hybrid', 'Hybrid'], ['On-site', 'On-site']])}${['Hybrid', 'On-site'].includes(state.data.arrangement) ? field('workplace', 'Workplace', { choices: WORKPLACES, full: true }) : ''}</div>`;
  if (row.id === 'bonus') return `${toggle('bonusEnabled', 'Include a signing bonus', 'The bonus and repayment condition appear in the letter.')}${state.data.bonusEnabled ? bonusFields() : ''}`;
  if (row.id === 'equity') return `${toggle('equityEnabled', 'Include equity', 'The grant and vesting period appear in the letter.')}${state.data.equityEnabled ? equityFields() : ''}`;
  if (row.id === 'autoInvite') return toggle('autoInvite', 'Auto-invite after signing', 'Send the Bolto account invitation after the candidate signs.');
  if (row.id === 'flsa') return `${field('flsa', 'FLSA classification', { choices: ['Exempt', 'Non-exempt'] })}${checkCallout('flsa')}${flsaHelp()}`;
  const options = {
    email: { type: 'email' }, jobTitle: {}, startDate: { type: 'date' }, endDate: { type: 'date' },
    employment: { choices: ['Full-time', 'Part-time'] }, manager: { choices: Object.keys(COMPANY_MANAGERS) },
    department: { choices: departmentChoices(), disabled: !state.data.manager, hint: 'Choose a manager in Reports to first.' }, i9: { choices: ['Required', 'Not required'] },
    payroll: { choices: ['US Salaried', 'US Hourly'] }, expiry: { type: 'date' },
    sender: { choices: ['Sam Patel'] }, note: { type: 'textarea' },
  };
  return field(row.keys[0], FIELDS[row.keys[0]], options[row.id]);
}
function summaryRow(row) {
  const allIssues = issues().filter(issue => row.keys.includes(issue.key));
  const missing = allIssues.some(issue => issue.type === 'missing');
  const invalid = allIssues.some(issue => issue.type === 'invalid');
  const active = state.editor?.id === row.id;
  const display = missing ? `${icon('alert', 14)} Missing` : invalid && !row.value ? `${icon('alert', 14)} Needs correction` : esc(row.value);
  const help = ROW_HELP[row.id];
  const helpOpen = Boolean(help) && openRowHelp.has(row.id);
  const label = help
    ? `<span class="row-label row-label-help"><span id="row-${row.id}-label">${row.label}</span><button type="button" class="row-help-button" data-action="toggle-row-help" data-row="${row.id}" aria-expanded="${helpOpen}" aria-controls="row-${row.id}-help" aria-label="${esc(help.label)}">${icon('info', 16)}</button></span>`
    : `<span class="row-label" id="row-${row.id}-label">${row.label}</span>`;
  const helpRegion = help ? `<div class="row-help explanation-content" id="row-${row.id}-help" role="region" aria-labelledby="row-${row.id}-label"${helpOpen ? '' : ' hidden'}>${help.html}</div>` : '';
  const editControl = row.toggle
    ? `<span class="switch summary-switch"><input type="checkbox" role="switch" id="summary-${row.id}" data-field="${row.keys[0]}" aria-labelledby="row-${row.id}-label" aria-describedby="row-${row.id}-value" ${state.data[row.keys[0]] ? 'checked' : ''}><span class="switch-track" aria-hidden="true"></span></span>`
    : row.noEdit ? '<span></span>' : row.changeTemplate
    ? `<button type="button" class="icon-button" data-action="change-template" data-template-source="summary" aria-label="Change worker type and template" aria-haspopup="dialog" aria-controls="dialog">${icon('edit', 16)}</button>`
    : `<button type="button" class="icon-button" data-action="edit-row" data-row="${row.id}" aria-label="Edit ${esc(row.label.toLowerCase())}" aria-expanded="${active}">${icon('edit', 16)}</button>`;
  return `<div class="summary-row${row.costly ? ' costly' : ''}${row.toggle ? ' toggle-summary-row' : ''}${allIssues.length ? ' attention' : ''}${invalid ? ' is-invalid' : ''}" id="row-${row.id}">
    ${label}<span class="row-value${missing || (invalid && !row.value) ? ' missing-value' : ''}" id="row-${row.id}-value">${display}${row.sub && !missing ? `<small>${esc(row.sub)}</small>` : ''}</span>
    ${editControl}${helpRegion}
    ${!active && allIssues.length ? `<span class="row-feedback">${icon('alert', 14)} ${esc(allIssues[0].message)}</span>` : ''}
    ${active ? `<form class="inline-editor" id="inline-form" novalidate><h4>Edit ${esc(row.label.toLowerCase())}</h4><p class="inline-save-hint">Changes are kept when you select another field.</p>${editorFields(row)}<div class="inline-actions">${btn('Cancel', 'cancel-edit', 'secondary')}<button type="submit" class="btn btn-primary">${row.keys.some(key => state.checks.includes(key)) ? 'Save & confirm' : 'Save changes'}</button></div></form>` : ''}
  </div>`;
}
function summaryPanel() {
  return `<section class="summary-panel" data-mobile-pane="details" data-review-scroll="summary" tabindex="0" aria-labelledby="summary-heading"><div class="summary-heading"><div><h2 id="summary-heading">Offer summary</h2></div><p><span class="legend-dot"></span>Costly details are highlighted within their sections. Select a row to edit it.</p></div>
    ${templateNotice()}
    <div id="review-issues">${reviewAlert()}</div>
    ${reviewRows().map(group => `<section class="summary-group"><h3>${group.label}</h3>${group.rows.map(summaryRow).join('')}</section>`).join('')}</section>`;
}
function reviewAlert() {
  if (!issues().length) return '';
  const invalid = issues().some(issue => issue.type === 'invalid');
  return `<div class="review-alert${invalid ? ' is-invalid' : ''}"><strong>${icon('alert', 16)} ${esc(issueSummary())}</strong>${invalid ? 'Correct the highlighted value before sending.' : 'Finish the highlighted details before sending.'}<br><button type="button" class="btn-text" data-action="first-issue">Go to the first detail ${icon('arrow', 14)}</button></div>`;
}
function header() {
  const isTemplate = state.screen === 'template';
  const special = ['sent', 'saved'].includes(state.screen);
  const phase = isTemplate ? 0 : ['review', 'sent'].includes(state.screen) ? 2 : 1;
  return `<header class="workspace-header"><div class="workspace"><span class="workspace-avatar" aria-hidden="true">NS</span><div><div class="workspace-name">Northstar Studio</div><div class="workspace-caption">Hiring workspace</div></div></div>
    <nav class="steps" aria-label="Offer progress">${[['template', 'Template'], ['candidate', 'Offer details'], ['review', 'Review & send']].map(([screen, label], index) => `${index ? '<span class="step-separator"></span>' : ''}<button type="button" class="step-button${phase > index || state.screen === 'sent' ? ' complete' : ''}" data-action="navigate" data-screen="${screen}" ${phase === index ? 'aria-current="step"' : ''}><span class="step-dot">${phase > index || state.screen === 'sent' ? icon('check', 14) : index + 1}</span>${label}</button>`).join('')}</nav>
    <div class="header-actions">${special ? '<span class="pill pill-neutral">Design preview</span>' : `${state.savedAt && !state.dirty ? `<span class="save-label">${icon('check', 14)} Draft saved</span>` : ''}${btn('Save as draft', 'save-draft', 'secondary')}`}</div></header>`;
}
function pageHeading() {
  const [label, title, description] = META[state.screen];
  const isForm = SECTIONS.some(section => section.id === state.screen);
  return `<div class="page-heading"><div><div class="eyebrow">${state.screen === 'template' ? 'Step 1 · Template' : state.screen === 'review' ? 'Step 3 · Review & send' : `Step 2 · ${label}`}</div><h1 id="screen-heading" tabindex="-1">${title}</h1><p>${description}</p></div>
    ${isForm ? `<div class="heading-side"><span class="pill pill-blue">${esc(templateName())}</span><button type="button" class="btn-text" data-action="change-template">Change ${icon('chevron', 14)}</button></div>` : ''}</div>`;
}
function mobileControls() {
  const label = state.screen === 'template' ? 'Templates' : state.screen === 'review' ? 'Summary' : 'Details';
  return `<div class="mobile-preview-controls" role="group" aria-label="Screen view"><button type="button" data-action="mobile-details" aria-pressed="${state.mobilePanel === 'details'}">${icon('edit', 16)} ${label}</button><button type="button" data-action="mobile-letter" aria-pressed="${state.mobilePanel === 'letter'}">${icon('eye', 16)} Letter preview</button></div>`;
}
function footerContents() {
  const screen = state.screen;
  if (screen === 'template') return `<div class="footer-left"><span class="footer-status">${icon('file', 18)}<span><b>${esc(templateName())}</b><small>Shared details stay if you change templates.</small></span></span></div><div class="footer-right">${savedSnapshot ? btn('Resume saved draft', 'resume-draft', 'quiet') : ''}${btn(`Use template ${icon('arrow', 16)}`, 'use-template', 'primary')}</div>`;
  if (screen === 'review') {
    const count = issues().length;
    const tags = offerFooterAlertSpecs(issueSummary()).map(tag => `<span class="footer-status-tag tag-${tag.tone}">${esc(tag.label)}</span>`).join('');
    return `<div class="footer-left">${btn('Back to details', 'back-details', 'secondary')}${tags ? `<div class="footer-readiness"><div class="footer-status-tags" aria-label="Offer readiness">${tags}</div><small>Nothing is sent until all details are complete and checked.</small></div>` : ''}</div><div class="footer-right"><button type="button" id="send-offer" data-action="send-offer" class="btn btn-primary" aria-disabled="${Boolean(count)}" aria-describedby="send-rule">${icon('send', 16)} Send offer letter</button><span id="send-rule" class="sr-only">This demo sends no real email. Current edits are included. All required fields must be valid and affected details checked.</span></div>`;
  }
  const index = SECTIONS.findIndex(section => section.id === screen);
  const next = SECTIONS[index + 1];
  const styledForm = ['candidate', 'compensation', 'hire'].includes(screen);
  const alerts = styledForm ? offerFooterAlertSpecs(screen === 'candidate' ? candidateEntryStatus() : sectionProgress(screen).label) : [];
  const status = styledForm
    ? alerts.length ? `<div class="footer-status-tags" aria-label="${screen === 'candidate' ? 'Candidate and role readiness' : 'Offer readiness'}">${alerts.map(tag => `<span class="footer-status-tag tag-${tag.tone}">${esc(tag.label)}</span>`).join('')}</div>` : ''
    : `<span class="footer-status">${index + 1} of ${SECTIONS.length} sections</span>`;
  return `<div class="footer-left">${btn(`${icon('back', 16)} Back`, 'previous', styledForm ? 'secondary' : 'quiet')}${status}</div><div class="footer-right">${btn(`${next ? `Continue to ${esc(next.label)}` : 'Review offer'} ${icon('arrow', 16)}`, 'continue', 'primary')}</div>`;
}
function successPage() {
  const sent = state.sent || { data: sampleData(state.sample), worker: state.worker, format: state.format };
  const d = sent.data;
  const name = candidateName(d);
  return `<div class="success-page"><div class="success-emblem">${icon('check', 40)}</div><p class="eyebrow" style="color:var(--success);margin-bottom:12px">Ready for their next chapter</p>
    <h1 id="screen-heading" tabindex="-1">${esc(d.firstName)}’s offer is on its way.</h1><p>The signing request is addressed to <strong>${esc(d.email)}</strong>. You’ve finished your part of the offer.</p>
    <div class="success-card"><div class="success-person"><div class="person-avatar">${esc(d.firstName[0] + d.lastName[0])}</div><div><h2>${esc(name)}</h2><p>${esc(d.jobTitle)}</p></div><span class="pill pill-success" style="margin-left:auto">${icon('check', 14)} Sent</span></div>
      <dl class="receipt"><div><dt>Pay</dt><dd>${money(d.amount)} / ${d.payType === 'hourly' ? 'hour' : 'year'}</dd></div><div><dt>Start date</dt><dd>${displayDate(d.startDate)}</dd></div><div><dt>Offer expires</dt><dd>${displayDate(d.expiry)}</dd></div><div><dt>From</dt><dd>Sam Patel, Head of People</dd></div></dl></div>
    <div class="next-event">${icon('mail', 22)}<div><b>What happens next?</b><p>${esc(d.firstName)} receives a link to read and sign the offer.${d.autoInvite ? ' Their Bolto account invitation follows after signing.' : 'Automatic Bolto invitation is off.'}</p></div></div>
    <div class="success-actions">${btn(`${icon('file', 16)} View sent offer`, 'view-sent', 'secondary')}${btn(`Create another offer ${icon('arrow', 16)}`, 'new-offer', 'primary')}</div>
    <p class="demo-disclaimer">Demo confirmation only. No email was sent and no candidate record was created.</p></div>`;
}
function savedPage() {
  return `<div class="success-page"><div class="success-emblem" style="background:var(--blue-soft);color:var(--blue-text);box-shadow:none">${icon('save', 36)}</div><h1 id="screen-heading" tabindex="-1">A pause, not a restart.</h1>
    <p>Your draft for ${esc(candidateName())} is saved in this browser. Come back to the same section whenever you’re ready.</p>
    <div class="success-card"><h2>${esc(candidateName())}</h2><p class="muted" style="margin-top:8px">${esc(templateName())}</p><div class="next-event">${icon('clock', 20)}<div><b>Resume at ${esc(META[state.lastScreen][0])}</b><p>${esc(issueSummary())}. Your shared details and template choice are kept.</p></div></div></div>
    <div class="success-actions">${btn(`Resume offer ${icon('arrow', 16)}`, 'resume-draft', 'primary')}</div><p class="demo-disclaimer">Local demo storage only. Nothing has been sent to Bolto.</p></div>`;
}
function applyMobileVisibility() {
  document.querySelectorAll('[data-mobile-pane]').forEach(node => {
    node.hidden = mobileQuery.matches && node.dataset.mobilePane !== state.mobilePanel;
  });
  document.querySelectorAll('.mobile-preview-controls button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.action === `mobile-${state.mobilePanel}`)));
  scrollActiveSection();
}
function scrollActiveSection() {
  const nav = document.querySelector('.section-nav');
  const active = nav?.querySelector('[aria-current="step"]');
  if (!active || nav.scrollWidth <= nav.clientWidth) return;
  const offset = active.getBoundingClientRect().left - nav.getBoundingClientRect().left + nav.scrollLeft;
  nav.scrollLeft = offset - (nav.clientWidth - active.offsetWidth) / 2;
}
function templateNotice() {
  return state.templateNotice ? `<div class="template-change-notice"><div><strong>Template changed. Your shared details are kept.</strong><p>${esc(state.templateNotice)}</p></div><button type="button" class="icon-button" data-action="dismiss-template-notice" aria-label="Dismiss template change notice">${icon('close', 16)}</button></div>` : '';
}
function render(focusId) {
  const scrollPositions = focusId === 'screen-heading' ? [] : [...document.querySelectorAll('[data-review-scroll]')].map(node => ({ pane: node.dataset.reviewScroll, top: node.scrollTop }));
  const special = ['sent', 'saved'].includes(state.screen);
  let content = '';
  if (special) {
    content = state.screen === 'sent' ? successPage() : savedPage();
  } else {
    const notice = state.screen === 'review' ? '' : templateNotice();
    const workbench = state.screen === 'template'
      ? `<div class="workbench"><section class="form-body" data-mobile-pane="details" aria-label="Choose an offer template">${templateScreen()}</section>${previewColumn()}</div>`
      : state.screen === 'review'
        ? `<div class="workbench review-workbench">${previewColumn()}${summaryPanel()}</div>`
        : `<div class="workbench form-workbench">${sectionNav()}${sectionPanel()}${previewColumn()}</div>`;
    content = `${pageHeading()}${notice}${mobileControls()}${workbench}`;
  }
  app.innerHTML = `<div class="app-shell${state.screen === 'review' ? ' review-shell' : ['candidate', 'compensation', 'hire'].includes(state.screen) ? ' moment-two-shell' : ''}${state.screen === 'candidate' ? ' candidate-role-shell' : ''}">${header()}<main class="page-content">${content}</main>${special ? '' : `<footer class="app-footer ${state.screen === 'review' ? 'review-footer' : ''}" id="app-footer">${footerContents()}</footer>`}</div>`;
  document.title = `${META[state.screen][0]} · Bolto offer prototype`;
  footerObserver.disconnect();
  const footer = document.getElementById('app-footer');
  if (footer) footerObserver.observe(footer);
  applyMobileVisibility();
  for (const saved of scrollPositions) {
    const pane = document.querySelector(`[data-review-scroll="${saved.pane}"]`);
    if (pane) pane.scrollTop = saved.top;
  }
  if (focusId) document.getElementById(focusId)?.focus({ preventScroll: true });
  reportView();
}
function refreshDerived() {
  const letter = document.getElementById('letter-content');
  if (letter) letter.innerHTML = letterHTML();
  const recipient = document.getElementById('preview-recipient');
  if (recipient) recipient.innerHTML = recipientHTML();
  document.querySelectorAll('[data-clause-preview]').forEach(node => {
    node.innerHTML = clauseHTML(node.dataset.clausePreview);
  });
  const footer = document.getElementById('app-footer');
  if (footer) footer.innerHTML = footerContents();
  const nav = document.querySelector('.section-nav');
  if (nav) {
    nav.outerHTML = sectionNav();
    scrollActiveSection();
  }
  const reviewIssues = document.getElementById('review-issues');
  if (reviewIssues) reviewIssues.innerHTML = reviewAlert();
  reportView();
}
function refreshFieldError(key) {
  const targets = document.querySelectorAll(`[data-field="${key}"]`);
  const error = document.getElementById(`field-${key}-error`);
  if (!targets.length || !error) return;
  const message = (state.touched.has(key) || state.showAllErrors) && requiredFields().includes(key) ? inputProblem(key) : '';
  targets.forEach(target => target.setAttribute('aria-invalid', String(Boolean(message))));
  error.innerHTML = message ? `${icon('alert', 14)}<span>${esc(message)}</span>` : '';
}
function navigate(screen) {
  screen = canonicalScreen(screen);
  if (!SCREEN_ORDER.includes(screen) && screen !== 'saved') throw new Error(`Unknown screen: ${screen}`);
  applyOpenEdit();
  state.screen = screen;
  if (screen === 'review') SECTIONS.forEach(section => state.visited.add(section.id));
  else if (SECTIONS.some(section => section.id === screen)) state.visited.add(screen);
  state.mobilePanel = 'details';
  clearAnnouncements();
  render('screen-heading');
  lastStatusAnnounced = sectionStatus();
  window.scrollTo({ top: 0, behavior: 'instant' });
}
function openEditor(id, fieldKey) {
  const row = rowById(id);
  if (!row || row.noEdit || row.changeTemplate) throw new Error(`This summary row cannot be edited inline: ${id}`);
  if (fieldKey && !row.keys.includes(fieldKey)) throw new Error(`Field ${fieldKey} does not belong to summary row ${id}.`);
  const previous = state.editor && state.editor.id !== id ? applyOpenEdit() : null;
  state.mobilePanel = 'details';
  if (!state.editor) {
    state.editor = { id, before: { ...state.data }, checksBefore: [...state.checks] };
    render();
  } else {
    applyMobileVisibility();
  }
  const key = fieldKey || document.querySelector('#inline-form [data-field]')?.dataset.field;
  if (!key) {
    toast('The editor could not open. Try the Edit button in the summary.', true);
    return false;
  }
  const focused = focusField(key);
  if (focused) announce(`Editing ${fieldKey ? FIELDS[fieldKey].toLowerCase() : row.label.toLowerCase()} in the offer summary.${previous && issues().length ? ` ${issueSummary()}.` : ''}`);
  return focused;
}
function applyOpenEdit() {
  if (!state.editor) return null;
  const editor = state.editor;
  const row = rowById(editor.id);
  if (!row) throw new Error(`The open summary row no longer exists: ${editor.id}`);
  row.keys.filter(key => requiredFields().includes(key)).forEach(key => state.touched.add(key));
  // Merely visiting an affected field is not confirmation; a valid correction is.
  const corrected = row.keys.filter(key => state.checks.includes(key) && state.data[key] !== editor.before[key] && !inputProblem(key));
  state.checks = state.checks.filter(key => !corrected.includes(key));
  state.editor = null;
  return row;
}
function cancelEditor(rerender = true) {
  const editor = state.editor;
  if (!editor) return;
  state.data = { ...editor.before };
  state.checks = [...editor.checksBefore];
  state.editor = null;
  if (rerender) {
    render();
    const editButton = document.querySelector(`[data-action="edit-row"][data-row="${editor.id}"]`);
    if (editButton) { editButton.focus({ preventScroll: true }); revealField(editButton); }
    announce('Edit cancelled. Previous values restored.');
  }
}
function saveEditor() {
  const row = rowById(state.editor.id);
  const required = row.keys.filter(key => requiredFields().includes(key));
  required.forEach(key => state.touched.add(key));
  const invalid = required.find(key => inputProblem(key));
  if (invalid) {
    render();
    focusField(invalid);
    announce(inputProblem(invalid), true);
    return;
  }
  state.checks = state.checks.filter(key => !row.keys.includes(key));
  applyOpenEdit();
  markChanged();
  render();
  const editButton = document.querySelector(`[data-action="edit-row"][data-row="${row.id}"]`);
  if (editButton) { editButton.focus({ preventScroll: true }); revealField(editButton); }
  announce(`${row.label} updated. ${issueSummary()}.`);
}
function focusField(key) {
  state.mobilePanel = 'details';
  applyMobileVisibility();
  const target = document.getElementById(`field-${key}`) || document.querySelector(`[data-field="${key}"]:checked`) || document.querySelector(`[data-field="${key}"]`);
  if (!target) {
    toast('This field could not be focused. Open its form section or summary row to edit it.', true);
    return false;
  }
  if (target.disabled && key === 'department') {
    const manager = document.getElementById('field-manager');
    if (manager) { manager.focus({ preventScroll: true }); revealField(manager); }
    announce('Choose a manager in Reports to before choosing their department.', true);
    return false;
  }
  target.focus({ preventScroll: true });
  revealField(target);
  return true;
}
function revealField(target) {
  target.scrollIntoView({ block: 'center', behavior: 'instant' });
  reportView();
  if (window.parent !== window) {
    const bounds = target.getBoundingClientRect();
    window.parent.postMessage({
      // The preview shell resizes the iframe, so use document coordinates rather than its temporary scroll offset.
      channel: 'bolto-visual-preview', type: 'reveal-field', top: bounds.top + window.scrollY, height: bounds.height,
    }, '*');
  }
}
function firstIssue() {
  const first = issues()[0];
  if (!first) return;
  if (state.screen !== 'review') navigate('review');
  const row = summaryRowForField(first.key);
  state.showAllErrors = true;
  if (openEditor(row.id, first.key)) announce(`${issueSummary()}. ${first.message}`, true);
}
function applyTemplate(worker, format) {
  if (!['employee', 'contractor'].includes(worker) || !['standard', 'concise'].includes(format)) throw new Error('Choose a supported template.');
  applyOpenEdit();
  const changedWorker = worker !== state.worker;
  const changedFormat = format !== state.format;
  state.worker = worker;
  state.format = format;
  if (changedWorker) {
    state.roleSetupId = null;
    state.checks = state.checks.filter(key => key !== 'flsa');
    if (worker === 'employee' && state.data.flsa) state.checks.push('flsa');
    state.templateNotice = worker === 'contractor'
      ? 'Candidate & role now asks for an end date. FLSA, I-9 and payroll group are skipped in this contractor example.'
      : 'Choose full-time or part-time in Candidate & role. Check FLSA, I-9 and payroll group in Hire setup. The contract end date is no longer used.';
  } else if (changedFormat) {
    state.templateNotice = 'The letter wording changed. The required fields and your entries are unchanged in this example.';
  }
  if (changedWorker || changedFormat) {
    markChanged();
    announce(`Template changed to ${templateName()}. Shared entries kept. ${issueSummary()}.`);
  }
}
function openDialog(html, opener) {
  dialogOpener = opener || document.activeElement;
  clearAnnouncements();
  dialog.classList.remove('role-setup-dialog');
  dialog.classList.toggle('review-dialog', ['review', 'candidate', 'compensation', 'hire'].includes(state.screen));
  dialog.innerHTML = `<div class="dialog-content">${html}</div><div id="dialog-announcer" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></div><div id="dialog-error-announcer" class="sr-only" role="alert" aria-atomic="true"></div>`;
  if (dialog.querySelector('#dialog-description')) dialog.setAttribute('aria-describedby', 'dialog-description');
  else dialog.removeAttribute('aria-describedby');
  dialog.showModal();
  // showModal already focuses the first control, which VoiceOver doesn't announce; move to the heading so the dialog is read.
  const heading = dialog.querySelector('#dialog-heading');
  if (heading) {
    heading.tabIndex = -1;
    setTimeout(() => { if (dialog.open) heading.focus(); }, 0);
  } else {
    dialog.querySelector('input, button, select')?.focus();
  }
  if (window.parent !== window) window.parent.postMessage({
    channel: 'bolto-visual-preview', type: 'dialog-open', top: dialog.getBoundingClientRect().top,
  }, '*');
}
function closeDialog() {
  clearAnnouncements();
  dialog.close();
  pendingRoleSetupId = null;
  if (dialogOpener?.isConnected) dialogOpener.focus({ preventScroll: true });
}
function showTemplateDialog(opener) {
  pendingTemplate = { worker: state.worker, format: state.format };
  state.templateGuide = { control: '', relationship: '' };
  state.guideOpen = false;
  const content = `<div class="dialog-header"><div><h2 id="dialog-heading">Change the template</h2><p id="dialog-description">Your shared details stay. Only fields that differ will need another look.</p></div><button type="button" class="icon-button" data-action="close-dialog" aria-label="Close template picker">${icon('close')}</button></div>
    ${templateOptions(pendingTemplate.worker, pendingTemplate.format, true)}
    <div class="dialog-note" id="template-change-detail">${templateChangeDescription()}</div>
    <div class="dialog-actions">${btn('Keep current template', 'close-dialog', 'secondary')}${btn('Use this template', 'apply-template', 'primary')}</div>`;
  openDialog(content, opener);
}
function templateChangeDescription() {
  if (pendingTemplate.worker === state.worker) return 'Standard and Concise use the same fields in this demo. Only the letter wording changes.';
  return pendingTemplate.worker === 'contractor'
    ? 'For this contractor template, Candidate & role adds an end date. Hire setup skips FLSA, I-9 and payroll group. Shared candidate, role and pay details stay.'
    : 'For this W-2 template, Role asks for full-time or part-time. Hire setup asks for FLSA, I-9 and payroll group. Shared details stay.';
}
function refreshPendingTemplate() {
  dialog.querySelectorAll('[data-template-worker]').forEach(input => { input.checked = input.dataset.templateWorker === pendingTemplate.worker; });
  dialog.querySelector('[id="template-change-detail"]').textContent = templateChangeDescription();
  dialog.querySelectorAll('[data-template-caption]').forEach(node => {
    node.textContent = pendingTemplate.worker === 'contractor' ? 'Contractor agreement' : 'Employee offer';
  });
}
function snapshot() {
  return { version: 2, data: { ...state.data }, sample: state.sample, worker: state.worker, format: state.format, roleSetupId: state.roleSetupId, checks: [...state.checks], visited: [...state.visited], screen: state.screen, savedAt: new Date().toISOString() };
}
function validSnapshot(value) {
  return value && [1, 2].includes(value.version) && value.data
    && Object.entries(BLANK).every(([key, defaultValue]) => value.version === 1 && STRUCTURED_TERM_FIELDS.includes(key) || typeof value.data[key] === typeof defaultValue)
    && ['alex', 'priya'].includes(value.sample) && ['employee', 'contractor'].includes(value.worker)
    && (value.roleSetupId == null || SAVED_ROLE_SETUPS.some(setup => setup.id === value.roleSetupId && setup.worker === value.worker))
    && ['standard', 'concise'].includes(value.format) && SCREEN_ORDER.slice(0, -1).includes(canonicalScreen(value.screen))
    && Array.isArray(value.checks) && value.checks.every(key => Object.hasOwn(FIELDS, key)) && typeof value.savedAt === 'string'
    && (value.visited == null || (Array.isArray(value.visited) && value.visited.every(id => SECTIONS.some(section => section.id === canonicalScreen(id)))));
}
function upgradeSnapshot(value) {
  if (!validSnapshot(value)) throw new Error('The saved draft has an unsupported format.');
  if (value.version === 2) return { ...value, roleSetupId: value.roleSetupId || null, screen: canonicalScreen(value.screen) };
  const data = { ...BLANK, ...value.data };
  // Only the exact earlier demo clause is safe to convert without changing its meaning.
  const knownRepayment = /^Repaid if the hire leaves within ([1-9]\d*) months? of their start date\.$/.exec(data.repayment);
  if (knownRepayment && positiveWholeNumber(knownRepayment[1])) {
    data.repaymentMonths = knownRepayment[1];
    data.repayment = '';
  }
  const replacements = { repayment: ['repaymentMonths'], equityDetails: ['equityShares', 'equityVestingMonths'] };
  const checks = [...new Set(value.checks.flatMap(key => replacements[key] || [key]))];
  return { ...value, version: 2, data, checks, roleSetupId: value.roleSetupId || null, screen: canonicalScreen(value.screen) };
}
function saveDraft() {
  const applied = applyOpenEdit();
  const draft = snapshot();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    if (localStorage.getItem(STORAGE_KEY) !== JSON.stringify(draft)) throw new Error('The saved draft could not be verified.');
  } catch (error) {
    console.error('Draft storage failed:', error);
    if (applied) render();
    toast('This browser could not save the draft. Keep this page open; your entries are still here.', true);
    return;
  }
  savedSnapshot = draft;
  state.savedAt = draft.savedAt;
  state.dirty = false;
  state.lastScreen = state.screen;
  navigate('saved');
  announce('Draft saved in this browser. Resume the offer to continue.');
}
function resumeDraft() {
  let draft;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error('No saved draft was found.');
    draft = upgradeSnapshot(JSON.parse(raw));
  } catch (error) {
    console.error('Draft restore failed:', error);
    toast('The saved draft could not be read. Your current entries have not been changed.', true);
    return;
  }
  savedSnapshot = draft;
  Object.assign(state, { data: { ...draft.data }, sample: draft.sample, worker: draft.worker, format: draft.format, roleSetupId: draft.roleSetupId, checks: [...draft.checks], visited: new Set((draft.visited || []).map(canonicalScreen)), savedAt: draft.savedAt, dirty: false, editor: null });
  navigate(draft.screen);
  if (draft.data.repayment || draft.data.equityDetails) {
    toast('Draft restored. Your earlier custom wording is kept in Compensation. Check the new template values before sending.');
  } else {
    announce(`Draft restored at ${META[draft.screen][0]}. ${issueSummary()}.`);
  }
}
function simulateSend() {
  applyOpenEdit();
  if (issues().length) { firstIssue(); return; }
  state.sent = { data: { ...state.data }, worker: state.worker, format: state.format };
  navigate('sent');
  announce(`Demo offer sent to ${candidateName(state.sent.data)} at ${state.sent.data.email}. No real email was sent.`);
}
function loadPreset(preset, sample = state.sample) {
  if (!['empty', 'partial', 'invalid', 'ready'].includes(preset) || !['alex', 'priya'].includes(sample)) throw new Error('Unsupported preview example.');
  state.sample = sample;
  state.worker = sample === 'priya' ? 'contractor' : 'employee';
  state.data = sampleData(sample);
  state.preset = preset;
  state.checks = [];
  state.touched = new Set();
  editedFields = new Set();
  state.showAllErrors = preset === 'invalid';
  state.editor = null;
  state.templateNotice = '';
  state.templateGuide = { control: '', relationship: '' };
  state.guideOpen = false;
  state.savedAt = null;
  state.dirty = false;
  state.sent = null;
  state.roleSetupId = null;
  clearAnnouncements();
  document.getElementById('toast').hidden = true;
  const section = SECTIONS.some(item => item.id === state.screen) ? state.screen : null;
  if (section === 'candidate') {
    state.data = candidateEntryData(sample);
    state.showAllErrors = false;
  }
  if (preset === 'empty') {
    if (!section) state.data = { ...BLANK };
    else {
      (section === 'candidate' ? CANDIDATE_ROLE_FIELDS : requiredFields(section)).forEach(key => { state.data[key] = ''; });
      if (section === 'compensation') Object.assign(state.data, { bonusEnabled: false, equityEnabled: false, repaymentMonths: '', equityShares: '', equityVestingMonths: '', repayment: '', equityDetails: '' });
      if (section === 'terms') state.data.note = '';
    }
  }
  if (preset === 'partial') {
    const gaps = {
      candidate: ['department'],
      compensation: ['bonusAmount', 'repaymentMonths'], hire: ['flsa', 'payroll'], terms: ['expiry'],
    };
    if (section === 'compensation') state.data.bonusEnabled = true;
    (section ? gaps[section] : ['startDate', 'flsa', 'expiry']).forEach(key => { state.data[key] = ''; });
  }
  if (preset === 'invalid') {
    const key = { candidate: 'email', compensation: 'amount', hire: 'flsa', terms: 'expiry' }[section] || (state.screen === 'review' ? 'email' : 'amount');
    const value = { email: state.data.email.split('@')[0] + '@', startDate: '2026-05-01', endDate: '2026-06-01', amount: '-150000', flsa: '', expiry: '2026-05-01' }[key];
    state.data[key] = value;
    if (section === 'candidate') state.touched.add(key);
  }
  if (state.screen === 'sent') state.sent = { data: sampleData(sample), worker: state.worker, format: state.format };
  render();
  document.querySelectorAll('[data-review-scroll]').forEach(node => { node.scrollTop = 0; });
  lastStatusAnnounced = sectionStatus();
  announce(`${preset === 'ready' ? 'Filled' : preset} example loaded. ${META[state.screen][0]}.`);
}
function reportView() {
  if (window.parent !== window) window.parent.postMessage({
    channel: 'bolto-visual-preview', type: 'view', screen: state.screen, sample: state.sample,
    preset: state.preset, height: Math.ceil(app.getBoundingClientRect().height), issues: issues().length,
  }, '*');
}
function fillSection() {
  const values = sampleData(state.worker === 'contractor' ? 'priya' : 'alex');
  const section = state.screen;
  if (!SECTIONS.some(item => item.id === section)) return;
  const keyGroups = {
    candidate: CANDIDATE_ROLE_FIELDS,
    compensation: ['payType', 'amount', 'bonusEnabled', 'bonusAmount', 'repaymentMonths', 'equityEnabled', 'equityShares', 'equityVestingMonths', 'repayment', 'equityDetails'],
    hire: ['flsa', 'i9', 'payroll', 'autoInvite'], terms: ['expiry', 'sender', 'note'],
  };
  keyGroups[section].forEach(key => { state.data[key] = values[key]; });
  state.checks = state.checks.filter(key => !keyGroups[section].includes(key));
  markChanged();
  render('section-heading');
  announce(`Example ${META[section][0].toLowerCase()} added. ${issueSummary()}.`);
}

document.addEventListener('pointerdown', event => {
  pointerActionTarget = event.target.closest('button, a[href]');
}, true);
document.addEventListener('click', () => { pointerActionTarget = null; });
document.addEventListener('pointercancel', () => { pointerActionTarget = null; });
document.addEventListener('keydown', () => { pointerActionTarget = null; }, true);
// WebKit drops :focus-visible when arrow keys move between radios, so track keyboard use for the choice-card ring.
document.addEventListener('keydown', event => {
  if (!event.metaKey && !event.ctrlKey) document.documentElement.dataset.input = 'keyboard';
}, true);
document.addEventListener('pointerdown', () => { document.documentElement.dataset.input = 'pointer'; }, true);
// Enter also selects the focused radio option; on an already-selected option it keeps its normal job (e.g. saving an inline edit).
document.addEventListener('keydown', event => {
  const input = event.target;
  if (event.key !== 'Enter' || !(input instanceof HTMLInputElement) || input.type !== 'radio' || input.checked || input.disabled) return;
  event.preventDefault();
  input.click();
});
app.addEventListener('focusin', event => {
  const target = event.target;
  if (!target.matches('button, a[href], input, select, textarea, summary')) return;
  requestAnimationFrame(() => {
    if (document.activeElement !== target || !target.isConnected) return;
    const footer = document.getElementById('app-footer');
    if (footer?.contains(target)) return;
    const pane = target.closest('[data-review-scroll]');
    const clippedPane = pane && getComputedStyle(pane).overflowY !== 'visible' ? pane.getBoundingClientRect() : null;
    const top = Math.max(0, clippedPane?.top || 0);
    const bottom = Math.min(innerHeight, footer?.getBoundingClientRect().top ?? innerHeight, clippedPane?.bottom ?? innerHeight);
    const bounds = target.getBoundingClientRect();
    if (bounds.top < top + 4 || bounds.bottom > bottom - 4 || bounds.left < 0 || bounds.right > innerWidth) revealField(target);
  });
});
app.addEventListener('input', event => {
  const input = event.target;
  if (!input.matches('[data-field]') || input.type === 'radio' || input.type === 'checkbox' || input.tagName === 'SELECT') return;
  setValue(input.dataset.field, input.value);
  editedFields.add(input.dataset.field);
  refreshFieldError(input.dataset.field);
  refreshDerived();
});
app.addEventListener('focusout', event => {
  const input = event.target;
  if (!input.matches('[data-field]')) return;
  // Radios and switches validate on change; checking on focusout would read the value before the new choice lands.
  if (input.type === 'radio' || input.type === 'checkbox') return;
  if (!editedFields.has(input.dataset.field) && !state.touched.has(input.dataset.field)) return;
  state.touched.add(input.dataset.field);
  // Safari clicks need the pointer target because buttons do not necessarily receive focus.
  const destination = event.relatedTarget || pointerActionTarget;
  if (destination?.closest('.inline-actions, [data-action="edit-letter-field"], [data-action="edit-row"], [data-action="change-template"], [data-action="navigate"], [data-action="save-draft"], [data-action="send-offer"], [data-action="continue"], [data-action="previous"], [data-action="open-role-setup"]')) return;
  refreshFieldError(input.dataset.field);
  refreshDerived();
  const error = requiredFields().includes(input.dataset.field) ? inputProblem(input.dataset.field) : '';
  if (error) announce(error);
  else announceStatusIfChanged();
});
app.addEventListener('change', event => {
  const input = event.target;
  if (input.matches('[data-guide-input]')) { updateTemplateGuide(input); return; }
  if (input.matches('[data-template-worker]')) {
    applyTemplate(input.dataset.templateWorker, state.format);
    render();
    document.querySelector(`[data-template-worker="${state.worker}"]`)?.focus({ preventScroll: true });
    return;
  }
  if (input.matches('[data-template-format]')) {
    applyTemplate(state.worker, input.dataset.templateFormat);
    render();
    document.querySelector(`[data-template-format="${state.format}"]`)?.focus({ preventScroll: true });
    return;
  }
  if (!input.matches('[data-field]')) return;
  const key = input.dataset.field;
  if (input.type !== 'checkbox' && input.type !== 'radio' && input.tagName !== 'SELECT') return;
  setValue(key, input.type === 'checkbox' ? input.checked : input.value);
  state.touched.add(key);
  const targetId = input.id;
  render(targetId);
  if (!targetId) document.querySelector(`[data-field="${key}"]`)?.focus({ preventScroll: true });
  if (key === 'autoInvite') announce(`Bolto invitation ${input.checked ? 'on. The hire is invited after signing.' : 'off. Invite them separately.'}`);
  else if (state.screen === 'candidate' && key !== 'manager') announceStatusIfChanged();
});
app.addEventListener('submit', event => {
  event.preventDefault();
  if (event.target.id === 'inline-form') saveEditor();
  else if (event.target.id === 'offer-form') continueSection();
});
app.addEventListener('keydown', event => {
  if (event.key === 'Escape' && state.editor) { event.preventDefault(); cancelEditor(); }
});
// Empty fields don't block Continue (Send is the gate); they're flagged on the section left behind. Wrong values stop here.
function continueSection() {
  const section = state.screen;
  const index = SECTIONS.findIndex(item => item.id === section);
  const label = META[section][0];
  const remaining = issues(section);
  requiredFields(section).forEach(key => state.touched.add(key));
  const invalid = remaining.filter(issue => issue.type === 'invalid');
  if (invalid.length) {
    render();
    focusField(invalid[0].key);
    announce(`${label}: ${issueSummary(section, invalid)}. ${invalid[0].message}`, true);
    return;
  }
  navigate(index === SECTIONS.length - 1 ? 'review' : SECTIONS[index + 1].id);
  if (remaining.length) announce(`${label} has ${issueSummary(section)}. You can finish ${remaining.length === 1 ? 'it' : 'them'} before sending.`);
}
function handleAction(button) {
  const action = button.dataset.action;
  if (action === 'navigate') navigate(button.dataset.screen);
  else if (action === 'use-template') { state.templateNotice = ''; navigate('candidate'); }
  else if (action === 'use-template-suggestion') {
    const result = templateSuggestion();
    if (!result.worker) { toast('Answer both questions with a clear working arrangement before selecting a suggestion.', true); return; }
    const guide = button.closest('[data-guide-scope]');
    state.guideOpen = false;
    if (guide.dataset.guideScope === 'pending') {
      pendingTemplate.worker = result.worker;
      refreshPendingTemplate();
      setDisclosure(guide, false);
      dialog.querySelector(`[data-template-worker="${result.worker}"]`).focus();
      announce(`${result.worker === 'employee' ? 'Employee' : 'Contractor'} selected. Use this template to confirm the change.`);
    } else {
      applyTemplate(result.worker, state.format);
      render();
      document.querySelector(`[data-template-worker="${result.worker}"]`).focus({ preventScroll: true });
      announce(`${templateName()} selected. Review the letter, then choose Use template.`);
    }
  }
  else if (action === 'library-bolto' || action === 'library-company') {
    state.templateLibrary = action === 'library-company' ? 'company' : 'bolto';
    render();
    document.querySelector(`[data-action="${action}"]`)?.focus({ preventScroll: true });
  }
  else if (action === 'continue') continueSection();
  else if (action === 'previous') {
    const index = SECTIONS.findIndex(section => section.id === state.screen);
    navigate(index === 0 ? 'template' : SECTIONS[index - 1].id);
  }
  else if (action === 'review') navigate('review');
  else if (action === 'back-details') navigate('terms');
  else if (action === 'mobile-details' || action === 'mobile-letter') {
    state.mobilePanel = action.slice(7);
    applyMobileVisibility();
    reportView();
  }
  else if (action === 'toggle-preview-highlights') {
    state.previewHighlights = !state.previewHighlights;
    button.closest('.preview-column').dataset.previewHighlights = String(state.previewHighlights);
    button.setAttribute('aria-checked', String(state.previewHighlights));
    button.querySelector('.switch-state').textContent = state.previewHighlights ? 'On' : 'Off';
    refreshDerived();
    announce(`Filled-in field highlights ${state.previewHighlights ? 'shown' : 'hidden'}. Missing-value and error warnings remain visible and editable.`);
  }
  else if (action === 'edit-letter-field') {
    const key = button.dataset.previewField;
    const row = summaryRowForField(key);
    if (!row) {
      toast('This value has no matching editor. Open its form section or summary row instead.', true);
      return;
    }
    if (state.screen === 'review') {
      openEditor(row.id, key);
    } else {
      if (state.screen !== row.section) navigate(row.section);
      if (focusField(key)) announce(`Editing ${FIELDS[key].toLowerCase()} in ${META[row.section][0]}.`);
    }
  }
  else if (action === 'edit-row') openEditor(button.dataset.row);
  else if (action === 'toggle-disclosure') setDisclosure(button.closest('.explanation'), button.getAttribute('aria-expanded') !== 'true');
  else if (action === 'use-recommendation') {
    const { key, value } = button.dataset;
    if (!ROW_HELP[key]) throw new Error(`No recommendation exists for: ${key}`);
    setValue(key, value);
    state.touched.add(key);
    state.checks = state.checks.filter(item => item !== key);
    render();
    const target = document.getElementById(`field-${key}`) || document.querySelector(`[data-action="toggle-row-help"][data-row="${key}"]`);
    target?.focus({ preventScroll: true });
    announce(`${FIELDS[key]} set to ${value}. ${issueSummary()}.`);
  }
  else if (action === 'toggle-row-help') {
    const id = button.dataset.row;
    const region = document.getElementById(`row-${id}-help`);
    if (!ROW_HELP[id] || !region) throw new Error(`No explanation exists for summary row: ${id}`);
    const open = !openRowHelp.has(id);
    if (open) openRowHelp.add(id); else openRowHelp.delete(id);
    region.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
  }
  else if (action === 'cancel-edit') cancelEditor();
  else if (action === 'first-issue') firstIssue();
  else if (action === 'fill-section') fillSection();
  else if (action === 'confirm-field') {
    const key = button.dataset.key;
    if (inputProblem(key)) {
      state.touched.add(key);
      refreshFieldError(key);
      focusField(key);
      announce(inputProblem(key), true);
    } else {
      state.checks = state.checks.filter(item => item !== key);
      markChanged();
      render('section-heading');
      announce(`${FIELDS[key]} confirmed. ${issueSummary()}.`);
    }
  }
  else if (action === 'dismiss-template-notice') { state.templateNotice = ''; render('screen-heading'); }
  else if (action === 'change-template') showTemplateDialog(button);
  else if (action === 'open-role-setup') showRoleSetupDialog(button);
  else if (action === 'apply-role-setup') {
    const setup = roleSetup(pendingRoleSetupId);
    applySavedRoleSetup(setup.id);
    closeDialog();
    render('use-role-setup');
    revealField(document.getElementById('use-role-setup'));
    announce(`${setup.name} applied. Candidate details, dates, pay and hire setup are unchanged. ${candidateEntryStatus()}.`);
  }
  else if (action === 'close-dialog') closeDialog();
  else if (action === 'apply-template') {
    const source = dialogOpener?.dataset.templateSource;
    applyTemplate(pendingTemplate.worker, pendingTemplate.format);
    closeDialog();
    render();
    const target = source
      ? document.querySelector(`[data-template-source="${source}"]`)
      : document.querySelector('.heading-side [data-action="change-template"]');
    if (target) {
      target.focus({ preventScroll: true });
      revealField(target);
    } else {
      document.getElementById('screen-heading')?.focus({ preventScroll: true });
    }
    announce(`Template changed to ${templateName()}. Shared entries kept. ${issueSummary()}.`);
  }
  else if (action === 'save-draft') saveDraft();
  else if (action === 'resume-draft') resumeDraft();
  else if (action === 'send-offer') simulateSend();
  else if (action === 'view-sent') {
    const sent = state.sent || { data: sampleData(state.sample), worker: state.worker, format: state.format };
    openDialog(`<div class="dialog-header"><div><h2 id="dialog-heading">Sent offer</h2><p>Demo copy for ${esc(candidateName(sent.data))}.</p></div><button type="button" class="icon-button" data-action="close-dialog" aria-label="Close sent offer">${icon('close')}</button></div>${letterHTML(sent.data, sent.worker, sent.format)}`, button);
  }
  else if (action === 'new-offer') {
    state.data = { ...BLANK };
    state.worker = 'employee';
    state.format = 'standard';
    state.checks = [];
    state.sent = null;
    state.roleSetupId = null;
    state.touched = new Set();
    editedFields = new Set();
    state.showAllErrors = false;
    state.templateNotice = '';
    state.templateGuide = { control: '', relationship: '' };
    state.guideOpen = false;
    state.preset = 'empty';
    state.savedAt = null;
    state.dirty = false;
    state.visited = new Set();
    navigate('template');
  }
}
app.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (button) handleAction(button);
});
dialog.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (button) handleAction(button);
});
dialog.addEventListener('change', event => {
  if (event.target.matches('[data-role-setup]')) { refreshRoleSetupPreview(event.target.dataset.roleSetup); return; }
  if (event.target.matches('[data-guide-input]')) { updateTemplateGuide(event.target); return; }
  if (event.target.matches('[data-template-worker]')) pendingTemplate.worker = event.target.dataset.templateWorker;
  if (event.target.matches('[data-template-format]')) pendingTemplate.format = event.target.dataset.templateFormat;
  refreshPendingTemplate();
});
dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
dialog.addEventListener('keydown', event => {
  if (event.key === 'Escape') { event.preventDefault(); closeDialog(); }
  if (event.key !== 'Tab') return;
  const candidates = [...dialog.querySelectorAll('a[href], button, input, select, textarea, summary, [tabindex]')]
    .filter(node => !node.matches(':disabled') && node.tabIndex >= 0 && node.getClientRects().length);
  const stops = candidates.filter(node => {
    if (!node.matches('input[type="radio"]') || !node.name) return true;
    const group = candidates.filter(other => other.matches('input[type="radio"]') && other.name === node.name);
    return node === (group.find(other => other.checked) || group[0]);
  });
  const first = stops[0], last = stops[stops.length - 1];
  if (!first) { event.preventDefault(); dialog.focus(); }
  else if (event.shiftKey && (document.activeElement === first || !stops.includes(document.activeElement))) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first.focus();
  }
});
dialog.addEventListener('close', () => {
  if (window.parent !== window) window.parent.postMessage({ channel: 'bolto-visual-preview', type: 'dialog-close' }, '*');
});
mobileQuery.addEventListener('change', () => {
  const focusedPane = document.activeElement.closest('[data-mobile-pane]');
  if (mobileQuery.matches && focusedPane) state.mobilePanel = focusedPane.dataset.mobilePane;
  applyMobileVisibility();
  reportView();
});
window.addEventListener('message', event => {
  if (event.source !== window.parent || event.data?.channel !== 'bolto-visual-preview') return;
  const message = event.data;
  if (message.type === 'navigate' && SCREEN_ORDER.includes(canonicalScreen(message.screen))) {
    if (message.screen === 'sent') state.sent = { data: sampleData(state.sample), worker: state.sample === 'priya' ? 'contractor' : 'employee', format: state.format };
    navigate(message.screen);
  } else if (message.type === 'preset' && ['empty', 'partial', 'invalid', 'ready'].includes(message.preset)) {
    loadPreset(message.preset);
  } else if (message.type === 'sample' && ['alex', 'priya'].includes(message.sample)) {
    loadPreset('ready', message.sample);
  } else if (message.type === 'reset') {
    state.screen = 'template';
    state.format = 'standard';
    state.templateLibrary = 'bolto';
    state.visited = new Set();
    loadPreset('ready', state.sample);
  } else if (message.type === 'resume') {
    resumeDraft();
  }
});
new ResizeObserver(reportView).observe(app);
render();
try {
  const draft = localStorage.getItem(STORAGE_KEY);
  if (draft) {
    savedSnapshot = upgradeSnapshot(JSON.parse(draft));
    refreshDerived();
  }
} catch (error) {
  console.error('Saved draft lookup failed:', error);
  toast('Saved drafts are unavailable in this browser. You can still explore every screen.', true);
}
if (initialPreset) loadPreset(initialPreset);
document.fonts.ready.then(reportView);
