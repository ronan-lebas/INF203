var counter = 0;
var slides;
var paused = false;

function load() {
  var xmlhttp, text;
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', 'slides.json');
  xmlhttp.onload = function(){
      text = this.responseText;
      slides = JSON.parse(text);
  };
  xmlhttp.send();
}

function play() {
  var div = document.getElementById("MAIN");
  div.innerHTML = "";
  var frame = document.createElement("iframe");
  frame.src = slides.slides[counter].url;
  div.appendChild(frame);
  counter++;

  if (counter < 6 && paused == false) {
    setTimeout(play, 2000);
  }
}

load();


function pause() {
  if (paused) {
    paused = false;
    play();
  } else {
    paused = true;
    counter--;
  }
}
function next() {
  paused = true;
  if (counter > 5) return;
  div = document.getElementById("MAIN");
  div.innerHTML = "";
  var frame = document.createElement("iframe");
  frame.src = slides.slides[counter].url;
  div.appendChild(frame);
  counter++;
}

function previous() {
  paused = true;
  if (counter < 2) return;
  counter -= 2;
  div = document.getElementById("MAIN");
  div.innerHTML = "";
  var frame = document.createElement("iframe");
  frame.src = slides.slides[counter].url;
  div.appendChild(frame);
}