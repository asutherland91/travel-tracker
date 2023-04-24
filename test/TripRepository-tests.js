import {
  expect
} from 'chai';
import TripRepository from '../src/classes/TripRepository';
import tripTestData from './trip-test-data';
import DestinationRepository from '../src/classes/DestinationRepository';


describe('Trip Repository', () => {
  var testRepository;
  beforeEach(() => {
    testRepository = new TripRepository(tripTestData);
  });

  it('should be a function', () => {
    expect(TripRepository).to.be.a('function');
  });

  it('should be an instance of TripRepository', () => {
    expect(testRepository).to.be.an.instanceOf(TripRepository);
  });

  it('should store trips', () => {
    expect(testRepository.trips).to.deep.equal(tripTestData);
  });

  it("should not be able to return an invalid trip", () => {
    expect(testRepository.getTrips(63)).to.deep.equal([]);
  });

  it("should return an array of trips belonging to correct traveler", () => {
    expect(testRepository.getTrips(1)).to.deep.equal([{
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

  it("should return an empty array if an incorrect travelerID is given", () => {
    expect(testRepository.getTrips(70)).to.deep.equal([]);
  });

  it("should have last item in the array equal the new trip added", () => {
    let newTrip =  {
      id: 11,
      userID: 1,
      destinationID: 1,
      date: "2024/01/01",
      travelers: 1,
      duration: 8,
      status: "pending", 
      suggestedActivities: []
    };
    testRepository.addNewTrip(newTrip);
    expect(testRepository.trips[10]).to.deep.equal(
      {
        id: 11,
        userID: 1,
        destinationID: 1,
        date: "2024/01/01",
        travelers: 1,
        duration: 8,
        status: "pending", 
        suggestedActivities: []
      }
    )
  });
});