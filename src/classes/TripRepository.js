class TripRepository {
  constructor(tripData) {
    this.trips = tripData;
  }

  getTrips(userID) {
    const trips = this.trips.filter(trip => {
      return trip.userID === userID;
    });
    return trips;
  };

  addNewTrip(newTrip) {
    this.trips.push(newTrip);
  }

}

export default TripRepository;