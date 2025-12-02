// 1. DATA (Travel Packages)
const destinations = [
    {
        id: 1,
        title: "Technological University of the Philippines",
        location: "Philippines, Manila",
        price: 67,
        image: "/assets/tup.jpg"
    },
    {
        id: 2,
        title: "Intramuros",
        location: "Manila, Philippines",
        price: 890,
        image: "/assets/intramuros.jpg"
    },
    {
        id: 3,
        title: "Boracay",
        location: "Aklan, Philippines",
        price: 1250,
        image: "/assets/boracay.jpg"
    },
    {
        id: 4,
        title: "Mount Fuji",
        location: "Mt. Fuji, Japan",
        price: 3000,
        image: "/assets/fuji.jpg"
    },
    {
        id: 5,
        title: "Eiffel Tower",
        location: "Paris, France",
        price: 1000,
        image: "/assets/eiffel.jpg"
    },
    {
        id: 6,
        title: "Hawaii Islands",
        location: "Hawaii, USA",
        price: 450,
        image: "/assets/hawaii.jpg"
    }
];

// 2. STATE MANAGEMENT
let bookedTrips = loadTripsFromLocalStorage(); 

const gridContainer = document.getElementById('destinations-grid');
const myTripsContainer = document.getElementById('myttrips');

// 3. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // Load Destinations
    loadDestinations(destinations);
    
    // Load Bookings
    renderBookedTrips(); 

    // Search Listener
    const searchInput = document.getElementById('search-input');
    if(searchInput){
        searchInput.addEventListener('input', filterDestinations);
    }

    // Mission & Vision Listener
    const missionBtn = document.getElementById("missionBtn");
    if(missionBtn) {
        missionBtn.addEventListener("click", function(event) {
            event.preventDefault();
            const mission = "Mission: To help travelers by providing a secure, easy, and comprehensive platform that simplifies the tiring process of trip planning and ensures a smooth, enjoyable, and stress-free travel experience.";
            const vision = "Vision: To be a reliable and innovative travel website that connects travelers to meaningful experiences and unforgettable journeys.";
            alert(mission + "\n\n" + vision);
        });
    }
});

// 4. FUNCTIONS

// Save/Load
function saveTripsToLocalStorage() {
    localStorage.setItem('bookedTrips', JSON.stringify(bookedTrips));
}

function loadTripsFromLocalStorage() {
    const storedTrips = localStorage.getItem('bookedTrips');
    return storedTrips ? JSON.parse(storedTrips) : [];
}

// Rendering Main Grid
function loadDestinations(dataToRender) {
    gridContainer.innerHTML = '';

    if (dataToRender.length === 0) {
        gridContainer.innerHTML = '<p class="no-results" style="grid-column: 1/-1; text-align:center;">No destinations found matching your search.</p>';
        return;
    }

    dataToRender.forEach(place => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
             <div class="card-img">
                 <img src="${place.image}" alt="${place.title}">
             </div>
             <div class="card-content">
                 <div class="location">
                     <i class="fa-solid fa-location-dot"></i>
                     <span>${place.location}</span>
                 </div>
                 <h2 class="card-title">${place.title}</h2>
                 <div class="action-btn" onclick="bookTrip(${place.id})">
                     <span class="price">$${place.price} <span class="per-person">/pax</span></span>
                     <button class="view-btn">Book <i class="fa-solid fa-chevron-right"></i></button>
                 </div>
             </div>
         `;
        gridContainer.appendChild(card);
    });
}

// Booking Logic
function bookTrip(tripId) {
    const tripToBook = destinations.find(trip => trip.id === tripId);

    if (bookedTrips.some(trip => trip.id === tripId)) {
        alert(`You have already booked the trip to ${tripToBook.title}.`);
        return;
    }

    bookedTrips.push(tripToBook);
    saveTripsToLocalStorage(); 
    renderBookedTrips();
    
    document.getElementById('mytripspage').scrollIntoView({ behavior: 'smooth' });
}

function cancelBooking(tripId) {
    bookedTrips = bookedTrips.filter(trip => trip.id !== tripId);
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
        const bookedCard = document.createElement('div');
        bookedCard.className = 'booked-card';
        bookedCard.innerHTML = `
            <div class="booked-info">
                <h4>${trip.title}</h4>
                <p>Location: ${trip.location}</p>
                <p><strong>Price: $${trip.price}</strong></p>
            </div>
            <button class="cancel-btn" onclick="cancelBooking(${trip.id})">
                Cancel
            </button>
        `;
        myTripsContainer.appendChild(bookedCard);
    });
}

// Search Logic
function filterDestinations() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase();

    const filteredDestinations = destinations.filter(place => {
        const titleMatch = place.title.toLowerCase().includes(searchTerm);
        const locationMatch = place.location.toLowerCase().includes(searchTerm);
        return titleMatch || locationMatch;
    });

    loadDestinations(filteredDestinations);
}

// Switch tabs
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Define which sections belong to which view
    const views = {
        'travel-view': ['heropage', 'travelpage'], // Combines Hero + Travel
        'mytrips-view': ['mytripspage'],
        'profile-view': ['profilepage'],
        'help-view': ['helppage']
    };

    // 2. Get all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    const allSections = document.querySelectorAll('main > section');

    // Function to switch views
    function switchView(viewName) {
        // A. Hide ALL sections first
        allSections.forEach(section => {
            section.classList.remove('active-section');
        });

        // B. Get the list of IDs for this view
        const activeIds = views[viewName];

        // C. Show ONLY the sections for this view
        if (activeIds) {
            activeIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.add('active-section');
            });
        }
    }

    // 3. Add Click Listeners to Nav Links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewName = link.getAttribute('data-view');
            switchView(viewName);
        });
    });

    // 4. Handle "Book Now" buttons 
    const bookButtons = document.querySelectorAll('.cta-button, .view-btn, .secondary-btn');
    bookButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchView('travel-view'); 
            document.getElementById('travelpage').scrollIntoView({ behavior: 'smooth' });
        });
    });
    switchView('travel-view');
});