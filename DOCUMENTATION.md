# Documentation Guide

Complete guide to the authentication package documentation.

---

## Purpose

This document explains the documentation structure, format, and how to use it effectively with AI agents.

---

## Documentation Philosophy

### Core Principles

**CODE-AGNOSTIC**: Documentation remains valid even when implementation changes

**AI-AGENT FRIENDLY**: Structured for AI code generation assistance

**RULES-BASED**: Clear MUST/MUST NOT guidelines

**STRATEGY-DRIVEN**: Purpose and context first

### What Makes This Format Different

**Traditional Documentation**:
- Extensive code examples
- Implementation details
- Tightly coupled to current code
- Requires updates when code changes

**Our Documentation**:
- Only import paths
- Behavioral rules
- Decoupled from implementation
- Remains valid across code changes

---

## Documentation Structure

### Layer-Based Architecture

Documentation mirrors the codebase structure:

```
┌─────────────────────────────────────┐
│  Presentation Layer (UI & Hooks)   │
├─────────────────────────────────────┤
│   Application Layer (Interfaces)   │
├─────────────────────────────────────┤
│  Domain Layer (Business Logic)     │
├─────────────────────────────────────┤
│ Infrastructure Layer (Services)    │
└─────────────────────────────────────┘
```

### File Organization

**README Files**: Layer and directory overviews
**Component Docs**: Individual component documentation
**Hook Docs**: Hook usage documentation
**Entity Docs**: Domain entity documentation

---

## Standard Format

Every documentation file follows this structure:

```markdown
# [Feature/Component Name]

Brief description of the feature.

---

## Strategy

**Purpose**: What this does and why it exists

**When to Use**:
- Use case 1
- Use case 2
- Use case 3

**Location**: `path/to/file.ts`

---

## Rules

**MUST**:
- Requirement 1
- Requirement 2
- Requirement 3

**MUST NOT**:
- Prohibition 1
- Prohibition 2
- Prohibition 3

---

## Constraints

- Technical limitation 1
- Platform requirement 2
- Dependency constraint 3

---

## Related Modules

- Related module 1
- Related module 2
```

---

## Using Documentation with AI Agents

### For Code Generation

When asking AI to generate code:

1. **Reference the documentation**
   - "Follow the rules in src/presentation/hooks/useAuth.md"
   - "Implement according to domain/ConfigAndErrors.md"

2. **Specify requirements**
   - Use MUST/MUST NOT rules as constraints
   - Follow strategy guidelines
   - Respect constraints

3. **Import paths**
   - Copy import paths directly from docs
   - Don't ask for examples, check docs

### Example AI Prompts

**✅ Good Prompt**:
```
Create a login component following the rules in
src/presentation/components/LoginForm.md. Use the
useAuth hook as documented in useAuth.md. Follow all
MUST and MUST NOT rules.
```

**❌ Bad Prompt**:
```
Create a login component with email and password fields
that calls Firebase auth directly.
```

---

## Documentation Sections Explained

### Strategy Section

**Purpose**: High-level intent and context

**Contents**:
- **Purpose**: What and why
- **When to Use**: Use cases and scenarios
- **Location**: File path for reference

**Why This Matters**:
- AI needs context to generate correct code
- Purpose guides implementation decisions
- Use cases prevent misuse

---

### Rules Section

**Purpose**: Concrete behavioral guidelines

**MUST Rules**:
- Required behaviors
- Mandatory actions
- Essential requirements

**MUST NOT Rules**:
- Forbidden actions
- Prohibited behaviors
- Anti-patterns to avoid

**Why This Matters**:
- Clear do's and don'ts
- Prevents common mistakes
- Enforces best practices
- AI can validate generated code

---

### Constraints Section

**Purpose**: Technical and platform limitations

**Types of Constraints**:
- Platform limitations (iOS/Android/Web)
- Dependency requirements
- Configuration requirements
- Performance constraints

**Why This Matters**:
- Sets realistic expectations
- Prevents impossible implementations
- Guides architecture decisions

---

## Import Paths

### Format

Import paths are shown as:

```typescript
import { FeatureName } from '@umituz/react-native-auth';
```

### Using Import Paths

1. **Copy directly**: Don't modify, use as-is
2. **Check file location**: Use Location field to verify
3. **No examples needed**: Docs describe behavior, not syntax

---

## Reading the Documentation

### Quick Reference

Each file has a **Strategy** section at the top for quick context.

### Detailed Guidelines

**Rules** sections provide detailed behavioral guidelines.

### Implementation Details

**Constraints** sections provide technical limitations.

### Related Information

**Related Modules** sections link to related documentation.

---

## Updating Documentation

### When to Update

**Code Changes**:
- ✅ Documentation usually doesn't need updates
- ✅ Only update if behavior/contract changes
- ❌ Don't update for implementation changes

**Behavioral Changes**:
- ✅ Update Strategy section if purpose changes
- ✅ Update Rules if requirements change
- ✅ Update Constraints if limitations change

### Format Compliance

All documentation must:
- Start with Strategy section
- Include Rules with MUST/MUST NOT
- List Constraints clearly
- Provide import paths only
- Use English language
- Be AI-agent friendly

---

## Common Patterns

### Hooks Documentation

Pattern:
1. Purpose and use cases
2. Return values
3. Usage rules
4. Constraints
5. Related hooks

### Components Documentation

Pattern:
1. Purpose and use cases
2. Props (required/optional)
3. Usage rules
4. Constraints
5. Related components

### Entity Documentation

Pattern:
1. Purpose and scope
2. Properties
3. Validation rules
4. Constraints
5. Related entities

---

## Best Practices

### For Developers

1. **Read Strategy first** - Understand purpose before implementation
2. **Follow Rules strictly** - MUST/MUST NOT are not suggestions
3. **Check Constraints** - Verify requirements before coding
4. **Use Import Paths** - Don't guess import locations

### For AI Agents

1. **Parse Strategy** - Extract intent and use cases
2. **Enforce Rules** - Validate against MUST/MUST NOT
3. **Respect Constraints** - Check limitations
4. **Generate Compliant Code** - Follow all guidelines

---

## Documentation Maintenance

### Principles

1. **Stability**: Documentation should rarely change
2. **Accuracy**: When it changes, be precise
3. **Consistency**: Maintain format across all files
4. **Clarity**: Write for humans and AI agents

### Review Process

Before considering documentation complete:
- ✅ Strategy section present and clear
- ✅ Rules cover all important cases
- ✅ Constraints listed accurately
- ✅ Import paths correct
- ✅ Related modules linked
- ✅ No code examples (except imports)
- ✅ English language throughout

---

## Quick Start Guide

### Finding Documentation

1. **Layer Overview**: Start with layer README.md
2. **Feature Details**: Check feature-specific .md files
3. **Usage Examples**: See Related Modules links

### Reading Strategy

1. **Quick Scan**: Read Strategy section
2. **Requirements**: Review Rules section
3. **Limitations**: Check Constraints section
4. **Context**: Browse Related Modules

### Implementing

1. **Understand**: Read Strategy thoroughly
2. **Plan**: Follow Rules as requirements
3. **Verify**: Check Constraints
4. **Implement**: Write code following guidelines

---

## Documentation Index

### Root Documentation
- `README.md` - Package overview and quick start

### Layer Documentation
- `src/presentation/README.md` - UI layer overview
- `src/domain/README.md` - Business logic overview
- `src/application/README.md` - Interfaces overview
- `src/infrastructure/README.md` - Services overview

### Component Documentation
- `src/presentation/components/README.md` - Components overview
- Individual component .md files

### Hook Documentation
- `src/presentation/hooks/README.md` - Hooks overview
- Individual hook .md files

### Entity Documentation
- `src/domain/entities/*.md` - Domain entity docs
- `src/domain/ConfigAndErrors.md` - Configuration and errors

### Service Documentation
- `src/infrastructure/services/README.md` - Services overview

---

## Getting Help

### Understanding Format

See this file (DOCUMENTATION.md) for format explanation.

### Using with AI

Reference specific .md files when prompting AI agents.

### Updating Documentation

Maintain the format and structure shown in existing files.

---

## Summary

This documentation is designed to be:
- **Stable**: Rarely needs updates
- **Clear**: Unambiguous guidelines
- **Actionable**: Direct implementation guidance
- **AI-Friendly**: Structured for automated code generation

The format emphasizes **what** and **why** over **how**, ensuring documentation remains useful even as implementations evolve.
