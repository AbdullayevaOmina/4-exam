import * as functions from "./functions.js";

document.addEventListener("DOMContentLoaded", async function () {
  functions.logOut();
  axios.defaults.baseURL = "https://nt-devconnector.onrender.com/api/";
  let headers = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("UserToken"),
    },
  };
  let form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let school = form[0].value.trim();
    let degree = form[1].value.trim();

    if (!school || !degree) {
      functions.createAlert("School and degree are required", "error");
      return;
    }

    if (form[4].checked) {
      form[5].disabled = true;
      form[5].value = "";
    }
    
    try {
      let { data } = await axios.put(
        "/profile/education",
        {
          school: school,
          degree: degree,
          fieldofstudy: form[2].value.trim(),
          from: form[3].value.trim(),
          to: form[5].value.trim(),
          description: form[6].value.trim(),
        },
        headers
      );

      console.log(data);
      functions.createAlert("Education added", "success");
      form.reset();

      setTimeout(() => {
        window.location.replace("../pages/dashboard.html");
      }, 1000);
    } catch (error) {
      console.error(error);
      // Xatolikni brauzer konsolida chiqarish
      console.error(error.response.data.message);
      functions.createAlert("Error adding education", "error");
    }
  });
});
