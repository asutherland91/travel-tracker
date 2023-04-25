//3rd party libraries
const dayjs = require("dayjs");
import Chart from "chart.js/auto";
Chart.defaults.color = "#000000";
var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

//class and repo imports
import DestinationRepository from "./classes/DestinationRepository";
import TripRepository from "./classes/TripRepository";
import TravelerRepository from "./classes/TravelerRepository";
import Traveler from "./classes/Traveler";

//api fetches
import {
  fetchDestinations,
  fetchTrips,
  fetchTravelers,
  postNewTrip,
  postApprovedTrip,
  deleteTrip
} from "./apiCalls"

//stylesheet import
import "./css/styles.css";


// image imports
import "./images/background-img.jpg"
import "./images/catbusv3.png"
import "./images/jumping-totoro.png"

//global variables
let destinationRepository;
let tripRepository;
let travelerRepository;
let traveler;
let pendingTrip;
let date = dayjs();


//query selectors
const submitButton = document.querySelector("#submit-button");
const errorButton = document.querySelector(".error-button");
const errorMessage = document.querySelector(".error-message");
const form = document.querySelector(".form");
const pendingEstimate = document.querySelector(".pending-estimate");
const confirmButton = document.querySelector(".confirm-button");
const cancelButton = document.querySelector(".cancel-button");
const formInputs = document.querySelectorAll(".form input");
const destinationSelector = document.querySelector("#destination-selector");
const departureDate = document.querySelector("#departure-date");
const loginPage = document.querySelector(".login-page");
const greeting = document.querySelector(".welcome-header");
const loginButton = document.querySelector("#login-button");


// eventListeners
submitButton.addEventListener("click", function (event) {
  event.preventDefault();
  pendingTrip = getTripValues();
  hideForm();
  showPending();
  const estimateValue = document.querySelector(".estimate-value");
  estimateValue.innerHTML = traveler.newTripEstimate(pendingTrip, destinationRepository);
});

cancelButton.addEventListener("click", event => {
  event.preventDefault();
  hidePending();
  showForm();
});

loginButton.addEventListener("click", event => {
  event.preventDefault();
  login();
});

departureDate.addEventListener("change", updateMinReturn);

confirmButton.addEventListener("click", event => {
  event.preventDefault();
  postNewTrip( {
    id: tripRepository.trips.length + 1,
    userID: parseInt(traveler.id),
    destinationID: parseInt(pendingTrip.destinationID),
    date: pendingTrip.date,
    travelers: parseInt(pendingTrip.travelers),
    duration: pendingTrip.duration,
  })
  .then(data => {
    if(data.newTrip) {
      tripRepository.addNewTrip(data.newTrip);
      displayTripCards();
      hidePending();
      showForm();
    }
    else {
      throw new Error();
    }
  })
  .catch(err => {
    hidePending();
    showError();
  })
});

errorButton.addEventListener("click", function (event) {
  event.preventDefault();
  hideError();
  showForm();
});

formInputs.forEach(input => {
  input.addEventListener("change", enableButton);
});

destinationSelector.addEventListener("change", enableButton);

Promise.all([fetchDestinations(), fetchTrips(), fetchTravelers()])
  .then(([destinationData, tripData, travelerData]) => {
    travelerRepository = new TravelerRepository(travelerData.travelers);
    destinationRepository = new DestinationRepository(destinationData.destinations);
    populateDestinationDropdown();
    dateFormatter();

    tripRepository = new TripRepository(tripData.trips);
  })
  .catch((error) => {
    alert("Error fetching data:" + error);
  });

function populateDestinationDropdown() {
  let destinationInput = document.querySelector("#destination-selector");
  destinationRepository.getDestinations().forEach(destination => {
    destinationInput.innerHTML += `<option value="${destination.id}">${destination.destination}</option>`
  });
};

function login() {
  const usernameInput = document.querySelector("#login");
  const passwordInput = document.querySelector("#password");
  if(usernameInput.value.startsWith("traveler") && passwordInput.value === "travel") {
    const userID = parseInt(usernameInput.value.slice(8));
    traveler = travelerRepository.getTravelerById(userID);
    displayGreeting();
    displayTripCards();
    displayAmountSpent();
    displayAmountSpentChart();
    showTravelerView();
  }
  else if(usernameInput.value === "agency" && passwordInput.value === "travel") {
    displayPendingCards();
    displayEarnings();
    displayTravelersOnTripsToday(date);
    showAgentView();
  }
  else {
    const loginError = document.querySelector(".login-error");
    loginError.classList.remove("hidden");
  };
};

function showTravelerView() {
  const travelerHeader = document.querySelector(".traveler-header");
  const travelerView = document.querySelector(".traveler-view");
  travelerHeader.classList.remove("hidden");
  travelerView.classList.remove("hidden");
  loginPage.classList.add("hidden");
};

function showAgentView() {
  const agentHeader = document.querySelector(".agent-header");
  const agentView = document.querySelector(".agent-view");
  agentHeader.classList.remove("hidden");
  agentView.classList.remove("hidden");
  loginPage.classList.add("hidden");
};

function displayTripCards() {
  let tripCards = document.querySelector(".trip-cards");
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

function displayPendingCards() {
  let pendingCards = document.querySelector(".pending-cards");
  pendingCards.innerHTML = " ";
  tripRepository.getAllPendingTrips().forEach(trip => {
    let pendingCard = document.createElement("article");
    pendingCard.classList.add("pending-card");
    pendingCards.appendChild(pendingCard);
    pendingCard.innerHTML += `
    <p class="card-label">Location:</p> <p class="card-info">${destinationRepository.getDestination(trip.destinationID).destination} </p>
    <p class="card-label">Date:</p> <p class="card-info">${trip.date} </p>
    <p class="card-label">Duration:</p> <p class="card-info">${trip.duration} days</p>
    <p class="card-label">Status:</p> <p class="card-info">${trip.status} </p>
    <div class="button-wrapper">
    <button class="approve" id="approve-trip${trip.id}">Approve</button>
    <button class="delete" id="delete-trip${trip.id}">Delete</button>
    </div>`
    document.querySelector(`#approve-trip${trip.id}`).addEventListener("click", (event) => {
      event.preventDefault()
      postApprovedTrip(trip)
      .then((data) => {
        if(data) {
          tripRepository.approveTripByID(data.updatedTrip.id);
          displayPendingCards();
        }
        else {
          throw new Error;
        }
      })
      .catch((error) => {
        alert("Error fetching data:" + error);
    })
  })
    document.querySelector(`#delete-trip${trip.id}`).addEventListener("click", (event) => {
      event.preventDefault()
      deleteTrip(trip)
      .then((data) => {
        if(data) {
        tripRepository.deleteTripByID(trip.id);
        displayPendingCards();
        }
        else {
          throw new Error;
        }
      })
      .catch((error) => {
        alert("Error fetching data:" + error);
      });
    });
  });
};

function displayTravelersOnTripsToday() {
  const travelersOnTrips = document.querySelector(".amount-of-travelers");
  travelersOnTrips.innerHTML = 
  `~We have ${tripRepository.getTravelersOnTripsToday(date)} travelers on adventures today~`
};

function displayEarnings() {
  const totalEarnings = document.querySelector(".amount-earned-total");
  totalEarnings.innerHTML = 
  `We have earned $${tripRepository.calculateYearlyAgentEarnings(destinationRepository)} this year and $${tripRepository.calculateTotalAgentEarnings(destinationRepository)} overall!`;
};

function displayAmountSpent() {
  let totalAmountSpentText = document.querySelector(".total-spent");
  totalAmountSpentText.innerHTML = `
  <p class="total-spent"> ~You have spent $${traveler.calculateYearlyAmountSpent(tripRepository, destinationRepository)} on adventures this year, and $${traveler.calculateTotalAmountSpent(tripRepository, destinationRepository)} overall on adventures to new worlds~ </p>`
};

function dateFormatter() {
  const departureField = document.querySelector("#departure-date");
  const returnField = document.querySelector("#return-date");
  departureField.setAttribute("min", date.format("YYYY-MM-DD"));
  returnField.setAttribute("min", date.add(1, "day").format("YYYY-MM-DD"));
};

function updateMinReturn() {
  const returnField = document.querySelector("#return-date");
  let dateGoValue = dayjs(document.querySelector("#departure-date").value);
  returnField.setAttribute("min", dateGoValue.add(1, "day").format("YYYY-MM-DD"));
  if(dayjs(returnField.value).isBefore(dateGoValue)) {
    returnField.value = dateGoValue.add(1, "day").format("YYYY-MM-DD");
  };
};

function getTripValues() {
  let dateGoValue = dayjs(document.querySelector("#departure-date").value);
  let dateReturnValue = dayjs(document.querySelector("#return-date").value);
  let travelerValue = document.querySelector("#traveler-count").value;
  let destinationValue = document.querySelector("#destination-selector").value;
  let duration = dateReturnValue.diff(dateGoValue, "day");
  return {date: dateGoValue.format("YYYY/MM/DD"), destinationID: parseInt(destinationValue), travelers: travelerValue, duration: duration}
};

function displayGreeting() {
  greeting.innerHTML = `
  <h1 class="welcome-header">Greetings ${traveler.getFirstName()}</h1>`
};

function enableButton() {
  if(destinationSelector.value && Array.from(formInputs).every(input => input.value)) {
    submitButton.removeAttribute("disabled");
  };
};

function displayAmountSpentChart() {
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