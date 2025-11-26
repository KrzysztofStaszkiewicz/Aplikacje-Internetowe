const WeatherApp = class{
    constructor(apiKey, resultsBlockSelector){
        this.apiKey = apiKey;
        this.resultsBlock = document.querySelector(resultsBlockSelector);

        this.currentWeatherLink = `https://api.openweathermap.org/data/2.5/weather?q={query}&appid=${apiKey}&units=metric&lang=pl`;
        this.forecastLink = `https://api.openweathermap.org/data/2.5/forecast?q={query}&appid=${apiKey}&units=metric&lang=pl`;

        this.currentWeather = undefined;
        this.forecast = undefined
    }

    getCurrentWeather(query){
        let url = this.currentWeatherLink.replace("{query}", query);
        let req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.addEventListener("load", () => {
            this.currentWeather = JSON.parse(req.responseText);
            this.drawWeather();
        });
        req.send();
    }

    getForecast(query){
        let url = this.forecastLink.replace("{query}", query);
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((date) => {
                console.log(date);
                this.forecast = date.list;
                this.drawWeather();
            });
        ;
    }

    getWeather(query){
        this.getCurrentWeather(query);
        this.getForecast(query);
    }

    drawWeather() {
        document.querySelector("#currentWeather").innerHTML = "";
        document.querySelector("#forecastRow").innerHTML = "";
    
        if (this.currentWeather) {
            const date = new Date(this.currentWeather.dt * 1000);
    
            const block = this.createWeatherBlock(
                `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`,
                this.currentWeather.main.temp,
                this.currentWeather.main.feels_like,
                this.currentWeather.weather[0].icon,
                this.currentWeather.weather[0].description
            );
    
            document.querySelector("#currentWeather").appendChild(block);
        }
    
        if (this.forecast) {
            const daily = this.forecast
                .filter(item => item.dt_txt.includes("12:00:00"))
                .slice(0, 5);
    
            daily.forEach(weather => {
                const date = new Date(weather.dt * 1000);
    
                const block = this.createWeatherBlock(
                    `${date.toLocaleDateString("pl-PL")} 12:00`,
                    weather.main.temp,
                    weather.main.feels_like,
                    weather.weather[0].icon,
                    weather.weather[0].description
                );
    
                document.querySelector("#forecastRow").appendChild(block);
            });
        }
    }    

    createWeatherBlock(dateString, temp, feelsLikeTemp, iconName, desc){
        const weatherBlock = document.createElement("div");
        weatherBlock.className = "weatherBlock"

        const dateBlock = document.createElement("div");
        dateBlock.className = "weatherDate";
        dateBlock.innerHTML = dateString;
        weatherBlock.appendChild(dateBlock);

        const tempBlock = document.createElement("div");
        tempBlock.className = "weatherTemp";
        tempBlock.innerHTML = `${temp} &deg;C`;
        weatherBlock.appendChild(tempBlock);

        const tempfeelslikeBlock = document.createElement("div");
        tempfeelslikeBlock.className = "weatherTempFeelsLike";
        tempfeelslikeBlock.innerHTML = `Odczuwalna: ${feelsLikeTemp} &deg;C`;
        weatherBlock.appendChild(tempfeelslikeBlock);

        const iconImg = document.createElement("img");
        iconImg.className = "weatherIcon";
        iconImg.src = `https://openweathermap.org/img/wn/${iconName}@2x.png`
        weatherBlock.appendChild(iconImg);

        const descBlock = document.createElement("div");
        descBlock.className = "weatherDescription";
        descBlock.innerHTML = desc;
        weatherBlock.appendChild(descBlock);

        return weatherBlock;
    }
}



document.WeatherApp = new WeatherApp("ca13b5850e341e4d04b0ecf129729c31", "#weatherResults");

document.querySelector("#showButton").addEventListener("click", function(){
    const query = document.querySelector("#locationInput").value;
    document.WeatherApp.getWeather(query);
})