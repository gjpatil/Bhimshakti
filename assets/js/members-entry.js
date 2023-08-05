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

/*firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    location.replace("contact.html")
  } else {
    document.getElementById("user").innerHTML = "Hello, " + user.email
  }
})

firebase.auth().onAuthStateChanged((user)=>{
  if(user){
      location.replace("#")
  }
}) */

function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      // Use setTimeout to display the alert after a short delay
      setTimeout(() => {
        alert("New Admin Successfully Registered");
      }, 100);

      // Redirect to the contact.html page after successful registration
      location.replace("#");
    })
    .catch((error) => {
      document.getElementById("error").innerHTML = error.message;
    });
}

function logout() {
  firebase.auth().signOut()
    .then(() => {
      alert("You have been logged out"); // Show the alert when logout is successful
      // Redirect to the contact.html page after logout
      location.replace("#");
    })
    .catch((error) => {
      console.log(error);
    });
}

// Function to populate the District select element with district names from Firebase
function populateDistricts() {
  var districtSelect = document.getElementById("districtSelect");
  // Assuming you have a "Districts" node in your Firebase database containing district names
  var districtTaglistRef = database.ref("Bhimshakti/District");
  districtTaglistRef.once("value")
    .then(function (snapshot) {
      // Clear existing options
      districtSelect.innerHTML = "";
      // Add "Select District" option
      var selectDistrictOption = document.createElement("option");
      selectDistrictOption.value = "";
      selectDistrictOption.text = "Select District";
      districtSelect.appendChild(selectDistrictOption);
      // Loop through the snapshot and add options
      snapshot.forEach(function (districtSnapshot) {
        var districtName = districtSnapshot.key; // Get the district name
        var option = document.createElement("option");
        option.value = districtName;
        option.text = districtName;
        districtSelect.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Error fetching districts from Firebase: ", error);
    });
}

// Function to populate the Taluka select element based on the selected District
function populateTalukas(selectedDistrict) {
  var talukaSelect = document.getElementById("talukaSelect");
  // Assuming you have a "Taluka" node under the selected District containing taluka names
  var talukaTaglistRef = database.ref("Bhimshakti/District/" + selectedDistrict + "/Taluka");
  talukaTaglistRef.once("value")
    .then(function (snapshot) {
      // Clear existing options
      talukaSelect.innerHTML = "";
      // Add "Select Taluka" option
      var selectTalukaOption = document.createElement("option");
      selectTalukaOption.value = "";
      selectTalukaOption.text = "Select Taluka";
      talukaSelect.appendChild(selectTalukaOption);
      // Loop through the snapshot and add options
      snapshot.forEach(function (talukaSnapshot) {
        var talukaName = talukaSnapshot.key; // Get the taluka name
        var option = document.createElement("option");
        option.value = talukaName;
        option.text = talukaName;
        talukaSelect.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Error fetching talukas from Firebase: ", error);
    });
}

// Function to populate the Village select element based on the selected Taluka
function populateVillages(selectedDistrict, selectedTaluka) {
  var villageSelect = document.getElementById("villageSelect");
  // Assuming you have a "Village" node under the selected Taluka containing village names
  var villageTaglistRef = database.ref("Bhimshakti/District/" + selectedDistrict + "/Taluka/" + selectedTaluka + "/Village");
  villageTaglistRef.once("value")
    .then(function (snapshot) {
      // Clear existing options
      villageSelect.innerHTML = "";
      // Add "Select Taluka" option
      var selectVillageOption = document.createElement("option");
      selectVillageOption.value = "";
      selectVillageOption.text = "Select Village";
      villageSelect.appendChild(selectVillageOption);
      // Loop through the snapshot and add options
      snapshot.forEach(function (villageSnapshot) {
        var villageName = villageSnapshot.key; // Get the village name
        var option = document.createElement("option");
        option.value = villageName;
        option.text = villageName;
        villageSelect.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Error fetching villages from Firebase: ", error);
    });
}

// Call the function to populate the District select element on page load
      populateDistricts();
      // Add event listener to the District select element
        document.getElementById("districtSelect").addEventListener("change", function () {
        var selectedDistrict = this.value; // Get the selected District
        // Populate the Taluka select element based on the selected District
        populateTalukas(selectedDistrict);
      });

      // Add event listener to the Taluka select element
        document.getElementById("talukaSelect").addEventListener("change", function () {
        var selectedDistrict = document.getElementById("districtSelect").value; // Get the selected District
        var selectedTaluka = this.value; // Get the selected Taluka
        // Populate the Village select element based on the selected Taluka
        populateVillages(selectedDistrict, selectedTaluka);
      });

// Initialize the variable to keep track of form submission
let isFormSubmitted = false;

// Add event listener to the "Submit" button with ID "createDatabase"
document.getElementById("createDatabase").addEventListener("click", function (event) {
  event.preventDefault();
});

// Function to handle image resizing
function resizeImage(file, maxWidth, maxHeight, callback) {
  var image = new Image();
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");

  image.onload = function () {
    var width = image.width;
    var height = image.height;

    // Calculate the new dimensions to maintain the aspect ratio
    if (width > height) {
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }
    }

    // Set the canvas dimensions to the new image dimensions
    canvas.width = width;
    canvas.height = height;
    // Draw the resized image on the canvas
    context.drawImage(image, 0, 0, width, height);
    // Convert the canvas data to a data URL
    var resizedImageUrl = canvas.toDataURL("image/jpeg");
    // Pass the resized image URL to the callback function
    callback(resizedImageUrl);
  };
  image.src = URL.createObjectURL(file);
}

// Function to upload the image to Firebase Cloud Storage
function uploadImage() {
  const file = document.querySelector("#photo").files[0];
  const name = +new Date() + "-" + file.name;
  const metadata = {
    contentType: file.type,
  };

  // Check if the image size is smaller or equal to 200x200
  if (file.size <= 200 * 200) {
    // Directly upload the original image to Firebase Cloud Storage
    var storageRef = firebase.storage().ref();
    var imageRef = storageRef.child("images/" + name);
    imageRef.put(file, metadata).then(function (snapshot) {
      console.log("Image uploaded successfully!");
      // Get the download URL of the uploaded image
      snapshot.ref.getDownloadURL().then(function (imageUrl) {
        console.log("Download URL:", imageUrl);

        // Set the image URL as the source for the <img> element
        document.querySelector("#image").src = imageUrl;

        // Set the URL text in the <p> element
        document.querySelector("#imageUrlLabel").value = imageUrl;

        // Show alert to indicate successful upload
        alert('Image uploaded successfully!');
      });
    });
  } else {
    // Resize the image to 200x200 pixels before uploading
    resizeImage(file, 200, 200, function (resizedImageUrl) {
      // Upload the resized image to Firebase Cloud Storage
      var storageRef = firebase.storage().ref();
      var imageRef = storageRef.child("images/" + name);
      imageRef.putString(resizedImageUrl, "data_url", metadata).then(function (snapshot) {
        console.log("Image uploaded successfully!");
        // Get the download URL of the resized image
        snapshot.ref.getDownloadURL().then(function (imageUrl) {
          console.log("Download URL:", imageUrl);

          // Set the image URL as the source for the <img> element
          document.querySelector("#image").src = imageUrl;

          // Set the URL text in the <p> element
          document.querySelector("#imageUrlLabel").value = imageUrl;
          console.log("Image URL set in the <img> element");
          // Show alert to indicate successful upload
          alert('Image uploaded successfully!');
        });
      });
    });
  }
}

/* Random Password Generator */

var el_down = document.getElementById("pass");

/* Function to generate combination of password */
function generatePassword() {
  var pass = '';
  var str = 'ABCDEFGHJKMNPQRSTUVWXYZ' +
    'abcdefghjkmnpqrstuvwxyz123456789@#&';

  for (let i = 1; i <= 8; i++) {
    var char = Math.floor(Math.random()
      * str.length + 1);

    pass += str.charAt(char)
  }

  return pass;
}


// Function to clear fields and generate a new password
function clearAndGeneratePassword() {
  // Clear all input fields
  document.getElementById("districtSelect").value = "";
  document.getElementById("talukaSelect").value = "";
  document.getElementById("villageSelect").value = "";
  document.getElementById("postSelect").value = "";
  document.getElementById("firstName").value = "";
  document.getElementById("midName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("email").value = "";
  document.getElementById("mobile").value = "";
  document.getElementById("pincode").value = "";
  document.getElementById("address").value = "";
  document.getElementById("pass").value = "";
  document.getElementById("birthdateDay").value = "";
  document.getElementById("birthdateMonth").value = "";
  document.getElementById("anniversaryDay").value = "";
  document.getElementById("anniversaryMonth").value = "";
  document.getElementById("imageUrlLabel").value = "";

  // Set the image URL as the source for the <img> element
  document.querySelector("#image").src = "";

  // Set a new random password
  document.getElementById("pass").value = generatePassword();
}

// Add event listener to the "Submit" button with ID "createDatabase"
document.getElementById("createDatabase").addEventListener("click", onSubmitButtonClick);

 // Store the data in Firebase under the specified path (Code remains the same)
  function onSubmitButtonClick(event) {
    event.preventDefault();
    // Get form input values
      const district = document.getElementById("districtSelect").value;
      const taluka = document.getElementById("talukaSelect").value;
      const village = document.getElementById("villageSelect").value;
      const post = document.getElementById("postSelect").value;
      const firstName = document.getElementById("firstName").value;
      const midName = document.getElementById("midName").value;
      const lastName = document.getElementById("lastName").value;
      const genderElement = document.querySelector("input[name='gender']:checked");
      const gender = genderElement ? genderElement.value : null;
      const email = document.getElementById("email").value;
      const mobile = document.getElementById("mobile").value;
      const address = document.getElementById("address").value;
      const pincode = document.getElementById("pincode").value;
      const imageUrl = document.getElementById("imageUrlLabel").value;
      // Assuming you have the day and month text values as separate variables
      const birthDay = document.getElementById("birthdateDay").value;
      const birthMonth = document.getElementById("birthdateMonth").value;
      const anniversaryDay = document.getElementById("anniversaryDay").value;
      const anniversaryMonth = document.getElementById("anniversaryMonth").value;
      const pass = document.getElementById("pass").value;
      
      const fullName = firstName+" "+midName+" "+lastName;

      // Combine day and month for birthdate
      const birthdate = `${birthMonth}-${birthDay}`;

      // Combine day and month for anniversaryDate
      const anniversaryDate = `${anniversaryMonth}-${anniversaryDay}`;

      // Get form input values
      console.log("District:", district);
      console.log("Taluka:", taluka);
      console.log("Village:", village);
      console.log("Post:", post);
      console.log("FullName:", fullName);
      console.log("Gender:", gender);
      console.log("Email:", email);
      console.log("Mobile:", mobile);
      console.log("Address:", address);
      console.log("Pincode:", pincode);
      console.log("Birthdate:", birthdate);
      console.log("AnniversaryDate:", anniversaryDate);
      console.log("ImageUrl:", imageUrl);
      console.log("Password:", pass);

      // Convert values to uppercase
      const districtUpperCase = district.toUpperCase();
      const talukaUpperCase = taluka.toUpperCase();
      const villageUpperCase = village.toUpperCase();
      const postUpperCase = post.toUpperCase();
      const fullNameUpperCase = fullName.toUpperCase();
      const genderUpperCase = gender.toUpperCase();
      const addressUpperCase = address.toUpperCase();


    // Store the data in Firebase under the specified path
    const dataRef = firebase
      .database()
      .ref("Data/UserName/" + fullNameUpperCase);
    dataRef
    .set({
      Name: fullNameUpperCase,
      Post: postUpperCase,
      Gender: genderUpperCase,
      Email: email,
      Mobile: mobile,
      District: districtUpperCase,
      Taluka: talukaUpperCase,
      Village: villageUpperCase,
      Address: addressUpperCase,
      Pincode: pincode,
      Birthdate: birthdate,
      AnniversaryDate: anniversaryDate,
      ImageUrl: imageUrl,
      Password: pass
    })
      .then(() => {
        // Show success message only if the form has not been submitted before (not upon page refresh)
        alert("Data saved successfully!");
      })
    // You can redirect to another page after the data is saved using location.replace("your-page.html");
 
  .catch((error) => {
    // Handle errors from Firebase
    alert("An error occurred while saving data. Please try again later.");
    console.error("Firebase Error: ", error);
  });

    // Store data in 'Birthdays' node
    const birthdaysRef = firebase.database().ref("Data/Birthdays/" + birthdate + "/" + fullNameUpperCase);
    birthdaysRef.set(true);

    // Store data in 'Anniversaries' node
    const anniversariesRef = firebase.database().ref("Data/Anniversaries/" + anniversaryDate + "/" + fullNameUpperCase);
    anniversariesRef.set(true);

    // Show success message only if the form has not been submitted before (not upon page refresh)
  alert("Data saved successfully!");
 }
