// 1. GLOBAL VARIABLES
let destinations = []; 
let bookedTrips = loadTripsFromLocalStorage(); 

const gridContainer = document.getElementById('destinations-grid');
const myTripsContainer = document.getElementById('myttrips');

// --- API CONFIGURATION ---
const API_BASE_URL = 'backend/api.php'; 
const LOGIN_URL    = 'backend/login.php'; 
const REGISTER_URL = 'backend/auth.php';  
const CONTACT_URL  = 'backend/contact.php';

// 2. MAIN INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    
    // A. Initialize Tabs (Show Hero by default)
    setupTabNavigation();
    startHeroSlideshow();
    // B. Load Data
    fetchDestinationsFromDB();
    renderBookedTrips(); 
    setupMissionVision();
    setupAuthentication(); 
    setupContactForm();
    checkLoginState();

    // C. Setup Search
    const searchInput = document.getElementById('search-input');
    if(searchInput) {
        searchInput.addEventListener('input', filterDestinations);
    }
});

// SWITCH TABS
function setupTabNavigation() {
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('main section'); // Gets all sections
    const bookNowBtn = document.querySelector('.cta-button');
    const logo = document.querySelector('.logo');

    // Define the specific sections by ID for easy access
    const heroSection = document.getElementById('heropage');
    const travelSection = document.getElementById('travelpage');

    // Function to switch tabs
    function switchTab(targetId) {
        sections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active-section');
        });
        
        if (targetId === 'travelpage' || targetId === 'home') {
            if(heroSection) {
                heroSection.style.display = 'flex'; // Hero uses flexbox in CSS
                heroSection.classList.add('active-section');
            }
            if(travelSection) {
                travelSection.style.display = 'block';
                travelSection.classList.add('active-section');
            }
            // If specific 'travelpage' was clicked, scroll to it. Otherwise scroll top.
            if(targetId === 'travelpage') {
                setTimeout(() => {
                    travelSection.scrollIntoView({ behavior: 'smooth' });
                }, 10);
            } else {
                window.scrollTo(0, 0);
            }

        } else {
            const targetSection = document.getElementById(targetId);
            if(targetSection) {
                targetSection.style.display = 'block';
                targetSection.classList.add('active-section');
                window.scrollTo(0, 0);
            }
        }

        // 3. Update Navigation Active State
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            const href = link.getAttribute('href').substring(1);
            // If we are in "Home" mode, highlight 'travelpage' link
            if (href === targetId) {
                link.classList.add('active-link');
            }
        });
    }
    // Nav Links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1); 
            switchTab(targetId);
        });
    });

    if(bookNowBtn) {
        bookNowBtn.addEventListener('click', () => {
            switchTab('travelpage');
        });
    }
    // Logo -> "Home" 
    if(logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => {
            switchTab('home'); 
        });
    }
    switchTab('home');
}

// 3. MISSION & VISION 
function setupMissionVision() {
    const missionBtn = document.getElementById("missionBtn");
    if(missionBtn) {
        missionBtn.addEventListener("click", function(event) {
            event.preventDefault();
            const mission = "Mission: To help travelers by providing a secure, easy, and comprehensive platform that simplifies the tiring process of trip planning and ensures a smooth, enjoyable, and stress-free travel experience. To promote hidden tourist destinations, encouraging travelers to discover new places and experience its beauty.";
            const vision = "Vision: To be a reliable and innovative travel website that connects travelers to meaningful experiences and unforgettable journeys. In the future, KNI Travels aims to become one of the most trusted travel services.";
            alert(mission + "\n\n" + vision);
        });
    }
}

// 4. AUTHENTICATION LOGIC
// 4. AUTHENTICATION LOGIC
function setupAuthentication() {
    const modal = document.getElementById("loginModal");
    const loginBtn = document.querySelector(".login-btn"); 
    const closeSpan = document.querySelector(".close-btn");
    
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if(loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if(localStorage.getItem('username')) {
                alert("You are already logged in as " + localStorage.getItem('username'));
            } else {
                modal.style.display = "block";
            }
        });
    }
    if(closeSpan) closeSpan.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if(e.target == modal) modal.style.display = "none"; };

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

    // --- FIX 1: LOGIN LOGIC ---
    if(loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById("login-username").value;
            const password = document.getElementById("login-password").value;
            const msg = document.getElementById("login-message");

            // USE LOGIN_URL HERE
            fetch(LOGIN_URL, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    msg.style.color = "green";
                    msg.textContent = "Login Successful!";
                    
                    if (data.user) {
                        localStorage.setItem('user_id', data.user.id);
                        localStorage.setItem('username', data.user.username);
                        localStorage.setItem('role', data.user.role); // Save role
                    }
                    
                    setTimeout(() => {
                        modal.style.display = "none";
                        checkLoginState(); 
                        // Redirect based on role from DB
                        if(data.user && data.user.role === 'admin') {
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
            .catch(err => {
                console.error(err);
                msg.textContent = "Error: Check console (F12)";
            });
        });
    }

    // --- FIX 2: REGISTRATION LOGIC ---
    if(registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById("reg-username").value;
            const password = document.getElementById("reg-password").value;
            const msg = document.getElementById("reg-message");

            // REGISTER_URL now correctly points to auth.php
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
                        // Switch to login tab automatically
                        tabLogin.click(); 
                        const loginMsg = document.getElementById("login-message");
                        if(loginMsg) {
                            loginMsg.textContent = "Account created! Please log in.";
                            loginMsg.style.color = "green";
                        }
                        // Clear inputs
                        document.getElementById("reg-username").value = "";
                        document.getElementById("reg-password").value = "";
                    }, 1500);
                } else {
                    msg.style.color = "red";
                    msg.textContent = data.message;
                }
            })
            .catch(err => {
                console.error(err);
                msg.textContent = "Error: Check console (F12)";
            });
        });
    }
}

// 5. CONTACT FORM
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;
            const responseMsg = document.getElementById('contact-response');

            fetch(CONTACT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    responseMsg.style.color = 'green';
                    responseMsg.textContent = data.message;
                    contactForm.reset();
                } else {
                    responseMsg.style.color = 'red';
                    responseMsg.textContent = data.message;
                }
            })
            .catch(err => console.error("Error sending message:", err));
        });
    }
}

// 6. UI UTILITIES
function checkLoginState() {
    const username = localStorage.getItem('username');
    const loginLink = document.querySelector('.login-btn');
    const displayUser = document.getElementById('display-username');
    const logoutBtn = document.getElementById('logout-btn');

    if(username) {
        if(loginLink) loginLink.textContent = "Hi, " + username;
        if(displayUser) displayUser.textContent = username;
        if(logoutBtn) {
            logoutBtn.style.display = 'inline-block';
            logoutBtn.onclick = () => {
                localStorage.clear();
                location.reload();
            };
        }
    } else {
        if(loginLink) loginLink.textContent = "Log in";
        if(logoutBtn) logoutBtn.style.display = 'none';
    }
}

// 7. DATA FETCHING
function fetchDestinationsFromDB() {
    fetch(API_BASE_URL + '?action=read')
        .then(response => response.json())
        .then(data => {
            destinations = data;
            loadDestinations(destinations);
        })
        .catch(error => {
            console.error('Error:', error);
            gridContainer.innerHTML = '<p class="no-results">Could not load destinations.</p>';
        });
}

function loadDestinations(data) {
    gridContainer.innerHTML = '';
    if (data.length === 0) {
        gridContainer.innerHTML = '<p class="no-results">No destinations found.</p>';
        return;
    }
    data.forEach(place => {
        const card = document.createElement('article');
        card.className = 'card';
        const imgSrc = place.image_url ? place.image_url : 'https://via.placeholder.com/300';
        
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

// 8. BOOKING LOGIC
function bookTrip(tripId) {
    const userId = localStorage.getItem('user_id');
    
    if(!userId) {
        const modal = document.getElementById("loginModal");
        if(modal) {
            modal.style.display = "block";
            const msg = document.getElementById("login-message");
            if(msg) {
                msg.textContent = "Please log in to book a trip.";
                msg.style.color = "#F2994A"; 
            }
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
    if(confirm("Are you sure you want to cancel this booking?")) {
        bookedTrips = bookedTrips.filter(t => t.id != tripId);
        saveTripsToLocalStorage(); 
        renderBookedTrips();
    }
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
            <div class="booked-info"><h4>${trip.title}</h4><p>₱${trip.price}</p></div>
            <button class="cancel-btn" onclick="cancelBooking(${trip.id})">Cancel</button>
        `;
        myTripsContainer.appendChild(div);
    });
}

//HERO SLIDESHOW
function startHeroSlideshow() {
    const imgElement = document.getElementById('slideshow-img');
    
    const images = [
        '../assets/hero1.jpg', //REMOVE '/' KAPAG IRURUN USING XAMPP (localhost) magiging  'assets/hero1.jpg' nalang
        '../assets/hero2.jpg', 
        '../assets/hero3.jpg',
        '../assets/hero4.jpg',
        '../assets/hero5.jpg',
        '../assets/hero6.jpg',
        '../assets/hero7.jpg',
        '../assets/hero8.jpg'
    ];

    let currentIndex = 0;

    setInterval(() => {
        if(!imgElement) return;

        imgElement.classList.add('fade-out');

        setTimeout(() => {
            currentIndex = (currentIndex + 1) % images.length;
            imgElement.src = images[currentIndex];

            imgElement.onload = () => {
                imgElement.classList.remove('fade-out');
            };
        }, 800);
        
    }, 2800); 
}

function saveTripsToLocalStorage() { localStorage.setItem('bookedTrips', JSON.stringify(bookedTrips)); }
function loadTripsFromLocalStorage() { return JSON.parse(localStorage.getItem('bookedTrips') || '[]'); }