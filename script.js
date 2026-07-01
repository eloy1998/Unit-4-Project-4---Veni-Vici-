const imageEndpoint = "https://api.thecatapi.com/v1/images/search?limit=1&has_breeds=1&mime_types=jpg,png";
const breedListEndpoint = "https://api.thecatapi.com/v1/breeds";
const state = {
  current: null,
  history: [],
  bans: [],
};

const discoverButton = document.getElementById("discoverButton");
const anotherButton = document.getElementById("anotherButton");
const messageText = document.getElementById("message");
const cardPlaceholder = document.getElementById("cardPlaceholder");
const discoveryCard = document.getElementById("discoveryCard");
const resultImage = document.getElementById("resultImage");
const breedValue = document.getElementById("breedValue");
const originValue = document.getElementById("originValue");
const temperamentValue = document.getElementById("temperamentValue");
const lifeSpanValue = document.getElementById("lifeSpanValue");
const banList = document.getElementById("banList");
const historyList = document.getElementById("historyList");

async function fetchCat() {
  showMessage("Looking for a new cat…");
  showLoader(true);

  const maxAttempts = 10;
  let item = null;
  let attempt = 0;

  while (attempt < maxAttempts && !item) {
    attempt += 1;
    try {
      const cat = await fetchCatItem();

      if (!cat) {
        continue;
      }

      if (isBanned(cat)) {
        continue;
      }

      item = cat;
    } catch (error) {
      console.error(error);
      showMessage("Unable to fetch data. Check your connection and try again.");
      showLoader(false);
      return;
    }
  }

  if (!item) {
    showMessage(
      "All available results are currently blocked by the ban list. Remove a ban and try again."
    );
    showLoader(false);
    return;
  }

  updateHistory(state.current);
  state.current = item;
  renderCurrentItem();
  renderBanList();
  renderHistory();
  showMessage("Click any attribute to add it to the ban list.");
  showLoader(false);
}

function parseCatData(data) {
  if (!data || !data.breeds || data.breeds.length === 0) {
    return null;
  }

  const breed = data.breeds[0];
  return {
    imageUrl: data.url,
    breed: breed.name || "Unknown",
    origin: breed.origin || "Unknown",
    temperament: breed.temperament || "Unknown",
    lifeSpan: breed.life_span || "Unknown",
    id: data.id,
  };
}

async function fetchCatItem() {
  const response = await fetch(imageEndpoint);
  const data = await response.json();
  const cat = parseCatData(data[0]);

  if (cat) {
    return cat;
  }

  return await fetchCatFromRandomBreed();
}

async function fetchCatFromRandomBreed() {
  const breedResponse = await fetch(breedListEndpoint);
  const breeds = await breedResponse.json();

  if (!Array.isArray(breeds) || breeds.length === 0) {
    return null;
  }

  const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
  if (!randomBreed || !randomBreed.id) {
    return null;
  }

  const response = await fetch(
    `https://api.thecatapi.com/v1/images/search?limit=1&breed_id=${randomBreed.id}&mime_types=jpg,png`
  );
  const imageData = await response.json();
  if (!Array.isArray(imageData) || imageData.length === 0 || !imageData[0].url) {
    return null;
  }

  return buildCatFromBreed(randomBreed, imageData[0].url, imageData[0].id);
}

function buildCatFromBreed(breed, imageUrl, imageId) {
  return {
    imageUrl,
    breed: breed.name || "Unknown",
    origin: breed.origin || "Unknown",
    temperament: breed.temperament || "Unknown",
    lifeSpan: breed.life_span || "Unknown",
    id: imageId || breed.id,
  };
}

function isBanned(item) {
  return state.bans.some((ban) => {
    if (ban.attribute === "temperament") {
      const normalizedTemperaments = item.temperament
        .split(",")
        .map((token) => token.trim());
      return (
        normalizedTemperaments.includes(ban.value) ||
        item.temperament === ban.value
      );
    }
    return item[ban.attribute] === ban.value;
  });
}

function updateHistory(previousItem) {
  if (!previousItem) {
    return;
  }
  state.history.unshift(previousItem);
  if (state.history.length > 6) {
    state.history.pop();
  }
}

function renderCurrentItem() {
  if (!state.current) {
    discoveryCard.classList.add("hidden");
    anotherButton.classList.add("hidden");
    return;
  }

  cardPlaceholder.classList.add("hidden");
  discoveryCard.classList.remove("hidden");
  anotherButton.classList.remove("hidden");

  resultImage.src = state.current.imageUrl;
  resultImage.alt = `Image of ${state.current.breed}`;
  breedValue.textContent = state.current.breed;
  originValue.textContent = state.current.origin;
  temperamentValue.textContent = state.current.temperament;
  lifeSpanValue.textContent = `${state.current.lifeSpan} years`;
}

function renderBanList() {
  if (state.bans.length === 0) {
    banList.innerHTML = "<li>No banned attributes yet.</li>";
    return;
  }

  banList.innerHTML = state.bans
    .map(
      (ban) =>
        `<li class="ban-pill" data-attr="${ban.attribute}" data-value="${ban.value}"><span>${ban.attribute}: ${ban.value}</span><strong>✕</strong></li>`
    )
    .join("");
}

function renderHistory() {
  if (state.history.length === 0) {
    historyList.innerHTML = "<p class='panel-copy'>No history yet. Every discovery will appear here.</p>";
    return;
  }

  historyList.innerHTML = state.history
    .map(
      (item) => `
      <article class="history-card">
        <img src="${item.imageUrl}" alt="Previously discovered ${item.breed}" />
        <div class="history-meta">
          <div><b>Breed</b><span>${item.breed}</span></div>
          <div><b>Origin</b><span>${item.origin}</span></div>
          <div><b>Temperament</b><span>${item.temperament}</span></div>
        </div>
      </article>`
    )
    .join("");
}

function showMessage(text) {
  messageText.textContent = text;
}

function showLoader(isLoading) {
  discoverButton.disabled = isLoading;
  anotherButton.disabled = isLoading;
  if (isLoading) {
    discoverButton.textContent = "Finding cats…";
    anotherButton.textContent = "Loading…";
  } else {
    discoverButton.textContent = "Discover a Cat";
    anotherButton.textContent = "Show another cat";
  }
}

function addBan(attribute, value) {
  const exists = state.bans.some(
    (ban) => ban.attribute === attribute && ban.value === value
  );

  if (exists) {
    return;
  }

  state.bans.push({ attribute, value });
  renderBanList();
}

function removeBan(attribute, value) {
  state.bans = state.bans.filter(
    (ban) => !(ban.attribute === attribute && ban.value === value)
  );
  renderBanList();
}

function setupEventListeners() {
  discoverButton.addEventListener("click", fetchCat);
  anotherButton.addEventListener("click", fetchCat);

  discoveryCard.addEventListener("click", (event) => {
    const target = event.target;
    if (!target.classList.contains("clickable")) {
      return;
    }

    const attribute = target.dataset.attr;
    const value = target.textContent.trim();
    if (!attribute || !value) {
      return;
    }

    addBan(attribute, value);
    showMessage(`Added ${attribute}: ${value} to the ban list.`);
  });

  banList.addEventListener("click", (event) => {
    const target = event.target.closest("li.ban-pill");
    if (!target) {
      return;
    }

    const attribute = target.dataset.attr;
    const value = target.dataset.value;
    if (!attribute || !value) {
      return;
    }

    removeBan(attribute, value);
    showMessage(`Removed ${attribute}: ${value} from the ban list.`);
  });
}

function initialize() {
  setupEventListeners();
  renderBanList();
  renderHistory();
}

initialize();
