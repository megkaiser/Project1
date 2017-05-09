//Open Weather Map API Key

var WeatherAPIKey = "52868524724c9712b16e9c2c6e0587e5";
var GeolocationAPIKey = "AIzaSyA5W3-HXFqPGO2zu2ZqS54zEl6YOkwQFtM";

//Function to run Google Geolocation API
function getGeoLocationGoogle() {
	var googleQueryURL = "https://www.googleapis.com/geolocation/v1/geolocate?key=" + GeolocationAPIKey;
    return new Promise(function(resolve, reject) {
        $.ajax({
        	method: "POST",
            url: googleQueryURL,
        }).done(function(response) {
            resolve(response);
        }).fail(function(err) {
            reject(err);
        })
    })
}


//Function to run Weather API with Geolocation
function getWeatherWithGeo() {
    getGeoLocationGoogle()
        .then(function(response) {
            var lat = response.location.lat;
            var lon = response.location.lng;

            var weatherLLQueryURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + WeatherAPIKey;
            $.ajax({
                url: weatherLLQueryURL,
                method: "GET"
            }).done(function(response) {
                $(".city").html("<h1>" + response.name + " Weather Details</h1>");
                $(".wind").html("Wind Speed: " + response.wind.speed);
                $(".humidity").html("Humidity: " + response.main.humidity);
                var f_temp = 9/5*(response.main.temp-273)+32;
                $(".temp").html("Temperature (F) " + Math.floor(f_temp));
								return response.weather[0].id;
            });
        })
        .catch(function(err) {
            //Failed! Move to user input function
        })
	}

//Function to run Weather API with User Input
function getWeatherWithUserInput() {
	return new Promise(function(resolve, reject) {
	
	var cityName = $("#city-name").val().trim();
	var stateName = $("#state-name").val().trim();
	var weatherCSQueryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "," + stateName + ",US=&appid=" + WeatherAPIKey;


	$.ajax({
		url: weatherCSQueryURL,
		method: "GET"
	}).done(function(response) {
			$(".city").html("<h1>" + response.name + " Weather Details</h1>");
			$(".wind").html("Wind Speed: " + response.wind.speed);
			$(".humidity").html("Humidity: " + response.main.humidity);
			var f_temp = 9/5*(response.main.temp-273)+32;
			$(".temp").html("Temperature (F) " + Math.floor(f_temp));
			// var icon = "<img src='http://openweathermaps.org/img/w/"+response.weather[0].icon+".png'>";
			// $(".code").html(icon);
			console.log(response.weather[0].id);
			resolve(response.weather[0].id);
	});

});
};

$("#input-location").on("click", function(event) {
	event.preventDefault();
  getWeatherWithUserInput()
	.then(function(response) {
		console.log(response);
		showWidget(response);
	})

});

//Make button pop-up when screen opens
$(window).on("load", function(){
  $("#myModal").modal("show");
});

//If Yes, then close modal, remove modal button, and run the Geolocation Function
$("#yes-geo").click(function() {
  $("#myModal").modal("toggle");
  //Do your request
  var weatherID = getWeatherWithGeo();
	console.log(weatherID);
	showWidget(weatherID);
  //Remove modal button
  // $("myModal")modal("hide");
})

//If No, then close modal, remove modal button, and show user input function
$("#no-geo").click(function() {
  $("#myModal").modal("toggle");
})






// music API //

function getOauth() {
	location.href ="https://www.mixcloud.com/oauth/authorize?client_id=yf52JKSHVGHYVksWSM&redirect_uri=http://localhost:3000";
}

function getAccessToken() {
	location.href='https://www.mixcloud.com/oauth/access_token?client_id=yf52JKSHVGHYVksWSM&redirect_uri=http://localhost:3000&client_secret=KUduqYkAPWqCykfcmQsZYTfk3pR4q89x&code=e8ZrjZXXag'
}

function showWidget(weather) {
	var access_token = 'E3MjPt6NJSQZ22S3pSTwgEvY7wBWeA5M';

	$.ajax({
		url: 'https://api.mixcloud.com/popular/?access_token=' + access_token,
		method: 'GET',
		dataType: 'json'
	}).done(function(response) {

		var weatherTags = weatherToTag(weather);
		var iframe_src = findMusicTag(response, weatherTags);
		$('iframe').attr('src', 'https://www.mixcloud.com/widget/iframe/?feed=' + iframe_src + '&hide_cover=1&mini=1&light=1&autoplay=1');

	});

};

function weatherToTag(weatherID) {
		if (weatherID >= 200 && weatherID <= 599) {
			return ['/discover/downtempo/', '/discover/chillout/', '/discover/ambient/'];
		} else if (weatherID >= 600 && weatherID <= 622) {
			return ['/discover/jazz/', '/discover/minimal/'];
		} else {
			return ['/discvoer/soul/', '/discover/afrobeat/', '/discover/reggae/'];
		}
};

function findMusicTag(response, tagsToFind) {
	var data = response.data;
	for (i=0; i<data.length; i++) {
		for (j=0; j<data[i].tags.length; j++) {
			for (k=0; k<tagsToFind.length; k++) {
				if (data[i].tags[j].key == tagsToFind[k]) {
					return data[i].url;
				}
			}
		}
	}
};
