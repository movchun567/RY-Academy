const inputs = document.querySelectorAll(".login-input");
const emailInput = inputs[0];
const passwordInput = inputs[1];
const loginButton = document.querySelector(".login-btn");
const error = document.createElement("div");
error.style.color = "red";
error.style.fontSize = "14px";
error.style.marginTop = "6px";
passwordInput.insertAdjacentElement("afterend", error);

function validate() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email) || password.length < 6) {
        error.textContent = "Invalid email or password (min 6 characters)";
        return;
    }
    error.textContent = "";
    const user = { email, password };
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "../template/todolist.html";
}

loginButton.addEventListener("click", validate);