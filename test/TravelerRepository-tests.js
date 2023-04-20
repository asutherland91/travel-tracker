import {
  expect
} from 'chai';
import TravelerRepository from '../src/classes/TravelerRepository';
import travelerTestData from './traveler-test-data';
import Traveler from '../src/classes/Traveler';


describe('Traveler Repository', () => {
  var testRepository;
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

});