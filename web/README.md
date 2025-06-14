## Getting Started

Clone this repositories:

```bash
git clone https://github.com/bhismapratama/fp-sisdas-project.git
```

Install packages:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Then, if you want to run the project on your android device, you need to install capacitor-cli:

```bash
npm install -g @capacitor/cli
```

Then, you can run the project on your android device:

```bash
npx cap sync
```

Then, you can run the project on your android device (you have to connect to android with USB):

```bash
pnpm run devs
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.
Or
Open [http://localhost:8100](http://localhost:8100) with your browser to see the result.

## Commit Message Convention

### Format

`<type>(optional scope): <description>`</br>
Example: `feat(pre-event): add speakers section`

### 1. Type

Available types are:

- feat → Changes about addition or removal of a feature. Ex: `feat: add table on landing page`, `feat: remove table from landing page`
- fix → Bug fixing, followed by the bug. Ex: `fix: illustration overflows in mobile view`
- docs → Update documentation (README.md)
- style → Updating style, and not changing any logic in the code (reorder imports, fix whitespace, remove comments)
- chore → Installing new dependencies, or bumping deps
- refactor → Changes in code, same output, but different approach
- ci → Update github workflows, husky
- test → Update testing suite, cypress files
- revert → when reverting commits
- perf → Fixing something regarding performance (deriving state, using memo, callback)
- vercel → Blank commit to trigger vercel deployment. Ex: `vercel: trigger deployment`

### 2. Optional Scope

Labels per page Ex: `feat(pre-event): add date label`

\*If there is no scope needed, you don't need to write it

### 3. Description

Description must fully explain what is being done.

Add BREAKING CHANGE in the description if there is a significant change.

**If there are multiple changes, then commit one by one**

- After colon, there are a single space Ex: `feat: add something`
- When using `fix` type, state the issue Ex: `fix: file size limiter not working`
- Use imperative, and present tense: "change" not "changed" or "changes"
- Don't use capitals in front of the sentence
- Don't add full stop (.) at the end of the sentence
