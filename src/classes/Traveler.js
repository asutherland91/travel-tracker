class Traveler {
  constructor(traveler) {
    this.id = traveler.id;
    this.name = traveler.name;
  };

  getTrips(tripRepository) {
    return tripRepository.getTrips(this.id);
  };

  getFirstName() {
    return this.name.split(' ')[0];
  };

  newTripEstimate(trip, destinationRepository) {
    let estimate = 0
    const newDestination = destinationRepository.getDestination(trip.destinationID);
    estimate += (trip.travelers * newDestination.estimatedFlightCostPerPerson);
    estimate += (trip.duration * newDestination.estimatedLodgingCostPerDay); 
    return (estimate * 1.1).toFixed(2);
  };

  calculateTotalAmountSpent(tripRepository, destinationRepository) {
    const trips = this.getTrips(tripRepository);
    const amountSpent = trips.reduce((total, trip) => {
      if(trip.status === "approved") {
        const destination = destinationRepository.getDestination(trip.destinationID);
        total += (trip.travelers * destination.estimatedFlightCostPerPerson);
        total += (trip.duration * destination.estimatedLodgingCostPerDay);
      }
      return total;
    }, 0);
    return (amountSpent * 1.1).toFixed(2);
  };

  calculateAmountSpentPerTrip(tripRepository, destinationRepository) {
    const trips = this.getTrips(tripRepository);
    const filteredTrips = trips.filter(trip => {
     return trip.status === "approved";
    });
      const amountSpentPerTrip = filteredTrips.map(trip => {
        const destination = destinationRepository.getDestination(trip.destinationID);
        let cost = 0;
        cost += (trip.travelers * destination.estimatedFlightCostPerPerson);
        cost += (trip.duration * destination.estimatedLodgingCostPerDay);
        cost = (cost * 1.1).toFixed(2);
        return {[destination.destination]: cost};
       });
      console.log(Object.values(amountSpentPerTrip[0]))
    return amountSpentPerTrip;
  };
}

export default Traveler;