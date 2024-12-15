/** This file is used to modify the frontend */
const welcomeDiv = document.getElementById("WelcomeMessage");
const signInButton = document.getElementById("signIn");
const signOutButton = document.getElementById("signOut");
const seeProfileButton = document.getElementById("seeProfile");
const cardDiv = document.getElementById("cardDiv");
const profileDiv = document.getElementById("profileDiv");

window.renderer.showWelcomeMessage((event, account) => {
  if (!account) return;

  cardDiv.style.display = "initial";
  welcomeDiv.innerHTML = `Welcome ${account.name}`;
  signInButton.hidden = true;
  signOutButton.hidden = false;
});

window.renderer.handleProfileData((event, graphResponse) => {
  if (!graphResponse) return;

  console.log(`Graph API responded at: ${new Date().toString()}`);
  setProfile(graphResponse);
});

// UI Event Handlers
signInButton.addEventListener("click", () => {
  console.log(`Signin Button clicked`);
  window.renderer.sendLoginMessage();
});

signOutButton.addEventListener("click", () => {
  console.log(`SignOut Button clicked`);
  window.renderer.sendSignOutMessage();
});

seeProfileButton.addEventListener("click", () => {
  console.log(`Show Profile Button clicked`);
  window.renderer.sendCheckProfileMessage();
});

const setProfile = (data) => {
  console.log(data);
  if (!data) return;

  profileDiv.innerHTML = "";

  // Add Bootstrap class for left alignment
  profileDiv.className = "text-start mt-3 text-left p-3 border rounded bg-light";

  // Dynamically create profile fields with Bootstrap classes
  const title = document.createElement("p");
  title.className = "mb-1";
  title.innerHTML = `<strong>Title:</strong> ${data.jobTitle || "N/A"}`;

  const email = document.createElement("p");
  email.className = "mb-1";
  email.innerHTML = `<strong>Mail:</strong> ${data.mail || "N/A"}`;

  const phone = document.createElement("p");
  phone.className = "mb-1";
  phone.innerHTML = `<strong>Phone:</strong> ${data.businessPhones[0] || "N/A"}`;

  const address = document.createElement("p");
  address.className = "mb-1";
  address.innerHTML = `<strong>Location:</strong> ${data.officeLocation || "N/A"}`;

  // Append the created elements to profileDiv
  profileDiv.appendChild(title);
  profileDiv.appendChild(email);
  profileDiv.appendChild(phone);
  profileDiv.appendChild(address);

  // Hide the "Show profile" button
  if (seeProfileButton) {
    seeProfileButton.style.display = "none";
  }
};
