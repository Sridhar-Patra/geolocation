const showBtn = document.getElementById("fetchInfoButton");
const postOfficeList = document.getElementById("pOList");




//function to fetch IP Address
function getIPAddress() {
  return fetch("https://api.ipify.org/?format=json")
    .then((response) => response.json())
    .then((data) => data.ip)
    .catch((error) => {
      console.error("Failed to fetch IP address:", error);
    });
}

// Function to fetch geo information based on the IP address
function fetchGeoInfo(ip) {
  const url = `https://ipapi.co/${ip}/json/`;

  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to retrieve geo information.");
      }
    })
    .catch((error) => {
      console.error("Failed to fetch geo information:", error);
    });
}

// Get the IP address on page load
document.addEventListener("DOMContentLoaded", async () => {
  const ipAddress = await getIPAddress();
});


// Button click event listener to fetch geo information
showBtn.addEventListener("click", async () => {
  showBtn.style.display = "none";
  const ipAddress = await getIPAddress();
  const geoInfo = await fetchGeoInfo(ipAddress);
  console.log(geoInfo)
  const latitude = geoInfo.latitude;
  const longitude = geoInfo.longitude;
  const timezone = geoInfo.timezone;
  const pincode = geoInfo.postal;
  const coords = [latitude, longitude];
  showMap(coords, geoInfo);
  showTime(timezone, pincode);
  getPostOffices(pincode);
});

//function to display map with geo location
function showMap(coord, data) {
  const mapContainer = document.getElementById("map");
  const map = `<iframe src="https://maps.google.com/maps?q=${coord[0]}, ${coord[1]}&z=15&output=embed" width="100%" height="100%"></iframe>`;
  const Details = document.getElementsByClassName("showDetails")[0];
  Details.style.display = "flex";
  Details.innerHTML += `
      <ul>
        <li>Lat: ${coord[0]}</li>
        <li>Long: ${coord[1]}</li>
      </ul>
      <ul>
        <li>City: ${data.city}</li>
        <li>Region: ${data.region}</li>
      </ul>
      <ul>
        <li>Organisation: ${data.org}</li>
        <li>Hostname: ${data.timezone}</li>
      </ul>
    
    `;
    mapContainer.innerHTML = map;
}

//function to display time
async function showTime(timezone, pincode) {
  var count = 0;
  await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
    .then((response) => response.json())
    .then((data) => {
      const postOffices = data[0].PostOffice;
      postOffices.forEach((value) => {
        count++;
      });
      const time = document.querySelector(".timezone");
      let currentTime = new Date().toLocaleString()
      console.log(currentTime)
      time.innerHTML += `
      <h3>Time Zone: ${timezone}</h3>
      <h3>Date And Time: ${currentTime}</h3>
      <h3>Pincode: ${pincode}</h3>
      <h3>Message: Number of pincode(s) found: ${count}</h3>
    `;
    });
}

//function to get the Pincodes
async function getPostOffices(pincode) {
  await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
    .then((response) => response.json())
    .then((data) => {
      const postOffices = data[0].PostOffice;
      postOffices.forEach((postOffice) => {
        postOfficeList.innerHTML += `
        <ul>
            <li>Name: ${postOffice.Name}</li>
            <li>Branch Type: ${postOffice.BranchType}</li>
            <li>Delivery Status: ${postOffice.DeliveryStatus}</li>
            <li>District: ${postOffice.District}</li>
            <li>Division: ${postOffice.Division}</li>
        </ul>
        `;
      });

      const searchpostOffice = document.getElementById("filterpin");
      searchpostOffice.innerHTML += `
            <input
            type="text"
            id="searchBox"
            placeholder="Search"
            oninput="searchPostOffices()"
            />
        `;
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

//function to filter post office
function searchPostOffices() {
  const search = document.getElementById("searchBox");

  const filter = search.value.toUpperCase();
  const listItems = postOfficeList.getElementsByTagName("ul");
  for (let i = 0; i < listItems.length; i++) {
    const listItem = listItems[i];
    const text = listItem.textContent || listItem.innerText;
    if (text.toUpperCase().indexOf(filter) > -1) {
      listItem.style.display = "";
    } else {
      listItem.style.display = "none";
    }
  }
}