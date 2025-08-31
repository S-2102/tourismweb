    // Get query params (lat, lng, name)
    const params = new URLSearchParams(window.location.search);
    const destLat = parseFloat(params.get("lat"));
    const destLng = parseFloat(params.get("lng"));
    const destination = L.latLng(destLat, destLng);

    // Init map
    const map = L.map('map').setView(destination, 13);

    // Add OSM tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const origin = L.latLng(position.coords.latitude, position.coords.longitude);

        // Add routing
        L.Routing.control({
          waypoints: [origin, destination],
          routeWhileDragging: false
        }).addTo(map);
      }, () => {
        alert("Could not get your location.");
      });
    } else {
      alert("Geolocation not supported.");
    }