// main.js — HearthLedger router and state. Loads after data.js,
// charts.js and views.js (plain scripts, no modules, no network).
// State: the seed data in LEDGER, plus the household's own additions
// kept in localStorage (with a silent fallback when storage is blocked).

var STORE_KEY = 'hearthledger-v1';

function loadStored() {
  try {
    var raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return { added: [], goalExtra: {}, billPaid: {} };
    var parsed = JSON.parse(raw);
    return {
      added: Array.isArray(parsed.added) ? parsed.added : [],
      goalExtra: parsed.goalExtra || {},
      billPaid: parsed.billPaid || {}
    };
  } catch (e) {
    return { added: [], goalExtra: {}, billPaid: {} };
  }
}

function saveStored(state) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify({
      added: state.added, goalExtra: state.goalExtra, billPaid: state.billPaid
    }));
  } catch (e) { /* storage unavailable: the site still works in-memory */ }
}

function computeTotals(txns) {
  var byCat = {};
  var spent = 0;
  txns.forEach(function (t) {
    byCat[t.cat] = (byCat[t.cat] || 0) + t.amount;
    spent += t.amount;
  });
  var income = 0;
  LEDGER.income.forEach(function (i) { income += i.amount; });
  var saved = 0;
  LEDGER.goals.forEach(function (g) { saved += g.monthly; });
  return {
    income: income,
    spent: spent,
    saved: saved,
    remaining: income - spent - saved,
    txns: txns.length,
    byCat: byCat
  };
}

var store = loadStored();
var state = {
  txns: LEDGER.transactions.concat(store.added),
  added: store.added,
  goalExtra: store.goalExtra,
  billPaid: store.billPaid,
  filter: { q: '', cat: 'all', sort: 'date' },
  totals: null
};
state.totals = computeTotals(state.txns);

var ROUTES = {
  '': viewDashboard,
  'transactions': viewTransactions,
  'budgets': viewBudgets,
  'goals': viewGoals,
  'bills': viewBills,
  'reports': viewReports,
  'about': viewAbout
};

function currentRoute() {
  var hash = window.location.hash || '#/';
  var path = hash.replace(/^#\/?/, '').split('?')[0];
  return ROUTES[path] ? path : '';
}

function render() {
  var route = currentRoute();
  var app = document.getElementById('app');
  app.innerHTML = ROUTES[route](state);
  document.querySelectorAll('#topnav a').forEach(function (a) {
    var r = a.getAttribute('href').replace(/^#\/?/, '');
    a.classList.toggle('active', r === route);
  });
  wirePage(route);
  window.__budgetShotDone = true;
}

function wirePage(route) {
  if (route === 'transactions') {
    var q = document.getElementById('f-q');
    var cat = document.getElementById('f-cat');
    var sort = document.getElementById('f-sort');
    if (q) q.addEventListener('input', function () { state.filter.q = q.value; render(); restoreFocus('f-q', q.value.length); });
    if (cat) cat.addEventListener('change', function () { state.filter.cat = cat.value; render(); });
    if (sort) sort.addEventListener('change', function () { state.filter.sort = sort.value; render(); });
    var form = document.getElementById('add-txn');
    if (form) form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var fd = new FormData(form);
      var amount = parseFloat(fd.get('amount'));
      var msg = document.getElementById('add-msg');
      if (!amount || amount <= 0 || !fd.get('merchant') || !fd.get('note')) {
        msg.textContent = 'Please fill in every field with a real amount.';
        return;
      }
      var txn = {
        date: fd.get('date') || '2026-11-26',
        merchant: String(fd.get('merchant')).trim(),
        note: String(fd.get('note')).trim(),
        cat: fd.get('cat'),
        amount: Math.round(amount * 100) / 100
      };
      state.added.push(txn);
      state.txns = LEDGER.transactions.concat(state.added);
      state.totals = computeTotals(state.txns);
      saveStored(state);
      state.filter.q = '';
      state.filter.cat = 'all';
      render();
      var again = document.getElementById('add-msg');
      if (again) again.textContent = 'Added ' + txn.merchant + ' — ' + money(txn.amount) + '. The totals already include it.';
    });
  }
  if (route === 'goals') {
    document.querySelectorAll('[data-goal]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-goal');
        var amt = parseFloat(btn.getAttribute('data-amount'));
        state.goalExtra[id] = (state.goalExtra[id] || 0) + amt;
        saveStored(state);
        render();
      });
    });
  }
  if (route === 'bills') {
    document.querySelectorAll('[data-bill]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = parseInt(btn.getAttribute('data-bill'), 10);
        var current = state.billPaid[i] !== undefined ? state.billPaid[i] : !!LEDGER.bills[i].paid;
        state.billPaid[i] = !current;
        saveStored(state);
        render();
      });
    });
  }
}

function restoreFocus(id, pos) {
  var el = document.getElementById(id);
  if (el) {
    el.focus();
    try { el.setSelectionRange(pos, pos); } catch (e) { /* not a text field */ }
  }
}

// ?shot=dashboard|transactions|budgets|phone stages one deterministic
// view for screenshots: it picks the route, then render() flags done.
(function stageShot() {
  var params = new URLSearchParams(window.location.search);
  var shot = params.get('shot');
  if (!shot) return;
  var map = { dashboard: '', transactions: 'transactions', budgets: 'budgets', goals: 'goals', phone: '' };
  if (map[shot] !== undefined) window.location.hash = '#/' + map[shot];
})();

window.addEventListener('hashchange', render);
render();
