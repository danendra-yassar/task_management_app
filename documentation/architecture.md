# Architectural Decisions Document (ADD)

This document outlines the architectural patterns, tech stack, and design decisions made for the Task Management Platform.

## 1. System Architecture Overview
The system follows a decoupled **Headless Backend & Single Page Application (SPA) Frontend** architecture. 
- **Backend (API Provider):** Powered by Laravel 11, acting strictly as a stateless RESTful API.
- **Frontend (UI Consumer):** Powered by Next.js 15 (App Router), rendering dynamic views and maintaining client-side states.

workflow :

[ Client Browser ] <--- HTTP REST (JSON) ---> [ Laravel API Gateway ]
        |                                             |
 (Next.js Frontend)                             (Queue Driver)
                                                      |
                                              [ MySQL Database ]
                                           (Jobs & Task Metadata)

## 2. Authentication Strategy (Laravel Sanctum)
- **Decision:**  Implemented token-based authentication via Laravel Sanctum instead of full OAuth2.

- **Rationale:** Sanctum provides a lightweight, secure token guarding system perfectly suited for SPAs without the unnecessary overhead of Passport/OAuth2 protocols. Tokens are securely stored on the client side via localStorage.

## 3. Asynchronous Background Jobs (Database Queue)
- **Decision:** Moved time-consuming simulation tasks (e.g., mail notification triggers) to an asynchronous Queue system using the database driver.

- **Rationale:** Processing a database record insert shouldn't keep the client browser hanging. By dispatching a SendTaskNotification job to the background, the user receives a 201 Created payload within milliseconds, while the heavy processing runs smoothly in the background.

## 4. Database Query Optimization (Composite Indexing)
- **Decision:**  Added a composite index to the tasks table on the ['status', 'priority'] columns.

- **Rationale:** The application relies heavily on dynamic filtering. Standard B-Tree indexing on separate columns behaves poorly under compound WHERE conditions. A composite index vastly accelerates read performance during complex pagination requests.

## 4. Smart UX Flow Interceptors
- **Decision:**  Form initialization forces a default pending status. Upon viewing a task's full criteria via the detail modal, an automated PUT request upgrades the task state to in_progress.

- **Rationale:** Automates project lifecycle updates, keeping project leads informed of real-time workspace actions without requiring explicit state inputs from developers.