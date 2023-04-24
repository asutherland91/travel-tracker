import {
expect
} from 'chai';
import Traveler from '../src/classes/Traveler';
import TravelerRepository from '../src/classes/TravelerRepository';
import DestinationRepository from '../src/classes/DestinationRepository';
import TripRepository from '../src/classes/TripRepository';
import travelerTestData from './traveler-test-data';
import tripTestData from './trip-test-data';
import destinationTestData from './destination-test-data';

describe("Traveler", () => {
  let traveler;
  let tripRepository;
  let destinationRepository;

  beforeEach(() => {
    traveler = new Traveler(travelerTestData[0]);
    tripRepository = new TripRepository(tripTestData);
    destinationRepository = new DestinationRepository(destinationTestData)
  });

  it("should be a function", () => {
    expect(Traveler).to.be.a("function");
  });

  it("should be an instance of traveler", () => {
    expect(traveler).to.be.an.instanceOf(Traveler);
  })

  it("should have a property that holds the traveler data object", () => {
    expect(traveler).to.deep.equal({
      "id": 1,
      "name": "Ham Leadbeater",
    }, );
  });

  it("should return an array of trips belonging to correct traveler", () => {
    expect(traveler.getTrips(tripRepository)).to.deep.equal([{
      "id": 2,
      "userID": 1,
      "destinationID": 1,
      "travelers": 5,
      "date": "2022/10/04",
      "duration": 18,
      "status": "approved",
      "suggestedActivities": []
      },{
      "id": 4,
      "userID": 1,
      "destinationID": 9,
      "travelers": 2,
      "date": "2022/02/25",
      "duration": 10,
      "status": "approved",
      "suggestedActivities": []
      },{"id": 10,
      "userID": 1,
      "destinationID": 10,
      "travelers": 6,
      "date": "2022/07/23",
      "duration": 17,
      "status": "pending",
      "suggestedActivities": []
    },
  ]);
});

  it("should calculate the amount of money a traveler has spent in total", () => {
    expect(traveler.calculateTotalAmountSpent(tripRepository, destinationRepository)).to.equal("6776.00");
  });

  it("should calculate the amount of money a traveler has spent per trip", () => {
    expect(traveler.calculateAmountSpentPerTrip(tripRepository, destinationRepository)).to.deep.equal(
      [
      { 'Lima, Peru': '3586.00' },
      { 'Amsterdam, Netherlands': '3190.00' }
    ]);
  });

  it("should return a travelers first name", () => {
    expect(traveler.getFirstName()).to.equal("Ham");
  });

  it("should calculate an estimate for a new trip", () => {
    let trip =  {
      id: 11,
      userID: 1,
      destinationID: 1,
      date: "2024/01/01",
      travelers: 1,
      duration: 10,
      status: "pending", 
      suggestedActivities: []
    };
    expect(traveler.newTripEstimate(trip, destinationRepository)).to.equal("1210.00");
  });
});