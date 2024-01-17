/*

function create_button() {
  let ul_list = document.createElement("ul");
document.body.appendChild(ul_list)

  let button = document.createElement("button");
  button.textContent = "PRESS ME !!!!!i!!!!   UWU ";
  button.addEventListener("click", fetch_data);
  document.body.appendChild(button);
}


function fetch_data() {
  fetch('Arrays.JSON')
    .then(response => response.json())
    .then(json => {
      json.forEach(element => {
        let new_list = document.createElement("li");
        new_list.textContent = element;
        document.querySelector("ul").appendChild(new_list);
      });
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

create_button();  

let api_url = 'https://dummyjson.com/products';

function create_button() {
  let input = document.createElement("input");
  document.body.appendChild(input);

  let button = document.createElement("button");
  button.textContent = "PRESS ME !!!!!i!!!!   UWU ";
  button.addEventListener("click", fetch_data);
  document.body.appendChild(button);

}

create_button();

let input = document.querySelector("input");
let image = document.querySelector("img");

function fetch_data() {
  fetch(api_url)
    .then(response => response.json())
    .then(data => {
      for (let i = 0; i < data.products.length; i++) {
        let product = data.products[i];
        if (Number(input.value) === product.id) {
          let photo = product.images[0]; 
          image.setAttribute("src", photo)
          console.log(data)
          return; 
        }
      }
      console.error('Product not found');
      console.log('Input value:', input.value);
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}
*/
document.addEventListener("DOMContentLoaded", function () {
  let button = document.querySelector(".button");
  let temp = document.querySelector(".temp");
  let API_key = "df6c563ee2770848e9bf0cf0363d6075";
  

  function API_geo(city_value){
  return `http://api.openweathermap.org/geo/1.0/direct?q=${city_value}&limit=10&appid=${API_key}`;
  }
  function get_API(city_selected) {
    return `https://api.openweathermap.org/data/2.5/weather?q=${city_selected}&appid=${API_key}`;
  }

  function API_forecast(city_selected) {
    return `https://api.openweathermap.org/data/2.5/forecast?q=${city_selected}&appid=${API_key}`;
  }
  
  button.addEventListener("click", async () => {
    await get_weather();
    await get_futur();
  });
  
  function show_display(){
    let box = document.querySelector(".display");
    box.classList.toggle("shown");
  }

  async function data_list(){
    try {
      let data_list =document.querySelector("datalist");
      let city_input = document.querySelector(".input_value");
      let city_value =city_input.value
      let API = API_geo(city_value);
      let response = await fetch(API);
      if (!response.ok){
        console.log(`ERRor -> ${resonse.status}`)
      }
      let data = await response.json();
      console.log(data);
      data_list.innerHTML = "";
      let displayed_input = data.filter(city => city.name.toLowerCase().startsWith(city_value.toLowerCase()));
      displayed_input.forEach((element) => {
      let option = document.createElement("option");
      option.textContent= element.name
      data_list.appendChild(option)
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
      let celsius = parseFloat(data.main.temp) - 273.15;
      console.log(celsius);
      temp.innerHTML = celsius.toFixed(2) + " degrees C°";
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  async function get_futur() {
    try {
      let city_selected = document.querySelector(".input_value").value;
      let API_2 = API_forecast(city_selected);
      let response = await fetch(API_2);
      if (!response.ok) {
        console.log(`ERROR -> ${response.status}`);
      }
      let data = await response.json();
      console.log(data);

      let indices = [];
      for (let i = 7; i < data.list.length; i += 8) {
        indices.push(i);
      }
      let selected_Data = indices.map(index => data.list[index]); 

      selected_Data.forEach((element, index) => {
        console.log(element.dt_txt);
      
        let day = new Date(element.dt_txt);
        let weekday = day.getDay()-1;
        let week=[];
        week[0]="Mon";
        week[1]="Tue";
        week[2]="Wed";
        week[3]="Thu";
        week[4]="Fri";
        week[5]="Sat";
        week[6]="Sun";
    
        let div_day = document.querySelector(`.day_${index}`);
        
        console.log(weekday);
        console.log(element.main.temp - 273.15);
        if (div_day) {
          div_day.innerHTML = `${week[weekday]}  <br />  ${(element.main.temp - 273.15).toFixed(2)}°C`     
        }
      });
    } catch (error) {
      console.error("Error in get_futur:", error.message);
    }
  }
});

  

