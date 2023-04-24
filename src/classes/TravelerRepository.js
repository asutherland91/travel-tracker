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
    console.log(travelerData)
    if(travelerData) {
      return new Traveler(travelerData);
    }
  }
}

export default TravelerRepository;