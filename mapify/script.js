const savedPlaces = JSON.parse(localStorage.getItem("savedPlaces") || "[]");
renderlist(savedPlaces)

let lastMarker = null;
function renderlist(list) {
  document.querySelector(".list").innerHTML = "";
  list.forEach((place, index) => {
    let color = place.favorite ? "#ff0000" : "#808080";

    list_item = document.createElement("div")
    list_item.classList.add("list-item")
    list_item.innerHTML = `
<p>${place.name}</p>
<i class="fa-solid fa-heart" style="color: ${color};" data-action="fav" data-index="${index}"></i>
<i class="fa-solid fa-trash" style="color: #e74c3c;" data-action="delete" data-index="${index}"></i>
<i class="fa-solid fa-location-arrow" style="color: #3498db;" data-action="show" data-index="${index}"></i>
  <i class="fa-solid fa-route" style="color: #6b9080;" data-action="dir"data-index="${index}"></i>

`
    list_item.dataset.name = place.name
    list_item.dataset.lat = place.lat;
    list_item.dataset.lng = place.lng;
    document.querySelector(".list").appendChild(list_item)
  })
  document.querySelectorAll(".list-item i").forEach(icon => {
    icon.addEventListener("click", handleIconClick);
  });
}
let activeTag = "save"; // default is "Saved"
document.querySelectorAll('.tag-item').forEach(tag => {
  tag.addEventListener('click', function () {
    document.querySelectorAll('.tag-item').forEach(t => t.classList.remove('active'));
    this.classList.add('active');

    activeTag = this.dataset.type; // "save", "area", or "favorite"
    filterList();
  });
});
function filterList() {
  let savedPlaces = JSON.parse(localStorage.getItem("savedPlaces") || "[]");

  if (activeTag === "favorite") {
    savedPlaces = savedPlaces.filter(p => p.favorite);
  }

  renderlist(savedPlaces);
}
function handleIconClick(e) {
  const index = +e.target.dataset.index;
  const action = e.target.dataset.action;
  let savedPlaces = JSON.parse(localStorage.getItem("savedPlaces") || "[]");
  const place = savedPlaces[index];


  if (action === "show") {
    if (currentRoute) {
      map.removeControl(currentRoute);
    }
    if (lastMarker) map.removeLayer(lastMarker);
    lastMarker = L.marker([parseFloat(place.lat), parseFloat(place.lng)])
      .addTo(map)
      .bindPopup(`<b>${place.name}</b>`)
    map.setView([parseFloat(place.lat), parseFloat(place.lng)], 14);
  }


  if (action === "delete") {
    savedPlaces.splice(index, 1);
    localStorage.setItem("savedPlaces", JSON.stringify(savedPlaces));
    renderlist(savedPlaces);
  }


  if (action === "fav") {
    savedPlaces[index].favorite = !savedPlaces[index].favorite;
    localStorage.setItem("savedPlaces", JSON.stringify(savedPlaces));
    renderlist(savedPlaces);
  }
  if (action === "dir") {
    const place = savedPlaces[index];
    showRouteTo(place.lat, place.lng);
    if (lastMarker) map.removeLayer(lastMarker);
    lastMarker = L.marker([parseFloat(place.lat), parseFloat(place.lng)])
      .addTo(map)
      .bindPopup(`<b>${place.name}</b>`)
    map.setView([parseFloat(place.lat), parseFloat(place.lng)], 14);
  }

}
const defaultCoords = [35.6892, 51.3890];
const defaultZoom = 12;

// Initialize map with placeholder view
const map = L.map('map').setView(defaultCoords, defaultZoom);

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Try to get user's location
let userLat = null;
let userLng = null;
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      userLat = position.coords.latitude;
      userLng = position.coords.longitude;

      // Update map to user's location
      map.setView([userLat, userLng], 13);

      // Marker at user's location
      const userLocationIcon = L.divIcon({
        className: '', // leave empty to avoid default styling
        html: '<div class="user-location-icon"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
      });

      lastLatLng = { lat: userLat, lng: userLng };

      L.marker([userLat, userLng], { icon: userLocationIcon })
        .addTo(map)
        .bindPopup(`
    <div class="popup-btn-container">
      <button class="popup-btn" onclick="openDialog()">
        <i class="fa-solid fa-bookmark"></i> Save place
      </button>
      <button class="popup-btn" onclick="alert('Start defining area')">
        <i class="fas fa-draw-polygon"></i> Make an Area
      </button>
    </div>
  `);


    },
    function (error) {
      // User denied or error occurred
      showFallback();
    }
  );
} else {
  // Geolocation not supported
  showFallback();
}

// Fallback: show Tehran
function showFallback() {
  lastLatLng = { lat: defaultCoords[0], lng: defaultCoords[1] };

  L.marker(defaultCoords)
    .addTo(map)
    .bindPopup(`
      <div class="popup-btn-container">
        <button class="popup-btn" onclick="openDialog()">
          <i class="fa-solid fa-bookmark"></i> Save place
        </button>
        <button class="popup-btn" onclick="alert('Getting directions...')">
          <i class="fas fa-route"></i> Get Direction
        </button>
        <button class="popup-btn" onclick="alert('Start defining area')">
          <i class="fas fa-draw-polygon"></i> Make an Area
        </button>
      </div>
    `)
    .openPopup();
}


//Add marker on click and remove the previous one
map.on('click', function (e) {
  const lat = e.latlng.lat.toFixed(6);
  const lng = e.latlng.lng.toFixed(6);

  if (lastMarker) {
    map.removeLayer(lastMarker);
  }

  lastLatLng = { lat, lng };

  lastMarker = L.marker([lat, lng]).addTo(map);

  lastMarker.bindPopup(`
    <div class="popup-btn-container">
      <button class="popup-btn" onclick="openDialog()">
        <i class="fa-solid fa-bookmark"></i> Save place
      </button>
      <button class="popup-btn" onclick=getDir(${lat},${lng})>
        <i class="fas fa-route"></i> Get Direction
      </button>
      <button class="popup-btn" onclick="alert('Start defining area')">
        <i class="fas fa-draw-polygon"></i> Make an Area
      </button>
    </div>
  `)
});


function openDialog() {
  document.getElementById("savePlaceDialog").classList.remove("hidden");
  document.getElementById("placeNameInput").value = '';
  document.getElementById("favoriteCheckbox").checked = false;
}

function closeDialog() {
  document.getElementById("savePlaceDialog").classList.add("hidden");
}

function savePlace() {
  const name = document.getElementById("placeNameInput").value.trim();
  const isFavorite = document.getElementById("favoriteCheckbox").checked;

  if (!name) {
    alert("Please enter a name for the place.");
    return;
  }

  const savedPlaces = JSON.parse(localStorage.getItem("savedPlaces") || "[]");

  savedPlaces.push({
    name: name,
    lat: lastLatLng.lat,
    lng: lastLatLng.lng,
    favorite: isFavorite
  });

  localStorage.setItem("savedPlaces", JSON.stringify(savedPlaces));
  renderlist(savedPlaces);

  closeDialog();
}
document.querySelectorAll('.tag-item').forEach(tag => {
  tag.addEventListener('click', function () {
    document.querySelectorAll('.tag-item').forEach(t => t.classList.remove('active'));
    this.classList.add('active');

    const selected = this.dataset.type;
    console.log("Selected:", selected); // "save", "area", or "favorite"
  });
});

let currentRoute = null; // store current route so we can remove it later

function showRouteTo(lat, lng) {
  if (currentRoute) {
    map.removeControl(currentRoute);
  }

  currentRoute = L.Routing.control({
    waypoints: [
      L.latLng(userLat, userLng), // your current location
      L.latLng(lat, lng) // destination
    ],
    routeWhileDragging: false,
    show: false,
    addWaypoints: false,
    draggableWaypoints: false,
    createMarker: () => null // don't show extra markers
  }).addTo(map);
}
function getDir(lat,lng){
    showRouteTo(lat,lng);
    if (lastMarker) map.removeLayer(lastMarker);
    lastMarker = L.marker([parseFloat(lat), parseFloat(lng)])
      .addTo(map)
    map.setView([parseFloat(lat), parseFloat(lng)], 14);
}