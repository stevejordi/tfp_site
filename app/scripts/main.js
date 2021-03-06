'use strict';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON(response) {
  return response.json()
}

function showProfile(type){
  var text = document.querySelector("."+type);
  text.classList.remove("hidden");
}

function drawChart(data){

var margin = {top: 100, right: 100, bottom: 100, left: 100},
  width = Math.min(600, window.innerWidth - 10) - margin.left - margin.right,
  height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20),
  color = d3.scale.ordinal().range(["#e53935"]),
  radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 0.5,
    levels: 5,
    roundStrokes: true,
    color: color
  };

  RadarChart(".radarChart", data, radarChartOptions);

}

document.addEventListener('DOMContentLoaded', function() {

  var form = document.getElementById("screen_name_form"),
    input = document.querySelector(".screen_name"),
    logo = document.querySelector(".logo"),
    loader = document.querySelector(".load"),
    song = document.getElementById("song"),
    error_msg = document.querySelector(".error");

  form.addEventListener('submit', function(e){
    e.preventDefault();

    if (input.value){

      form.classList.add("hidden");
      logo.classList.add("hidden");
      loader.classList.remove("hidden");
      song.play();

      fetch("http://188.166.145.237/v1/user/"+input.value)
        .then(checkStatus)
        .then(parseJSON)
        .then(function(data){

          loader.classList.add("hidden");
          song.pause();
          logo.classList.remove("hidden");

          var values = [
					  [//User Parameters
						{axis:"Bot",value:data.bot/100},
						{axis:"Drama Queen",value:data.drama_queen/100},
						{axis:"Stalker",value:data.stalker/100},
						{axis:"Hater",value:data.hater/100},
						{axis:"Spammer",value:data.spammer/100}
					  ]
					];

          showProfile(data.final);
          drawChart(values);

        })
        .catch(function(error){
          console.log('request failed', error);
          loader.classList.add("hidden");
          song.pause();
          logo.classList.remove("hidden");
          error_msg.classList.remove("hidden");
        })

    }

  })

});
