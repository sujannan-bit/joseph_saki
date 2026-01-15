const DB_KEY = 'MI_FOOD_FINAL_DB_V4';
const PICKY_KEY = 'SAKI_PICKY_V4';

let rests = JSON.parse(localStorage.getItem(DB_KEY)) || [];
let picky = JSON.parse(localStorage.getItem(PICKY_KEY)) || [];
let currentTab = 'all';

document.addEventListener('DOMContentLoaded', () => {
  renderRests();
  renderPicky();
});

// --- 餐廳管理 ---
function setTab(tab, btn) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderRests();
}

function saveRest() {
  const editId = document.getElementById('edit-id').value;
  const name = document.getElementById('restName').value;
  const map = document.getElementById('restMap').value;
  const loc = document.getElementById('addLoc').value;
  const style = document.getElementById('addStyle').value;
  const jane = document.getElementById('janeScore').value;
  const su = document.getElementById('suScore').value;
  const note = document.getElementById('restNote').value;

  if (!name) return alert('請填寫店名！');

  if (editId) {
    const index = rests.findIndex(r => r.id == editId);
    if (index !== -1) rests[index] = { ...rests[index], name, map, loc, style, jane, su, note };
  } else {
    rests.push({ id: Date.now(), name, map, loc, style, jane, su, note });
  }

  localStorage.setItem(DB_KEY, JSON.stringify(rests));
  renderRests();
  toggleForm();
  resetForm();
}

function renderRests() {
  const locFilter = document.getElementById('loc-filter').value;
  const styleFilter = document.getElementById('style-filter').value;
  const listContainer = document.getElementById('rest-list');

  let filtered = rests.filter(r => {
    const matchLoc = (locFilter === 'all' || r.loc === locFilter);
    const matchStyle = (styleFilter === 'all' || r.style === styleFilter);
    let matchTab = true;
    if (currentTab === 'wish') matchTab = (parseInt(r.jane) === 0);
    if (currentTab === 'high') matchTab = (parseInt(r.jane) >= 4);
    return matchLoc && matchStyle && matchTab;
  });

  listContainer.innerHTML = filtered.map(r => `
    <div class="rest-item">
      <div class="rest-info">
        <h4>${r.name} <small style="color:#aaa;">[${r.style}]</small></h4>
        <p>🐰 ${r.jane} | 🧔 ${r.su || '?'} | ${r.loc}</p>
        ${r.note ? `<p class="item-note">📝 ${r.note}</p>` : ''}
      </div>
      <div style="display:flex; gap:12px; align-items:center;">
        ${r.map ? `<a href="${r.map}" target="_blank" style="text-decoration:none;">📍</a>` : ''}
        <button onclick="editRest(${r.id})" style="border:none;background:none;color:#ccc;cursor:pointer">✎</button>
        <button onclick="deleteRest(${r.id})" style="border:none;background:none;color:#ddd;cursor:pointer">✕</button>
      </div>
    </div>
  `).reverse().join('');
}

function editRest(id) {
  const item = rests.find(r => r.id == id);
  if (!item) return;
  document.getElementById('add-form').classList.remove('hidden');
  document.getElementById('edit-id').value = item.id;
  document.getElementById('restName').value = item.name;
  document.getElementById('restMap').value = item.map || '';
  document.getElementById('addLoc').value = item.loc;
  document.getElementById('addStyle').value = item.style;
  document.getElementById('janeScore').value = item.jane;
  document.getElementById('suScore').value = item.su;
  document.getElementById('restNote').value = item.note || '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteRest(id) {
  if(!confirm("確定刪除嗎？")) return;
  rests = rests.filter(r => r.id !== id);
  localStorage.setItem(DB_KEY, JSON.stringify(rests));
  renderRests();
}

// --- 偏食區管理 ---
function addPicky() {
  const val = document.getElementById('picky-input').value;
  if (!val) return;
  picky.push(val);
  savePicky();
}

function renderPicky() {
  const container = document.getElementById('picky-tags-container');
  container.innerHTML = picky.map((p, idx) => `
    <span class="picky-tag" onclick="editPicky(${idx})">${p}</span>
  `).join('');
}

function editPicky(idx) {
  const newVal = prompt("編輯偏食紀錄 (留空則刪除):", picky[idx]);
  if (newVal === null) return;
  if (newVal.trim() === "") {
    picky.splice(idx, 1);
  } else {
    picky[idx] = newVal;
  }
  savePicky();
}

function savePicky() {
  localStorage.setItem(PICKY_KEY, JSON.stringify(picky));
  document.getElementById('picky-input').value = '';
  renderPicky();
}

// --- UI 功能 ---
function toggleForm() { 
  document.getElementById('add-form').classList.toggle('hidden'); 
  if(document.getElementById('add-form').classList.contains('hidden')) resetForm();
}
function resetForm() {
  document.getElementById('edit-id').value = '';
  document.getElementById('restName').value = '';
  document.getElementById('restMap').value = '';
  document.getElementById('restNote').value = '';
}
function closeOverlay() { document.getElementById('overlay').classList.add('hidden'); }

function startGeminiSearch() {
  document.getElementById('overlay').classList.remove('hidden');
  document.getElementById('ai-loading').classList.remove('hidden');
  document.getElementById('ai-result-content').classList.add('hidden');
  setTimeout(() => {
    let pool = rests.filter(r => !picky.some(p => r.name.includes(p)));
    let winner = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : rests[0];
    document.getElementById('ai-loading').classList.add('hidden');
    document.getElementById('ai-result-content').classList.remove('hidden');
    if (winner) {
      document.getElementById('res-name').innerText = winner.name;
      document.getElementById('res-meta').innerText = `${winner.loc} · ${winner.style}`;
      document.getElementById('res-score').innerText = `🐰 ${winner.jane} | 🧔 ${winner.su}`;
      document.getElementById('res-note-display').innerText = winner.note ? `📝 ${winner.note}` : "";
      document.getElementById('res-map-link').href = winner.map || "#";
    }
  }, 1000);
}