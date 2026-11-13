import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";

const toast = document.getElementById("toast");
const depositForm = document.getElementById("depositForm");
const withdrawForm = document.getElementById("withdrawForm");
const historyTabs = document.getElementById("historyTabs");

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/*
  WALLET SECURITY STATUS

  Real wallet operations are intentionally disabled.

  Do not add money to a balance from browser JavaScript.
  Deposits must be credited only after verified payment.
  Withdrawals must be processed by trusted server-side logic.
  Transaction records must be created by trusted server-side logic.
*/

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.replace("login.html");
    return;
  }

  console.log("PLAYT124 wallet opened for:", user.uid);
});

// Deposit form
depositForm.addEventListener("submit", (event) => {
  event.preventDefault();

  showToast(
    "Deposits are not active yet. Secure payment integration is pending."
  );
});

// Withdrawal form
withdrawForm.addEventListener("submit", (event) => {
  event.preventDefault();

  showToast(
    "Withdrawals are not active yet. Secure wallet processing is pending."
  );
});

// Transaction history filters
historyTabs.addEventListener("click", (event) => {
  const button = event.target.closest(".history-tab");

  if (!button) return;

  document.querySelectorAll(".history-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  button.classList.add("active");

  const selectedFilter = button.dataset.filter;

  const messages = {
    all: "Your verified wallet transactions will appear here.",
    deposit: "Your verified deposits will appear here.",
    entry: "Your tournament entry-fee records will appear here.",
    winning: "Your verified tournament winnings will appear here.",
    withdrawal: "Your withdrawal records will appear here.",
    refund: "Your eligible refund records will appear here."
  };

  const historyContent = document.getElementById("historyContent");

  historyContent.innerHTML = `
    <div class="empty-history">
      <div class="empty-icon">₹</div>
      <h3>No transactions yet</h3>
      <p>${messages[selectedFilter]}</p>
    </div>
  `;
});
