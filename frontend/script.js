// 1. GLOBAL VARIABLES
let destinations = []; 
let bookedTrips = loadTripsFromLocalStorage(); 

const gridContainer = document.getElementById('destinations-grid');
const myTripsContainer = document.getElementById('myttrips');

// --- API CONFIGURATION ---
const API_BASE_URL = '../backend/api.php'; 
const LOGIN_URL    = '../backend/login.php'; 
const REGISTER_URL = '../backend/auth.php';  
const CONTACT_URL  = '../backend/contact.php';
const RESET_URL    = '../backend/reset_password.php';

// 2. MAIN INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    
    // A. Initialize Tabs
    setupTabNavigation();
    startHeroSlideshow();
    // B. Load Data
    fetchDestinationsFromDB();
    renderBookedTrips(); 
    setupFooter();
    setupAuthentication(); 
    setupContactForm();
    checkLoginState();
    loadProfileData();

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
    // Nav Links Click Listener
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // --- THE FIX: ALLOW ADMIN LINK TO WORK ---
            // If the link goes to "admin.html", stop this function and let the browser load the page.
            if (href === 'admin.html') {
                return; // Do nothing, just let the link work naturally
            }

            // For all other links (Home, Travel, etc.), prevent the page from reloading
            e.preventDefault();
            const targetId = href.substring(1); // Remove the '#'
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

// 3. footer
function setupFooter() {
    const missionBtn = document.getElementById("missionBtn");
    const aboutUsBtn = document.getElementById("aboutUsBtn");
    if(missionBtn) {
        missionBtn.addEventListener("click", function(event) {
            event.preventDefault();
            const mission = "Mission: To help travelers by providing a secure, easy, and comprehensive platform that simplifies the tiring process of trip planning and ensures a smooth, enjoyable, and stress-free travel experience. To promote hidden tourist destinations, encouraging travelers to discover new places and experience its beauty.";
            const vision = "Vision: To be a reliable and innovative travel website that connects travelers to meaningful experiences and unforgettable journeys. In the future, KNI Travels aims to become one of the most trusted travel services.";
            alert(mission + "\n\n" + vision);
        });
    }
    if(aboutUsBtn) {
        aboutUsBtn.addEventListener("click", function(event) {
            event.preventDefault();
            const aboutus = "KNI Travels is a fictional travel service business that helps the users to make their trip planning safer, easier, faster, and more enjoyable. The company provides travel packages and services, guides, and booking assistance to help the users with their travels. By using a web application to promote and deliver its services, KNI Travels aims to provide a convenient and reliable platform where users can explore destinations, plan trips, and book travel services easier all in one place.";
            alert(aboutus);
        });
    }
}

// 4. AUTHENTICATION LOGIC
function setupAuthentication() {
    const modal = document.getElementById("loginModal");
    const loginBtn = document.querySelector(".login-btn"); 
    const closeSpan = document.querySelector(".close-btn");
    
    // TABS
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    
    // FORMS
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const resetForm = document.getElementById("resetForm"); // NEW

    // NEW LINKS
    const forgotLink = document.getElementById("forgot-pass-link");
    const backToLogin = document.getElementById("back-to-login");

    // 1. OPEN MODAL LOGIC
    if(loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if(localStorage.getItem('username')) {
                alert("You are already logged in as " + localStorage.getItem('username'));
            } else {
                modal.style.display = "block";
                // Always reset to Login view when opening
                if(loginForm) loginForm.style.display = "block";
                if(registerForm) registerForm.style.display = "none";
                if(resetForm) resetForm.style.display = "none";
                
                // Reset active tabs
                if(tabLogin) tabLogin.classList.add("active-tab");
                if(tabRegister) tabRegister.classList.remove("active-tab");
            }
        });
    }

    // CLOSE MODAL LOGIC
    if(closeSpan) closeSpan.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if(e.target == modal) modal.style.display = "none"; };

    // 2. TAB SWITCHING (Login vs Register)
    if(tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => {
            loginForm.style.display = "block";
            registerForm.style.display = "none";
            if(resetForm) resetForm.style.display = "none"; // Hide reset
            tabLogin.classList.add("active-tab");
            tabRegister.classList.remove("active-tab");
        });

        tabRegister.addEventListener('click', () => {
            loginForm.style.display = "none";
            registerForm.style.display = "block";
            if(resetForm) resetForm.style.display = "none"; // Hide reset
            tabRegister.classList.add("active-tab");
            tabLogin.classList.remove("active-tab");
        });
    }

    // 3. FORGOT PASSWORD LINKS (New Logic)
    if(forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = "none";
            registerForm.style.display = "none";
            resetForm.style.display = "block"; // Show reset form
        });
    }

    if(backToLogin) {
        backToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            resetForm.style.display = "none";
            loginForm.style.display = "block";
        });
    }

    // 4. RESET PASSWORD SUBMIT (New Logic)
    if(resetForm) {
        resetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById("reset-username").value;
            const newPassword = document.getElementById("reset-new-password").value;
            const msg = document.getElementById("reset-message");

            fetch(RESET_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, new_password: newPassword })
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    msg.style.color = "green";
                    msg.textContent = "Password updated! Please log in.";
                    setTimeout(() => {
                        // Clear form and go back to login
                        document.getElementById("reset-username").value = "";
                        document.getElementById("reset-new-password").value = "";
                        msg.textContent = "";
                        resetForm.style.display = "none";
                        loginForm.style.display = "block";
                    }, 2000);
                } else {
                    msg.style.color = "red";
                    msg.textContent = data.message;
                }
            })
            .catch(err => {
                console.error(err);
                msg.textContent = "Error connecting to server.";
                msg.style.color = "red";
            });
        });
    }

    // 5. LOGIN SUBMIT (Original Logic)
    if(loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById("login-username").value;
            const password = document.getElementById("login-password").value;
            const msg = document.getElementById("login-message");

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
                        localStorage.setItem('role', data.user.role);
                    }
                    
                    setTimeout(() => {
                        modal.style.display = "none";
                        checkLoginState(); 
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

    // 6. REGISTER SUBMIT (Original Logic)
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
                        const loginMsg = document.getElementById("login-message");
                        if(loginMsg) {
                            loginMsg.textContent = "Account created! Please log in.";
                            loginMsg.style.color = "green";
                        }
                        // Clear inputs
                        document.getElementById("reg-username").value = "";
                        document.getElementById("reg-password").value = "";
                        msg.textContent = "";
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
    // 1. Get data from Local Storage
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role'); // This was saved during login
    
    // 2. Get UI Elements
    const loginLink = document.querySelector('.login-btn');
    const displayUser = document.getElementById('display-username');
    const logoutBtn = document.getElementById('logout-btn');
    const adminLink = document.getElementById('admin-nav-link'); // The new link

    // 3. Logic
    if(username) {
        // User is Logged In
        if(loginLink) loginLink.textContent = "Hi, " + username;
        if(displayUser) displayUser.textContent = username;
        
        if(logoutBtn) {
            logoutBtn.style.display = 'inline-block';
            logoutBtn.onclick = () => {
                localStorage.clear();
                location.reload();
            };
        }

        // --- THE NEW ADMIN CHECK ---
        if(role === 'admin') {
            // If admin, show the link
            if(adminLink) adminLink.style.display = 'block'; 
        } else {
            // If normal user, make sure it's hidden
            if(adminLink) adminLink.style.display = 'none';
        }

    } else {
        // User is Logged Out
        if(loginLink) loginLink.textContent = "Log in";
        if(logoutBtn) logoutBtn.style.display = 'none';
        
        // Always hide admin link when logged out
        if(adminLink) adminLink.style.display = 'none';
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
let currentTripId = null;
let currentBasePrice = 0;

// Aopen pop up
function bookTrip(tripId) {
    const userId = localStorage.getItem('user_id');
    
    // Check  if logged in
    if(!userId) {
        const loginModal = document.getElementById("loginModal");
        if(loginModal) {
            loginModal.style.display = "block";
            document.getElementById("login-message").textContent = "Please log in to book.";
        }
        return;
    }

    // trip details
    const trip = destinations.find(t => t.id == tripId);
    if (!trip) return;

    currentTripId = tripId;
    currentBasePrice = parseFloat(trip.price);

    // Populate pop up
    document.getElementById("modal-trip-title").textContent = trip.title;
    document.getElementById("modal-base-price").textContent = "₱" + currentBasePrice.toLocaleString();
    
    // Reset Tickets to 1
    document.getElementById("ticket-count").value = 1;
    calculateTotal();

    // pop up
    document.getElementById("bookingModal").style.display = "block";
}

//Calculator
function updateTickets(change) {
    const input = document.getElementById("ticket-count");
    let count = parseInt(input.value) + change;
    if (count < 1) count = 1; // Minimum 1 ticket
    input.value = count;
    calculateTotal();
}

function calculateTotal() {
    const count = parseInt(document.getElementById("ticket-count").value);
    const total = count * currentBasePrice;
    document.getElementById("modal-total-price").textContent = "₱" + total.toLocaleString(undefined, {minimumFractionDigits: 2});
}

//Confirm Booking
document.getElementById("confirm-booking-btn").addEventListener("click", function() {
    const count = parseInt(document.getElementById("ticket-count").value);
    const total = count * currentBasePrice;
    const userId = localStorage.getItem('user_id');

    document.getElementById("bookingModal").style.display = "none";

    fetch(API_BASE_URL + '?action=book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            user_id: userId, 
            trip_id: currentTripId,
            total_price: total //computed total
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            alert(data.message + "\nTotal Paid: ₱" + total.toLocaleString());
            location.reload(); 
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(err => {
        console.error(err);
    });
});

// D. Close Modal Logic
const bookingModal = document.getElementById("bookingModal");
const closeBooking = document.querySelector(".close-booking");
if(closeBooking) {
    closeBooking.onclick = () => bookingModal.style.display = "none";
}
// Close when clicking outside
window.onclick = (e) => {
    if(e.target == bookingModal) bookingModal.style.display = "none";
    const loginModal = document.getElementById("loginModal");
    if(e.target == loginModal) loginModal.style.display = "none";
};

// get bookings from database
function renderBookedTrips() {
    const userId = localStorage.getItem('user_id');
    const container = document.getElementById('myttrips');
    if (!userId) {
        container.innerHTML = '<p class="empty-message">Please log in to view your trips.</p>';
        return;
    }

    //get bookings
    fetch(API_BASE_URL + `?action=get_user_bookings&user_id=${userId}`)
        .then(res => res.json())
        .then(data => {
            container.innerHTML = '';

            if (data.length === 0) {
                container.innerHTML = '<p class="empty-message">You have no active bookings.</p>';
                return;
            }

            // load
            data.forEach(trip => {
                const div = document.createElement('div');
                div.className = 'booked-card';
                div.innerHTML = `
                    <div class="booked-info">
                        <h4>${trip.trip_title}</h4>
                        <p>Total: ₱${parseFloat(trip.trip_price).toLocaleString()}</p>
                        <small style="color:#888">Date: ${trip.booking_date}</small>
                    </div>
                    <button class="cancel-btn" onclick="cancelBooking(${trip.id})">Cancel</button>
                `;
                container.appendChild(div);
            });
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = '<p class="empty-message">Error loading trips.</p>';
        });
}

//Cancel Booking
function cancelBooking(bookingId) {
    if(confirm("Are you sure you want to cancel this booking?")) {
        fetch(API_BASE_URL + "?action=delete_booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: bookingId })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            renderBookedTrips();
        });
    }
}
//PROFILE PAGE
function loadProfileData() {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('user_id');

    // UI Elements
    const nameEl = document.getElementById('profile-username');
    const roleEl = document.getElementById('profile-role');
    const statsEl = document.getElementById('stat-trips');
    const logoutBtn = document.getElementById('logout-btn-profile');

    if (username) {
        nameEl.textContent = username;
        roleEl.textContent = role === 'admin' ? 'Administrator' : 'Explorer';
        
        fetch(API_BASE_URL + `?action=get_user_bookings&user_id=${userId}`)
            .then(res => res.json())
            .then(data => {
                const count = Array.isArray(data) ? data.length : 0;
                statsEl.textContent = count;
            });

        // Activate Logout Button
        if(logoutBtn) {
            logoutBtn.onclick = () => {
                if(confirm("Are you sure you want to log out?")) {
                    localStorage.clear();
                    location.reload();
                }
            };
        }
    } else {
        // If not logged in
        nameEl.textContent = "Guest User";
        roleEl.textContent = "Visitor";
        statsEl.textContent = "0";
        if(logoutBtn) logoutBtn.style.display = 'none';
    }
}
//HERO SLIDESHOW
function startHeroSlideshow() {
    const imgElement = document.getElementById('slideshow-img');
    
    const images = [
        'assets/hero1.jpg', //REMOVE '/' KAPAG IRURUN USING XAMPP (localhost) magiging  'assets/hero1.jpg' nalang
        'assets/hero2.jpg', 
        'assets/hero3.jpg',
        'assets/hero4.jpg',
        'assets/hero5.jpg',
        'assets/hero6.jpg',
        'assets/hero7.jpg',
        'assets/hero8.jpg'
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
        }, 550);
        
    }, 4000); 
}


function saveTripsToLocalStorage() { localStorage.setItem('bookedTrips', JSON.stringify(bookedTrips)); }
function loadTripsFromLocalStorage() { return JSON.parse(localStorage.getItem('bookedTrips') || '[]'); }