function normalizeName(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function sumByCategory(rows) {
  const out = {};
  for (const row of rows) {
    const key = row.category;
    out[key] = (out[key] || 0) + Number(row.amount || 0);
  }
  return out;
}

module.exports = { normalizeName, sumByCategory };
