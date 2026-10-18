# Security Policy

## Supported versions

Ojabook is a continuously deployed web application. Only the latest version
deployed from the `main` branch is supported with security fixes.

| Version        | Supported |
| -------------- | --------- |
| `main` (latest) | Yes      |
| Older commits  | No        |

## Reporting a vulnerability

Please **do not open a public issue** for security problems.

Report privately using GitHub's
[private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
via the **Security → Report a vulnerability** button on the repository's
Security tab.

Please include:

- a description of the issue and its impact,
- steps to reproduce (or a proof of concept),
- the affected version/commit,
- any suggested fix, if you have one.

You can expect an initial acknowledgement within **5 business days**. Once a
fix is available it will be released on `main` and, where relevant, an advisory
will be published.

## Automated checks

This repository runs automated security checks on every pull request and on a
weekly schedule. See the **Security & CI** section of the
[README](./README.md) for what is scanned. Confidentiality of reports is
respected until a fix has shipped.
