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

// Global Variables
let destinations = []; // Will be populated by the database
let bookedTrips = loadTripsFromLocalStorage(); // Load saved bookings immediately

const gridContainer = document.getElementById('destinations-grid');
const myTripsContainer = document.getElementById('myttrips');

// --- 1. API CONNECTION (Connecting to your Database) ---

function fetchDestinationsFromDB() {
    // This fetches data from the PHP file we created
    fetch('api.php?action=read')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Save the database data into our global variable
            destinations = data;
            // Render the cards on the screen
            loadDestinations(destinations);
        })
        .catch(error => {
            console.error('Error loading destinations:', error);
            gridContainer.innerHTML = '<p class="no-results">Error loading data. Make sure XAMPP is running.</p>';
        });
}

// --- 2. LOCAL STORAGE (Saving Bookings) ---

function saveTripsToLocalStorage() {
    localStorage.setItem('bookedTrips', JSON.stringify(bookedTrips));
}

function loadTripsFromLocalStorage() {
    const storedTrips = localStorage.getItem('bookedTrips');
    return storedTrips ? JSON.parse(storedTrips) : [];
}

// --- 3. BOOKING LOGIC ---

function bookTrip(tripId) {
    // Find the trip in the destinations array
    // We use '==' to match even if one is string and one is number
    const tripToBook = destinations.find(trip => trip.id == tripId);

    if (!tripToBook) {
        console.error("Trip not found!");
        return;
    }

    // Check for duplicates
    if (bookedTrips.some(trip => trip.id == tripId)) {
        alert(`You have already booked the trip to ${tripToBook.title}.`);
        return;
    }

    // Add to booked list
    bookedTrips.push(tripToBook);
    
    // Save and Update UI
    saveTripsToLocalStorage(); 
    renderBookedTrips();

    alert(`✅ Successfully booked ${tripToBook.title}!`);
}

function cancelBooking(tripId) {
    // Remove the trip with the matching ID
    bookedTrips = bookedTrips.filter(trip => trip.id != tripId);
    
    // Save and Update UI
    saveTripsToLocalStorage(); 
    renderBookedTrips();

    alert('❌ Booking successfully cancelled.');
}

// --- 4. RENDER FUNCTIONS (Displaying HTML) ---

function renderBookedTrips() {
    myTripsContainer.innerHTML = ''; 

    if (bookedTrips.length === 0) {
        myTripsContainer.innerHTML = '<p class="empty-message">You have no active bookings.</p>';
        return;
    }

    bookedTrips.forEach(trip => {
        const bookedCard = document.createElement('div');
        bookedCard.className = 'booked-card';
        // Note: We use trip.image_url if coming from DB, or trip.image if using old data
        // The PHP API returns 'image_url' based on the SQL table we made.
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
        
        // Handle image key difference (DB uses 'image_url', static used 'image')
        const imgSrc = place.image_url || place.image;

        card.innerHTML = `
             <div class="card-img">
                 <img src="${imgSrc}" alt="${place.title}">
             </div>
             <div class="card-content">
                 <div class="location">
                     <i class="fa-solid fa-location-dot"></i>
                     <span>${place.location}</span>
                 </div>
                 <h2 class="card-title">${place.title}</h2>
                 <div class="action-btn" onclick="bookTrip(${place.id})">
                     <span class="price">$${place.price}<span class="per-person">/person</span></span>
                     <button class="view-btn">View Details <i class="fa-solid fa-chevron-right"></i></button>
                 </div>
             </div>
         `;
        gridContainer.appendChild(card);
    });
}

// --- 5. SEARCH FILTER ---

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

// --- 6. INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Fetch data from MySQL Database
    fetchDestinationsFromDB();
    
    // 2. Load Bookings from Local Storage
    renderBookedTrips(); 

    // 3. Setup Search Listener
    const searchInput = document.getElementById('search-input');
    if(searchInput) {
        searchInput.addEventListener('input', filterDestinations);
    }
});