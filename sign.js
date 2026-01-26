document.title = "YALLA HAGZ";

const signupForm = document.querySelector(".signup-form");
const usernameInput = document.getElementById("signup-username");
const ageInput = document.getElementById("age");
const emailInput = document.getElementById("email");
const levelSelect = document.getElementById("plan");
const passwordInput = document.getElementById("signup-password");
const retypePasswordInput = document.getElementById("retype-password");
const signupBtn = document.getElementById("button");

let messageElement = null;

signupBtn.addEventListener("click", handleSignup);

// Handle signup form submission
function handleSignup(e) {
  e.preventDefault();

  // Get form values
  const username = usernameInput.value.trim();
  const age = ageInput.value.trim();
  const email = emailInput.value.trim();
  const level = levelSelect.value;
  const password = passwordInput.value;
  const retypePassword = retypePasswordInput.value;

  // Remove previous message if exists
  if (messageElement) {
    messageElement.remove();
  }

  if (!username || !age || !email || !level || !password || !retypePassword) {
    showMessage("All fields are required!", "error");
    return;
  }

  if (isNaN(age) || age <= 0) {
    showMessage("Please enter a valid age!", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showMessage("Please enter a valid email!", "error");
    return;
  }

  if (password !== retypePassword) {
    showMessage("Passwords do not match!", "error");
    return;
  }

  // Check if user already exists
  if (userExists(username, email)) {
    showMessage("User already exists!", "error");
    return;
  }

  // If all validations pass, save the data
  const userData = {
    username,
    age,
    email,
    level,
    password,
    coins: 0,
    createdAt: new Date().toISOString(),
  };

  saveToLocalStorage(userData);

  showMessage("Sign up successful!", "success");

  signupForm.reset();

  // Optionally redirect after successful signup
  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000);
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check if user already exists in localStorage
function userExists(username, email) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userExists = users.some(
    (user) => user.username === username || user.email === email,
  );

  return userExists;
}

function saveToLocalStorage(userData) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(userData);
  localStorage.setItem("users", JSON.stringify(users));
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

  signupForm.insertBefore(messageElement, signupForm.firstChild);
}
