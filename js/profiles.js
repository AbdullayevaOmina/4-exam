import * as functions from "./functions.js";

document.addEventListener("DOMContentLoaded", async () => {
  functions.logOut();

  axios.defaults.baseURL = "https://nt-devconnector.onrender.com/api/";
  const usersProfile = document.querySelector(".users");

  async function getUserProfile(userId) {
    try {
      const response = await axios.get(`/profile/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  } 
 
  try {
    functions.showLoader();
    const { data } = await axios.get("/profile");
    functions.hideLoader();

    data.forEach((element) => {
      const user = `
        <div class="d-flex align-items-center p-3 mb-5 px-4 border color-grey user">
          <img src="${element.user.avatar}" alt="" class="viewProfile" />
          <div class="d-flex justify-content-between mx-5 w-100">
            <div class="my-3">
              <h1 class="viewProfile">${element.user.name}</h1>
              <p class="fs-5 mt-3">${element.status} at ${element.company}</p>
              <p class="fs-5 mt-3">${element.location}</p>
              <a  href="./profile.html">
                <button class="viewProfileBtn" data-user-id="${
                  element.user._id
                }">
                  View Profile
                </button>
              </a> 
            </div>
            <ul class="d-grid align-items-center my-3 mx-5">${functions.skills(
              element
            )}</ul>
          </div>
        </div>`;

      usersProfile.innerHTML += user;
    });

    functions.go_to_profile(usersProfile, "../pages/profile.html");
  } catch (error) {
    console.error(error);
    functions.hideLoader();
  }
});
