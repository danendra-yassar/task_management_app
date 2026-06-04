# Comprehensive Installation & Environment Setup Guide

This guide provides explicit step-by-step instructions to boot the complete ecosystem on a local development environment.

## Prerequisite Environment
Before starting, ensure you have the following runtimes installed on your machine:
- **PHP:** >= 8.2 (With PDO, OpenSSL, and Mbstring extensions enabled)
- **Composer:** For managing PHP dependencies
- **Node.js:** >= 18.x (Includes `npm` package manager)
- **Database Engine:** MySQL / MariaDB (e.g., via XAMPP)

---

## Step 1: Database Initialization
1. Launch your local MySQL control panel (XAMPP/Laragon).
2. Create an empty database schema named `transcosmos_db`.
3. Locate the provided SQL file dump inside the repository:
   `backend/database/transcosmos_db.sql`
4. Import the SQL file via phpMyAdmin or your preferred database GUI tool to provision the tables, foreign keys, constraints, and mock seeder data.

---

## Step 2: Backend Backend Setup (Laravel)
1. Navigate into the backend root folder:
   ```bash
   cd backend

2. Duplicate the environment template and name it .env:
    cp .env.example .env

3. Open .env and verify your database parameters match your system credentials:
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=transcosmos_db
    DB_USERNAME=root
    DB_PASSWORD=
    QUEUE_CONNECTION=database

4. Boot up the local API engine server: 
    php artisan serve

5. Open an independent terminal terminal split, navigate to the backend directory, and spawn the background worker queue process:
    php artisan queue:work

## Step 3: Frontend Client Setup (Next.js)

1. Open a fresh terminal tab and change into the frontend workspace:
    cd frontend

2. Verify that axios and lucide-react dependencies are mapped by installing any required packages:
    npm install

3. Spin up the modern Next.js development server:
    npm run dev

4. Fire up modern browser and navigate to the application endpoint:
    http://localhost:3000/login
