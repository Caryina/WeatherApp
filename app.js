const form = document.querySelector("form");
const input = document.querySelector("input");
const msg = document.querySelector(".msg");
const list = document.querySelector(".cities");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let inputVal = input.value;

  //check if there's already a city
  const listItems = list.querySelectorAll(".city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter((el) => {
      let content = "";
      // City, Country
      if (inputVal.includes(",")) {
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    form.reset();
    list.innerHTML = "";
    return;
  }

  const URL_CURRENT_WEATHER = `https://api.openweathermap.org/data/2.5/weather?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q=${inputVal}`;

  fetch(URL_CURRENT_WEATHER)
    .then((response) => response.json())
    .then((data) => {
      const { main, name, sys, weather } = data;
      const URL_WEATHER_ICON_PREFIX = `http://openweathermap.org/img/w/${weather[0]["icon"]}.png`;

      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `<div class="todayForecastDiv">
      <div class="nameTemp"
      <h2 class="city-name" data-name="${name},${sys.country}">
        <span>${name}</span>
        <sup>${sys.country}</sup>
      </h2>
      <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div></div>
      <figure>
        <img class="city-icon" src="${URL_WEATHER_ICON_PREFIX}" alt="${
        weather[0]["description"]
      }">
        <figcaption>${weather[0]["description"]}</figcaption>
      </figure>
      <h5> Humidity : ${main.humidity} </h5>
      <h5> Pressure : ${main.pressure}</h5>
      <h5> Temp Min : ${Math.round(main.temp_min)}<sup>°C</sup></h5>
      <h5> Temp Max : ${Math.round(main.temp_max)}<sup>°C</sup></h5>
      </div>
    `;
      li.innerHTML = markup;
      list.appendChild(li);
    })
    .catch(() => {
      msg.textContent = "Please enter a valid city";
    });

  msg.textContent = "";
  form.reset();
});

// Weather Forecast for 6 days, every 3 hours

const forecastBtn = document.getElementById("forecastBtn");
const forecastDiv = document.getElementById("forecastDiv");

const URL_FORECAST_WEATHER =
  "https://api.openweathermap.org/data/2.5/forecast?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q=";

forecastBtn.addEventListener("click", showForecast);

function showForecast() {
  if (input.value === "") {
    msg.textContent = "Please enter a valid city";
  }
  //create final endpoint
  let finalEndPoint = URL_FORECAST_WEATHER + input.value;

  console.log(finalEndPoint);

  // fetch from endpoint
  fetch(finalEndPoint)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.city.name);
      console.log(data.list[0].dt_txt.split(" ")[0]);
      console.log(data.list[0].dt_txt.split(" ")[1]);
      console.log(data.list[0].main.temp);
      console.log(data.list[0].weather[0].description);

      var nrOfForecasts = 0;
      for (let i = 0; i < data.list.length; i++) {
        if (
          data.list[i].dt_txt.split(" ")[0] !==
          data.list[i + 1].dt_txt.split(" ")[0]
        ) {
          nrOfForecasts = i + 1;
          break;
        }
      }

      console.log(nrOfForecasts);
      forecastDiv.innerHTML = "";
      createforecastBoxDiv(data, forecastDiv, 0, nrOfForecasts - 1);
      createforecastBoxDiv(data, forecastDiv, nrOfForecasts, nrOfForecasts + 7);
      createforecastBoxDiv(
        data,
        forecastDiv,
        nrOfForecasts + 8,
        nrOfForecasts + 15
      );
      createforecastBoxDiv(
        data,
        forecastDiv,
        nrOfForecasts + 16,
        nrOfForecasts + 23
      );
      createforecastBoxDiv(
        data,
        forecastDiv,
        nrOfForecasts + 24,
        nrOfForecasts + 31
      );
      createforecastBoxDiv(
        data,
        forecastDiv,
        nrOfForecasts + 32,
        data.list.length - 1
      );
    });
}

// create div for forecast
function createforecastHoursOutput(name, day, hour, temp, description) {
  let output = `
   <div class="forecastHours">
     <h2 class="city-name" data-name="${name}">
         <span>${name}</span> 
     </h2>
      <h5 class="date"> ${day}</h5>
      <p class="hour"> ${hour}</p>
      <p class="temp"> ${Math.round(temp)}<sup>°C</sup></p>
      <p class="desc"> ${description}</p>
   </div>
   `;
  input.value = "";
  return output;
}

function createforecastBoxDiv(data, divElement, startIndex, endIndex) {
  let forecastBox = document.createElement("div");
  forecastBox.classList.add("forecastBox");
  for (let i = startIndex; i <= endIndex; i++) {
    forecastBox.innerHTML += createforecastHoursOutput(
      data.city.name,
      data.list[i].dt_txt.split(" ")[0],
      data.list[i].dt_txt.split(" ")[1],
      data.list[i].main.temp,
      data.list[i].weather[0].description
    );
  }
  divElement.appendChild(forecastBox);
}
