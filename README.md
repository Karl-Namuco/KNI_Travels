# KNI Travels Web App

**KNI Travels** is a travel website designed to make planning trips easier and faster. It helps users discover both international landmarks and local Philippine gems in one place.

The site is built as a **Single Page Application**, meaning you can browse and book trips instantly without page reloads.

## Key Features

- **For travelers:** Browse local and international packages, book trips, use the "My Trips" dashboard, and create accounts.
- **For admins:** Manage destinations, view bookings, and read customer inquiries.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** PHP
- **Database:** MySQL
- **Tools:** VS Code, XAMPP

## How to Run Locally

1. Install XAMPP and start Apache and MySQL.
2. Clone this repository into your XAMPP `htdocs` folder.
3. Open `http://localhost/phpmyadmin`, create a database named `kni_travels`, and import `backend/kni.sql`.
4. Leave `frontend/config.js` set to `../backend`. If your local MySQL port is not `3325`, update the fallback port in `backend/db.php`.
5. Open `http://localhost/KNI_Travels/frontend/`.

## Free Demo Deployment

This project has a static HTML/CSS/JavaScript frontend and a PHP + MySQL backend. Use Vercel for the frontend and a free PHP/MySQL host such as InfinityFree for the backend. Vercel does not run this PHP backend.

### Set Up the PHP Backend and Database

1. Create a free hosting account and a MySQL database with the host.
2. Open that database in phpMyAdmin and import `backend/kni.sql` into the selected database. This schema is intended for a fresh database.
3. Copy `backend/db.config.example.php` to `backend/db.config.php` and enter the database host, username, password, database name, and port supplied by the host. Do not commit `db.config.php`; it is excluded by `.gitignore`.
4. Upload the backend PHP endpoints and your private `db.config.php` to a `backend` folder in the host's web root. If you deploy from Git, upload `db.config.php` separately through the host's file manager because it is intentionally excluded from Git. Do not upload `kni.sql` or the example config file as public files.
5. Confirm that the backend is reachable at a URL like `https://your-host.example/backend/api.php?action=read`.

### Deploy the Frontend to Vercel

1. Edit `frontend/config.js` and set `window.KNI_API_BASE_URL` to the backend folder URL, for example `https://your-host.example/backend`. Do not add a trailing slash.
2. In Vercel, import this Git repository and set the project **Root Directory** to `frontend`. Select **Other** as the framework; no build command is needed and the output directory is `.`.
3. Deploy, then test destination loading, login, registration, contact, and booking flows using the Vercel URL.

## Demo-Only Security Warning

Do not use this deployment for real users or sensitive information. The admin page's role check is only in the browser, and the backend admin actions do not enforce authorization. Anyone who can reach the API can modify destinations, bookings, and messages. The project also includes a default admin account in the SQL seed data. A production deployment needs server-side authentication and authorization before exposing these actions.

## Developers

Group 8 - BSIT 3A, TUP Manila

- Karl Cedrick R. Namuco - Interface and frontend function
- Nero Arbert D. De paz - Extra features and backend connection
- Ia Mary R. Sorio - Design and accessibility
