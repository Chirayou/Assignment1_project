export const TEMPLATES = {
  readme: `# MarkPulse Studio

A modern, high-performance Markdown Editor and Document Studio designed for developers, technical writers, and content creators.

> [!NOTE]
> MarkPulse Studio provides real-time split-screen rendering, rich document analytics, auto-saving, and multi-format export capability.

## 🚀 Features

- **Split-View Live Preview**: Synchronized Markdown rendering with GFM support.
- **Document Analytics**: Real-time tracking of word counts, reading time, and structural density.
- **Multi-Format Export**: Export to Markdown (.md), clean HTML, or print-ready PDF layout.
- **Template Library**: Instant starter templates for technical writing workflows.

## 🛠️ Quick Start

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Launch development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Build for production:
   \`\`\`bash
   npm run build
   \`\`\`

## 📊 Sample Data Table

| Feature | Support Level | Status |
| :--- | :---: | ---: |
| Real-time Preview | Full | ✅ Active |
| Syntax Highlighting | 100+ Languages | ✅ Active |
| Export Formats | MD, HTML, PDF | ✅ Active |
| Local Storage Autosave | Automatic | ✅ Active |

---

*Created with MarkPulse Studio — Elevating your technical documentation.*
`,

  techspec: `# Technical Specification: Core Architecture

**Author**: Senior Systems Engineer  
**Date**: October 2026  
**Status**: Draft / Under Review  

---

## 1. System Overview

This specification outlines the architectural blueprint for the Next-Gen Data Engine, detailing component breakdown, API schemas, and deployment topologies.

### Key Objectives
- Achieve sub-10ms query latency for 99.9% of incoming API requests.
- Provide horizontal scalability across multi-region deployment nodes.
- Maintain strict backward compatibility for existing client protocols.

---

## 2. Component Architecture

\`\`\`mermaid
graph TD
    Client[Web & API Clients] --> Gateway[API Gateway Layer]
    Gateway --> Auth[Auth Service]
    Gateway --> QueryEngine[Distributed Query Engine]
    QueryEngine --> Cache[(Redis Cache Cluster)]
    QueryEngine --> DB[(Distributed Postgres Node)]
\`\`\`

### 2.1 API Endpoint Definition

\`\`\`json
{
  "endpoint": "/api/v1/analytics/query",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer <TOKEN>"
  },
  "payload": {
    "timeframe": "7d",
    "metrics": ["throughput", "error_rate", "p99_latency"],
    "groupBy": "service"
  }
}
\`\`\`

---

## 3. Security & Compliance Checklist

- [x] TLS 1.3 encryption in transit
- [x] AES-256 encryption at rest
- [ ] OAuth2 / OIDC token validation fallback
- [ ] Automated vulnerability vulnerability scan pipeline

> [!WARNING]
> Ensure all secret keys are rotated every 90 days following security governance policy 402-B.
`,

  releasenotes: `# Release Notes - Version 2.4.0

*Released: October 18, 2026*

We are excited to announce **v2.4.0**, featuring major performance optimizations, enhanced syntax rendering, and brand-new document statistics.

---

## ✨ What's New

### ⚡ Performance Boosts
- **Blazing Fast Parser**: Incremental Markdown parsing reduced rendering latency by 45%.
- **Memory Footprint**: Virtualized preview viewports for long document scrolling.

### 🎨 Visual & UI Enhancements
- Added native dark and light aesthetic themes.
- Enhanced callout blocks (\`NOTE\`, \`WARNING\`, \`TIP\`, \`IMPORTANT\`).

### 🐛 Bug Fixes
- Fixed table formatting misalignments when rendering nested lists.
- Resolved auto-save race conditions when editing multiple sessions.

---

## 📈 Impact Metrics

> [!TIP]
> Upgrade today by pulling the latest \`main\` branch and running \`npm run build\`.
`,

  meeting: `# Team Sync & Action Plan

**Date**: October 18, 2026  
**Attendees**: Alex (Product), Taylor (Lead Dev), Sam (UI/UX), Jordan (QA)  

---

## 📝 Discussion Topics

1. **Sprint Review**: Review progress on MarkPulse Studio milestones.
2. **UX Polish**: Responsive split panel resizing and keyboard shortcuts.
3. **Release Readiness**: Testing cross-browser compatibility.

---

## 🎯 Action Items

- [x] **Taylor**: Complete Marked parser custom extensions for callout banners.
- [x] **Sam**: Finalize modern dark glassmorphic CSS theme tokens.
- [ ] **Jordan**: Execute cross-browser regression test matrix.
- [ ] **Alex**: Draft user onboarding guide and README overview.

---

> [!IMPORTANT]
> Next sync scheduled for Monday at 10:00 AM EST.
`
};
