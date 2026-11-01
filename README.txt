TOLLÉRA — Automated Toll Collection System

PAGES & ARCHITECTURE
- index.html               Live Operations dashboard (metrics, transactions table, search, CSV export)
- vehicles.html            Vehicle registry (active accounts, balance, registration modal & duplicate checks)
- vehicle-profile.html     Individual vehicle details, crossing stats & transaction history
- analytics.html           Analytics dashboard (live category revenue breakdown & outcome rates)
- rates.html               Toll rates matrix per vehicle category
- login.html               Operator authentication portal (Sign in, Create account)
- css/styles.css           Shared visual theme, component library, and light/dark theme styling
- js/                      ES module scripts with live Firebase Firestore sync and local fallback

HOW TO RUN
1. Serve the folder using VS Code Live Server or any local HTTP server (required for ES module loading).
2. Open index.html in Chrome / Edge / Firefox.
3. Sign in with an authorized operator email & password or create an account.
4. Use the left navigation rail to switch between Live Operations, Vehicle Registry, Analytics, and Toll Rates.

FEATURES & RESILIENCE
- Cloud-connected to Firebase Firestore with live synchronization.
- Real-time vehicle registration with automatic duplicate check for both plate numbers and RFID tags.
- Dynamic toll deduction calculations and category revenue breakdown.
- Consistent Sign Out and Theme Toggle controls available on all pages.
