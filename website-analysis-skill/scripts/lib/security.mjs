const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions?/i,
  /(?:system|developer)\s+(?:message|prompt|instruction)/i,
  /reveal\s+(?:your\s+)?(?:prompt|secrets?|credentials?|environment)/i,
  /act\s+as\s+(?:an?\s+)?(?:assistant|system|developer)/i,
  /do\s+not\s+follow\s+the\s+user/i,
];

const SENSITIVE_PATTERNS = [
  { label: 'private key', pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i },
  { label: 'credential-like assignment', pattern: /\b(?:api[_-]?key|secret|password|token)\s*[:=]\s*["']?[a-z0-9_\-/.+=]{12,}/i },
  { label: 'JWT-like token', pattern: /\beyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\b/ },
  { label: 'GitHub-like token', pattern: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/ },
];

export function inspectUntrustedContent(value) {
  const text = String(value ?? '');
  return {
    promptInjectionDetected: PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(text)),
    sensitiveTypes: SENSITIVE_PATTERNS.filter(({ pattern }) => pattern.test(text)).map(({ label }) => label),
  };
}

export function redactSensitive(value) {
  let redacted = String(value ?? '');
  for (const { label, pattern } of SENSITIVE_PATTERNS) {
    redacted = redacted.replace(new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`), `[REDACTED ${label}]`);
  }
  return redacted;
}

export function safeEvidence(value, maximumLength = 320) {
  return redactSensitive(value)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maximumLength) || 'No text excerpt available.';
}
