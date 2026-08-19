const API_BASE = "/api";

const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const profileSection = document.getElementById("profileSection");

function toggleForms() {
  const showingLogin = loginSection.style.display !== "none";
  loginSection.style.display = showingLogin ? "none" : "block";
  registerSection.style.display = showingLogin ? "block" : "none";
}

function getToken() {
  return localStorage.getItem("authToken");
}

function setToken(token) {
  localStorage.setItem("authToken", token);
}

function clearToken() {
  localStorage.removeItem("authToken");
}

async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (_) {}

  if (!response.ok) {
    const message = (data && data.message) || "Сталася помилка запиту";
    throw new Error(message);
  }

  return data;
}

async function register() {
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const errorEl = document.getElementById("registerError");
  errorEl.textContent = "";

  if (!name || !email || !password) {
    errorEl.textContent = "Заповніть усі поля.";
    return;
  }
  if (password.length < 6) {
    errorEl.textContent = "Пароль має містити щонайменше 6 символів.";
    return;
  }

  try {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    setToken(data.token);
    await loadProfile();
  } catch (err) {
    errorEl.textContent = err.message;
  }
}

async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const errorEl = document.getElementById("loginError");
  errorEl.textContent = "";

  if (!email || !password) {
    errorEl.textContent = "Вкажіть email і пароль.";
    return;
  }

  try {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    await loadProfile();
  } catch (err) {
    errorEl.textContent = err.message;
  }
}

async function loadProfile() {
  const token = getToken();
  if (!token) {
    showAuthForms();
    return;
  }

  try {
    const data = await apiRequest("/users/me", { method: "GET" });
    showProfile(data.user);
  } catch (err) {
    clearToken();
    showAuthForms();
  }
}

function showAuthForms() {
  profileSection.style.display = "none";
  loginSection.style.display = "block";
  registerSection.style.display = "none";
}

function showProfile(user) {
  loginSection.style.display = "none";
  registerSection.style.display = "none";
  profileSection.style.display = "block";

  document.getElementById("profileName").textContent = user.name;
  document.getElementById("profileEmail").textContent = user.email;
  document.getElementById("profileCreatedAt").textContent = new Date(
    user.createdAt,
  ).toLocaleDateString("uk-UA");
  document.getElementById("profileBio").value = user.bio || "";
}

async function updateProfile() {
  const bio = document.getElementById("profileBio").value.trim();
  const messageEl = document.getElementById("profileMessage");
  messageEl.textContent = "";

  try {
    const data = await apiRequest("/users/me", {
      method: "PUT",
      body: JSON.stringify({ bio }),
    });
    showProfile(data.user);
    messageEl.textContent = "Профіль оновлено.";
  } catch (err) {
    messageEl.textContent = err.message;
    messageEl.classList.add("error-text");
  }
}

function logout() {
  clearToken();
  showAuthForms();
}

loadProfile();
