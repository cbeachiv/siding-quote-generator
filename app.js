// === State ===
const STORAGE_KEYS = {
  materials: 'sqg_materials',
  extras: 'sqg_extras',
};

let materials = loadFromStorage(STORAGE_KEYS.materials) || [
  { name: 'Vinyl', materialCost: 0, laborCost: 0 },
  { name: 'Fiber Cement (HardiePlank)', materialCost: 0, laborCost: 0 },
  { name: 'LP SmartSide', materialCost: 0, laborCost: 0 },
  { name: 'Cedar', materialCost: 0, laborCost: 0 },
  { name: 'Aluminum', materialCost: 0, laborCost: 0 },
];

let extrasRates = loadFromStorage(STORAGE_KEYS.extras) || {
  windows:        { material: 0, labor: 0 },
  doors:          { material: 0, labor: 0 },
  trim:           { material: 0, labor: 0 },
  outsideCorners: { material: 0, labor: 0 },
  insideCorners:  { material: 0, labor: 0 },
  jChannel:       { material: 0, labor: 0 },
  soffits:        { material: 0, labor: 0 },
  fascia:         { material: 0, labor: 0 },
  tearoff:        { material: 0, labor: 0 },
};

let sectionCounter = 0;

// === Helpers ===
function loadFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatCurrency(amount) {
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// === Settings: Materials ===
function renderMaterials() {
  const list = document.getElementById('materials-list');
  list.innerHTML = '';
  materials.forEach((mat, i) => {
    const item = document.createElement('div');
    item.className = 'material-item';
    item.innerHTML = `
      <span class="mat-label">${escapeHtml(mat.name)}</span>
      <span class="mat-info">Material: $${mat.materialCost.toFixed(2)}/sqft</span>
      <span class="mat-info">Labor: $${mat.laborCost.toFixed(2)}/sqft</span>
      <button class="btn-remove" data-index="${i}" title="Remove">&times;</button>
    `;
    list.appendChild(item);
  });
  // Update all section material dropdowns
  updateMaterialDropdowns();
  recalculate();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.getElementById('add-material-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('mat-name').value.trim();
  const cost = parseFloat(document.getElementById('mat-cost').value) || 0;
  const labor = parseFloat(document.getElementById('mat-labor').value) || 0;
  if (!name) return;
  materials.push({ name, materialCost: cost, laborCost: labor });
  saveToStorage(STORAGE_KEYS.materials, materials);
  renderMaterials();
  this.reset();
});

document.getElementById('materials-list').addEventListener('click', function(e) {
  if (e.target.classList.contains('btn-remove')) {
    const index = parseInt(e.target.dataset.index, 10);
    materials.splice(index, 1);
    saveToStorage(STORAGE_KEYS.materials, materials);
    renderMaterials();
  }
});

// === Settings: Extras ===
function loadExtrasUI() {
  document.querySelectorAll('.extras-config-table input').forEach(input => {
    const extra = input.dataset.extra;
    const field = input.dataset.field;
    if (extrasRates[extra]) {
      input.value = extrasRates[extra][field] || '';
    }
  });
}

document.getElementById('save-extras').addEventListener('click', function() {
  document.querySelectorAll('.extras-config-table input').forEach(input => {
    const extra = input.dataset.extra;
    const field = input.dataset.field;
    if (!extrasRates[extra]) extrasRates[extra] = { material: 0, labor: 0 };
    extrasRates[extra][field] = parseFloat(input.value) || 0;
  });
  saveToStorage(STORAGE_KEYS.extras, extrasRates);
  recalculate();
  showSaveConfirmation(this);
});

function showSaveConfirmation(btn) {
  const original = btn.textContent;
  btn.textContent = 'Saved!';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
  }, 1500);
}

// === Settings Toggle ===
document.getElementById('settings-toggle').addEventListener('click', function() {
  const content = document.getElementById('settings-content');
  this.classList.toggle('collapsed');
  content.classList.toggle('hidden');
});

// === Sections ===
function addSection(name, materialIndex, sqft) {
  sectionCounter++;
  const id = sectionCounter;
  const container = document.getElementById('sections-container');
  const card = document.createElement('div');
  card.className = 'section-card';
  card.dataset.sectionId = id;
  card.innerHTML = `
    <button class="btn-remove-section" data-section-id="${id}" title="Remove section">&times;</button>
    <div class="section-header">
      <input type="text" class="section-name" placeholder="Section name (e.g., Front Wall)" value="${escapeHtml(name || '')}">
    </div>
    <div class="section-fields">
      <div>
        <label>Material</label>
        <select class="section-material">
          ${materialOptionsHtml(materialIndex)}
        </select>
      </div>
      <div>
        <label>Square Footage</label>
        <input type="number" class="section-sqft" min="0" step="0.1" value="${sqft || ''}" placeholder="0">
      </div>
    </div>
  `;
  container.appendChild(card);

  // Bind events for live recalculation
  card.querySelector('.section-material').addEventListener('change', recalculate);
  card.querySelector('.section-sqft').addEventListener('input', recalculate);
  card.querySelector('.section-name').addEventListener('input', recalculate);
  card.querySelector('.btn-remove-section').addEventListener('click', function() {
    card.remove();
    recalculate();
  });

  recalculate();
}

function materialOptionsHtml(selectedIndex) {
  if (materials.length === 0) {
    return '<option value="-1">No materials configured</option>';
  }
  return materials.map((m, i) =>
    `<option value="${i}" ${i === selectedIndex ? 'selected' : ''}>${escapeHtml(m.name)}</option>`
  ).join('');
}

function updateMaterialDropdowns() {
  document.querySelectorAll('.section-material').forEach(select => {
    const current = parseInt(select.value, 10);
    select.innerHTML = materialOptionsHtml(current >= 0 && current < materials.length ? current : 0);
  });
}

document.getElementById('add-section').addEventListener('click', function() {
  addSection('', 0, '');
});

// === Tear-off toggle ===
document.getElementById('tearoff-enabled').addEventListener('change', function() {
  document.getElementById('extra-tearoff').disabled = !this.checked;
  recalculate();
});

// === Live Recalculation ===
// Bind all extras inputs and margin input
document.querySelectorAll('[data-extra-input]').forEach(input => {
  input.addEventListener('input', recalculate);
});
document.getElementById('profit-margin').addEventListener('input', recalculate);
document.getElementById('customer-name').addEventListener('input', recalculate);

function recalculate() {
  const sections = getSections();
  const extras = getExtrasInputs();
  const margin = parseFloat(document.getElementById('profit-margin').value) || 0;
  const customerName = document.getElementById('customer-name').value.trim();

  // Calculate section costs
  let totalSidingMaterial = 0;
  let totalSidingLabor = 0;
  const sectionRows = [];

  sections.forEach(s => {
    if (s.materialIndex < 0 || s.materialIndex >= materials.length || !s.sqft) return;
    const mat = materials[s.materialIndex];
    const matCost = s.sqft * mat.materialCost;
    const labCost = s.sqft * mat.laborCost;
    totalSidingMaterial += matCost;
    totalSidingLabor += labCost;
    sectionRows.push({
      label: `Siding — ${mat.name}${s.name ? ' (' + s.name + ')' : ''} — ${s.sqft.toLocaleString()} sq ft`,
      material: matCost,
      labor: labCost,
    });
  });

  // Calculate extras costs
  const extrasRows = [];
  const extrasDefs = [
    { key: 'windows',        label: 'Windows',          unit: 'units',     inputId: 'windows' },
    { key: 'doors',          label: 'Doors',            unit: 'units',     inputId: 'doors' },
    { key: 'trim',           label: 'Trim',             unit: 'linear ft', inputId: 'trim' },
    { key: 'outsideCorners', label: 'Outside Corners',  unit: 'linear ft', inputId: 'outsideCorners' },
    { key: 'insideCorners',  label: 'Inside Corners',   unit: 'linear ft', inputId: 'insideCorners' },
    { key: 'jChannel',       label: 'J-Channel',        unit: 'linear ft', inputId: 'jChannel' },
    { key: 'soffits',        label: 'Soffits',          unit: 'sq ft',     inputId: 'soffits' },
    { key: 'fascia',         label: 'Fascia',           unit: 'linear ft', inputId: 'fascia' },
    { key: 'tearoff',        label: 'Tear-off/Removal', unit: 'sq ft',     inputId: 'tearoff' },
  ];

  let totalExtrasMaterial = 0;
  let totalExtrasLabor = 0;

  extrasDefs.forEach(def => {
    const qty = extras[def.inputId] || 0;
    if (qty <= 0) return;
    if (def.key === 'tearoff' && !document.getElementById('tearoff-enabled').checked) return;

    const rate = extrasRates[def.key] || { material: 0, labor: 0 };
    const matCost = qty * rate.material;
    const labCost = qty * rate.labor;
    totalExtrasMaterial += matCost;
    totalExtrasLabor += labCost;
    extrasRows.push({
      label: `${def.label} — ${qty.toLocaleString()} ${def.unit}`,
      material: matCost,
      labor: labCost,
    });
  });

  const totalMaterial = totalSidingMaterial + totalExtrasMaterial;
  const totalLabor = totalSidingLabor + totalExtrasLabor;
  const totalCost = totalMaterial + totalLabor;

  // Margin calculation: Quote = Cost / (1 - margin/100)
  const marginDecimal = Math.min(margin, 99) / 100;
  const quotePrice = marginDecimal < 1 ? totalCost / (1 - marginDecimal) : totalCost;
  const profitAmount = quotePrice - totalCost;

  // Render summary
  renderSummary(customerName, sectionRows, extrasRows, totalMaterial, totalLabor, totalCost, margin, profitAmount, quotePrice);
}

function getSections() {
  const cards = document.querySelectorAll('.section-card');
  return Array.from(cards).map(card => ({
    name: card.querySelector('.section-name').value.trim(),
    materialIndex: parseInt(card.querySelector('.section-material').value, 10),
    sqft: parseFloat(card.querySelector('.section-sqft').value) || 0,
  }));
}

function getExtrasInputs() {
  const result = {};
  document.querySelectorAll('[data-extra-input]').forEach(input => {
    result[input.dataset.extraInput] = parseFloat(input.value) || 0;
  });
  return result;
}

function renderSummary(customerName, sectionRows, extrasRows, totalMaterial, totalLabor, totalCost, margin, profitAmount, quotePrice) {
  // Customer display
  const custDisplay = document.getElementById('customer-display');
  custDisplay.textContent = customerName ? `Customer: ${customerName}` : '';

  const tbody = document.getElementById('summary-body');
  const tfoot = document.getElementById('summary-foot');
  tbody.innerHTML = '';
  tfoot.innerHTML = '';

  const allRows = [...sectionRows, ...extrasRows];

  if (allRows.length === 0 && totalCost === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="empty-summary">Add sections and extras above to see your quote.</td></tr>`;
    return;
  }

  // Line items
  allRows.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(row.label)}</td>
      <td class="amount">${formatCurrency(row.material)}</td>
      <td class="amount">${formatCurrency(row.labor)}</td>
      <td class="amount">${formatCurrency(row.material + row.labor)}</td>
    `;
    tbody.appendChild(tr);
  });

  // Totals in tfoot
  tfoot.innerHTML = `
    <tr class="subtotal">
      <td>Total Material Cost</td>
      <td class="amount" colspan="2"></td>
      <td class="amount">${formatCurrency(totalMaterial)}</td>
    </tr>
    <tr class="subtotal">
      <td>Total Labor Cost</td>
      <td class="amount" colspan="2"></td>
      <td class="amount">${formatCurrency(totalLabor)}</td>
    </tr>
    <tr class="subtotal">
      <td>Total Cost</td>
      <td class="amount" colspan="2"></td>
      <td class="amount">${formatCurrency(totalCost)}</td>
    </tr>
    <tr class="margin-row-display">
      <td>Profit (${margin}% margin)</td>
      <td class="amount" colspan="2"></td>
      <td class="amount">${formatCurrency(profitAmount)}</td>
    </tr>
    <tr class="grand-total">
      <td>Quote Price</td>
      <td class="amount" colspan="2"></td>
      <td class="amount">${formatCurrency(quotePrice)}</td>
    </tr>
  `;
}

// === Clear Quote ===
document.getElementById('clear-quote').addEventListener('click', function() {
  document.getElementById('customer-name').value = '';
  document.getElementById('sections-container').innerHTML = '';
  document.querySelectorAll('[data-extra-input]').forEach(input => { input.value = 0; });
  document.getElementById('tearoff-enabled').checked = false;
  document.getElementById('extra-tearoff').disabled = true;
  document.getElementById('profit-margin').value = 30;
  sectionCounter = 0;
  addSection('', 0, '');
});

// === Print ===
document.getElementById('print-quote').addEventListener('click', function() {
  window.print();
});

// === Init ===
function init() {
  renderMaterials();
  loadExtrasUI();
  // Start with settings collapsed
  document.getElementById('settings-toggle').classList.add('collapsed');
  document.getElementById('settings-content').classList.add('hidden');
  // Add one default section
  addSection('', 0, '');
}

init();
