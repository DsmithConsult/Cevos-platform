# Security Policy

## CEVOS Security Policy

The CEVOS project values the security, reliability, and integrity of its software, documentation, data models, and community infrastructure.

We appreciate the efforts of security researchers, contributors, and community members who help identify and report security issues responsibly.

---

# Supported Versions

The following table indicates which versions currently receive security updates.

| Version | Supported |
|----------|-----------|
| 1.x | ✅ Yes |
| 0.9.x | ✅ Yes |
| 0.8.x and earlier | ❌ No |

As the project evolves, supported versions may change.

---

# Reporting a Vulnerability

If you discover a security vulnerability, please do not create a public GitHub issue.

Instead, report the vulnerability privately to the project maintainers.

## Report Contents

Please include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Affected components
- Proof-of-concept information (if available)
- Mitigation suggestions (optional)

Example:

```text
Subject: Potential security issue in CEVOS

Summary:
A vulnerability was found in the authentication flow that could allow unauthorized access under certain conditions.

Steps to Reproduce:
1. Navigate to the login endpoint
2. Submit a crafted request
3. Observe the unexpected response

Impact:
Potential unauthorized access to restricted project data.

Affected Components:
Backend API, authentication module
```

---

# Disclosure Process

Once a report is received, the maintainers will:

- Acknowledge receipt of the report
- Assess the issue and severity
- Work on a fix or mitigation plan
- Coordinate disclosure timing with the reporter

We ask that reporters do not publicly disclose the issue until the maintainers have had an opportunity to address it.

---

# Security Expectations

Community members are expected to:

- Report vulnerabilities responsibly
- Avoid exploiting issues beyond what is necessary to validate the report
- Respect the privacy and confidentiality of affected systems
- Cooperate with maintainers during triage and remediation
