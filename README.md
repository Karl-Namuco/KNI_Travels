# KNI Travels Web App

**KNI Travels** is a travel website designed to make planning trips easier and faster. It helps users discover both international landmarks and local Philippine gems in one place.

The site is built as a **Single Page Application (SPA)**, meaning you can browse and book trips instantly without annoying page reloads.

---

## Key Features
* **For Travelers:**
    * Browse travel packages (Local & International).
    * Book trips instantly with a pop-up modal.
    * Secure Login & Sign Up.
    * "My Trips" dashboard to track bookings.
* **For Admins:**
    * Manage destinations (Add/Edit/Delete).
    * View all customer bookings.
    * Read customer inquiries.

---

## Tech Stack
* **Frontend:** HTML, CSS, JavaScript
* **Backend:** PHP
* **Database:** MySQL
* **Tools:** VS Code, XAMPP

---

## Performance
We focused on making the site fast and easy to use on phones and computers.
* [cite_start]**Desktop Score:** 99/100 (Performance) [cite: 405]
* [cite_start]**Accessibility:** 100/100 [cite: 405]

---

## How to Run Locally

1.  **Install XAMPP** and start **Apache** & **MySQL**.
2.  **Clone this repo** into your XAMPP `htdocs` folder.
3.  **Setup Database:**
    * Go to `http://localhost/phpmyadmin`.
    * Create a database named `kni_travels`.
    * Import the `backend/kni.sql` file.
4.  **Connect:**
    * Check `backend/db.php` to make sure the settings match your XAMPP (usually user: `root`, password: empty).
5.  **Run:**
    * Open your browser and go to `http://localhost/KNI_Travels/frontend/`.

---

## Developers (Group 8 - BSIT 3A (TUP MANILA))
* [cite_start]**Nero Arbert D. De paz** - Extra features & Backend connection
* [cite_start]**Karl Cedrick R. Namuco** - Interface & Frontend Function
* [cite_start]**Ia Mary R. Sorio** - Design & Accesibility
