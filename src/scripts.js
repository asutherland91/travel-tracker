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
  fetchTravelers,
  postNewTrip
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
let pendingTrip;


//query selectors
const submitButton = document.querySelector("#submit-button");
const errorButton = document.querySelector(".error-button");
const errorMessage = document.querySelector(".error-message");
const form = document.querySelector(".form");
const pendingEstimate = document.querySelector(".pending-estimate");
const confirmButton = document.querySelector(".confirm-button");
const cancelButton = document.querySelector(".cancel-button");
const estimateValue = document.querySelector(".estimate-value");
const formInputs = document.querySelectorAll("form input");
const destinationSelector = document.querySelector("#destination-selector");
const departureDate = document.querySelector("#departure-date");


// eventListeners
submitButton.addEventListener('click', function (event) {
  event.preventDefault();
  pendingTrip = getTripValues();
  hideForm();
  showPending();
  estimateValue.innerHTML = traveler.newTripEstimate(pendingTrip, destinationRepository);
});

cancelButton.addEventListener('click', event => {
  event.preventDefault();
  hidePending();
  showForm();
});

departureDate.addEventListener('change', updateMinReturn);

confirmButton.addEventListener('click', event => {
  event.preventDefault();
  postNewTrip({
    id: tripRepository.trips.length + 1,
    userID: parseInt(traveler.id),
    destinationID: parseInt(pendingTrip.destinationID),
    date: pendingTrip.date,
    travelers: parseInt(pendingTrip.travelers),
    duration: pendingTrip.duration,
  })
  .then(data => {
    if(data.newTrip){
      tripRepository.addNewTrip(data.newTrip);
      displayTripCards();
      hidePending();
      showForm();
    }
    else{
      throw new Error();
    }
  })
  .catch(err => {
    hidePending();
    showError();
  })
});

errorButton.addEventListener('click', function (event) {
  event.preventDefault();
  hideError();
  showForm();
});

formInputs.forEach(input => {
  input.addEventListener('change', enableButton)
});

destinationSelector.addEventListener('change', enableButton);


Promise.all([fetchDestinations(), fetchTrips(), fetchTravelers()])
  .then(([destinationData, tripData, travelerData]) => {
    travelerRepository = new TravelerRepository(travelerData.travelers);
    traveler = travelerRepository.getRandomTraveler();
    displayGreeting(traveler);
   
    destinationRepository = new DestinationRepository(destinationData.destinations);
    populateDestinationDropdown();
    dateFormatter();

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
};

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

function dateFormatter() {
  let date = dayjs();
  const departureField = document.querySelector("#departure-date");
  const returnField = document.querySelector("#return-date");
  departureField.setAttribute("min", date.format("YYYY-MM-DD"));
  returnField.setAttribute("min", date.add(1, "day").format("YYYY-MM-DD"))
};

function updateMinReturn() {
  const returnField = document.querySelector("#return-date");
  let dateGoValue = dayjs(document.querySelector("#departure-date").value);
  returnField.setAttribute("min", dateGoValue.add(1, "day").format("YYYY-MM-DD"));
  if(dayjs(returnField.value).isBefore(dateGoValue)) {
    returnField.value = dateGoValue.add(1, "day").format("YYYY-MM-DD");
  }
  
};

function getTripValues() {
  let dateGoValue = dayjs(document.querySelector("#departure-date").value);
  let dateReturnValue = dayjs(document.querySelector("#return-date").value);
  let travelerValue = document.querySelector("#traveler-count").value;
  let destinationValue = document.querySelector("#destination-selector").value;
  let duration = dateReturnValue.diff(dateGoValue, 'day');
  return {date: dateGoValue.format("YYYY/MM/DD"), destinationID: parseInt(destinationValue), travelers: travelerValue, duration: duration}
};

function displayGreeting(traveler) {
  const greeting = document.querySelector('.welcome-header');
  greeting.innerHTML = `
  <h1 class="welcome-header">Greetings ${traveler.getFirstName()}</h1>`
};

function enableButton() {
  if(destinationSelector.value && Array.from(formInputs).every(input => input.value)) {
    submitButton.removeAttribute("disabled");
  };
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

function hideForm() {
form.classList.add("hidden");
};

function showForm() {
form.classList.remove("hidden");
};

function showError() {
errorMessage.classList.remove("hidden");
};

function hideError() {
errorMessage.classList.add("hidden");
};

function showPending() {
pendingEstimate.classList.remove("hidden");
};

function hidePending() {
pendingEstimate.classList.add("hidden");
};