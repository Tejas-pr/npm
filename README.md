# 🧠 Tejas AI Agent Skills

[![NPM Version](https://img.shields.io/npm/v/tejas-ai-skills.svg?style=flat-square)](https://www.npmjs.com/package/tejas-ai-skills)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Welcome to **Tejas AI Skills** — a curated collection of highly specialized knowledge modules ("skills") designed to supercharge your AI coding assistants (like Cursor, GitHub Copilot Workspace, TanStack Intent, or custom agent setups).

By injecting these skills into your AI's context, you upgrade its baseline knowledge, allowing it to make better architectural decisions, write superior copy, and design interfaces based on proven psychological principles.

## 🚀 Quick Install

You don't need to bloat your `package.json` dependencies. Simply run the auto-installer in the root of your project:

```bash
npx tejas-ai-skills
```
*(For Bun projects: `bunx tejas-ai-skills`)*

This command instantly fetches the latest knowledge modules and injects them into your local `.agents/skills` directory, making them immediately discoverable by your AI workspace.

## 📚 Current Skill Modules

Our current focus is on elevating the user experience (UX) and user interface (UI) design capabilities of AI agents.

### 1. UX Psychology Principles & Cognitive Biases
Upgrades your AI with deep knowledge of cognitive biases (Zeigarnik Effect, Fitts's Law, Goal Gradient Effect, etc.) so it can generate code and architectures that naturally guide user behavior and reduce cognitive load.

### 2. UX Writing & UI Copy Guide
Prevents your AI from generating robotic, generic text like "Submit" or "Click Here". This skill forces the AI to write clear, action-oriented, and accessible microcopy that builds user trust and drives conversions.

## 🔮 What's Next? (More Skills Coming Soon!)

This repository is continuously evolving. I am actively researching and building more specialized agent skills spanning:
- Advanced Frontend Architecture (React, Next.js)
- Backend Scaling & Performance Optimization
- Cybersecurity & Threat Modeling
- System Design Best Practices

*Watch/Star this repository to stay updated as new skills are released!*

## 🛠️ How It Works Under the Hood

When you run the `npx` command, a lightweight script reads the `.md` skill files from the NPM registry and securely copies them into your project's `.agents/skills/` directory. Modern agentic AI workflows are designed to automatically scan this directory and ingest the Markdown instructions before generating code.

---
*Built with passion by Tejas.*