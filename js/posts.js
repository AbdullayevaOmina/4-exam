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
  let posts = document.querySelector(".posts");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/posts",
        {
          text: form[0].value.trim(),
        },
        headers
      );

      functions.createAlert("Post created successfully", "success");
      window.location.reload();
    } catch (error) {
      console.error(error);
      functions.createAlert(error, "error");
      functions.hideLoader();
    }
  });

  try {
    functions.showLoader();
    let { data } = await axios.get("/posts", headers);
    functions.hideLoader();

    console.log(data);
    data.forEach((element) => {
      let post = `
        <div class="color-grey d-flex border my-4 p-3 w-100">
          <div class="w-25 post-img">
            <img class="cursor-pointer viewProfileBtn" data-user-id="${
              element.user
            }" src="${element.avatar}" alt="">
            <h5 data-user-id="${
              element.user
            }" class="mt-3 display-color cursor-pointer viewProfileBtn">${
        element.name
      }</h5>
          </div>
          <div class="w-75 d-grid gap-3 my-4">
            <h5>${element.text}</h5>
            <small class="text-grey">Posted on ${element.date.slice(
              5,
              7
            )}/${element.date.slice(8, 10)}/${element.date.slice(0, 4)}</small>
            <div class="d-flex gap-2">
              <button class="whiteBtn border like" data-post-id="${
                element._id
              }">
                <i class="fa-regular fa-thumbs-up"></i> <span class="like-count"> ${
                  element.likes.length
                }</span>
              </button>
              <button class="whiteBtn border dis-like"><i class="fa-regular fa-thumbs-down"></i></button>
              <button data-post-id="${
                element._id
              }" class="discuation">Discussion ${
        element.comments.length
      } </button>
            </div>
          </div>
        </div>`;
      posts.innerHTML += post;
    });

    functions.go_to_profile(posts, "../pages/profile.html");
    functions.go_to_post(posts, "../pages/post.html");

    document.querySelectorAll(".like").forEach((likeButton) => {
      likeButton.addEventListener("click", () => {
        const post_id = likeButton.getAttribute("data-post-id");
        const like_count = document.querySelector("like-count");
        functions.likePost(post_id, like_count);
      });
    });
    
  } catch (error) {
    console.error(error);
    functions.hideLoader();
    functions.createAlert(error);
  }
});
