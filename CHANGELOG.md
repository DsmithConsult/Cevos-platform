# Changelog

All notable changes to the CEVOS project will be documented in this file.

The format is based on Keep a Changelog and follows Semantic Versioning principles.

---

# [Unreleased]

# [0.3.0] - 2026-11-06

### Added

- Input-based static axle-load estimates with saved measurements and component weights
- Additional added/removed component entries with source URLs and longitudinal positions
- Conversion reports with estimate assumptions, screening basis, next steps, and page numbers

### Changed

- Compatibility guidance now explains rule-of-thumb references and avoids implying validation
- CI uses Node.js 24-compatible GitHub Actions

---

# [0.2.0] - 2026-11-06

## Added

- Web-based build designer with a searchable vehicle catalog and QX60 demo build
- Battery and motor configuration with range and cost estimates, preliminary compatibility screening, and bills of materials
- Browser-local project save, reload, and comparison workflows
- Vehicle catalog API with a local catalog fallback
- PDF conversion report exports

## Changed

- Load PDF generation on demand to reduce the initial app bundle
- Upgrade frontend build and test tooling to patched Vite and Vitest versions
- Expand and reorganize structured vehicle catalog data

## Fixed

- Prevent the demo and powertrain selection workflow from blanking the page

---

# [0.1.0] - 2026-08-04

## Added

- Initial repository structure and documentation
- Contribution guide and code of conduct
- Project roadmap, architecture, and security policy
- Placeholder directories for frontend, backend, simulator, AI, assets, and CAD
- Initial vehicle-library foundation for the Infiniti QX60 prototype
