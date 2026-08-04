# Contributing to CEVOS

First off, thank you for considering a contribution to CEVOS (Community EV Operating System).

Our goal is to build an open-source platform that helps users design, simulate, and share electric vehicle conversion projects. Contributions of all sizes are welcome.

---

# How to Contribute

You can contribute in several ways:

- Reporting bugs
- Suggesting new features
- Improving documentation
- Adding vehicle data
- Adding component data
- Writing code
- Reviewing pull requests
- Testing new features

---

# Getting Started

## 1. Fork the Repository

Create a personal fork of the project and clone it locally.

```bash
git clone https://github.com/your-username/cevos-platform.git
```

## 2. Create a Branch

Create a feature branch for your changes.

```bash
git checkout -b feature/my-new-feature
```

Examples:

```text
feature/range-calculator
feature/3d-vehicle-viewer
feature/component-library
bugfix/cost-estimator
docs/readme-updates
```

## 3. Make Changes

Keep changes focused and easy to review.

## 4. Commit Changes

Use clear and descriptive commit messages.

Example:

```text
Add battery pack validation logic
Fix weight distribution calculation bug
Update Infiniti QX60 documentation
```

## 5. Submit a Pull Request

Open a Pull Request with a summary of:

- What changed
- Why it changed
- How it was tested

---

# Pull Request Guidelines

Before submitting:

- [ ] Code builds successfully
- [ ] Documentation updated if necessary
- [ ] Tests pass
- [ ] No unnecessary files included
- [ ] Pull request title is descriptive

Good example:

```text
Add battery compatibility validation engine
```

Avoid:

```text
Update stuff
Misc fixes
```

---

# Coding Standards

## General Principles

Write code that is:

- Readable
- Maintainable
- Well documented
- Consistently formatted

Prefer simple solutions whenever possible.

---

## Naming

Use descriptive names.

Good:

```text
batteryCapacityKWh
estimatedRangeMiles
vehicleWeightLb
```

Avoid:

```text
a
temp
value1
```

---

# Documentation Contributions

Documentation is just as important as code.

Examples:

- Installation guides
- Architecture diagrams
- Tutorials
- Vehicle specifications
- Troubleshooting guides

Documentation updates may be submitted independently of code changes.

---

# Vehicle and Component Data Contributions

The vehicle library and component library are core parts of the project.

When contributing data:

- Use accurate and well-sourced information
- Follow the existing data structure
- Include units where relevant
- Document assumptions when necessary

Examples of useful contributions:

- New vehicle profiles
- Battery specification updates
- Motor compatibility notes
- Weight and dimensions data

---

# Community Expectations

Please be respectful, constructive, and helpful in discussions.

We encourage:

- Open collaboration
- Thoughtful feedback
- Patient support for new contributors
- Clear communication

We ask contributors to avoid disruptive behavior and to help maintain a welcoming environment for everyone.

---

# Testing Contributions

Testing helps ensure that new features, bug fixes, and data updates do not introduce unintended issues.

All contributors are encouraged to test their changes before submitting a Pull Request.

---

## Testing Requirements

At a minimum, verify that:

- New functionality works as intended
- Existing functionality remains unaffected
- No new warnings or errors are introduced
- Documentation matches the implemented behavior

---

## Testing Types

### Functional Testing

Confirm that the feature performs as expected.

Examples:

- Vehicle configurations save correctly
- Range calculations return expected values
- Reports generate successfully
- Component validation rules execute properly

---

### Data Validation Testing

For vehicle or component library changes, verify:

- Required fields are populated
- Units are correct
- Values are realistic
- JSON files are valid

Example:

```json
{
  "make": "Infiniti",
  "model": "QX60",
  "year": 2017
}
```

---

### Regression Testing

Confirm that existing functionality continues to work after your changes.

Examples:

- Existing vehicle records load correctly
- Cost estimation calculations remain accurate
- Previously supported configurations still validate

---

### User Interface Testing

When modifying the frontend:

Verify:

- Layout displays correctly
- Navigation works as expected
- Forms accept valid input and reject invalid input
- Interactive elements respond properly

---

## Reporting Test Results

When submitting a pull request, include relevant testing notes such as:

- What was tested
- How it was tested
- Any known limitations

This helps reviewers understand the scope and reliability of your contribution.

---

# Thank You

Thank you for helping build CEVOS. Every contribution, whether small or large, helps move the project forward.
