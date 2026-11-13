
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

import {
  auth,
  db
} from "./firebase-config.js";

const form = document.querySelector("form");

if (!form) {
  throw new Error("Registration form was not found.");
}

const emailInput =
  form.querySelector('input[type="email"]') ||
  form.querySelector('[name="email"]') ||
  form.querySelector("#email");

const passwordInputs = form.querySelectorAll('input[type="password"]');

const usernameInput =
  form.querySelector('[name="username"]') ||
  form.querySelector("#username") ||
  form.querySelector('input[type="text"]') ||
  form.querySelector('input:not([type])');

const passwordInput = passwordInputs[0];
const confirmPasswordInput = passwordInputs[1];

const termsCheckbox = form.querySelector('input[type="checkbox"]');

const status = document.createElement("p");
status.setAttribute("role", "status");
status.style.marginTop = "14px";
status.style.fontSize = "14px";
form.insertAdjacentElement("afterend", status);

function showMessage(message, success = false) {
  status.textContent = message;
  status.style.color = success ? "#22c55e" : "#ef4444";
}

function getErrorMessage(error) {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email already has an account. Please log in.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/weak-password":
      return "Password must contain at least 6 characters.";

    case "auth/operation-not-allowed":
      return "Email and password registration is not enabled.";

    case "auth/network-request-failed":
      return "Network error. Check your internet connection.";

    case "permission-denied":
    case "firestore/permission-denied":
      return "Your account was created, but the database rejected the profile. Contact support.";

    default:
      return "Registration failed. Please try again.";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (
    !usernameInput ||
    !emailInput ||
    !passwordInput ||
    !confirmPasswordInput
  ) {
    showMessage("Registration fields could not be found.");
    return;
  }

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (!username || !email || !password || !confirmPassword) {
    showMessage("Please complete all fields.");
    return;
  }

  if (username.length < 3 || username.length > 30) {
    showMessage("Username must be 3 to 30 characters.");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must contain at least 6 characters.");
    return;
  }

  if (password !== confirmPassword) {
    showMessage("Passwords do not match.");
    return;
  }

  if (termsCheckbox && !termsCheckbox.checked) {
    showMessage("Please accept the Terms and Conditions.");
    return;
  }

  const submitButton = form.querySelector(
    'button[type="submit"], input[type="submit"]'
  );

  if (submitButton) submitButton.disabled = true;

  let createdUser = null;

  showMessage("Creating your PLAYT124 account...", true);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    createdUser = userCredential.user;

    await updateProfile(createdUser, {
      displayName: username
    });

    await setDoc(doc(db, "users", createdUser.uid), {
      uid: createdUser.uid,
      username: username,
      email: createdUser.email,
      createdAt: serverTimestamp()
    });

    showMessage("Account created successfully. Opening PLAYT124...", true);

    window.location.href = "home.html";

  } catch (error) {
    console.error("Registration error:", error);

    if (createdUser) {
      showMessage(
        "Your authentication account was created, but its profile could not be saved. Do not register again. Please contact support."
      );
    } else {
      showMessage(getErrorMessage(error));
    }

    if (submitButton) submitButton.disabled = false;
  }
});
      
