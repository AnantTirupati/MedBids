# System Verification Test Suite

This document lists steps to verify and run the MedBids system tests.

---

## 1. System Verification Suite (`scripts/test-runner.ts`)
We created a custom test suite using TypeScript to validate all primary logistic pathways:
*   Patient Phone Login Authentication
*   Pharmacy Phone Login Authentication
*   Prescription Uploading (Pending state check)
*   Admin Verification Moderation (Live auction room initialization)
*   Pharmacy Bid Quote Submissions
*   Real-Time Lowest Bid Recalculation
*   Notification dispatch engine triggers

---

## 2. Running Tests
Run the test runner locally using `tsx`:
```bash
npx tsx scripts/test-runner.ts
```
Outputs passed/failed assertions and summaries directly.
