# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **security@beefree.io**

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

This information will help us triage your report more quickly.

## Security Best Practices

When using `@beefree.io/react`:

### 1. Never Expose API Credentials

❌ **NEVER** include Beefree API credentials in frontend code:

```javascript
// ❌ DANGEROUS - DO NOT DO THIS
const token = await fetch('https://auth.beefree.io/token', {
  body: JSON.stringify({
    client_id: 'your-id',      // Exposed!
    client_secret: 'your-secret' // Exposed!
  })
})
```

✅ **ALWAYS** fetch tokens from your backend:

```javascript
// ✅ SECURE - Backend handles credentials
const token = await fetch('/api/beefree/token', {
  credentials: 'include'
})
```

### 2. Validate User Input

Always validate and sanitize any user input before passing it to the builder.

### 3. Keep Dependencies Updated

Regularly update `@beefree.io/react` and its dependencies:

```bash
yarn upgrade @beefree.io/react
```

### 4. Use HTTPS

Always serve your application over HTTPS in production.

### 5. Implement Authentication

Ensure proper authentication is in place before allowing users to access the builder.

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine affected versions
2. Audit code to find any similar problems
3. Prepare fixes for all supported versions
4. Release new security patch versions as soon as possible

## Comments on this Policy

If you have suggestions on how this process could be improved, please submit a pull request.
