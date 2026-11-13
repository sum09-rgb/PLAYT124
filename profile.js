
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

import {
  auth,
  db
} from "./firebase-config.js";

const elements = {
  welcome: document.getElementById("welcomeText"),
  username: document.getElementById("profileUsername"),
  email: document.getElementById("profileEmail"),
  avatar: document.getElementById("userAvatar"),
  coinBalance: document.getElementById("headerCoinBalance"),

  myProfileButton: document.getElementById("myProfileButton"),
  modal: document.getElementById("profileModal"),
  modalBackdrop: document.getElementById("modalBackdrop"),
  closeModal: document.getElementById("closeProfileModal"),

  modalAvatar: document.getElementById("modalAvatar"),
  detailUsername: document.getElementById("detailUsername"),
  detailEmail: document.getElementById("detailEmail"),
  detailUid: document.getElementById("detailUid"),
  detailJoined: document.getElementById("detailJoined"),

  logoutButton: document.getElementById("logoutButton"),
  noticeToggle: document.getElementById("noticeToggle"),
  musicToggle: document.getElementById("musicToggle"),
  toast: document.getElementById("toast")
};

let currentProfile = null;
let toastTimer;

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2600);
}

function setAvatar(username) {
  const initial = (username || "P").trim().charAt(0).toUpperCase() || "P";

  elements.avatar.textContent = initial;
  elements.modalAvatar.textContent = initial;
}

function formatDate(timestamp) {
  if (!timestamp || typeof timestamp.toDate !== "function") {
    return "Not available";
  }

  return timestamp.toDate().toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

async function loadUserProfile(user) {
  const userDocument = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userDocument);

  const firestoreData = userSnapshot.exists()
    ? userSnapshot.data()
    : {};

  const username =
    firestoreData.username ||
    user.displayName ||
    "PLAYT124 Player";

  const email =
    firestoreData.email ||
    user.email ||
    "Email unavailable";

  currentProfile = {
    username,
    email,
    uid: user.uid,
    createdAt: firestoreData.createdAt || null
  };

  elements.welcome.textContent = "Welcome Back,";
  elements.username.textContent = username;
  elements.email.textContent = email;
  elements.detailUsername.textContent = username;
  elements.detailEmail.textContent = email;
  elements.detailUid.textContent = user.uid;
  elements.detailJoined.textContent = formatDate(currentProfile.createdAt);

  setAvatar(username);
}

function openProfileModal() {
  if (!currentProfile) return;

  elements.modal.classList.add("open");
  elements.modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeProfileModal() {
  elements.modal.classList.remove("open");
  elements.modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

elements.myProfileButton.addEventListener("click", openProfileModal);
elements.closeModal.addEventListener("click", closeProfileModal);
elements.modalBackdrop.addEventListener("click", closeProfileModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProfileModal();
  }
});

// Save the user's local display preferences.
function loadPreferences() {
  elements.noticeToggle.checked =
    localStorage.getItem("playt124_notice_enabled") === "true";

  elements.musicToggle.checked =
    localStorage.getItem("playt124_music_enabled") === "true";
}

elements.noticeToggle.addEventListener("change", () => {
  localStorage.setItem(
    "playt124_notice_enabled",
    String(elements.noticeToggle.checked)
  );

  showToast("Notice preference saved.");
});

elements.musicToggle.addEventListener("change", () => {
  localStorage.setItem(
    "playt124_music_enabled",
    String(elements.musicToggle.checked)
  );

  showToast("Music preference saved.");
});

loadPreferences();

// Features that have not been developed yet.
document.querySelectorAll(".coming-item").forEach((button) => {
  button.addEventListener("click", () => {
    const feature = button.dataset.feature || "This feature";
    showToast(feature + " is coming soon.");
  });
});

// Firebase logout.
elements.logoutButton.addEventListener("click", async () => {
  const confirmed = window.confirm(
    "Are you sure you want to logout from PLAYT124?"
  );

  if (!confirmed) return;

  elements.logoutButton.disabled = true;
  elements.logoutButton.style.opacity = "0.6";

  try {
    await signOut(auth);
    window.location.replace("login.html");
  } catch (error) {
    console.error("Logout error:", error);
    showToast("Logout failed. Please try again.");

    elements.logoutButton.disabled = false;
    elements.logoutButton.style.opacity = "1";
  }
});

// Require a signed-in Firebase user before displaying the profile.
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace("login.html");
    return;
  }

  try {
    await loadUserProfile(user);
  } catch (error) {
    console.error("Profile loading error:", error);

    // Authentication data is still available if a profile document
    // has not yet been created in Firestore.
    currentProfile = {
      username: user.displayName || "PLAYT124 Player",
      email: user.email || "Email unavailable",
      uid: user.uid,
      createdAt: null
    };

    elements.username.textContent = currentProfile.username;
    elements.email.textContent = currentProfile.email;
    elements.detailUsername.textContent = currentProfile.username;
    elements.detailEmail.textContent = currentProfile.email;
    elements.detailUid.textContent = currentProfile.uid;
    elements.detailJoined.textContent = "Not available";

    setAvatar(currentProfile.username);

    showToast("Some profile details could not be loaded.");
  }
});
    
