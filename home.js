
"use strict";

document.addEventListener("DOMContentLoaded", () => {

  // =====================================
  // HOMEPAGE IMAGE MANAGEMENT
  // =====================================

  function applyHomepageImages(images = {}) {

    document.querySelectorAll("[data-image-slot]").forEach(slot => {

      const slotName = slot.dataset.imageSlot;
      const imageUrl = images[slotName];

      if (!imageUrl) return;

      // Accept only HTTP(S) URLs or safe relative image paths.
      const safeUrl =
        /^(https?:\/\/|\/|assets\/)/i.test(imageUrl) &&
        !/^(javascript:|data:)/i.test(imageUrl);

      if (!safeUrl) return;

      const image = slot.querySelector("img");

      if (!image) return;

      image.onload = () => {
        slot.classList.add("has-image");
      };

      image.onerror = () => {
        slot.classList.remove("has-image");
        image.removeAttribute("src");
      };

      image.src = imageUrl;

    });
  }

  // Future Admin Dashboard / Firebase integration point.
  window.PLAYT124_applyHomeImages = applyHomepageImages;

  // Initially no uploaded homepage images.
  applyHomepageImages(
    window.PLAYT124_HOME_IMAGES || {}
  );


  // =====================================
  // TUTORIAL ACCORDION
  // =====================================

  const tutorialToggle =
    document.getElementById("tutorialToggle");

  const tutorialContent =
    document.getElementById("tutorialContent");

  if (tutorialToggle && tutorialContent) {

    tutorialToggle.addEventListener("click", () => {

      const isExpanded =
        tutorialToggle.getAttribute("aria-expanded") === "true";

      tutorialToggle.setAttribute(
        "aria-expanded",
        String(!isExpanded)
      );

      tutorialContent.hidden = isExpanded;

    });

  }


  // =====================================
  // ANNOUNCEMENT NAVIGATION
  // =====================================

  const announcementButton =
    document.getElementById("announcementButton");

  if (announcementButton) {

    announcementButton.addEventListener("click", () => {

      const updates = document.getElementById("updatesSection");

      if (updates) {
        updates.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

    });

  }


  // =====================================
  // IMAGE SLOT INFORMATION
  // =====================================

  const homepageImageSlots = [
    "siteLogo",
    "tutorialBanner",
    "updateBanner",
    "exclusiveOne",
    "exclusiveTwo",
    "ongoingImage",
    "upcomingImage",
    "completedImage"
  ];

  window.PLAYT124_HOME_IMAGE_SLOTS = homepageImageSlots;


  // =====================================
  // INITIAL WALLET DISPLAY
  // =====================================

  // No actual wallet balance is available yet.
  // Firebase and secure wallet integration will
  // supply the real balance in a later stage.

  const coinBalance =
    document.getElementById("coinBalance");

  if (coinBalance) {
    coinBalance.textContent = "--";
  }


  // =====================================
  // HOMEPAGE INITIALIZATION
  // =====================================

  console.log("PLAYT124 Homepage initialized.");

});
