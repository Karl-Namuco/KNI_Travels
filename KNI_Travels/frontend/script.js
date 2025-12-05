// 1. GLOBAL VARIABLES
let destinations = []; 
let bookedTrips = loadTripsFromLocalStorage(); 

const gridContainer = document.getElementById('destinations-grid');
const myTripsContainer = document.getElementById('myttrips');

// --- API CONFIGURATION ---
// Use '../backend/' if your HTML is in a subfolder (like 'frontend' or 'KNI_Travels')
// Use 'backend/' if your HTML is in the root folder.
const API_BASE_URL = '../backend/api.php'; 
const AUTH_URL = '../backend/auth.php';
const REGISTER_URL = '../backend/register.php';

// 2. MAIN INITIALIZATION (Runs when page loads)
document.addEventListener('DOMContentLoaded', () => {
    
    // A. Load Data
    fetchDestinationsFromDB();
    renderBookedTrips(); 
    setupMissionVision();
    setupAuthentication(); // Handles Login, Register, and Tabs

    // B. Setup Search
    const searchInput = document.getElementById('search-input');
    if(searchInput) {
        searchInput.addEventListener('input', filterDestinations);
    }
});

// 3. MISSION & VISION 
function setupMissionVision() {
    const missionBtn = document.getElementById("missionBtn");
    if(missionBtn) {
        missionBtn.addEventListener("click", function(event) {
            event.preventDefault();
            const mission = "Mission: To help travelers by providing a secure, easy platform...";
            const vision = "Vision: To be a reliable and innovative travel website...";
            alert(mission + "\n\n" + vision);
        });
    }
}

// 4. AUTHENTICATION LOGIC (Login/Register/Tabs)
function setupAuthentication() {
    const modal = document.getElementById("loginModal");
    const loginBtn = document.querySelector(".login-btn"); 
    const closeSpan = document.querySelector(".close-btn");
    
    // Tabs & Forms
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    // Open/Close Modal
    if(loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = "block";
        });
    }
    if(closeSpan) closeSpan.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if(e.target == modal) modal.style.display = "none"; };

    // Tab Switching
    if(tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => {
            loginForm.style.display = "block";
            registerForm.style.display = "none";
            tabLogin.classList.add("active-tab");
            tabRegister.classList.remove("active-tab");
        });

        tabRegister.addEventListener('click', () => {
            loginForm.style.display = "none";
            registerForm.style.display = "block";
            tabRegister.classList.add("active-tab");
            tabLogin.classList.remove("active-tab");
        });
    }

    // Login Submit
    if(loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById("login-username").value;
            const password = document.getElementById("login-password").value;
            // CHECK: Look for message ID (either login-message or login-error)
            const msg = document.getElementById("login-message") || document.getElementById("login-error");

            if(!msg) { console.error("Missing error message element in HTML"); return; }

            // Point to your Auth Backend
            fetch(AUTH_URL, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    msg.style.color = "green";
                    msg.textContent = "Login Successful!";
                    
                    // Save User Info
                    localStorage.setItem('user_id', data.user_id);
                    localStorage.setItem('username', username);
                    
                    setTimeout(() => {
                        modal.style.display = "none";
                        alert("Welcome, " + username + "!");
                        // If Admin, go to Admin Panel. If User, reload page.
                        if(username.toLowerCase() === 'admin') {
                            window.location.href = "admin.html";
                        } else {
                            location.reload(); 
                        }
                    }, 1000);
                } else {
                    msg.style.color = "red";
                    msg.textContent = data.message;
                }
            })
            .catch(err => console.error(err));
        });
    }

    // Register Submit
    if(registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById("reg-username").value;
            const password = document.getElementById("reg-password").value;
            const msg = document.getElementById("reg-message");

            fetch(REGISTER_URL, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    msg.style.color = "green";
                    msg.textContent = "Account Created!";
                    setTimeout(() => {
                        tabLogin.click(); // Switch to login tab
                        const loginMsg = document.getElementById("login-message") || document.getElementById("login-error");
                        if(loginMsg) {
                            loginMsg.textContent = "Account created! Please log in.";
                            loginMsg.style.color = "green";
                        }
                    }, 1500);
                } else {
                    msg.style.color = "red";
                    msg.textContent = data.message;
                }
            })
            .catch(err => console.error(err));
        });
    }
}

// 5. DATA FETCHING (Destinations)
function fetchDestinationsFromDB() {
    fetch(API_BASE_URL + '?action=read')
        .then(response => {
            if (!response.ok) throw new Error("API not found at " + API_BASE_URL);
            return response.json();
        })
        .then(data => {
            destinations = data;
            loadDestinations(destinations);
        })
        .catch(error => {
            console.error('Error:', error);
            gridContainer.innerHTML = '<p class="no-results">Could not load destinations. Check Console for details.</p>';
        });
}

// 6. RENDER & FILTER FUNCTIONS
function loadDestinations(data) {
    gridContainer.innerHTML = '';
    if (data.length === 0) {
        gridContainer.innerHTML = '<p class="no-results">No destinations found.</p>';
        return;
    }
    data.forEach(place => {
        const card = document.createElement('article');
        card.className = 'card';
        const imgSrc = place.image_url || place.image;
        
        // Added style="cursor:pointer" to make the whole card clickable for booking if you want
        card.innerHTML = `
             <div class="card-img"><img src="${imgSrc}" alt="${place.title}"></div>
             <div class="card-content">
                 <div class="location"><i class="fa-solid fa-location-dot"></i> <span>${place.location}</span></div>
                 <h2 class="card-title">${place.title}</h2>
                 <div class="action-btn" onclick="bookTrip(${place.id})" style="cursor: pointer;">
                     <span class="price">₱${place.price}</span>
                     <button class="view-btn">Book Now <i class="fa-solid fa-chevron-right"></i></button>
                 </div>
             </div>
         `;
        gridContainer.appendChild(card);
    });
}

function filterDestinations() {
    const term = document.getElementById('search-input').value.toLowerCase();
    const filtered = destinations.filter(p => 
        p.title.toLowerCase().includes(term) || p.location.toLowerCase().includes(term)
    );
    loadDestinations(filtered);
}

// 7. BOOKING LOGIC (LocalStorage)
function bookTrip(tripId) {
    // Check if user is logged in first!
    const userId = localStorage.getItem('user_id');
    
    if(!userId) {
        // REMOVED ALERT: alert("Please Log In to book a trip!");
        
        // Directly find the Modal and open it
        const modal = document.getElementById("loginModal");
        if(modal) {
            modal.style.display = "block";
            // Set a friendly message so they know why it opened
            const msg = document.getElementById("login-message") || document.getElementById("login-error");
            if(msg) {
                msg.textContent = "Please log in to book a trip.";
                msg.style.color = "#F2994A"; // Orange accent color
            }
        } else {
            // Fallback just in case
            console.error("Could not find loginModal. Trying button click...");
            const loginBtn = document.querySelector(".login-btn");
            if(loginBtn) loginBtn.click(); 
        }
        return;
    }

    const trip = destinations.find(t => t.id == tripId);
    if (!trip) return;

    if (bookedTrips.some(t => t.id == tripId)) {
        alert(`You already booked ${trip.title}.`);
        return;
    }

    bookedTrips.push(trip);
    saveTripsToLocalStorage(); 
    renderBookedTrips();
    alert(`✅ Successfully booked ${trip.title}!`);
}

function cancelBooking(tripId) {
    bookedTrips = bookedTrips.filter(t => t.id != tripId);
    saveTripsToLocalStorage(); 
    renderBookedTrips();
}

function renderBookedTrips() {
    myTripsContainer.innerHTML = ''; 
    if (bookedTrips.length === 0) {
        myTripsContainer.innerHTML = '<p class="empty-message">You have no active bookings.</p>';
        return;
    }
    bookedTrips.forEach(trip => {
        const div = document.createElement('div');
        div.className = 'booked-card';
        div.innerHTML = `
            <div class="booked-info"><h4>${trip.title}</h4><p>$${trip.price}</p></div>
            <button class="cancel-btn" onclick="cancelBooking(${trip.id})">Cancel</button>
        `;
        myTripsContainer.appendChild(div);
    });
}

function saveTripsToLocalStorage() { localStorage.setItem('bookedTrips', JSON.stringify(bookedTrips)); }
function loadTripsFromLocalStorage() { return JSON.parse(localStorage.getItem('bookedTrips') || '[]'); }