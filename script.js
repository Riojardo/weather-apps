document.addEventListener("DOMContentLoaded", function () {
  let button = document.querySelector(".button");
  let temp = document.querySelector(".temp");
  let API_key = "df6c563ee2770848e9bf0cf0363d6075";
  /*let API_key_webcam = "8lN2jktHUWt3GJNfYLBpLUAeZurjcctR"; ----> keywebcam for live server */
  let API_key_webcam =
    "ARWNnz02oSx8TXIjdC3HYZmViD8RYBly"; /* ----> keywebcam for github page */

  let saved_input = localStorage.getItem("last_input");
  let city_input = document.querySelector(".input_value");
  if (saved_input) {
    city_input.value = saved_input;
  }
  if (saved_input) {
    get_weather();
    get_futur();
  }

  let request = {
    method: "GET",
    headers: {
      "x-windy-api-key": API_key_webcam,
      "Content-Type": "application/json",
    },
  };

  function API_geo(city_value) {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${city_value}&limit=10&appid=${API_key}`;
  }
  function get_API(city_selected) {
    return `https://api.openweathermap.org/data/2.5/weather?q=${city_selected}&appid=${API_key}`;
  }
  function API_forecast(city_selected) {
    return `https://api.openweathermap.org/data/2.5/forecast?q=${city_selected}&appid=${API_key}`;
  }

  function error_webcam() {
    let error_stream = document.querySelector(".error");
    error_stream.innerHTML = `
      <p>The livestream of this city is unfortunately unavailable.<br />
      We are deeply sorry for the inconveniences :(  <br />
      Here ! A dancing dog as an apologie from the developers.</p>
      <div class="tenor-gif-embed" data-postid="20286048" data-share-method="host" data-aspect-ratio="0.890625" data-width="100%">
        <a href="https://media.tenor.com/dqH6ZBgOvMUAAAAi/dog-dance.gif"></a>
      </div>
    `;

    let live = document.querySelector("iframe");
    live.style.display = "none";
    let gif_script = document.createElement("script");
    gif_script.type = "text/javascript";
    gif_script.async = true;
    gif_script.src = "https://tenor.com/embed.js";
    document.body.appendChild(gif_script);
  }

  button.addEventListener("click", async () => {
    await get_weather();
    await get_futur();
  });

  function show_display() {
    let box = document.querySelector(".display");
    box.classList.toggle("shown");
  }

  let x_values = [" "];
  let y_values = [];

  async function data_list() {
    try {
      let data_list = document.querySelector("datalist");
      let city_input = document.querySelector(".input_value");
      let city_value = city_input.value.trim();
      let API = API_geo(city_value);
      let response = await fetch(API);
      if (!response.ok) {
        console.log(`ERRor -> ${response.status}`);
        return;
      }
      let data = await response.json();
      console.log(data);
      data_list.innerHTML = "";
      let displayed_input = data.filter((city) =>
        city.name.toLowerCase().startsWith(city_value.toLowerCase())
      );
      displayed_input.forEach((element) => {
        let option = document.createElement("option");
        option.textContent = element.name;
        data_list.appendChild(option);
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  document.querySelector(".input_value").addEventListener("input", data_list);

  async function get_weather() {
    try {
      let city_selected = document.querySelector(".input_value").value;
      let API = get_API(city_selected);
      let response = await fetch(API);
      show_display();
      if (!response.ok) {
        console.log(`ERROR -> ${response.status}`);
      }
      let data = await response.json();

      console.log("API data", data);
      let live = document.querySelector("iframe");
      live.style.display = "";
      live.src = " ";
      let error_stream = document.querySelector(".error");
      error_stream.innerHTML = " ";

      let celsius = parseFloat(data.main.temp) - 273.15;
      console.log(celsius);
      y_values.push(celsius);
      temp.innerHTML = celsius.toFixed(2) + " degrees C°";
      let desc = document.querySelector(".desc");
      desc.innerHTML = " ";
      let icone_Code = data.weather[0].icon;
      let icone_Url = `https://openweathermap.org/img/w/${icone_Code}.png`;
      let icone = document.createElement("img");
      icone.src = icone_Url;
      desc.appendChild(icone);

      function get_time() {
        let time_zone = data.timezone;
        let current_time = new Date();
        current_time.setSeconds(current_time.getSeconds() + time_zone);
        let time = document.querySelector("#time");
        time.innerHTML = "";
        let hour = current_time.toLocaleString().split(" ")[1];
        time.textContent = hour;
        console.log(
          "Current Time:",
          current_time.toLocaleString().split(" ")[1]
        );
      }

      setInterval(get_time, 1000);

      let webcam_ID = null;

      async function get_webcam_ID() {
        let API = `https://api.windy.com/webcams/api/v3/webcams?lang=en&limit=50&offset=0&countries=${data.sys.country},string`;
        try {
          let response = await fetch(API, request);
          if (!response.ok) {
            console.log(`HTTP error! Status: ${response.status}`);
          }
          let data = await response.json();
          console.log(data);
          for (let i = 0; i < data.webcams.length; i++) {
            if (data.webcams[i].title.includes(city_selected)) {
              webcam_ID = parseInt(data.webcams[i].webcamId);
              break;
            }
          }

          localStorage.setItem("last_input", city_selected);

          async function get_webcam() {
            let API = `https://api.windy.com/webcams/api/v3/webcams/${webcam_ID}?lang=en&include=player`;
            try {
              let response = await fetch(API, request);
              if (!response.ok) {
                console.log(
                  `HTTP error bla bla blas! Status: ${response.status}`
                );
                error_webcam();
              }
              let data = await response.json();
              console.log(data.player.live);
              let live = document.querySelector("iframe");
              live.src = data.player.live;
            } catch (error) {
              console.error("Error:", error.message);
            }
          }
          get_webcam();
        } catch (error) {
          console.error("Error:", error.message);
        }
      }
      get_webcam_ID();
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  async function get_futur() {
    try {
      let city_selected = document.querySelector(".input_value").value;
      localStorage.setItem("last_input", city_selected);
      let API_2 = API_forecast(city_selected);
      let response = await fetch(API_2);
      if (!response.ok) {
        console.log(`ERROR -> ${response.status}`);
      }
      let data = await response.json();
      console.log(data);
      let today_info = data.list[0].dt_txt.split(" ")[0];
      let today_date = document.querySelector(".day");
      today_date.textContent = "Today is the : " + today_info;

      let indices = [];
      for (let i = 7; i < data.list.length; i += 8) {
        indices.push(i);
      }
      let selected_Data = indices.map((index) => data.list[index]);

      selected_Data.forEach((element, index) => {
        let day = new Date(element.dt_txt);
        let weekday = day.getDay();
        let week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        let div_day = document.querySelector(`.day_${index}`);

        console.log(weekday);
        console.log(element.main.temp - 273.15);
        if (div_day) {
          div_day.innerHTML = `${week[weekday]}  <br />  ${(
            element.main.temp - 273.15
          ).toFixed(2)}°C`;
          y_values.push((element.main.temp - 273.15).toFixed(2));
          x_values.push(week[weekday]);
        }
      });

      new Chart("myChart", {
        type: "line",
        data: {
          labels: x_values,
          datasets: [
            {
              label: "Temperature",
              fill: false,
              lineTension: 0,
              backgroundColor: "rgba(0,0,255,1.0)",
              borderColor: "rgb(255,255,255)",
              data: y_values,
            },
          ],
        },
        options: {
          legend: { display: true },
          scales: {
            yAxes: [
              {
                ticks: { min: -16, max: 40 },
              },
            ],
          },
        },
      });
    } catch (error) {
      console.error("Error in get_futur:", error.message);
    }
  }
});
