document.addEventListener("DOMContentLoaded", () => {
  const openReviewButton = document.getElementById("openReviewButton");
  const reviewOverlay = document.getElementById("reviewOverlay");
  const closeReview = document.getElementById("closeReview");

  if (!openReviewButton || !reviewOverlay) return;

  openReviewButton.addEventListener("click", () => {
    if (window.isLoggedIn) {
      reviewOverlay.style.display = "flex"; // show form overlay
    } else {
      const authModal = new bootstrap.Modal(document.getElementById("authModal"));
      authModal.show();
    }
  });

  closeReview.addEventListener("click", () => {
    reviewOverlay.style.display = "none";
  });

  reviewOverlay.addEventListener("click", (e) => {
    if (e.target === reviewOverlay) reviewOverlay.style.display = "none";
  });
});
