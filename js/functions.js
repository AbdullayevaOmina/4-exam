axios.defaults.baseURL = "https://nt-devconnector.onrender.com/api/";
let headers = {
  headers: {
    "x-auth-token": `${localStorage.getItem("userProfile_ID")}`,
  },
};

export function showLoader() {
  document.querySelector("#loader-container").style.display = "block";
}
 
export function hideLoader() {
  document.querySelector("#loader-container").style.display = "none";
}

export function logOut() {
  document.querySelector("#logout").addEventListener("click", () => {
    localStorage.removeItem("UserToken");
    window.location.replace("../pages/login.html");
  });
}

export function skills(element) {
  let a = element.skills.length <= 5 ? element.skills.length : 5;
  let skillsHtml = "";
  for (let i = 0; i < a; i++) {
    skillsHtml += `<li class="list-unstyled display-color fs-5">${element.skills[i]}</li>`;
  }
  return skillsHtml;
}

export function deleteAcount() {
  document.querySelector("#deleteBtn").addEventListener("click", async () => {
    let userConfirmation = confirm("Hisobingizni o'chirishni tasdiqlaysizmi?");

    if (userConfirmation) {
      try {
        await axios.delete("/profile", headers);
        localStorage.removeItem("UserToken");
        window.location.replace("../pages/login.html");
      } catch (error) {
        console.error("Hisobni o'chirish xatoligi:", error);
      }
    } else {
      console.log("Hisob o'chirish bekor qilindi.");
    }
  });
}

export function createAlert(msg, type = "error") {
  let alertElement = document.createElement("div");
  let color =
    type === "error"
      ? "danger"
      : type === "success"
      ? "success"
      : type === "info"
      ? "primry"
      : "warning";
  let className = `alert text-white bg-${color}`;

  alertElement.classList.add(...className.split(" "));
  alertElement.innerText = msg;
  let closeBtn = document.createElement("button");
  closeBtn.classList.add("ms-4", "btn", `btn-${color}`);
  closeBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
  alertElement.append(closeBtn);
  document.querySelector(".alert-wrapper").append(alertElement);
  closeBtn.addEventListener("click", () => alertElement.remove());
  setTimeout(() => alertElement.remove(), 3_000);
}

export function go_to_profile(userCard, win_loc) {
  userCard.addEventListener("click", (event) => {
    if (event.target.classList.contains("viewProfileBtn")) {
      const userId = event.target.getAttribute("data-user-id");
      localStorage.setItem("userProfile_Id", userId);
      if (win_loc) window.location.replace(win_loc);
    }
  });
}

export function go_to_post(postCard, win_loc) {
  postCard.addEventListener("click", (event) => {
    if (event.target.classList.contains("discuation")) {
      const userId = event.target.getAttribute("data-post-id");
      localStorage.setItem("userPost_Id", userId);
      if (win_loc) window.location.replace(win_loc);
    }
  });
}

export async function deleteMyPost(item) {
  let { data } = await axios.delete(`/api/posts/${item._id}`, headers);
  window.location.reload();
}

export async function likePost(id, element) {
  try {
    let { data } = await axios.put(`/posts/like/${id}`, headers);
    if (data.length >= 0) {
      element.textContent = data.length;
    } else {
      element.textContent = "";
    }
  } catch (error) {
    console.log(error);
  }
}

export async function dislikePost(id, element) {
  let { data } = await axios.put(`/api/posts/unlike/${id}`, undefined, headers);
  if (data.length > 0) {
    element.textContent = data.length;
  } else {
    element.textContent = "";
  }
}
