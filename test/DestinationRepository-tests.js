import {
  expect
} from 'chai';
import DestinationRepository from '../src/classes/DestinationRepository';
import destinationTestData from './destination-test-data';
import Traveler from '../src/classes/Traveler';


// describe('Destination Repository', () => {
//   var testRepository;
//   beforeEach(() => {
//     testRepository = new DestinationRepository(destinationTestData);
//   });

//   it('should be a function', () => {
//     expect(DestinationRepository).to.be.a('function');
//   });

//   it('should be an instance of DestinationRepository', () => {
//     expect(testRepository).to.be.an.instanceOf(DestinationRepository);
//   });

//   it('should store destinations', () => {
//     expect(testRepository.destinations).to.deep.equal(destinationTestData);
//   });

//   it("should not be able to return an invalid destination", () => {
//     expect(testRepository.getDestination(63)).to.deep.equal(undefined);
//   });

// });