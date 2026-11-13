
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";

import {
  auth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "./firebase-config.js";

const form = document.querySelector("form");

if (!form) {
  throw new Error("Login form was not found.");
}

const emailInput =
  form.querySelector('input[type="email"]') ||
  form.querySelector('[name="email"]') ||
  form.querySelector("#email");

const passwordInput =
  form.querySelector('input[type="password"]') ||
  form.querySelector('[name="password"]') ||
  form.querySelector("#password");

const rememberCheckbox = form.querySelector('input[type="checkbox"]');

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
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your internet connection.";
    default:
      return "Login failed. Please try again.";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!emailInput || !passwordInput) {
    showMessage("Login form fields could not be found.");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage("Enter your email and password.");
    return;
  }

  const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');

  if (submitButton) submitButton.disabled = true;

  showMessage("Signing in...", true);

  try {
    const persistence = rememberCheckbox?.checked
      ? browserLocalPersistence
      : browserSessionPersistence;

    await setPersistence(auth, persistence);
    await signInWithEmailAndPassword(auth, email, password);

    showMessage("Login successful. Opening PLAYT124...", true);
    window.location.href = "home.html";
  } catch (error) {
    console.error("Login error:", error);
    showMessage(getErrorMessage(error));
    if (submitButton) submitButton.disabled = false;
  }
});
