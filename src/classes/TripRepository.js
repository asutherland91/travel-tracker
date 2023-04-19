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

  

}

export default TripRepository;