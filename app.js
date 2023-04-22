// Main  entry points

// require all necessary modeules
const express = require("express");
const https = require("https");
const app = express();

const bodyParser = require("body-parser");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//for Embedded js
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
// receiving data from user input and taking data from API
app.post("/", (req, res) => {
  const query = req.body.cityName;
  const appId = "your API key";
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    appId +
    "&units=" +
    unit;
  https.get(url, (response) => {
    if (response.statusCode === 200) {
      response.on("data", (data) => {
        const w_data = JSON.parse(data);

        const name = w_data.name;
        const countryN = w_data.sys.country;
        const temp = Math.round(w_data.main.temp);
        const windS = w_data.wind.speed;
        const weather_desc = w_data.weather[0].description;
        const icon = w_data.weather[0].icon;
        const humidity = w_data.main.humidity;
        const img_url = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        // sending data to template
        res.render("weatherM", {
          weather_descM: weather_desc,
          img_urlM: img_url,
          tempM: temp,
          humidityM: humidity,
          nameM: name,
          windSM: windS,
          countryNM: countryN,
        });
      });
    } else {
      res.render("failure");
    }
  });
});
app.post("/failure",(req,res)=>{
  res.redirect("/");
});
// listening from 2727 port
app.listen(2727, () => {
  console.log("listening port: 2727");
});
