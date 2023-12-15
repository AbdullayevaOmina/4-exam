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
  let linksBtn = document.querySelector("#linksBtn");
  let links = document.querySelector(".links");
  let goBackBtn = document.querySelector("#goback");

  linksBtn.addEventListener("click", () => {
    links.classList.toggle("d-none");
  });

  goBackBtn.addEventListener("click", () => {
    window.location.replace("../pages/dashboard.html");
  });

  userData = await axios.get("/profile/me", headers);
  console.log(userData.data);
  

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let status = form[0].value.trim();
    let skills = form[4].value.trim();

    if (!status) return createAlert("Status is required");
    if (!skills) return createAlert("Skills is required");

    try {
      let { data } = await axios.post(
        "/profile",
        {
          status: status,
          skills: skills,
          company: form[1].value.trim(),
          website: form[2].value.trim(),
          location: form[3].value.trim(),
          githubusername: form[5].value.trim(),
          bio: form[6].value.trim(),
          twitter: form[7].value.trim(),
          instagram: form[8].value.trim(),
          facebook: form[9].value.trim(),
          youtube: form[10].value.trim(),
          linkedin: form[11].value.trim(),
        },
        headers
      );

      console.log(data);

      createAlert("Profile Created", "success");

      form.reset();

      window.location.replace("../pages/dashboard.html");
    } catch (error) {
      console.error(error);
      createAlert(error.response.data.message, "error");
    }
  });
});
