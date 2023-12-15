import * as functions from "./functions.js";

document.addEventListener("DOMContentLoaded", async function () {
  functions.logOut();
  axios.defaults.baseURL = "https://nt-devconnector.onrender.com/api/";
  let headers = {
    headers: {
      "x-auth-token": `${localStorage.getItem("userProfile_ID")}`,
    },
  };
  let user_Id = localStorage.getItem("userProfile_Id");

  try {
    functions.showLoader();
    let { data } = await axios.get(`/profile/user/${user_Id}`);
    functions.hideLoader();

    // SHOWCASE
    document.querySelector(".showcase").innerHTML = `
      <img src="${data.user.avatar}" alt="" />
      <h1 class="name"><b>${data.user.name}</b></h1>
      <p class="status fs-5">${data.status}  at  ${data.company}</p>
    `;

    // SKILLS
    document.querySelector(".scills").textContent = data.skills;

    // BIO
    let bioHTML = "";
    if (data.bio.trim() !== "") {
      document.querySelector(".skills-set").classList.add("border-bottom");
      bioHTML = `
        <h1 class="display-color"><span>Users</span> Bio</h1>
        <p class="scills fs-5 mt-5">${data.bio}</p>
      `;
    }
    document.querySelector(".bio").innerHTML = bioHTML;

    // EDUCATION
    let edu = document.querySelector("#educations");
    if (data.education.length === 0) {
      edu.innerHTML = `<b>No education credentials</b>`;
    } else {
      let educationsHTML = data.education.map((element) => {
        let to =
          element.to === null
            ? "Now"
            : `${element.to.slice(5, 7)}/${element.to.slice(
                8,
                10
              )}/${element.to.slice(0, 4)}`;

        return `
          <div class="education my-5 border-bottom">
            <h4>${element.school}</h4>
            <p>${element.from.slice(5, 7)}/${element.from.slice(
          8,
          10
        )}/${element.from.slice(0, 4)}- ${to}</p>
            <p><b>Degree: </b>${element.degree}</p>
            <p><b>Field Of Study: </b>${element.fieldofstudy}</p>
            <p><b>Description: </b>${element.description}</p>
          </div>
        `;
      });
      edu.innerHTML = educationsHTML.join("");
    }

    // EXPERIENCE
    let exp = document.querySelector("#experiences");
    if (data.experience.length === 0) {
      exp.innerHTML = `<b>No experience credentials</b>`;
    } else {
      let experiencesHTML = data.experience.map((element) => {
        let to =
          element.to === null
            ? "Now"
            : `${element.to.slice(5, 7)}/${element.to.slice(
                8,
                10
              )}/${element.to.slice(0, 4)}`;

        return `
          <div class="education my-5 border-bottom">
            <h4>${element.company}</h4>
            <p>${element.from.slice(5, 7)}/${element.from.slice(
          8,
          10
        )}/${element.from.slice(0, 4)}- ${to}</p>
            <p><b>Position: </b>${element.title}</p>
            <p><b>Location: </b>${element.location}</p>
            <p><b>Description: </b>${element.description}</p>
          </div>
        `;
      });
      exp.innerHTML = experiencesHTML.join("");
    }

    // GITHUB
    let githubusername = data.githubusername.trim();
    if (githubusername !== "") {
      try {
        let githubData = await axios.get(`/profile/github/${githubusername}`);
        console.log(githubData);

        githubData.data.forEach((element) => {
          let repo = `<div class="repo d-flex justify-content-between w-100 border p-3 my-3">
              <div>
                <a target="_blank" href="${element.clone_url}" class="display-color">
                  <h4>${element.name}</h4>
                </a>
              </div>
              <div class="d-grid gap-2">
                <button>Stars:  ${element.stargazers_count}</button>
                <button class="bg-dark">Watchers:  ${element.watchers_count}</button>
                <button class="border whiteBtn">fork: ${element.forks_count}</button>
              </div>
            </div>`;

          document.querySelector("#repos").innerHTML += repo;
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      document.querySelector(
        "#repos"
      ).innerHTML = `<p class="fs-5">github is not included</p>`;
    }

    console.log(data);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      // Xato kodni foydalanuvchiga ko'rsatish
      document.querySelector(
        ".user"
      ).innerHTML = `<h1>${error.response.data.msg}</h1>`;
    } else {
      // Boshqa xatolar
      console.error(error);
      functions.createAlert("An error occurred", "error");
    }
    functions.hideLoader();
  }
});
