"use strict";$(document).ready(function(){});
var firebaseConfig = {
  apiKey: "AIzaSyAF7Xsfki_Ig2Qh7_t9tLA20yc1M-v8guY",
  authDomain: "bhimshakti-website.firebaseapp.com",
  databaseURL: "https://bhimshakti-website-default-rtdb.firebaseio.com",
  projectId: "bhimshakti-website",
  storageBucket: "bhimshakti-website.appspot.com",
  messagingSenderId: "35537957359",
  appId: "1:35537957359:web:bba1b1871e28eb9a3d861a",
  measurementId: "G-ZXNX44JP1R"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Reference to the Firebase database
var database = firebase.database();

$(document).ready(function() {
  $('.js-searchBox').searchBox({ elementWidth: '250' });
});

// Function to handle the "Members Data" button click
function handleMembersDataButtonClick() {
  clearDropdownSelection("birthdateSelect");
  clearDropdownSelection("birthnameSelect");
  clearDropdownSelection("annivdateSelect");
  clearDropdownSelection("annivnameSelect");
  clearDataAndSelection();
  // Populate the "selectName" dropdown and update the SelectedName div
  populateNameDropdown();
  displayOperation("Members Data");
  // Add event listener to the "selectName" dropdown to call displaySelectedName() when the selection changes
  document.getElementById("btn-members").addEventListener("click", handleMembersDataButtonClick);
}

// Function to handle the "Birthdays" button click
function handleBirthdaysButtonClick() {
  clearDropdownSelection("selectName");
  clearDropdownSelection("annivdateSelect");
  clearDropdownSelection("annivnameSelect");
  clearDataAndSelection();
  // Populate the "birthdate" dropdown
  populateBirthdateDropdown();
  displayOperation("Birthdays");
  document.getElementById("btn-birthday").addEventListener("click", handleBirthdaysButtonClick);
}

// Function to handle the "Anniversaries" button click
function handleAnniversariesButtonClick() {
  clearDropdownSelection("selectName");
  clearDropdownSelection("birthdateSelect");
  clearDropdownSelection("birthnameSelect");
  clearDataAndSelection();
  // Populate the "anniv date" dropdown
  populateAnniversaryDateDropdown();
  displayOperation("Anniversaries");
  document.getElementById("btn-anniversary").addEventListener("click", handleAnniversariesButtonClick);
}

// Attach click event listeners to the buttons
document.getElementById("btn-members").addEventListener("click", handleMembersDataButtonClick);
document.getElementById("btn-birthday").addEventListener("click", handleBirthdaysButtonClick);
document.getElementById("btn-anniversary").addEventListener("click", handleAnniversariesButtonClick);

// Function to clear the selected option of a dropdown
function clearDropdownSelection(dropdownId) {
  var dropdown = document.getElementById(dropdownId);
  dropdown.selectedIndex = 0;
}

// Function to populate the "name" dropdown
function populateNameDropdown() {
  var dropdown = document.getElementById("selectName");
  var ref = firebase.database().ref("Data/UserName");
  ref.once("value")
    .then(function (snapshot) {
      dropdown.innerHTML = ""; // Clear existing options

      // Add the default "Select Name" option
      var defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.text = "Select Name";
      dropdown.appendChild(defaultOption);

      // Loop through the snapshot and add options
      snapshot.forEach(function (childSnapshot) {
        var name = childSnapshot.key;
        var option = document.createElement("option");
        option.value = name;
        option.text = name;
        dropdown.appendChild(option);
      });
      // Add event listener to the dropdown to call displaySelectedName() when the selection changes
      document.getElementById("selectName").addEventListener("change", displaySelectedName);
    })
    .catch(function (error) {
      console.error("Error fetching names from Firebase: ", error);
    });
}

// Function to populate the "birthdate" dropdown
function populateBirthdateDropdown() {
  var dropdown = document.getElementById("birthdateSelect");
  var ref = firebase.database().ref("Data/Birthdays");
  ref.once("value")
    .then(function (snapshot) {
      dropdown.innerHTML = ""; // Clear existing options
      // Add the default "Select Birthdate" option
      var defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.text = "Select Birthdate";
      dropdown.appendChild(defaultOption);
      // Loop through the snapshot and add options
      snapshot.forEach(function (childSnapshot) {
        var date = childSnapshot.key;
        var option = document.createElement("option");
        option.value = date;
        option.text = date;
        dropdown.appendChild(option);
      });
      // Add event listener to the dropdown to call populateBirthnameDropdown() when the selection changes
      dropdown.addEventListener("change", function () {
        var selectedBirthdate = dropdown.value;
        populateBirthnameDropdown(selectedBirthdate);
      });
    })
    .catch(function (error) {
      console.error("Error fetching birthdates from Firebase: ", error);
    });
}

// Function to populate the "anniversary date" dropdown
function populateAnniversaryDateDropdown() {
  var dropdown = document.getElementById("annivdateSelect");
  var ref = firebase.database().ref("Data/Anniversaries");
  ref.once("value")
    .then(function (snapshot) {
      dropdown.innerHTML = ""; // Clear existing options

      // Add the default "Select Anniversary Date" option
      var defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.text = "Select Anniversary Date";
      dropdown.appendChild(defaultOption);

      // Loop through the snapshot and add options
      snapshot.forEach(function (childSnapshot) {
        var date = childSnapshot.key;
        var option = document.createElement("option");
        option.value = date;
        option.text = date;
        dropdown.appendChild(option);
      });
      // Add event listener to the dropdown to call populateAnnivnameDropdown() when the selection changes
      dropdown.addEventListener("change", function () {
        var selectedAnnivdate = dropdown.value;
        console.log("Selected Anniversary Date:", selectedAnnivdate); // Log the selectedAnnivdate
        populateAnnivnameDropdown(selectedAnnivdate); // Call the function with the correct selectedAnnivdate
      });
    })
    .catch(function (error) {
      console.error("Error fetching anniversary dates from Firebase: ", error);
    });
}

// Function to populate the "birthname" dropdown based on the selected birthdate
function populateBirthnameDropdown(selectedBirthdate) {
  var dropdown = document.getElementById("birthnameSelect");
  var selectedBirthdate = document.getElementById("birthdateSelect").value; // Get the selected birthdate
  var ref = firebase.database().ref("Data/Birthdays/" + selectedBirthdate);
  ref.once("value")
    .then(function (snapshot) {
      dropdown.innerHTML = ""; // Clear existing options

      // Add the default "Select Name" option
      var defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.text = "Select Name";
      dropdown.appendChild(defaultOption);

      // Loop through the snapshot and add options
      snapshot.forEach(function (childSnapshot) {
        var name = childSnapshot.key;
        var option = document.createElement("option");
        option.value = name;
        option.text = name;
        dropdown.appendChild(option);
      });
      // Add event listener to the dropdown to call displaySelectedName() when the selection changes
      document.getElementById("birthnameSelect").addEventListener("change", displaySelectedName);
    })
    .catch(function (error) {
      console.error("Error fetching birth names from Firebase: ", error);
    });
}

function populateAnnivnameDropdown(selectedAnnivdate) {
  var dropdown = document.getElementById("annivnameSelect");
  var ref = firebase.database().ref("Data/Anniversaries/" + selectedAnnivdate);
  ref.once("value")
    .then(function (snapshot) {
      dropdown.innerHTML = ""; // Clear existing options

      // Add the default "Select Name" option
      var defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.text = "Select Name";
      dropdown.appendChild(defaultOption);

      // Loop through the snapshot and add options
      snapshot.forEach(function (childSnapshot) {
        var name = childSnapshot.key;
        var option = document.createElement("option");
        option.value = name; // Set the option value to the name, not just "true"
        option.text = name;
        dropdown.appendChild(option);
      });
      // Add event listener to the dropdown to call displaySelectedName() when the selection changes
      dropdown.addEventListener("change", displaySelectedName);
    })
    .catch(function (error) {
      console.error("Error fetching anniversary names from Firebase: ", error);
    });
}

// Function to update the selectedNameDiv when a name is selected from the dropdowns
function displaySelectedName() {
  var selectedNameDiv = document.getElementById("selectedName");
  var selectedName;

  var selectedNameDropdown = document.getElementById("selectName");
  var selectedBirthnameDropdown = document.getElementById("birthnameSelect");
  var selectedAnnivnameDropdown = document.getElementById("annivnameSelect");

  if (selectedNameDropdown.selectedIndex !== 0) {
    selectedName = selectedNameDropdown.value;
  } else if (selectedBirthnameDropdown.selectedIndex !== 0) {
    selectedName = selectedBirthnameDropdown.value;
  } else if (selectedAnnivnameDropdown.selectedIndex !== 0) {
    selectedName = selectedAnnivnameDropdown.value;
  } else {
    selectedName = ""; // Default value if none of the dropdowns is selected
  }

  // Update the selectedNameDiv with the selected name
  selectedNameDiv.textContent = selectedName || "No Name Selected";
}

// Function to display the operation
function displayOperation(operationText) {
  var operationDiv = document.getElementById("operation");
  operationDiv.textContent = operationText;
}

// Function to clear data divs and selectedNameDiv
function clearDataAndSelection() {
  document.getElementById("selectedName").textContent = "No Name Selected";
  document.getElementById("imgUrlLabel").textContent = "";
  document.getElementById("post").textContent = "";
  document.getElementById("gender").textContent = "";
  document.getElementById("district").textContent = "";
  document.getElementById("taluka").textContent = "";
  document.getElementById("village").textContent = "";
  document.getElementById("mobile").textContent = "";
  document.getElementById("email").textContent = "";
  document.getElementById("address").textContent = "";
  document.getElementById("pincode").textContent = "";
  document.getElementById("birthdate").textContent = "";
  document.getElementById("anniversaryDate").textContent = "";
}

// Call the displaySelectedName() function to set the initial selected name
displaySelectedName();

function fetchDataAndUpdateDivs() {
  // Get the values from the respective div elements
  var selectedName = document.getElementById("selectedName").textContent.trim();

  // Reference to the Firebase database node
  var databaseRef = firebase.database().ref("Data").child("UserName").child(selectedName);
    // Fetch data from Firebase
  databaseRef.on("value", 
    function(snapshot){
      var data = snapshot.val();
      if (data) {

console.log(data)
           // Update the respective divs with the fetched data
      document.getElementById("imgUrlLabel").textContent = data.ImageUrl || '';   
      document.getElementById("post").textContent = data.Post || '';
      document.getElementById("gender").textContent = data.Gender || '';
      document.getElementById("mobile").textContent = data.Mobile || '';
      document.getElementById("email").textContent = data.Email || '';
      document.getElementById("district").textContent = data.District || '';
      document.getElementById("taluka").textContent = data.Taluka || '';
      document.getElementById("village").textContent = data.Village || '';
      document.getElementById("address").textContent = data.Address || '';
      document.getElementById("pincode").textContent = data.Pincode || '';
      document.getElementById("birthdate").textContent = data.Birthdate || '';
      document.getElementById("anniversaryDate").textContent = data.AnniversaryDate || '';
    } else {
      console.error("Data not found.");
    }
  },
  function(error) {
    console.error("Error fetching data: ", error);
  }
);
}
// Add event listener to the button to trigger data fetch and update divs on click
document.getElementById("btn-profile").addEventListener("click", fetchDataAndUpdateDivs);


function showProfileImage() {
  // Get the URL text from the label element
  const imageUrl = document.querySelector("#imgUrlLabel").textContent;

  // Set the URL as the src attribute for the "profileimage" element
  document.querySelector("#profileimage").src = imageUrl;
}


