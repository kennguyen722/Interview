function verifyCsrf(req, res, next) {
  const csrfCookie = req.cookies.csrf;
  const csrfHeader = req.headers['x-csrf-token'];
  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return res.status(403).json({ error: 'CSRF_INVALID' });
  }
  return next();
}

const criticalChecklist = [
  'authn-authz-validated',
  'input-validation-boundary',
  'injection-safe-queries',
  'secrets-not-hardcoded',
  'pii-redaction-logs',
];

function evaluateSecurityReview(checkState) {
  const missing = criticalChecklist.filter((item) => !checkState[item]);
  return { pass: missing.length === 0, missing };
}

module.exports = { verifyCsrf, evaluateSecurityReview };
