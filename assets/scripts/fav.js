document.addEventListener("DOMContentLoaded", () => {
  // Select all save buttons
  const saveButtons = document.querySelectorAll(".save-button, .details-save-button");

  saveButtons.forEach(button => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      const placeId = button.dataset.id;

      // Check if user is logged in
      if (!window.isLoggedIn) {
        // Trigger login modal if using Bootstrap modal
        const authModal = new bootstrap.Modal(document.getElementById('authModal'));
        authModal.show();
        return;
      }

      try {
        const res = await fetch(`/favorites/toggle/${placeId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();

        if (data.saved) {
          button.classList.add("saved"); // Add red heart
        } else {
          button.classList.remove("saved"); // Remove red heart
        }

      } catch (err) {
        console.error("Error toggling favorite:", err);
      }
    });
  });
});
