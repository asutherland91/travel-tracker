import Traveler from "./Traveler";

class TravelerRepository {
  constructor(travelerData) {
    this.travelers = travelerData;
  }

  getRandomTraveler() {
    const index = Math.floor(Math.random() * this.travelers.length);
    return new Traveler(this.travelers[index]);
  }
}

export default TravelerRepository;