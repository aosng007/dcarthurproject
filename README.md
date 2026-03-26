# DC Arthur Project

A professional website for DC Arthur — showcasing residential and commercial construction, design, and project management services.

## 🚀 Tech Stack

- **HTML / CSS / JavaScript** — static site, no build step required
- **Playwright** — end-to-end browser testing
- **Formspree** — serverless contact-form handling
- **GitHub Actions** — automated CI (E2E-Tests workflow)

## 🧪 Running Tests Locally

```bash
npm install
npx playwright install --with-deps chromium
npx playwright test
```

## 🤖 CI / Continuous Integration

Every push and pull request triggers the **E2E-Tests** GitHub Actions workflow, which:

1. Installs Node 20 and project dependencies
2. Installs the Chromium browser via Playwright
3. Spins up a local `http-server` on port 8080
4. Runs all Playwright end-to-end tests
5. Uploads an HTML test report as an artifact (retained 7 days)

The workflow is named **`E2E-Tests`** so it can be added to the Branch Protection rule on `main`, ensuring no code is merged unless all tests pass.

## 🔒 Branch Protection & Code Ownership

- The `main` branch is protected — merging requires the **E2E-Tests** check to pass.
- A [CODEOWNERS](.github/CODEOWNERS) file ensures **@aosng007** must approve every pull request before it can be merged.
