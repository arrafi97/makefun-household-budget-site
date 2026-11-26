// charts.js — hand-drawn SVG charts for HearthLedger. No libraries:
// every chart is a string of SVG built from the numbers in data.js.

function donutChart(segments, size, thickness) {
  // segments: [{ label, value, color }]. Returns an SVG donut with a
  // centre label, plus a legend list. Values of 0 are skipped.
  var total = 0;
  segments.forEach(function (s) { total += s.value; });
  var cx = size / 2, cy = size / 2, r = size / 2 - 4;
  var inner = r - thickness;
  var start = -Math.PI / 2;
  var paths = '';
  segments.forEach(function (s) {
    if (s.value <= 0) return;
    var frac = s.value / total;
    var end = start + frac * Math.PI * 2;
    var large = (end - start) > Math.PI ? 1 : 0;
    var x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    var x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
    var x3 = cx + inner * Math.cos(end), y3 = cy + inner * Math.sin(end);
    var x4 = cx + inner * Math.cos(start), y4 = cy + inner * Math.sin(start);
    paths += '<path d="M ' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
      ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x2.toFixed(1) + ' ' + y2.toFixed(1) +
      ' L ' + x3.toFixed(1) + ' ' + y3.toFixed(1) +
      ' A ' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + x4.toFixed(1) + ' ' + y4.toFixed(1) +
      ' Z" fill="' + s.color + '"><title>' + esc(s.label) + ': ' + money(s.value) + '</title></path>';
    start = end;
  });
  return '<svg viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Spending by category">' +
    paths +
    '<text x="' + cx + '" y="' + (cy - 6) + '" text-anchor="middle" class="donut-centre-big">' + money(total) + '</text>' +
    '<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" class="donut-centre-small">spent in November</text>' +
    '</svg>';
}

function monthBars(months, width, height, highlightLast) {
  // Grouped bars: income (pale) behind spending (solid) for six months.
  var max = 0;
  months.forEach(function (m) { max = Math.max(max, m.income, m.spent); });
  max = Math.ceil(max / 1000) * 1000;
  var padL = 44, padB = 22, padT = 8;
  var plotW = width - padL - 8, plotH = height - padT - padB;
  var slot = plotW / months.length;
  var bw = Math.min(26, slot * 0.32);
  var out = '<svg viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Income and spending, last six months">';
  [0.25, 0.5, 0.75, 1].forEach(function (f) {
    var y = padT + plotH * (1 - f);
    out += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (width - 8) + '" y2="' + y.toFixed(1) + '" class="gridline"/>' +
      '<text x="' + (padL - 6) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end" class="axis-label">$' + (max * f / 1000).toFixed(0) + 'k</text>';
  });
  months.forEach(function (m, i) {
    var x = padL + i * slot + slot / 2;
    var hInc = (m.income / max) * plotH, hSp = (m.spent / max) * plotH;
    var strong = highlightLast && i === months.length - 1;
    out += '<rect x="' + (x - bw - 2).toFixed(1) + '" y="' + (padT + plotH - hInc).toFixed(1) + '" width="' + bw + '" height="' + hInc.toFixed(1) + '" rx="2" class="bar-income"/>' +
      '<rect x="' + (x + 2).toFixed(1) + '" y="' + (padT + plotH - hSp).toFixed(1) + '" width="' + bw + '" height="' + hSp.toFixed(1) + '" rx="2" class="' + (strong ? 'bar-spent-now' : 'bar-spent') + '">' +
      '<title>' + m.month + ': spent ' + money(m.spent) + ' of ' + money(m.income) + ' income</title></rect>' +
      '<text x="' + x.toFixed(1) + '" y="' + (height - 6) + '" text-anchor="middle" class="axis-label">' + m.month + '</text>';
  });
  out += '</svg>';
  return out;
}

function progressBar(pct, color) {
  var p = Math.max(0, Math.min(100, pct));
  return '<span class="bar"><span class="bar-fill" style="width:' + p.toFixed(1) + '%;background:' + color + '"></span></span>';
}
