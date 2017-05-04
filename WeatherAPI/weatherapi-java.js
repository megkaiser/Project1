//Open Weather Map API Key
var APIKey = "52868524724c9712b16e9c2c6e0587e5";


function runQuery(queryURL) {
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function()) {

  }
}

$("#find-location").on("click", function(event) {
var cityName = $("#city-name").val().trim();
var stateName = $("#state-name").val().trim();

var queryURLBase = "api.openweathermap.org/data/2.5/weather?q=" + cityName + ", " + "stateName" + ", US=" + APIKey;
runQuery(queryURLBase);   

});

