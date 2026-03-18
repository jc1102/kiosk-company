# GitHub + Paperclip Workflow Standard

## Overview
Standard workflow for agents working on issues from Paperclip board.

## Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Create    │     │    Agent    │     │   Create    │     │   Review   │     │   Merge &   │
│   Issue     │────▶│    Works    │────▶│     PR      │────▶│   & Test    │────▶│   Close     │
│ (Paperclip) │     │   Locally   │     │  (Linked)   │     │             │     │   Issue     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
     KIOAA-17          feature/xxx          PR #123            approved         Closes #17
```

## Step-by-Step

### 1. Issue Created in Paperclip
- Issue ID: `KIOAA-17`
- Title: "Complete SimOffice Dashboard Integration"
- Assignee: Axel

### 2. Agent Starts Work
```bash
# Pull latest
git pull origin main

# Create feature branch
git checkout -b feature/kioaa-17-dashboard-integration
```

### 3. Work & Commit
```bash
# Make changes, then commit
git add .
git commit -m "feat: Complete dashboard integration

- Added API endpoints for portfolio data
- Integrated real-time updates

KIOAA-17"
```

### 4. Create PR with Issue Link
**PR Title:** `feat: Complete SimOffice Dashboard Integration (KIOAA-17)`

**PR Body:**
```markdown
## Description
Complete the SimOffice dashboard integration with real-time portfolio data.

## Changes
- Added API endpoints for portfolio data
- Integrated real-time updates

## Testing
- [ ] Unit tests passing
- [ ] Manual testing completed

## Links
- Paperclip Issue: KIOAA-17

Closes #KIOAA-17
```

### 5. Code Review & Merge
- Reviewer approves
- Squash and merge
- **GitHub auto-closes** linked issue

### 6. Verify Issue Closed
- Check Paperclip issue is closed
- Move TODO to done if tracked

## PR Template

Create `.github/pull_request_template.md` in each repo:

```markdown
## Description
<!-- What does this PR do? -->

## Changes
<!-- List specific changes -->

## Testing
- [ ] Tests passing
- [ ] Manual verification

## Links
- Paperclip Issue: <!-- Issue ID, e.g., KIOAA-17 -->

<!-- Auto-close linked issue -->
Closes #<!-- Issue Number -->
```

## Branch Naming Convention

| Type | Example |
|------|---------|
| Feature | `feature/kioaa-17-dashboard-integration` |
| Bugfix | `bugfix/kioaa-18-fix-login-error` |
| Hotfix | `hotfix/kioaa-20-security-patch` |

## Commit Message Format

```
<type>(<scope>): <description>

[optional body]

KIOAA-<issue-number>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Useful GitHub Keywords

- `Closes #17` - Closes issue when PR merged
- `Fixes #18` - Same as closes
- `Resolves #19` - Same as closes
- `Related to #20` - Links but doesn't close

## Important Notes

1. **Never commit directly to main/master**
2. **Always link PR to Paperclip issue**
3. **Use `Closes #KIOAA-XX`** (GitHub needs just the number, but include full ID in PR title)
4. **Delete branch after merge** - Keeps repo clean
