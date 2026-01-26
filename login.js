document.querySelector(".welcome-page .welcome span").innerHTML = "Yalla Hagz";

document.title = "YALLA HAGZ";

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-button");
const signupBtn = document.getElementById("signup-button");
const loginForm = document.querySelector(".login-form");

let messageElement = null;

loginBtn.addEventListener("click", handleLogin);

signupBtn.addEventListener("click", () => {
  window.location.href = "sign.html";
});

function handleLogin(e) {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  // Remove previous message if exists
  if (messageElement) {
    messageElement.remove();
  }

  if (!username || !password) {
    showMessage("Please enter username and password!", "error");
    return;
  }

  // Check if user exists in localStorage
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (user) {
    // User found, save current user session and redirect to home
    localStorage.setItem("currentUser", JSON.stringify(user));
    showMessage("Login successful! Redirecting...", "success");

    // Redirect to home.html after 1.5 seconds
    setTimeout(() => {
      window.location.href = "home.html";
    }, 1500);
  } else {
    // User not found
    showMessage("Account is not found. You may sign up", "error");
    // Reset password field
    passwordInput.value = "";
  }
}

function showMessage(message, type) {
  messageElement = document.createElement("div");
  messageElement.textContent = message;
  messageElement.style.padding = "12px 20px";
  messageElement.style.marginBottom = "20px";
  messageElement.style.borderRadius = "8px";
  messageElement.style.textAlign = "center";
  messageElement.style.fontWeight = "bold";
  messageElement.style.fontSize = "16px";

  if (type === "error") {
    messageElement.style.color = "white";
    messageElement.style.backgroundColor = "#d32f2f";
  } else if (type === "success") {
    messageElement.style.color = "white";
    messageElement.style.backgroundColor = "#388e3c";
  }

  loginForm.insertBefore(messageElement, loginForm.firstChild);
}
