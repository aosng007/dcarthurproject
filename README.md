# DC Arthur Project

A professional website for DC Arthur — showcasing residential and commercial construction, design, and project management services.

## 🚀 Tech Stack

- **HTML / CSS / JavaScript** — static site, no build step required
- **Playwright** — end-to-end browser testing
- **Formspree** — serverless contact-form handling
- **GitHub Actions** — automated CI (E2E-Tests workflow)

## 🎨 CSS Themes

Three interchangeable themes are available and can be toggled via the **Switch Theme** button (bottom-right of every page):

| Theme | File | Description |
|-------|------|-------------|
| **Minimal** | `style-minimal.css` | Pure white · deep charcoal · Cormorant Garamond + Inter |
| **Corporate** | `style-corporate.css` | Dark navy · gold accents · DM Serif Display + DM Sans |
| **Hampton** | `style-hampton.css` | Crisp white · deep navy (#002147) · taupe borders · Lato + Montserrat |

The switcher cycles **Minimal → Corporate → Hampton → Minimal** and persists the selection to `localStorage` under the key `dcap-theme`.

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

The workflow is named **`E2E-Tests`**; in branch protection rules on `main`, the required status check will appear as **`E2E-Tests / E2E Tests`**, ensuring no code is merged unless all tests pass.

## 🔒 Branch Protection & Code Ownership

- The `main` branch is protected — merging requires the **`E2E-Tests / E2E Tests`** check to pass.
- A [CODEOWNERS](.github/CODEOWNERS) file ensures **@aosng007** must approve every pull request before it can be merged.
