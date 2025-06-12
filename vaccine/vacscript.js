let vaccinationCenters = [];

// Fetch data from the vacdata.json file
fetch("vaccine/vaccine.json")
  .then((response) => response.json())
  .then((data) => {
    vaccinationCenters = data;
  })
  .catch((error) => {
    console.error("Error loading vaccination data:", error);
  });

// Convert degrees to radians
const toRadians = (degrees) => degrees * (Math.PI / 180);

// Calculate distance between two coordinates using the Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Handle location permission and filter centers
document.getElementById("get-location").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(

      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        const radius = parseInt(document.getElementById("radius").value, 10);
        console.log(userLat);
        console.log(userLon);
        console.log(radius);
        const nearbyCenters = vaccinationCenters.filter((center) => {
          const distance = calculateDistance(userLat, userLon, center.Latitude, center.Longitude);
          return distance <= radius;
        });

        displayResults(nearbyCenters);
      },
      (error) => {
        alert("Unable to retrieve your location. Please allow location access.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

// Display results dynamically
const displayResults = (centers) => {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  if (centers.length === 0) {
    resultsDiv.innerHTML = "<p>No vaccination centers found within the selected radius.</p>";
  } else {
    centers.forEach((center) => {
      const card = document.createElement("div");
      card.className = "result-card";
      card.innerHTML = `
        <h2>${center["Disease Name"]}</h2>
        <p><strong>Address:</strong> ${center.Address}</p>
        <p><strong>Date:</strong> ${center.Date}</p>
        <p><strong>Age Group:</strong> ${center["Age Group"]}</p>
      `;
      resultsDiv.appendChild(card);
    });
  }
};

// Update radius display dynamically
document.getElementById("radius").addEventListener("input", (event) => {
  document.getElementById("radius-value").innerText = `${event.target.value} km`;
});
