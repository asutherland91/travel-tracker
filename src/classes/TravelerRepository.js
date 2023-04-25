import Traveler from "./Traveler";

class TravelerRepository {
  constructor(travelerData) {
    this.travelers = travelerData;
  }

  getRandomTraveler() {
    const index = Math.floor(Math.random() * this.travelers.length);
    return new Traveler(this.travelers[index]);
  }

  getTravelerById(userID) {
    const travelerData = this.travelers.find(traveler => traveler.id === userID);
    if(travelerData) {
      return new Traveler(travelerData);
    }
  }

  getTravelerByName(travelerName) {
    const travelerData = this.travelers.find(traveler => traveler.name.includes(travelerName));
    if(travelerData) {
      return new Traveler(travelerData);
    }
  }

  
}

export default TravelerRepository;