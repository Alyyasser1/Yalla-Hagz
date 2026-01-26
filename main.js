document.title = "YALLA HAGZ";
// Initialize on Page Load
document.addEventListener("DOMContentLoaded", () => {
  initializeHeader();
  setupEventListeners();
  displayRooms();
});

// Initialize Header with User Data

function initializeHeader() {
  const currentUser = localStorage.getItem("currentUser");

  if (currentUser) {
    const user = JSON.parse(currentUser);

    // Extract initials from username
    const initials = user.username
      .split(" ")
      .map((name) => name.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);

    // Update account circle and dropdown
    document.getElementById("accountInitials").textContent = initials;
    document.getElementById("accountAvatarInitials").textContent = initials;
    document.getElementById("accountUsername").textContent = user.username;
    document.getElementById("accountEmail").textContent = user.email;

    // Update coins display
    const coinsCount = user.coins || 0;
    const coinsCountElement = document.getElementById("coinsCount");
    coinsCountElement.textContent = coinsCount;
    coinsCountElement.innerHTML = `${coinsCount} <i class="fa-solid fa-coins"></i>`;
  } else {
    // Redirect to login if no user is logged in
    window.location.href = "login.html";
  }
}

// Setup Event Listeners
let selectedCoinPackage = null;

function setupEventListeners() {
  // Coins Display Click - Toggle Dropdown
  const coinsDisplay = document.querySelector(".coins-display");
  const coinsDropdown = document.getElementById("coinsDropdown");

  coinsDisplay.addEventListener("click", () => {
    coinsDropdown.classList.toggle("active");
    // Close account dropdown if open
    document.getElementById("accountDropdown").classList.remove("active");
    selectedCoinPackage = null;
    clearCoinPackageSelection();
  });

  // Account Circle Click - Toggle Dropdown
  const accountCircle = document.getElementById("accountCircle");
  const accountDropdown = document.getElementById("accountDropdown");

  accountCircle.addEventListener("click", () => {
    accountDropdown.classList.toggle("active");
    // Close coins dropdown if open
    coinsDropdown.classList.remove("active");
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", (event) => {
    const coinsSection = document.querySelector(".coins-section");
    const accountSection = document.querySelector(".account-section");

    if (!coinsSection.contains(event.target)) {
      coinsDropdown.classList.remove("active");
    }

    if (!accountSection.contains(event.target)) {
      accountDropdown.classList.remove("active");
    }
  });

  // Logout Button
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  });

  // Coin Package Selection
  const coinPackages = document.querySelectorAll(".coin-package");
  coinPackages.forEach((button) => {
    button.addEventListener("click", () => {
      clearCoinPackageSelection();
      button.classList.add("selected");
      selectedCoinPackage = button.getAttribute("data-amount");
    });
  });

  // Get Coins Button Click
  const getCoinsBtn = document.getElementById("getCoinsBtn");
  getCoinsBtn.addEventListener("click", purchaseCoins);

  // Search Bar - Enter to Search
  const searchInput = document.getElementById("searchInput");
  const searchSuggestions = document.getElementById("searchSuggestions");

  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.trim();
    if (searchTerm.length > 0) {
      showSearchSuggestions(searchTerm);
    } else {
      searchSuggestions.classList.remove("active");
      displayRooms();
    }
  });

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        searchSuggestions.classList.remove("active");
        searchRooms(searchTerm);
      }
    }
  });

  // Close suggestions when clicking outside
  document.addEventListener("click", (event) => {
    const searchBarWrapper = document.querySelector(".search-bar-wrapper");
    if (!searchBarWrapper.contains(event.target)) {
      searchSuggestions.classList.remove("active");
    }
  });

  // Create Room Button
  const createRoomBtn = document.getElementById("createRoomBtn");
  const createRoomModal = document.getElementById("createRoomModal");
  const closeRoomModal = document.getElementById("closeRoomModal");
  const createRoomForm = document.getElementById("createRoomForm");

  createRoomBtn.addEventListener("click", () => {
    createRoomModal.classList.add("active");
  });

  closeRoomModal.addEventListener("click", () => {
    createRoomModal.classList.remove("active");
    createRoomForm.reset();
  });

  createRoomModal.addEventListener("click", (event) => {
    if (event.target === createRoomModal) {
      createRoomModal.classList.remove("active");
      createRoomForm.reset();
    }
  });

  createRoomForm.addEventListener("submit", (event) => {
    event.preventDefault();
    createRoom();
  });

  // Room Details Modal
  const roomDetailsModal = document.getElementById("roomDetailsModal");
  const closeRoomDetailsModal = document.getElementById(
    "closeRoomDetailsModal",
  );

  closeRoomDetailsModal.addEventListener("click", () => {
    roomDetailsModal.classList.remove("active");
  });

  roomDetailsModal.addEventListener("click", (event) => {
    if (event.target === roomDetailsModal) {
      roomDetailsModal.classList.remove("active");
    }
  });

  // Footer Links
  const homeLink = document.getElementById("homeLink");
  const alyLink = document.getElementById("alyLink");

  homeLink.addEventListener("click", () => {
    window.location.reload();
  });

  alyLink.addEventListener("click", () => {
    window.open("https://www.linkedin.com/in/aly-yasser-2b0907209/", "_blank");
  });
}

// Clear Coin Package Selection
function clearCoinPackageSelection() {
  const coinPackages = document.querySelectorAll(".coin-package");
  coinPackages.forEach((button) => {
    button.classList.remove("selected");
  });
}

// Purchase Coins
function purchaseCoins() {
  if (!selectedCoinPackage) {
    alert("Please select a coin package first!");
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentCoins = currentUser.coins || 0;
  const coinsToAdd = parseInt(selectedCoinPackage);

  // Update coins in localStorage
  currentUser.coins = currentCoins + coinsToAdd;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // Update coins in users object
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userIndex = users.findIndex((u) => u.email === currentUser.email);
  if (userIndex !== -1) {
    users[userIndex].coins = currentUser.coins;
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Update display
  document.getElementById("coinsCount").textContent = currentUser.coins;
  document.getElementById("coinsCount").innerHTML =
    `${currentUser.coins} <i class="fa-solid fa-coins"></i>`;

  // Close dropdown
  document.getElementById("coinsDropdown").classList.remove("active");

  // Reset selection
  selectedCoinPackage = null;
  clearCoinPackageSelection();
}

// Search Rooms - Show Suggestions
function showSearchSuggestions(searchTerm) {
  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  const searchSuggestions = document.getElementById("searchSuggestions");

  // Filter rooms by name (case-insensitive)
  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (filteredRooms.length === 0) {
    searchSuggestions.innerHTML = `<div class="search-suggestion-item" style="cursor: default; padding: 10px 12px; text-align: center; color: #999;">No rooms found</div>`;
    searchSuggestions.classList.add("active");
    return;
  }

  // Display suggestions
  searchSuggestions.innerHTML = "";
  filteredRooms.forEach((room) => {
    const suggestionItem = document.createElement("div");
    suggestionItem.className = "search-suggestion-item";
    suggestionItem.textContent = room.name;
    suggestionItem.addEventListener("click", () => {
      document.getElementById("searchInput").value = room.name;
      searchSuggestions.classList.remove("active");
      searchRooms(room.name);
    });
    searchSuggestions.appendChild(suggestionItem);
  });

  searchSuggestions.classList.add("active");
}

// Search Rooms - Filter and Display
function searchRooms(searchTerm) {
  if (!searchTerm.trim()) {
    displayRooms();
    return;
  }

  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  const roomsContainer = document.getElementById("roomsContainer");

  // Filter rooms by name
  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (filteredRooms.length === 0) {
    roomsContainer.innerHTML = `<p style="text-align: center; color: var(--main-color); grid-column: 1 / -1;">No rooms found "${searchTerm}". Create one!</p>`;
    return;
  }

  // Display filtered rooms
  roomsContainer.innerHTML = "";
  filteredRooms.forEach((room) => {
    const avgAge = calculateAverageAge(room.players);
    const avgLevel = calculateAverageLevel(room.players);

    const roomCard = document.createElement("div");
    roomCard.className = "room-card";
    roomCard.innerHTML = `
      <h3 class="room-name">${room.name}</h3>
      <div class="room-details">
        <div class="room-info">
          <div class="room-location"><strong>${room.courtName}</strong></div>
          <div class="room-court">${room.location}</div>
        </div>
        <div class="room-stats">
          <div class="room-stat">
            <span class="room-stat-label">Average Age</span>
            <span class="room-stat-value">${avgAge}</span>
          </div>
          <div class="room-stat">
            <span class="room-stat-label">Average Level</span>
            <span class="room-stat-value">${avgLevel}</span>
          </div>
        </div>
      </div>
    `;

    roomCard.addEventListener("click", () => {
      joinRoom(room.id);
    });

    roomsContainer.appendChild(roomCard);
  });
}

// Create Room Function
function createRoom() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentCoins = currentUser.coins || 0;
  const roomCost = 100;

  if (currentCoins < roomCost) {
    alert("Unable to create a room. You need at least 100 coins!");
    return;
  }

  const roomName = document.getElementById("roomName").value;
  const courtName = document.getElementById("courtName").value;
  const courtLocation = document.getElementById("courtLocation").value;
  const roomLevel = document.getElementById("roomLevel").value;

  // Deduct coins
  currentUser.coins = currentCoins - roomCost;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // Update coins in users object
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userIndex = users.findIndex((u) => u.email === currentUser.email);
  if (userIndex !== -1) {
    users[userIndex].coins = currentUser.coins;
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Create room object
  const room = {
    id: Date.now(),
    name: roomName,
    courtName: courtName,
    location: courtLocation,
    level: roomLevel,
    createdBy: currentUser.email,
    players: [
      {
        name: currentUser.username,
        email: currentUser.email,
        age: currentUser.age || 25,
        level: roomLevel,
      },
    ],
    createdAt: new Date().toISOString(),
  };

  // Save room to localStorage
  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  rooms.push(room);
  localStorage.setItem("rooms", JSON.stringify(rooms));

  // Update coins display
  document.getElementById("coinsCount").innerHTML =
    `${currentUser.coins} <i class="fa-solid fa-coins"></i>`;

  // Close modal
  document.getElementById("createRoomModal").classList.remove("active");
  document.getElementById("createRoomForm").reset();

  // Refresh rooms display
  displayRooms();
}

// Display Rooms Function
function displayRooms() {
  const roomsContainer = document.getElementById("roomsContainer");
  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];

  if (rooms.length === 0) {
    roomsContainer.innerHTML =
      '<p style="text-align: center; color: var(--main-color); grid-column: 1 / -1;">No available rooms. Create one!</p>';
    return;
  }

  roomsContainer.innerHTML = "";

  rooms.forEach((room) => {
    const avgAge = calculateAverageAge(room.players);
    const avgLevel = calculateAverageLevel(room.players);

    const roomCard = document.createElement("div");
    roomCard.className = "room-card";
    roomCard.innerHTML = `
      <h3 class="room-name">${room.name}</h3>
      <div class="room-details">
        <div class="room-info">
          <div class="room-location"><strong>${room.courtName}</strong></div>
          <div class="room-court">${room.location}</div>
        </div>
        <div class="room-stats">
          <div class="room-stat">
            <span class="room-stat-label">Average Age</span>
            <span class="room-stat-value">${avgAge}</span>
          </div>
          <div class="room-stat">
            <span class="room-stat-label">Average Level</span>
            <span class="room-stat-value">${avgLevel}</span>
          </div>
        </div>
      </div>
    `;

    roomCard.addEventListener("click", () => {
      joinRoom(room.id);
    });

    roomsContainer.appendChild(roomCard);
  });
}

// Calculate Average Age
function calculateAverageAge(players) {
  if (players.length === 0) return 0;
  const totalAge = players.reduce(
    (sum, player) => sum + Number(player.age || 25),
    0,
  );
  return Math.round(totalAge / players.length);
}

// Calculate Average Level (Most Repeated)
function calculateAverageLevel(players) {
  if (players.length === 0) return "N/A";

  const levelCount = {};
  players.forEach((player) => {
    const level = player.level || "beginner";
    levelCount[level] = (levelCount[level] || 0) + 1;
  });

  let mostRepeatedLevel = "beginner";
  let maxCount = 0;

  for (const [level, count] of Object.entries(levelCount)) {
    if (count > maxCount) {
      maxCount = count;
      mostRepeatedLevel = level;
    }
  }

  return mostRepeatedLevel;
}

// Join Room Function
function joinRoom(roomId) {
  const roomDetailsModal = document.getElementById("roomDetailsModal");
  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  const room = rooms.find((r) => r.id === roomId);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!room) return;

  // Update modal with room details
  document.getElementById("roomDetailName").textContent = room.name;
  document.getElementById("roomDetailCourt").textContent = room.courtName;
  document.getElementById("roomDetailLocation").textContent = room.location;
  document.getElementById("roomDetailLevel").textContent = room.level;

  // Display players
  const playersList = document.getElementById("playersList");
  playersList.innerHTML = "";
  room.players.forEach((player) => {
    const playerItem = document.createElement("div");
    playerItem.className = "player-item";
    playerItem.innerHTML = `
      <div class="player-info">
        <div class="player-details">
          <p class="player-name"><strong>${player.name}</strong> <span class="player-level-badge">${player.level}</span></p>
          <p class="player-email">${player.email}</p>
        </div>
      </div>
    `;
    playersList.appendChild(playerItem);
  });

  // Set up join button
  const joinBtn = document.getElementById("roomJoinBtn");
  const leaveBtn = document.getElementById("roomLeaveBtn");
  const isPlayerInRoom = room.players.some(
    (p) => p.email === currentUser.email,
  );

  if (isPlayerInRoom) {
    joinBtn.style.display = "none";
    leaveBtn.style.display = "inline-block";
  } else {
    joinBtn.style.display = "inline-block";
    leaveBtn.style.display = "none";
  }

  // Remove old event listeners by cloning
  const newJoinBtn = joinBtn.cloneNode(true);
  joinBtn.parentNode.replaceChild(newJoinBtn, joinBtn);
  const newLeaveBtn = leaveBtn.cloneNode(true);
  leaveBtn.parentNode.replaceChild(newLeaveBtn, leaveBtn);

  // Add new event listeners
  document.getElementById("roomJoinBtn").addEventListener("click", () => {
    handleJoinRoom(roomId);
  });

  document.getElementById("roomLeaveBtn").addEventListener("click", () => {
    handleLeaveRoom(roomId);
  });

  roomDetailsModal.classList.add("active");
}

// Handle Join Room
function handleJoinRoom(roomId) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentCoins = currentUser.coins || 0;
  const joinCost = 50;

  if (currentCoins < joinCost) {
    alert("You don't have enough coins! You need 50 coins to join a room.");
    return;
  }

  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  const roomIndex = rooms.findIndex((r) => r.id === roomId);

  if (roomIndex !== -1) {
    const room = rooms[roomIndex];

    // Check if user already in room
    if (room.players.some((p) => p.email === currentUser.email)) {
      alert("You are already in this room!");
      return;
    }

    // Deduct coins
    currentUser.coins = currentCoins - joinCost;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Update coins in users object
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex((u) => u.email === currentUser.email);
    if (userIndex !== -1) {
      users[userIndex].coins = currentUser.coins;
      localStorage.setItem("users", JSON.stringify(users));
    }

    // Add player to room
    room.players.push({
      name: currentUser.username,
      email: currentUser.email,
      age: currentUser.age || 25,
      level: currentUser.level || "beginner",
    });

    rooms[roomIndex] = room;
    localStorage.setItem("rooms", JSON.stringify(rooms));

    // Update coins display
    document.getElementById("coinsCount").innerHTML =
      `${currentUser.coins} <i class="fa-solid fa-coins"></i>`;

    // Refresh room display
    joinRoom(roomId);
    displayRooms();
  }
}

// Handle Leave Room
function handleLeaveRoom(roomId) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  const roomIndex = rooms.findIndex((r) => r.id === roomId);

  if (roomIndex !== -1) {
    const room = rooms[roomIndex];

    // Remove player from room
    room.players = room.players.filter((p) => p.email !== currentUser.email);
    rooms[roomIndex] = room;
    localStorage.setItem("rooms", JSON.stringify(rooms));

    // Refresh room display
    joinRoom(roomId);
    displayRooms();
  }
}
