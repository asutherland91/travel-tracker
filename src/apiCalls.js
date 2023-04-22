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

function postNewTrip(trip) {
  return fetch("http://localhost:3001/api/v1/trips", {
    method: 'POST',
    body: JSON.stringify({
        id: trip.id,
        userID: trip.userID,
        destinationID: trip.destinationID,
        date: trip.date,
        travelers: trip.travelers,
        duration: trip.duration,
        status: "pending", 
        suggestedActivities: []
      }
    ),
    headers: {
      'content-Type': 'application/json'
    }
  })
  .then(response => response.json())
}

export {
  fetchDestinations,
  fetchTrips,
  fetchTravelers,
  postNewTrip
};