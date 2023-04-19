function fetchTravelers() {
  return fetch("http://localhost:3001/api/v1/travelers")
    .then(response => response.json());
};

function fetchTrips() {
  return fetch("http://localhost:3001/api/v1/trips")
    .then(response => response.json());
};

function fetchDestinations() {
  return fetch("http://localhost:3001/api/v1/destinations")
    .then(response => response.json());
}