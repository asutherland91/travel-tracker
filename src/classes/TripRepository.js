const dayjs = require('dayjs');
var isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)

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

  getAllPendingTrips(tripData) {
    const trips = this.trips.filter(trip => {
      return trip.status === "pending";
    });
    return trips;
  };

  addNewTrip(newTrip) {
    this.trips.push(newTrip);
  }

  calculateTotalAgentEarnings(destinationRepository) {
    const totalEarnings = this.trips.reduce((total, trip) => {
      if(trip.status === "approved") {
        let destination = destinationRepository.getDestination(trip.destinationID);
        total += (trip.travelers * destination.estimatedFlightCostPerPerson);
        total += (trip.duration * destination.estimatedLodgingCostPerDay);
      }
      return total;
    }, 0);
    return (totalEarnings * .1).toFixed(2);
  }

  calculateYearlyAgentEarnings(destinationRepository) {
    const totalEarnings = this.trips.reduce((total, trip) => {
      if(trip.status === "approved" && dayjs(trip.date).isAfter('2022-12-31', 'month')) {
        let destination = destinationRepository.getDestination(trip.destinationID);
        total += (trip.travelers * destination.estimatedFlightCostPerPerson);
        total += (trip.duration * destination.estimatedLodgingCostPerDay);
      }
      return total;
    }, 0);
    return (totalEarnings * .1).toFixed(2);
  }

  approveTripByID(tripID) {
    const approvedTrip = this.trips.find(trip => {
      return trip.id === tripID 
    })
    return approvedTrip.status = "approved";
  }

  deleteTripByID(tripID) {
    const deletedTrip = this.trips.find(trip => {
      return trip.id ===tripID
    })
    return deletedTrip.status = "deleted";
  }

  getTravelersOnTripsToday(date) {
    const trips = this.trips.filter(trip => {
      const tripEndDate = dayjs(trip.date).add(trip.duration, 'day');
      if(trip.status === "approved" && date.isBetween(trip.date, tripEndDate)){
        return true;
      };
      return false;
    });
    return trips.length;
  }
}

export default TripRepository;