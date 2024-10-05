const emptyInput = document.getElementById("error");
const searchBtn = document.getElementById("searchBtn");

document.getElementById("cityInput").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});

const searchButton = () => {
  const searchInput = document.getElementById("cityInput");
  const cityName = searchInput.value;
  emptyInput.textContent = "";
  if (cityName === "") {
    emptyInput.innerHTML = `
            <p class="text-start text-danger">Please enter a city name to search...</p>
        `;
  }
  searchInput.value = "";
  loadSearch(cityName);
};


function getLatitudeAndLongitude() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        loadLatLon(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}



const loadLatLon = async (latitude, longitude) => {
  const api = "22d1a0e1d4cd698a126a5527938a4f5b"
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
  displayWeather(data);
};
const loadSearch = async (city) => {
  const api = "22d1a0e1d4cd698a126a5527938a4f5b"
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
  displayWeather(data);
};

const displayWeather = (temparature) => {
  console.log(temparature);
  if (temparature.message === "city not found" ) {
    emptyInput.innerHTML = `
            <p class="text-start text-danger">Ops... city not found</p>
        `;
  }

  const container = document.getElementById("container");
  container.textContent = "";
  const localDate = convertUnixTimeToLocal(temparature.dt);
  const sunriseTime = convertUnixTimeToLocal(temparature.sys.sunrise);
  const sunsetTime = convertUnixTimeToLocal(temparature.sys.sunset);
  const div = document.createElement("div");
  div.innerHTML = `<div class="my-2">
                    <div class="display-4 fw-bolder">
                    ${temparature.name}, ${temparature.sys.country}
                    </div>
                    <div class="fs-6 fw-bolder mb-2">
                    ${localDate.fullDate}
                    </div>
                    <img src="http://openweathermap.org/img/wn/${temparature.weather[0].icon}@2x.png" alt="">
                    <div class="display-1 fw-bolder">
                    ${temparature.main.temp}°C
                    </div>
                    <p class="fw-bold mb-0 text-uppercase">${temparature.weather[0].main}</p>
                    <p class="fw-bold mb-0 text-uppercase">${temparature.weather[0].description}</p>
                    <p>Humidity ${temparature.main.humidity}%</p>
                    <div class="fs-6">
                    ${temparature.main.temp_min}/${temparature.main.temp_max} Feels Like: <span class="fw-bold">${temparature.main.feels_like}°C<span>
                    </div>
                    <div class="d-flex justify-content-around">
                    <p class="text-center fw-bold">Sunrise: ${sunriseTime.time12h}</p>
                    <p class="text-center fw-bold">Sunset: ${sunsetTime.time12h}</p>
                    </div>
                    <p class="text-center mb-0 fw-bold">Have a good day...&#128522</p>
                    </div>`
    container.appendChild(div);

};

const convertUnixTimeToLocal = (unixTime) => {
  const milliSeconds = unixTime * 1000;
  const humanDateFormat = new Date(milliSeconds)
  const convertedTimeObject = {
    fullDate: humanDateFormat.toLocaleString("en-US", {
      day: "numeric",
      month:"short",
      year: "numeric",
    }),
    time12h: humanDateFormat.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
  };
  return convertedTimeObject;
};


window.onload = function () {
  getLatitudeAndLongitude();
};


