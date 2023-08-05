// Initialize Firebase
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

// Populate the "selectName" dropdown and update the SelectedName div
populateNameDropdown();

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

// Function to display the selected name in the "username" input field
function displaySelectedName() {
  var selectedName = document.getElementById("selectName").value;
  document.getElementById("username").value = selectedName;
  document.getElementById("username2").value = selectedName;
}

//Admin login form 
document.getElementById("loginForm").addEventListener("submit",(event)=>{
  event.preventDefault()
})

// Function to handle form submission
function userlogin(event) {
  event.preventDefault();

  const selectedName = document.getElementById("selectName").value;
  const userpsw = document.getElementById("userpsw").value;

  // Check if both username and userpsw are entered
  if (!selectedName || !userpsw) {
    alert("Please select a name and enter the password.");
    return;
  }

  // Reference to the Firebase database
  const database = firebase.database();
  const passwordRef = database.ref("Data/UserName/" + selectedName + "/Password");
  const imageUrlRef = database.ref("Data/UserName/" + selectedName + "/ImageUrl");

  // Get the password and image URL from the database
  Promise.all([passwordRef.once("value"), imageUrlRef.once("value")])
    .then(function([passwordSnapshot, imageUrlSnapshot]) {
      const correctPassword = passwordSnapshot.val();
      const imageUrl = imageUrlSnapshot.val();

      // Compare the entered userpsw with the correctPassword
      if (userpsw !== correctPassword) {
        alert("Password is incorrect");
      } else {
        // Set the image URL to the profile picture element
        document.getElementById("profilePicture").src = imageUrl;

         // Make the "Members Profiles" button visible
         document.getElementById("membersProfilesBtn").hidden = false;
         alert("You have been logged in");
      }
    })
    .catch(function(error) {
      console.error("Error fetching data from Firebase: ", error);
    });
}

// Function to open the "Members Profiles" view
function openMembersView() {
  // Replace this line with the code to open the "Members Profiles" view
  // For example, you can use location.replace to navigate to the desired page:
  location.replace("members-view.html");
}

// Function to handle form submission for changing password
function changePassword(event) {
  event.preventDefault();

  const selectedName = document.getElementById("selectName").value;
  const oldpsw = document.getElementById("oldpsw").value;
  const newpsw1 = document.getElementById("newpsw1").value;
  const newpsw2 = document.getElementById("newpsw2").value;
  const question = document.getElementById("question").value;
  // Check if all 4 values are entered
  if (!selectedName || !oldpsw || !newpsw1 || !newpsw2) {
    alert("Please enter all details.");
    return;
  }

  // Check if new passwords match
  if (newpsw1 !== newpsw2) {
    alert("New password does not match.");
    return;
  }

  // Reference to the Firebase database
  const database = firebase.database();
  const passwordRef = database.ref("Data/UserName/" + selectedName + "/Password");
  const questionRef = database.ref("Data/UserName/" + selectedName + "/Question");

  // Get the old password from the database
  passwordRef.once("value")
    .then(function(snapshot) {
      const correctOldPassword = snapshot.val();

      // Compare the entered oldpsw with the correctOldPassword
      if (oldpsw !== correctOldPassword) {
        alert("Old password is incorrect.");
      } else {
        // Update the password in the database with newpsw2
        passwordRef.set(newpsw2)
        questionRef.set(question)
          .then(function() {
            alert("Password changed successfully.");
          })
          .catch(function(error) {
            console.error("Error updating password in Firebase: ", error);
          });
      }
    })
    .catch(function(error) {
      console.error("Error fetching password from Firebase: ", error);
    });
}

// Function to open the password recovery popup
function openPopup() {
  document.getElementById("popup").style.display = "block";
}

// Function to close the password recovery popup
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// Function to handle password retrieval
function retrievePassword() {
  const selectedName = document.getElementById("selectName").value;
  const favoriteQuestion = document.getElementById("favoriteQuestion").value;
  const mobileNumber = document.getElementById("mobileNumber").value;
  console.log("Selected Name:", selectedName);
  console.log("Entered Question:", favoriteQuestion);
  console.log("Entered Mobile Number:", mobileNumber);

  // Check if all fields are entered
  if (!selectedName || !favoriteQuestion || !mobileNumber) {
    alert("Please enter all details.");
    return;
  }

  // Reference to the Firebase database
  const database = firebase.database();
  const favoriteQuestionRef = database.ref("Data/UserName/" + selectedName + "/Question");
  const mobileNumberRef = database.ref("Data/UserName/" + selectedName + "/Mobile");
  const passwordRef = database.ref("Data/UserName/" + selectedName + "/Password");

  // Get the saved favorite question, answer, and mobile number from the database
  Promise.all([favoriteQuestionRef.once("value"), mobileNumberRef.once("value")])
    .then(function(snapshots) {
      const savedFavoriteQuestion = snapshots[0].val();
      const savedMobileNumber = snapshots[1].val();

      // Compare the entered favorite question, answer, and mobile number with the saved values
      if (favoriteQuestion !== savedFavoriteQuestion || mobileNumber !== savedMobileNumber) {
        alert("Incorrect favorite question or mobile number.");
      } else {
        // Get the password from the database and show it in the label
        passwordRef.once("value")
          .then(function(snapshot) {
            const password = snapshot.val();
            document.getElementById("oldPasswordLabel").textContent = "Old Password: " + password;
          })
          .catch(function(error) {
            console.error("Error fetching password from Firebase: ", error);
          });
      }
    })
    .catch(function(error) {
      console.error("Error fetching data from Firebase: ", error);
    });
}

//Admin login -- forgot password and sign out

function login() {
  const adminemail = document.getElementById("adminemail").value;
  const adminpsw = document.getElementById("adminpsw").value;

  // Check if a user is already signed in
  const currentUser = firebase.auth().currentUser;
  if (currentUser) {
    // User is already signed in
    const username = currentUser.email; // Replace this with your preferred way to display the username
    alert(`You are already signed in as ${username}.`);
    // Show the hidden buttons
    document.getElementById("membersProfileBtn2").hidden = false;
    document.getElementById("membersEntryBtn").hidden = false;
    return; // Do not proceed with sign-in if the user is already signed in
  }

  // If the user is not already signed in, proceed with sign-in
  firebase.auth().signInWithEmailAndPassword(adminemail, adminpsw)
    .then(() => {
      // Sign-in successful
      alert("You have successfully signed in.");
       // Show the hidden buttons
    document.getElementById("membersProfileBtn2").hidden = false;
    document.getElementById("membersEntryBtn").hidden = false;

     })
    .catch((error) => {
      // An error happened.
      console.error("Error signing in:", error);
      document.getElementById("error").innerHTML = error.message;
    });
}

function forgotPass(){
  const adminemail = document.getElementById("adminemail").value
  firebase.auth().sendPasswordResetEmail(adminemail)
  .then(() => {
      alert("Reset link sent to your email id")
  })
  .catch((error) => {
      document.getElementById("error").innerHTML = error.message
  });
}

//Function to handle user sign out
function signOutUser() {
  firebase.auth().signOut()
    .then(() => {
      // Sign-out successful.
      console.log("User signed out successfully");

      localStorage.clear();

      // Hide authenticated sections
      document.getElementById("profilePicture").src = ""; // Clear the profile picture
      document.getElementById("membersProfileBtn2").hidden = true; // Hide the "Members Profiles" button
      document.getElementById("membersEntryBtn").hidden = true; // Hide the "Members Profiles" button
      // Show an alert to indicate successful sign-out
      alert("You have signed out successfully");
    })
    .catch((error) => {
      // An error happened.
      console.error("Error signing out:", error);
    });
}

// Function to handle user sign-in status and update the UI
function updateUI(user) {
  if (user) {
    // User is signed in, show the user's email
    const userEmail = document.getElementById("userEmail");
    userEmail.textContent = `Signed in as: ${user.email}`;


  } else {
    // User is signed out, clear the email display
    const userEmail = document.getElementById("userEmail");
    userEmail.textContent = "";
  }
}

// Listen for changes in the authentication state
firebase.auth().onAuthStateChanged((user) => {
  updateUI(user);
});

// Function to handle user sign out
function signOutUser() {
  firebase.auth().signOut()
    .then(() => {
      // Sign-out successful.
      console.log("User signed out successfully");
      updateUI(null); // Clear the email display after sign-out
    })
    .catch((error) => {
      // An error happened.
      console.error("Error signing out:", error);
    });
}
