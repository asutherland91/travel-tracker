const dayjs = require('dayjs')

import DestinationRepository from './classes/DestinationRepository';
import TripRepository from './classes/TripRepository';
import TravelerRepository from './classes/TravelerRepository';
import Traveler from './classes/Traveler'

import {
  fetchDestinations,
  fetchTrips,
  fetchTravelers
} from './apiCalls'

import './css/styles.css';

// image imports
import './images/background-img.jpg'
import "./images/catbusv3.png"
import "./images/jumping-totoro.png"

//global variables
let destinationRepository;
let tripRepository;
let travelerRepository;
let traveler; 

//query selectors
const submitButton = document.querySelector("#submit-button");

// eventListeners
  submitButton.addEventListener('click', function (event) {
    event.preventDefault();
    postNewTrip();
  });

Promise.all([fetchDestinations(), fetchTrips(), fetchTravelers()])
  .then(([destinationData, tripData, travelerData]) => {
    travelerRepository = new TravelerRepository(travelerData.travelers);
    traveler = travelerRepository.getRandomTraveler();
   
    destinationRepository = new DestinationRepository(destinationData.destinations);
    populateDestinationDropdown();

    tripRepository = new TripRepository(tripData.trips);
    displayTripCards(tripRepository);
    displayAmountSpent(tripRepository, destinationRepository)

    
  })

function populateDestinationDropdown() {
  let destinationInput = document.querySelector("#destination-selector");
  destinationRepository.getDestinations().forEach(destination => {
    destinationInput.innerHTML += `<option value="${destination.id}">${destination.destination}</option>`
  });
}

function displayTripCards() {
  let tripCards = document.querySelector(".trip-cards")
  tripCards.innerHTML = " ";
  traveler.getTrips(tripRepository).forEach(trip => {
    let tripCard = document.createElement("article");
    tripCard.classList.add("trip-card");
    tripCard.innerHTML += `
    <p>Location: ${destinationRepository.getDestination(trip.destinationID).destination} </p>
    <p>Date: ${trip.date} </p>
    <p>Duration:${trip.duration} </p>
    <p>Status: ${trip.status} </p> `
    tripCards.appendChild(tripCard);
  });
  };

  function displayAmountSpent(tripRepository, destinationRepository) {
    let amountSpentText = document.querySelector(".amount-spent-text");
    amountSpentText.innerHTML = `
    <p class="amount-spent-text"> ~You have spent ${traveler.calculateTotalAmountSpent(tripRepository, destinationRepository)} total on adventures to new worlds~ </p>`
  };
 


function getTripValues() {
  let dateGoValue = dayjs(document.querySelector("#date-go-selector").value);
  let dateReturnValue = dayjs(document.querySelector("#date-return-selector").value);
  let travelerValue = document.querySelector("#traveler-selector").value;
  let destinationValue = document.querySelector("#destination-selector").value;
  let duration = dateReturnValue.diff(dateGoValue, 'day');
  return {date: dateGoValue.format("YYYY/MM/DD"), destination: destinationValue, travelers: travelerValue, duration: duration}
}

function postNewTrip() {
  
    const tripValues = getTripValues();
  
  fetch("http://localhost:3001/api/v1/trips", {
    method: 'POST',
    body: JSON.stringify({
        id: (tripRepository.trips.length + 1),
        userID: parseInt(traveler.id),
        destinationID: parseInt(tripValues.destination),
        date: tripValues.date,
        travelers: parseInt(tripValues.travelers),
        duration: tripValues.duration,
        status: "pending", 
        suggestedActivities: []
      }
    ),
    headers: {
      'content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    tripRepository.addNewTrip(data.newTrip)
    displayTripCards()
  })
  
};