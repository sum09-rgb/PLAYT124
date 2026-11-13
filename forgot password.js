
import {
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";

import { auth } from "./firebase-config.js";

const form = document.querySelector("form");

if (!form) {
  throw new Error("Forgot-password form was not found.");
}

const emailInput =
  form.querySelector('input[type="email"]') ||
  form.querySelector('[name="email"]') ||
  form.querySelector("#email");

const status = document.createElement("p");
status.setAttribute("role", "status");
status.style.marginTop = "14px";
status.style.fontSize = "14px";
form.insertAdjacentElement("afterend", status);

function showMessage(message, success = false) {
  status.textContent = message;
  status.style.color = success ? "#22c55e" : "#ef4444";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!emailInput) {
    showMessage("Email field could not be found.");
    return;
  }

  const email = emailInput.value.trim();

  if (!email) {
    showMessage("Please enter your email address.");
    return;
  }

  const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');

  if (submitButton) submitButton.disabled = true;

  showMessage("Sending password reset email...", true);

  try {
    await sendPasswordResetEmail(auth, email);

    showMessage(
      "If an account exists for this email, a password reset email has been sent. Check your inbox and spam folder.",
      true
    );
  } catch (error) {
    console.error("Password reset error:", error);

    if (error.code === "auth/invalid-email") {
      showMessage("Please enter a valid email address.");
    } else if (error.code === "auth/network-request-failed") {
      showMessage("Network error. Check your internet connection.");
    } else if (error.code === "auth/too-many-requests") {
      showMessage("Too many attempts. Please try again later.");
    } else {
      showMessage("Unable to send the reset email. Please try again.");
    }
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});
