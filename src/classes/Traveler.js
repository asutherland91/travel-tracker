class Traveler {
  constructor(traveler) {
    this.id = traveler.id;
    this.name = traveler.name;
  }

  getTrips(tripRepository) {
    return tripRepository.getTrips(this.id);
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
}

export default Traveler;