import {
  expect
} from 'chai';
import TravelerRepository from '../src/classes/TravelerRepository';
import travelerTestData from './traveler-test-data';
import Traveler from '../src/classes/Traveler';


describe('Traveler Repository', () => {
  let testRepository;
  let userID
  beforeEach(() => {
    testRepository = new TravelerRepository(travelerTestData);
  });

  it('should be a function', () => {
    expect(TravelerRepository).to.be.a('function');
  });

  it('should be an instance of TravelerRepository', () => {
    expect(testRepository).to.be.an.instanceOf(TravelerRepository);
  });

  it('should store travelers', () => {
    expect(testRepository.travelers).to.deep.equal(travelerTestData);
  });

  it("should be able to return an instance of traveler", () => {
    expect(testRepository.getRandomTraveler()).to.be.an.instanceOf(Traveler);
  });

  it("should be able to return a specific traveler by id", () => {
    expect(testRepository.getTravelerById(2)).to.deep.equal(
      {
      "id": 2,
      "name": "Rachael Vaughten",
      });
  });

  it("shouldn't be able to return a traveler if the ID doesn't exist", () => {
    expect(testRepository.getTravelerById(99)).to.equal(undefined);
  });

  it("should be able to return a specific traveler by name", () => {
    expect(testRepository.getTravelerByName("Rachael")).to.deep.equal(
      {
      "id": 2,
      "name": "Rachael Vaughten",
      });
  });

  it("shouldn't be able to return a traveler if the name doesn't exist", () => {
    expect(testRepository.getTravelerByName("Steve")).to.equal(undefined);
  });
});