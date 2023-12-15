import * as functions from "./functions.js";

document.addEventListener("DOMContentLoaded", async function () {
  axios.defaults.baseURL = "https://nt-devconnector.onrender.com/api/";
  let form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let fullName = form[0].value.trim();
    let email = form[1].value.trim();
    let password = form[2].value.trim();
    let confirmPassword = form[3].value.trim();

    if (!fullName || !password || !email)
      return functions.createAlert("All fields are required!");

    if (fullName.length < 9)
      return functions.createAlert(
        "Full Name must be at least 9 characters long"
      );

    if (password.length < 4)
      return functions.createAlert(
        "Password must be at least 4 character long"
      );

    if (password !== confirmPassword)
      return functions.createAlert("Passwords do not match");

    try {
      let { data } = await axios.post("/users", {
        name: fullName,
        email: email,
        password: password,
      });
      // console.log(data);
      localStorage.setItem("UserToken", data.token);

      functions.createAlert("Signed up successfully", "success");
      form.reset();

      window.location.replace("../pages/dashboard.html");
    } catch (error) {
      console.error(error);
      functions.createAlert(error);
    }
  });
});
