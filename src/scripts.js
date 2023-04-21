//3rd party libraries
const dayjs = require('dayjs')
import Glide from '@glidejs/glide'
// Required Core Stylesheet
import "@glidejs/glide/dist/css/glide.core.min.css";
// Optional Theme Stylesheet
import "@glidejs/glide/dist/css/glide.theme.min.css";
import Chart from 'chart.js/auto';
Chart.defaults.color = "#000000"
  // new Glide('.glide').mount()

//class and repo imports
import DestinationRepository from './classes/DestinationRepository';
import TripRepository from './classes/TripRepository';
import TravelerRepository from './classes/TravelerRepository';
import Traveler from './classes/Traveler'

//api fetches
import {
  fetchDestinations,
  fetchTrips,
  fetchTravelers
} from './apiCalls'

//stylesheet import
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
    displayAmountSpentChart(tripRepository, destinationRepository)
  })

function populateDestinationDropdown() {
  let destinationInput = document.querySelector("#destination-selector");
  destinationRepository.getDestinations().forEach(destination => {
    destinationInput.innerHTML += `<option value="${destination.id}">${destination.destination}</option>`
  });
}

function displayTripCards() {
  // let tripsGlide = document.querySelector(".glide__slides");
  // traveler.getTrips(tripRepository).forEach(trip => {
  //   let tripCard = document.createElement("li");
  //   tripCard.classList.add("trip-card");
  //   tripsGlide.appendChild(tripCard);
  //   tripCard.classList.add("glide__slide");
  //   tripCard.innerHTML += `
  //   <p class="card-label">Location:</p> <p class="card-info">${destinationRepository.getDestination(trip.destinationID).destination} </p>
  //   <p class="card-label">Date:</p> <p class="card-info">${trip.date} </p>
  //   <p class="card-label">Duration:</p> <p class="card-info">${trip.duration} days </p>
  //   <p class="card-label">Status:</p> <p class="card-info">${trip.status} </p>
  //   `
  //   new Glide('.glide', {
  //     type: 'carousel',
  //     startAt: 0,
  //     perView: 1,
  //     rewind: false,
  //     peek: {
  //       before: 0,
  //       after: 0
  //     },
  //     focusAt: "center"
  //   }).mount()
  // });
  let tripCards = document.querySelector(".trip-cards")
  tripCards.innerHTML = " ";
  traveler.getTrips(tripRepository).forEach(trip => {
    let tripCard = document.createElement("article");
    tripCard.classList.add("trip-card");
    tripCards.appendChild(tripCard);
    tripCard.innerHTML += `
    <p class="card-label">Location:</p> <p class="card-info">${destinationRepository.getDestination(trip.destinationID).destination} </p>
    <p class="card-label">Date:</p> <p class="card-info">${trip.date} </p>
    <p class="card-label">Duration:</p> <p class="card-info">${trip.duration} days</p>
    <p class="card-label">Status:</p> <p class="card-info">${trip.status} </p> `
  });
  };

  function displayAmountSpent(tripRepository, destinationRepository) {
    let amountSpentText = document.querySelector(".total-spent");
    amountSpentText.innerHTML = `
    <p class="total-spent"> ~You have spent $${traveler.calculateTotalAmountSpent(tripRepository, destinationRepository)} total on adventures to new worlds~ </p>`
  };

function getTripValues() {
  let dateGoValue = dayjs(document.querySelector("#departure-date").value);
  let dateReturnValue = dayjs(document.querySelector("#return-date").value);
  let travelerValue = document.querySelector("#traveler-count").value;
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
  });
};

function displayAmountSpentChart(tripRepository, destinationRepository) {
  const totalCost = traveler.calculateAmountSpentPerTrip(tripRepository, destinationRepository);
  const labels = totalCost.map(trip => Object.keys(trip)[0]);
  const data = totalCost.map(trip => Object.values(trip)[0]);
  new Chart("chart", {
    type: "bar",
    data: {
      datasets: [{
        label: "Total Amount Spent",
        backgroundColor: "#7FBDF8",
        borderColor: "#3C4252",
        borderWidth: 2,
        hoverBackgroundColor: "#65ADEF",
        hoverBorderColor: "#3C4252",
        data: data,
      }],
      labels: labels,
    },
  })
};