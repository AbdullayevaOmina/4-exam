import * as functions from "./functions.js";

document.addEventListener("DOMContentLoaded", async function () {
  axios.defaults.baseURL = "https://nt-devconnector.onrender.com/api/";
  let headers = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("UserToken"),
    },
  };
  let userName = document.querySelector(".userName");
  let DashboardSection = document.querySelector(".section");
  let loader = document.querySelector("#loader-container");

  functions.logOut();

  try {
    functions.showLoader();
    let { data } = await axios.get("/auth", headers);
    functions.hideLoader();
    userName.textContent = data.name;
  } catch (error) {
    console.error("Autentifikatsiya xatoligi:", error);
    functions.hideLoader();
  }

  let userData;
  try {
    functions.showLoader();
    userData = await axios.get("/profile/me", headers);
    functions.hideLoader();
  } catch (error) {
    console.error("Profilni olishda xatolik yuz berdi:", error);
    functions.hideLoader();
  }
 
  if (!userData.data) {
    DashboardSection.innerHTML = `<p class="info">You have not yet setup a profile, please add some info</p>
        <a href="./create_profile.html">
          <button>Create Profile</button>
        </a>`;
  } else {
    DashboardSection.innerHTML = `<div class="section">
        <div class="d-flex gap-3">
          <a href="../pages/edit_profile.html">
            <button class="btn whiteBtn border">Edite Profile</button>
          </a>
          <a href="../pages/add_experiense.html">
            <button class="btn whiteBtn border">Add experience</button>
          </a>
          <a href="../pages/add_education.html">
            <button class="btn whiteBtn border">Add Education</button>
          </a>
        </div>
        <p class="fs-4 my-3 mt-5">Experience Credentials</p>
        <table class="table table-bordered table-success table-striped w-75">
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th>Years</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="expCred"></tbody>
        </table>
        <p class="fs-4 my-3 mt-5">Education Credentials</p>
        <table class="table table-bordered table-success table-striped w-75">
          <thead>
            <tr>
              <th>School</th>
              <th>Degree</th>
              <th>Years</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="eduCred"></tbody>
        </table>

        <button id="deleteBtn" class="btn btn-danger mt-4">
          Delete My Account
        </button>
      </div>`;
  }

  console.log(userData.data);

  let eduCred = document.querySelector("#eduCred");
  let expCred = document.querySelector("#expCred");

  userData.data.experience.forEach((element) => {
    let tr = `
    <tr>
      <th>${element.company}</th>
      <th>${element.title}</th>
      <th>${element.from.slice(0, 10)}</th>
      <th><button class="btn btn-danger expCredDeleteBtn" data-id="${
        element._id
      }">Delete</button></th>
    </tr>`;
    expCred.innerHTML += tr;
  });

  userData.data.education.forEach((element) => {
    let tr = `
    <tr>
      <th>${element.school}</th>
      <th>${element.degree}</th>
      <th>${element.from.slice(0, 10)}</th>
      <th><button class="btn btn-danger eduCredDeleteBtn" data-id="${
        element._id
      }">Delete</button></th>
    </tr>`;
    eduCred.innerHTML += tr;
  });

  document.querySelectorAll(".expCredDeleteBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      let userConfirmation = confirm("Ma'lumotni o'chirishni tasdiqlaysizmi?");
      if (userConfirmation) {
        let id = btn.getAttribute("data-id");
        try {
          await axios.delete(`/profile/experience/${id}`, headers);
          window.location.reload();
        } catch (error) {
          console.error("Ma'lumotni o'chirishda xatolik yuz berdi:", error);
        }
      } else {
        console.log("O'chirish bekor qilindi.");
      }
    });
  });

  document.querySelectorAll(".eduCredDeleteBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      let userConfirmation = confirm("Ma'lumotni o'chirishni tasdiqlaysizmi?");
      if (userConfirmation) {
        let id = btn.getAttribute("data-id");
        try {
          await axios.delete(`/profile/education/${id}`, headers);
          window.location.reload();
        } catch (error) {
          console.error("Ma'lumotni o'chirishda xatolik yuz berdi:", error);
        }
      } else {
        console.log("O'chirish bekor qilindi.");
      }
    });
  });

  functions.deleteAcount()
});
