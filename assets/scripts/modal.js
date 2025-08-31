
    const showSignup = document.getElementById("showSignup");
    const showLogin = document.getElementById("showLogin");
    const loginBox = document.querySelector(".form-box.login");
    const registerBox = document.querySelector(".form-box.register");

    function toggleForms(show) {
      loginBox.classList.remove("active");
      registerBox.classList.remove("active");

      if (show === "login") {
        loginBox.classList.add("active");
      } else {
        registerBox.classList.add("active");
      }
    }

    showSignup.addEventListener("click", (e) => {
      e.preventDefault();
      toggleForms("signup");
    });

    showLogin.addEventListener("click", (e) => {
      e.preventDefault();
      toggleForms("login");
    });
    // document.querySelectorAll(".auth-form form").forEach(form => {
    //   form.addEventListener("submit", function (e) {
    //     e.preventDefault(); // prevent page reload
    //     // You can handle login/signup here later with fetch/ajax
    //   });
    // });