class DestinationRepository {
  constructor(destinationData) {
    this.destinations = destinationData;
  }

  getDestination(destinationID) {
    const destination = this.destinations.find(location => {
      return location.id === destinationID;
    });
    return destination;
  };
}

export default DestinationRepository;