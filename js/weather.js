const OWM_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const OWM_API_KEY = ""; //use your api key from openweathermap.org
const GN_API_URL = "http://api.geonames.org/search";
const GN_API_USERNAME = ""; //use your api username from geonames.org

function distinct_cities(geonames) {
  const filtered_cities = [];

  for (let data of geonames) {
    let is_found = false;
    for (let city of filtered_cities) {
      if (city.countryCode == data.countryCode) {
        is_found = true;
        break;
      }
    }
    if (!is_found) {
      filtered_cities.push(data);
    }
  }

  return filtered_cities;
}

const app = new Vue({
  el: "#app",
  data: {
    query_city: "",
    query_city_results: [],
    search_started: false,
    search_status: "Search",
    weather_data: null,
    units: localStorage.getItem("units")
      ? localStorage.getItem("units")
      : "standard",
  },
  methods: {
    search_for_cities: function () {
      this.search_started = true;
      this.search_status = "Searching...";

      const gn_rd = {
        q: this.query_city,
        type: "json",
        style: "short",
        username: GN_API_USERNAME,
      };

      const gn_promise = axios.get(
        `${GN_API_URL}?q=${gn_rd.q}&type=${gn_rd.type}&style=${gn_rd.style}&username=${gn_rd.username}`
      );

      gn_promise.then((response) => {
        this.query_city_results = distinct_cities(response.data.geonames);
        this.search_started = false;

        this.search_status = "Search";
      });

      gn_promise.catch((error) => {
        console.log("Promise response:", error.message);
        this.search_started = false;

        this.search_status = "Search";
      });
    },
    display_weather_data: function (latitude, longitude) {
      const owm_promise = axios.get(
        `${OWM_API_URL}?lat=${latitude}&lon=${longitude}&units=${this.units}&appid=${OWM_API_KEY}`
      );

      owm_promise.then((response) => {
        this.weather_data = response.data;
      });
    },
    change_units: function () {
      localStorage.setItem("units", this.units);
      window.location.reload();
    },
    get_weather_icon(icon_name) {
      return "http://openweathermap.org/img/w/" + icon_name + ".png";
    },
  },
  computed: {
    unit_symbol: function () {
      switch (this.units) {
        case "standard":
          return "°K";
        case "metric":
          return "°C";
        case "imperial":
          return "°F";
        default:
          return "°K";
      }
    },
  },
});

/*
abbreviations 

owm_api = open weather map
gn_api = geo_names
gn_rd = geo_name_request_data 
*/
