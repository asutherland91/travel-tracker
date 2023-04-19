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

  it.skip('should be a function', () => {
    expect(TravelerRepository).to.be.a('function');
  });

  it.skip('should be an instance of TravelerRepository', () => {
    expect(testRepository).to.be.an.instanceOf(TravelerRepository);
  });

  it.skip('should store travelers', () => {
    expect(testRepository.travelers).to.deep.equal(travelerTestData);
  });

  it.skip("should not be able to return an invalid traveler", () => {
    expect(testRepository.getTraveler(63)).to.deep.equal(undefined);
  });

});