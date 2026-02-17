CarbonTrack
Blockchain-Inspired Carbon Emission Reporting Platform

CarbonTrack is a web-based platform that enables companies to submit, track, and verify carbon emission data in a transparent and tamper-resistant manner.

The system uses SHA-256 hashing to simulate blockchain-like immutability and ensures that every emission submission and audit action is securely recorded.

Features
Authentication

Firebase Email/Password Login

Role-based access (Company, Auditor, Government)

Metamask Wallet Authentication (Web3 Login)

Company Portal

Monthly Emission Report Submission

Upload supporting evidence

Automatic CO₂ emission calculation

SHA-256 hash generation for each submission

View verification status and auditor remarks

Emission analytics dashboard (Chart.js)

Auditor Portal

View all pending submissions

Review evidence and recompute emissions

Approve or Reject reports

Add verification remarks

Auditor decision hashing

Public Dashboard

View verified company reports

Transparent sustainability records

Emission comparison

Company-wise emission analytics

Blockchain Simulation

Each submission generates:

submissionHash

prevHash

Creates an append-only hash chain

Prevents silent data tampering

🛠 Tech Stack
Frontend

HTML

CSS

JavaScript (ES Modules)

Chart.js

CryptoJS (SHA-256)

Ethers.js (Metamask Integration)

Backend / Database

Firebase Authentication

Firebase Firestore

Firebase Security Rules

How Hashing Works

For every submission:

SHA256({
  companyId,
  month,
  emissionData,
  totalEmission,
  timestamp,
  prevHash
})


If any data is modified → Hash changes.

Auditor decisions are also hashed.

This creates a blockchain-like integrity mechanism.

 Project Structure
CarbonTrack/
│
├── index.html
├── login.html
├── register.html
├── company.html
├── auditor.html
├── public.html
│
├── style.css
│
└── js/
    ├── firebase.js
    ├── auth-login.js
    ├── auth-register.js
    ├── protect.js
    ├── logout.js
    ├── company-report.js
    ├── auditor.js
    └── public.js

🔧 Setup Instructions

Clone the repository:

git clone https://github.com/yourusername/carbontrack.git


Create a Firebase project

Enable:

Authentication (Email/Password)

Firestore Database

Firebase Storage (optional)

Add your Firebase config in:

js/firebase.js


Run locally using:

Live Server (VS Code)

Firestore Structure
users collection
users/{uid}
    orgName
    email
    role
    walletAddress (optional)

reports collection
reports/{reportId}
    companyId
    month
    electricity
    fuel
    transport
    waste
    totalEmission
    status (pending / approved / rejected)
    remarks
    submissionHash
    prevHash
    auditorHash
    timestamp

    Use Case

ESG Reporting

Corporate Sustainability Tracking

Academic Blockchain Simulation Projects

Transparent Carbon Disclosure Systems

Developed By

Prakhar Agrawal
Blockchain Division
CyberLabs – IIT (ISM) Dhanbad

License

This project is for academic and demonstration purposes.