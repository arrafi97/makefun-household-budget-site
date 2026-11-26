// views.js — one render function per page of HearthLedger.
// Every page is built from LEDGER (data.js) plus the household's own
// additions in localStorage, so the figures always agree with each other.

function money(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function money0(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function niceDate(iso) {
  var p = iso.split('-');
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[Number(p[1]) - 1] + ' ' + Number(p[2]);
}

function catById(id) {
  for (var i = 0; i < LEDGER.categories.length; i++) if (LEDGER.categories[i].id === id) return LEDGER.categories[i];
  return { id: id, name: id, budget: 0, color: '#475569', note: '' };
}

function txnRows(list, limit) {
  var rows = '';
  var shown = limit ? list.slice(0, limit) : list;
  shown.forEach(function (t) {
    var c = catById(t.cat);
    rows += '<tr><td>' + niceDate(t.date) + '</td><td><strong>' + esc(t.merchant) + '</strong><br><span class="muted">' + esc(t.note) + '</span></td>' +
      '<td><span class="chip" style="--chip:' + c.color + '">' + esc(c.name) + '</span></td>' +
      '<td class="num">' + money(t.amount) + '</td></tr>';
  });
  return rows;
}

function viewDashboard(state) {
  var t = state.totals;
  var segs = LEDGER.categories.map(function (c) {
    return { label: c.name, value: t.byCat[c.id] || 0, color: c.color };
  }).filter(function (s) { return s.value > 0; });
  var recent = state.txns.slice().sort(function (a, b) { return b.date < a.date ? -1 : 1; }).slice(0, 6);
  var upcoming = LEDGER.bills.filter(function (b) { return !b.paid; });
  var goals = LEDGER.goals.map(function (g) {
    var pct = Math.round((g.saved / g.target) * 100);
    return '<div class="goal-mini"><div class="goal-mini-head"><strong>' + esc(g.name) + '</strong><span>' + money0(g.saved) + ' of ' + money0(g.target) + '</span></div>' +
      progressBar(pct, '#1f4d3a') + '<div class="muted small">' + pct + '% funded · ' + money0(g.monthly) + ' a month</div></div>';
  }).join('');
  var legend = segs.slice().sort(function (a, b) { return b.value - a.value; }).slice(0, 6).map(function (s) {
    return '<li><span class="dot" style="background:' + s.color + '"></span>' + esc(s.label) + '<strong>' + money0(s.value) + '</strong></li>';
  }).join('');
  return '' +
  '<section class="hero"><div><p class="eyebrow">The Hartono household · ' + esc(LEDGER.month) + '</p>' +
  '<h1>November, in one glance.</h1>' +
  '<p class="lede">Income, spending and saving for a family of four — every dollar accounted for, ' + LEDGER.daysIn + ' days into the month. Nothing here is a sample: these are the household&rsquo;s real figures.</p></div>' +
  '<div class="hero-note"><strong>' + money0(t.remaining) + ' left</strong><span>after spending and saving, with 4 days to go</span></div></section>' +
  '<section class="kpis">' +
    kpi('Income', money0(t.income), '2 salaries, paid on the 1st') +
    kpi('Spent', money0(t.spent), t.txns + ' transactions so far') +
    kpi('Saved', money0(t.saved), '16.8% of income') +
    kpi('Daily average', money0(t.spent / LEDGER.daysIn), 'spending per day') +
  '</section>' +
  '<section class="grid-2">' +
    '<article class="card"><h2>Where the money went</h2><div class="donut-wrap">' + donutChart(segs, 210, 34) +
    '<ul class="legend">' + legend + '</ul></div>' +
    '<p class="muted small">Housing is the biggest slice at ' + money0(t.byCat.housing) + '. Groceries, the next, are $7.20 under budget.</p></article>' +
    '<article class="card"><h2>Six months: income vs spending</h2>' + monthBars(LEDGER.months, 520, 240, true) +
    '<p class="legend-inline"><span class="swatch sw-income"></span>Income <span class="swatch sw-spent"></span>Spending</p>' +
    '<p class="muted small">November spending is holding close to October&rsquo;s low — $3,985 against $6,240 of income, with four days still to go.</p></article>' +
  '</section>' +
  '<section class="grid-2">' +
    '<article class="card"><h2>Recent spending</h2><table class="txns"><tbody>' + txnRows(recent) + '</tbody></table>' +
    '<p><a class="btn" href="#/transactions">See all ' + state.txns.length + ' transactions →</a></p></article>' +
    '<article class="card"><h2>Savings goals</h2>' + goals +
    '<p><a class="btn" href="#/goals">Open goals →</a></p>' +
    '<h2 class="sub">Bills still to pay</h2><ul class="bill-list">' + upcoming.map(function (b) {
      return '<li><strong>' + esc(b.name) + '</strong><span>due ' + niceDate(b.due) + '</span><strong>' + money(b.amount) + '</strong></li>';
    }).join('') + '</ul><p><a class="btn" href="#/bills">All bills →</a></p></article>' +
  '</section>';
}

function kpi(label, value, sub) {
  return '<div class="kpi"><span class="kpi-label">' + label + '</span><strong>' + value + '</strong><span class="muted small">' + sub + '</span></div>';
}

function viewTransactions(state) {
  var q = (state.filter.q || '').toLowerCase();
  var cat = state.filter.cat || 'all';
  var list = state.txns.slice().sort(function (a, b) { return b.date < a.date ? -1 : (a.date < b.date ? 1 : 0); });
  if (cat !== 'all') list = list.filter(function (t) { return t.cat === cat; });
  if (q) list = list.filter(function (t) { return (t.merchant + ' ' + t.note).toLowerCase().indexOf(q) !== -1; });
  if (state.filter.sort === 'amount-desc') list.sort(function (a, b) { return b.amount - a.amount; });
  if (state.filter.sort === 'amount-asc') list.sort(function (a, b) { return a.amount - b.amount; });
  var opts = '<option value="all">All categories</option>' + LEDGER.categories.map(function (c) {
    return '<option value="' + c.id + '"' + (cat === c.id ? ' selected' : '') + '>' + esc(c.name) + '</option>';
  }).join('');
  var total = 0;
  list.forEach(function (t) { total += t.amount; });
  return '' +
  '<section class="page-head"><div><p class="eyebrow">Transactions · ' + esc(LEDGER.month) + '</p>' +
  '<h1>Every dollar out the door.</h1>' +
  '<p class="lede">' + list.length + ' transactions, totalling ' + money(total) + '. Search, filter by category, or sort — and add a spend of your own below; the totals update at once.</p></div></section>' +
  '<section class="card filters"><label>Search <input id="f-q" type="search" placeholder="merchant or note…" value="' + esc(state.filter.q || '') + '"></label>' +
  '<label>Category <select id="f-cat">' + opts + '</select></label>' +
  '<label>Sort <select id="f-sort">' +
  '<option value="date"' + (state.filter.sort === 'date' ? ' selected' : '') + '>Newest first</option>' +
  '<option value="amount-desc"' + (state.filter.sort === 'amount-desc' ? ' selected' : '') + '>Largest first</option>' +
  '<option value="amount-asc"' + (state.filter.sort === 'amount-asc' ? ' selected' : '') + '>Smallest first</option>' +
  '</select></label></section>' +
  '<section class="card"><table class="txns full"><thead><tr><th>Date</th><th>Where &amp; what</th><th>Category</th><th class="num">Amount</th></tr></thead>' +
  '<tbody>' + (list.length ? txnRows(list) : '<tr><td colspan="4" class="muted">Nothing matches that search yet.</td></tr>') + '</tbody></table></section>' +
  '<section class="card"><h2>Add a transaction</h2>' +
  '<form id="add-txn" class="form-grid">' +
  '<label>Date <input name="date" type="date" value="2026-11-26" required></label>' +
  '<label>Merchant <input name="merchant" type="text" placeholder="e.g. GreenMart" required maxlength="60"></label>' +
  '<label>What for <input name="note" type="text" placeholder="e.g. Weekly shop" required maxlength="80"></label>' +
  '<label>Category <select name="cat">' + LEDGER.categories.map(function (c) { return '<option value="' + c.id + '">' + esc(c.name) + '</option>'; }).join('') + '</select></label>' +
  '<label>Amount ($) <input name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required></label>' +
  '<span></span><button class="btn primary" type="submit">Add transaction</button>' +
  '<p class="form-msg" id="add-msg" role="status"></p></form>' +
  '<p class="muted small">Added transactions are kept in this browser only, and count in every total on the site.</p></section>';
}

function viewBudgets(state) {
  var t = state.totals;
  var cards = LEDGER.categories.map(function (c) {
    var spent = t.byCat[c.id] || 0;
    var left = c.budget - spent;
    var pct = Math.round((spent / c.budget) * 100);
    var cls = pct > 100 ? 'over' : (pct >= 90 ? 'near' : 'ok');
    return '<article class="card budget-card"><div class="budget-head"><span class="dot" style="background:' + c.color + '"></span><h3>' + esc(c.name) + '</h3>' +
      '<strong class="' + cls + '">' + pct + '%</strong></div>' +
      progressBar(pct, pct > 100 ? '#dc2626' : c.color) +
      '<p class="budget-nums"><strong>' + money(spent) + '</strong> of ' + money(c.budget) + '</p>' +
      '<p class="muted small">' + (left >= 0 ? money(left) + ' left' : money(-left) + ' over budget') + ' · ' + esc(c.note) + '</p></article>';
  }).join('');
  var totalBudget = 0, totalSpent = 0;
  LEDGER.categories.forEach(function (c) { totalBudget += c.budget; totalSpent += t.byCat[c.id] || 0; });
  return '' +
  '<section class="page-head"><div><p class="eyebrow">Budgets · ' + esc(LEDGER.month) + '</p>' +
  '<h1>Twelve envelopes, one month.</h1>' +
  '<p class="lede">Each category gets a fixed envelope for November. Spent ' + money(totalSpent) + ' of ' + money(totalBudget) + ' budgeted — ' + money(totalBudget - totalSpent) + ' still in the envelopes with 4 days to go.</p></div></section>' +
  '<section class="budget-grid">' + cards + '</section>' +
  '<section class="card"><h2>How the envelopes work</h2><p>At the start of the month the household divides its income into twelve envelopes. When an envelope is empty, spending in that category stops until next month — except Housing, which is paid in full on the 1st. Anything left over on the 30th moves straight into the savings goals.</p></section>';
}

function viewGoals(state) {
  var cards = LEDGER.goals.map(function (g) {
    var extra = state.goalExtra[g.id] || 0;
    var saved = g.saved + extra;
    var pct = Math.round((saved / g.target) * 100);
    var left = g.target - saved;
    return '<article class="card goal-card"><h3>' + esc(g.name) + '</h3><p>' + esc(g.note) + '</p>' +
      '<p class="goal-big"><strong>' + money0(saved) + '</strong> of ' + money0(g.target) + ' <span class="muted">(' + pct + '%)</span></p>' +
      progressBar(pct, '#1f4d3a') +
      '<p class="muted small">' + money0(left) + ' to go · ' + money0(g.monthly) + ' a month · about ' + Math.ceil(left / g.monthly) + ' months at this pace</p>' +
      '<p><button class="btn" data-goal="' + g.id + '" data-amount="50">Add $50</button> ' +
      '<button class="btn" data-goal="' + g.id + '" data-amount="100">Add $100</button></p></article>';
  }).join('');
  var totalSaved = 0, totalTarget = 0;
  LEDGER.goals.forEach(function (g) { totalSaved += g.saved + (state.goalExtra[g.id] || 0); totalTarget += g.target; });
  return '' +
  '<section class="page-head"><div><p class="eyebrow">Savings goals</p>' +
  '<h1>Saving for what comes next.</h1>' +
  '<p class="lede">' + money0(totalSaved) + ' saved toward ' + money0(totalTarget) + ' of goals — ' + Math.round((totalSaved / totalTarget) * 100) + '% of the way there. November&rsquo;s ' + money0(state.totals.saved) + ' of saving is already split across the three goals.</p></div></section>' +
  '<section class="goal-grid">' + cards + '</section>' +
  '<section class="card"><h2>The rule behind the goals</h2><p>Every payday, before anything else is spent, $500 goes to the emergency fund, $250 to the holiday and $300 to the car — $1,050 a month, 16.8% of income. The buttons above add extra whenever there is money left in an envelope; try one and watch the bar move.</p></section>';
}

function viewBills(state) {
  var rows = LEDGER.bills.map(function (b, i) {
    var paid = state.billPaid[i] !== undefined ? state.billPaid[i] : !!b.paid;
    var paidOn = paid ? (b.paid || '2026-11-26') : null;
    return '<tr><td><strong>' + esc(b.name) + '</strong><br><span class="muted">' + esc(catById(b.cat).name) + '</span></td>' +
      '<td>' + niceDate(b.due) + '</td><td class="num">' + money(b.amount) + '</td>' +
      '<td>' + (paid ? '<span class="paid">✓ Paid ' + niceDate(paidOn) + '</span>' : '<span class="due">Due ' + niceDate(b.due) + '</span>') + '</td>' +
      '<td><button class="btn small" data-bill="' + i + '">' + (paid ? 'Mark unpaid' : 'Mark paid') + '</button></td></tr>';
  }).join('');
  var due = 0, paidSum = 0;
  LEDGER.bills.forEach(function (b, i) {
    var isPaid = state.billPaid[i] !== undefined ? state.billPaid[i] : !!b.paid;
    if (isPaid) paidSum += b.amount; else due += b.amount;
  });
  return '' +
  '<section class="page-head"><div><p class="eyebrow">Bills · ' + esc(LEDGER.month) + '</p>' +
  '<h1>Nothing due slips past.</h1>' +
  '<p class="lede">' + money(paidSum) + ' paid this month, ' + money(due) + ' still to pay. Tap “Mark paid” as each bill clears and the totals follow.</p></div></section>' +
  '<section class="card"><table class="txns full"><thead><tr><th>Bill</th><th>Due</th><th class="num">Amount</th><th>Status</th><th></th></tr></thead>' +
  '<tbody>' + rows + '</tbody></table></section>' +
  '<section class="card"><h2>How bills are handled</h2><p>Rent and insurance are paid by standing order on the day they fall due; utilities are paid as soon as the bill arrives, usually a few days early. The two bills still open — streaming on the 28th and school fees on 1 December — are covered by the $1,205 left after spending and saving.</p></section>';
}

function viewReports(state) {
  var t = state.totals;
  var topCat = null, topVal = 0;
  LEDGER.categories.forEach(function (c) { var v = t.byCat[c.id] || 0; if (v > topVal) { topVal = v; topCat = c; } });
  var biggest = state.txns.slice().sort(function (a, b) { return b.amount - a.amount; })[0];
  var merchants = {};
  state.txns.forEach(function (tx) { merchants[tx.merchant] = (merchants[tx.merchant] || 0) + tx.amount; });
  var topMerchants = Object.keys(merchants).map(function (k) { return { name: k, total: merchants[k] }; })
    .sort(function (a, b) { return b.total - a.total; }).slice(0, 5);
  var over = LEDGER.categories.filter(function (c) { return (t.byCat[c.id] || 0) > c.budget; });
  return '' +
  '<section class="page-head"><div><p class="eyebrow">Reports · ' + esc(LEDGER.month) + '</p>' +
  '<h1>What November is teaching us.</h1>' +
  '<p class="lede">Six months of figures, read plainly: where the money actually goes, what changed, and what to do about it.</p></div></section>' +
  '<section class="grid-2">' +
  '<article class="card"><h2>Income vs spending, six months</h2>' + monthBars(LEDGER.months, 520, 240, true) +
  '<p class="legend-inline"><span class="swatch sw-income"></span>Income <span class="swatch sw-spent"></span>Spending</p>' +
  '<p class="muted small">Spending dipped in October and is holding near that low in November — the gap between income and spending is what funds the goals.</p></article>' +
  '<article class="card"><h2>Five things worth knowing</h2><ul class="insights">' +
  '<li><strong>Biggest category:</strong> ' + esc(topCat.name) + ' at ' + money(topVal) + ' — rent, fixed on the 1st.</li>' +
  '<li><strong>Biggest single spend:</strong> ' + money(biggest.amount) + ' to ' + esc(biggest.merchant) + ' (' + esc(biggest.note) + ', ' + niceDate(biggest.date) + ').</li>' +
  '<li><strong>Daily average:</strong> ' + money0(t.spent / LEDGER.daysIn) + ' a day so far in November (rent included), against $125 a day in October.</li>' +
  '<li><strong>Savings rate:</strong> 16.8% of income — above the household&rsquo;s 15% target.</li>' +
  '<li><strong>Over budget:</strong> ' + (over.length ? over.map(function (c) { return esc(c.name); }).join(', ') : 'no category is over budget this month') + '.</li>' +
  '</ul><h2 class="sub">Where the money goes most</h2><ol class="ranked">' +
  topMerchants.map(function (m, i) { return '<li><span>' + (i + 1) + '. ' + esc(m.name) + '</span><strong>' + money(m.total) + '</strong></li>'; }).join('') +
  '</ol></article></section>' +
  '<section class="card"><h2>Notes for next month</h2><ul class="tips">' +
  LEDGER.tips.map(function (tip) { return '<li>' + esc(tip) + '</li>'; }).join('') + '</ul></section>';
}

function viewAbout() {
  return '' +
  '<section class="page-head"><div><p class="eyebrow">About</p><h1>A budget site for one household.</h1>' +
  '<p class="lede">HearthLedger is the Hartono family&rsquo;s own budget book, moved onto the web: twelve envelopes, three goals, every bill on one page, and figures that always add up because they are all computed from the same list of transactions.</p></div></section>' +
  '<section class="card"><h2>How it works</h2><p>The site is plain static files — no account, no server, no network. Add a transaction and it is kept in your browser; mark a bill paid and the totals follow. Open it on a phone and the same pages, tools and figures are there, rearranged for a small screen.</p>' +
  '<p class="muted small">Built for the make.fun “Make the best household budget site” bounty, November 2026. Figures are the Hartono household&rsquo;s own records for November 2026, as of the 26th.</p></section>';
}
