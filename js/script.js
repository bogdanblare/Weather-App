const form = document.querySelector("form");
const submitBtn = document.querySelector(".submit-btn");
const error = document.querySelector(".error-msg");
form.addEventListener("submit", handleSubmit);
submitBtn.addEventListener("click", handleSubmit);

function handleSubmit(e) {
	e.preventDefault();
	fetchWeather();
}

async function getWeatherData(location) {
	const response = await fetch(
		`http://api.weatherapi.com/v1/forecast.json?key=a7ccca0b720443df853122703230205&q=${location}`,
		{
			mode: "cors",
		}
	);
	if (response.status === 400) {
		throwErrorMsg();
	} else {
		error.style.display = "none";
		const weatherData = await response.json();
		const newData = processData(weatherData);
		displayData(newData);
		reset();
	}
}

function throwErrorMsg() {
	error.style.display = "block";
	if (error.classList.contains("fade-in")) {
		error.style.display = "none";
		error.classList.remove("fade-in2");
		error.offsetWidth;
		error.classList.add("fade-in");
		error.style.display = "block";
	} else {
		error.classList.add("fade-in");
	}
}

function processData(weatherData) {
	// grab all the data i want to display on the page
	const myData = {
		condition: weatherData.current.condition.text,
		feelsLike: {
			c: Math.round(weatherData.current.feelslike_c),
		},
		currentTemp: {
			c: Math.round(weatherData.current.temp_c),
		},
		wind: Math.round(weatherData.current.wind_kph),
		humidity: weatherData.current.humidity,
		location: weatherData.location.name.toUpperCase(),
	};

	// if in the US, add state
	// if not, add country
	if (weatherData.location.country === "United States of America") {
		myData["region"] = weatherData.location.region.toUpperCase();
	} else {
		myData["region"] = weatherData.location.country.toUpperCase();
	}

	return myData;
}

function displayData(newData) {
	const weatherInfo = document.getElementsByClassName("info");
	Array.from(weatherInfo).forEach((div) => {
		if (div.classList.contains("fade-in1")) {
			div.classList.remove("fade-in1");
			div.offsetWidth;
			div.classList.add("fade-in1");
		} else {
			div.classList.add("fade-in1");
		}
	});
	document.querySelector(".condition").textContent = newData.condition;
	document.querySelector(
		".location"
	).textContent = `${newData.location}, ${newData.region}`;
	document.querySelector(".degrees").textContent = newData.currentTemp.c;
	document.querySelector(
		".feels-like"
	).textContent = `FEELS LIKE: ${newData.feelsLike.c}`;
	document.querySelector(".wind_kph").textContent = `WIND: ${newData.wind} KPH`;
	document.querySelector(
		".humidity"
	).textContent = `HUMIDITY: ${newData.humidity}`;
}

function reset() {
	form.reset();
}

// get location from user
function fetchWeather() {
	const input = document.querySelector('input[type="text"]');
	const userLocation = input.value;
	getWeatherData(userLocation);
}
