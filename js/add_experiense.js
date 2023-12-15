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
    let jobtitle = form[0].value.trim();
    let company = form[1].value.trim();

    if (form[4].checked) {
      form[5].disabled = true;
      form[5].value = "";
    }
 
    console.log(form[4].value);

    if (!jobtitle) return functions.createAlert("Job title is required");
    if (!company) return functions.createAlert("Company is required");

    try {
      let { data } = await axios.put(
        "/profile/experience",
        {
          title: jobtitle,
          company: company,
          location: form[2].value.trim(),
          from: form[3].value.trim(),
          to: form[5].value.trim(),
          description: form[6].value.trim(),
        },
        headers
      );

      console.log(data);

      functions.createAlert("Experience added", "success");

      form.reset();

      setTimeout(() => {
        window.location.replace("../pages/dashboard.html");
      }, 1000);
    } catch (error) {
      console.error(error);
      functions.createAlert(error.response.data.message, "error");
    }
  });
});
