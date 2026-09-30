# UPI MDR Calculator India (UPI MDR కాలిక్యులేటర్)

A production-grade, bilingual (English & Telugu) Progressive Web App (PWA) to calculate **UPI Merchant Discount Rates (MDR)**, customer charges (₹0), and net merchant settlements under official Reserve Bank of India (RBI) and National Payments Corporation of India (NPCI) guidelines.

---

## 📌 Key Highlights & Rules

- **Person-to-Person (P2P):** 100% Free with 0% MDR and ₹0 customer charges.
- **Transactions up to ₹2,000 (≤ ₹2,000):** 100% Free across all merchants and payment instruments (0% MDR).
- **Transactions above ₹2,000 (> ₹2,000):**
  - **Customer Charge:** ALWAYS ₹0 (UPI is completely free for paying consumers).
  - **Merchant MDR (Announced Framework):**
    - Small Merchants (Turnover ≤ ₹20 Lakhs): **0.30%** (Capped at max ₹15)
    - Regular Commercial Merchants: **0.65%** (Capped at max ₹30)
    - Essential Services, Utilities & Fuel: **0.50%** (Capped at max ₹15)
    - Large Enterprises: **0.90%** (Capped at max ₹45)
  - **Prepaid Wallet / PPI on UPI QR:** 1.1% interchange for standard retail (> ₹2,000).

---

## 🚀 Features

- 🔊 **Soundbox-Style Layman View:** 4 giant, plain-language steps showing Customer Paid, Customer Extra Fee (₹0), Bank Cut Fee, and Merchant Bank Credit.
- 🇮🇳 **Bilingual Localization:** Natural, clear Telugu (తెలుగు) and English designed for shopkeepers in Telangana & Andhra Pradesh.
- ⚡ **1-Tap Quick Buttons:** Instantly test ₹500, ₹1,000, ₹2,000 (Free), and ₹2,005 (MDR Trigger).
- 📊 **Business Volume Estimator:** Project monthly and annual settlement figures based on daily transaction volume and average ticket size.
- 📱 **Progressive Web App (PWA):** Installable on Android, iOS, and Desktop with offline caching via Service Worker.
- 🧪 **100% Tested:** Complete Vitest test suite covering edge cases, caps, and regulatory dates.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Testing:** Vitest
- **PWA:** Vite PWA Plugin + Custom Service Worker

---

## 💻 Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd <your-repo-name>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run Unit Tests:**
   ```bash
   npm run test
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📜 Regulatory Sources

- Reserve Bank of India (RBI)
- National Payments Corporation of India (NPCI)
- Ministry of Finance, Department of Financial Services (DFS), Government of India
- Payment and Settlement Systems Act, Section 10A

---

## ⚖️ Disclaimer

*This application is an independent public utility calculator built for informational and estimation purposes. It is not affiliated with the Reserve Bank of India (RBI), NPCI, or the Government of India.*
