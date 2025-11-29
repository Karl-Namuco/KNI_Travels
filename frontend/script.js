


//Mission & Vision
document.addEventListener("DOMContentLoaded", function() {
    const missionBtn = document.getElementById("missionBtn");
    if(missionBtn) {
        missionBtn.addEventListener("click", function(event) {
            event.preventDefault();
            const mission = "Mission: To help travelers by providing a secure, easy, and comprehensive platform that simplifies the tiring process of trip planning and ensures a smooth, enjoyable, and stress-free travel experience. To promote hidden tourist destinations, encouraging travelers to discover new places and experience its beauty.";
            const vision = "Vision: To be a reliable and innovative travel website that connects travelers to meaningful experiences and unforgettable journeys. In the future, KNI Travels aims to become one of the most trusted travel services.";
            alert(mission + "\n\n" + vision);
        });
    }
});
// 1. THE DATA (Simulating a database response)
const destinations = [
    {
        id: 1,
        title: "Shadowpeak Canyon",
        location: "Colorado, USA",
        price: 67,
        image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Crimson Rift",
        location: "Wadi Rum Desert, Jordan",
        price: 98900,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Whispering Dunes",
        location: "Namib Desert, Namibia",
        price: 12500,
        image: "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        title: "Frostveil Summit",
        location: "Svalbard, Norway",
        price: 30000,
        image: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        title: "The Obsidian Hollow",
        location: "Iceland's Highlands",
        price: 10000,
        image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        title: "Stormbreaker Isles",
        location: "Faroe Islands, Denmark",
        price: 45000,
        image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=800&q=80"
    }
];

// Global array: Loads trips from Local Storage on initial execution
let bookedTrips = loadTripsFromLocalStorage(); 

const gridContainer = document.getElementById('destinations-grid');
const myTripsContainer = document.getElementById('myttrips');

// --- Local Storage Functions for Persistence ---

/** Saves the current bookedTrips array to Local Storage. */
function saveTripsToLocalStorage() {
    // Convert JS array to JSON string for storage
    localStorage.setItem('bookedTrips', JSON.stringify(bookedTrips));
}

/** Loads booked trips from Local Storage, or returns an empty array if none are found. */
function loadTripsFromLocalStorage() {
    const storedTrips = localStorage.getItem('bookedTrips');
    // Parse JSON string back into a JS array
    return storedTrips ? JSON.parse(storedTrips) : [];
}

// --- BOOKING LOGIC ---

function bookTrip(tripId) {
    const tripToBook = destinations.find(trip => trip.id === tripId);

    // Prevent duplicate bookings
    if (bookedTrips.some(trip => trip.id === tripId)) {
        alert(`You have already booked the trip to ${tripToBook.title}.`);
        return;
    }

    bookedTrips.push(tripToBook);
    
    // Save state and re-render the list
    saveTripsToLocalStorage(); 
    renderBookedTrips();

    alert(`✅ Successfully booked ${tripToBook.title}!`);
}

function cancelBooking(tripId) {
    // Filter out the trip with the matching ID
    bookedTrips = bookedTrips.filter(trip => trip.id !== tripId);
    
    // Save state and re-render the list
    saveTripsToLocalStorage(); 
    renderBookedTrips();

    alert('❌ Booking successfully cancelled.');
}

// --- RENDERING FUNCTIONS ---

function renderBookedTrips() {
    myTripsContainer.innerHTML = ''; // Clear previous content

    if (bookedTrips.length === 0) {
        myTripsContainer.innerHTML = '<p class="empty-message">You have no active bookings.</p>';
        return;
    }

    bookedTrips.forEach(trip => {
        const bookedCard = document.createElement('div');
        bookedCard.className = 'booked-card';
        // Note: onclick calls cancelBooking(id)
        bookedCard.innerHTML = `
            <div class="booked-info">
                <h4>${trip.title}</h4>
                <p>Location: ${trip.location}</p>
                <p>Price: $${trip.price}</p>
            </div>
            <button class="cancel-btn" onclick="cancelBooking(${trip.id})">
                Cancel Booking
            </button>
        `;
        myTripsContainer.appendChild(bookedCard);
    });
}

function loadDestinations(dataToRender) {
    const data = dataToRender || destinations; 
    gridContainer.innerHTML = '';

    if (data.length === 0) {
        gridContainer.innerHTML = '<p class="no-results">No destinations found matching your search.</p>';
        return;
    }

    data.forEach(place => {
        const card = document.createElement('article');
        card.className = 'card';
        
        // CRUCIAL: Action button calls bookTrip(id)
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
                     <span class="price">Php${place.price}<span class="per-person">/person</span></span>
                     <button class="view-btn">View Details <i class="fa-solid fa-chevron-right"></i></button>
                 </div>
             </div>
         `;
        gridContainer.appendChild(card);
    });
}

// --- FILTERING LOGIC ---

function filterDestinations() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase();

    // Filter the original data array
    const filteredDestinations = destinations.filter(place => {
        // Check if the search term is found in the Title OR the Location
        const titleMatch = place.title.toLowerCase().includes(searchTerm);
        const locationMatch = place.location.toLowerCase().includes(searchTerm);
        
        return titleMatch || locationMatch;
    });

    // Re-render the grid using the filtered results
    loadDestinations(filteredDestinations);
}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Load the main destinations grid
    loadDestinations(destinations);
    
    // 2. Load and render booked trips from Local Storage
    renderBookedTrips(); 

    // 3. Attach the filter function to the search input
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', filterDestinations);
});