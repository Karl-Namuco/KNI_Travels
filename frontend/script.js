


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