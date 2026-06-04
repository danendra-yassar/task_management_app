# Task Management Platform - Technical Assessment

## 📌 Overview
This is a full-stack implementation project for a Task Management platform built as part of a Technical Assessment. The application separates concerns between a backend RESTful API using **Laravel 11** and a modern interactive frontend using **Next.js 15 (App Router)** with **TypeScript** and **Tailwind CSS**.

The system meets the requested industry-standard minimum requirements, including database performance optimizations, secure file upload handling, background job processing, and a responsive user interface.

---

## 📂 Project Structure
The project is organized as a clean monorepo with a clear separation between server and client sides according to the submission guidelines:

```text
transcosmos_assesment_danendra/
├── backend/                  # RESTful API (Laravel 11 & PHP 8.2+)
│   ├── app/                  # Core logic (Controllers, Models, Jobs)
│   ├── config/               # Application configuration
│   ├── database/             # Migrations, Seeders, and SQL Dump
│   │   └── transcosmos_db.sql # DB Dump: Schema + Sample Data (Test rules)
│   ├── routes/               # API endpoint definitions
│   └── README.md             # Backend-specific notes
├── frontend/                 # Client SPA (Next.js 15 + Tailwind CSS)
│   ├── app/                  # Next.js App Router (Pages & Components)
│   │   ├── components/       # Reusable UI (Dashboard layout, etc.)
│   │   ├── login/            # Client authentication features
│   │   └── utils/            # Axios API engine & interceptors
│   ├── public/               # Static files & frontend assets
│   └── README.md             # Frontend-specific notes
└── README.md                 # Main project documentation (this file)
```

