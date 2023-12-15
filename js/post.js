import * as functions from "./functions.js";

document.addEventListener("DOMContentLoaded", async function () {
  axios.defaults.baseURL = "https://nt-devconnector.onrender.com/api/";
  let headers = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("UserToken"),
    },
  };
  let form = document.querySelector("form");
  let commentsSection = document.querySelector(".comments");
  functions.logOut();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `/posts/comment/${localStorage.getItem("userPost_Id")}`,
        {
          text: form[0].value.trim(),
        },
        headers
      );

      functions.createAlert("Comment successfully", "success");
      window.location.reload();
    } catch (error) {
      console.error(error);
      functions.createAlert(error, "error");
    }
  });

  try {
    functions.showLoader();
    let { data } = await axios.get(
      `/posts/${localStorage.getItem("userPost_Id")}`,
      headers
    );
    functions.hideLoader();

    document.querySelector(".post").innerHTML = `
        <div class="color-grey d-flex border my-4 p-3 w-100">
          <div class="w-25 post-img">
            <img class="cursor-pointer viewProfileBtn" src="${
              data.avatar
            }" alt="">
            <h5 data-user-id="${data}" class="mt-3 display-color cursor-pointer viewProfileBtn">${
      data.name
    }</h5>
          </div>
          <div class="w-75 d-grid gap-3 my-4">
            <h5>${data.text}</h5>
            <small class="text-grey">Posted on ${data.date.slice(
              5,
              7
            )}/${data.date.slice(8, 10)}/${data.date.slice(0, 4)}</small>
            <div class="d-flex gap-2">
              <button class="whiteBtn border like" data-post-id="${data._id}">
                <i class="fa-regular fa-thumbs-up"></i> <span class="like-count"> ${
                  data.likes.length
                }</span>
              </button>
              <button class="whiteBtn border dis-like"><i class="fa-regular fa-thumbs-down"></i></button>
              <button class="discuation" data-post-id="${
                data._id
              }">Discussion ${data.comments.length} </button>
            </div>
          </div>
        </div>`;

    console.log(data);

    data.comments.forEach((element) => {
      let comment = `
    <div class="color-grey d-flex border my-4 p-3 w-100">
      <div class="w-25 post-img">
        <img class="cursor-pointer viewProfileBtn" data-user-id="${element.user}" src="${element.avatar}" alt="" />
        <h5 class="mt-3 display-color cursor-pointer viewProfileBtn" data-user-id="${element.user}">${element.name}</h5>
      </div>
      <div class="w-75 d-grid gap-3 my-4">
        <h5>${element.text}</h5>
        <small class="text-grey">Posted on ${element.date.slice(
          5,
          7
        )}/${element.date.slice(8, 10)}/${element.date.slice(0, 4)}</small>
      </div>
    </div>`;

      commentsSection.innerHTML += comment;
    });

    document.querySelectorAll(".like").forEach((likeButton) => {
      likeButton.addEventListener("click", () => {
        const post_id = likeButton.getAttribute("data-post-id");
        const like_count = likeButton.querySelector(".like-count");
        functions.likePost(post_id, like_count);
      });
    });


    functions.go_to_profile(commentsSection, "../pages/profile.html");

  } catch (error) {
    console.error(error);
    functions.hideLoader();
    functions.createAlert(error);
  }
});
