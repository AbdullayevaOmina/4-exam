import * as functions from "./functions.js";

document.addEventListener("DOMContentLoaded", async function () {
  axios.defaults.baseURL = "https://nt-devconnector.onrender.com/api/";
  let form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let email = form[0].value.trim();
    let password = form[1].value.trim();

    if (!password || !email)
      return functions.createAlert("password or email error");

    if (password.length < 4)
      return functions.createAlert("password or email error");

    try {
      let { data } = await axios.post("/auth", {
        email: email,
        password: password,
      });
      // console.log(data);
      functions.createAlert("Welcome!", "success");
      localStorage.setItem("UserToken", data.token);
      form.reset();
      window.location.replace("../pages/dashboard.html");
    } catch (error) {
      console.error(error);
      functions.createAlert(error);
    }
  });
});
