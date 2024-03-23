var counter = 0
var slides;

function load() {
  var xmlhttp, text;
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', 'slides.json')
  xmlhttp.onload = function(){
      text = this.responseText;
      slides = JSON.parse(text);
  }
  xmlhttp.send();
  
}

function play() {
  
  div = document.getElementById("MAIN");
  div.innerHTML = "";
  let frame = document.createElement("iframe");
  frame.src = slides.slides[counter].url;
  div.appendChild(frame);
  counter+=1
  if(counter<6){
    setTimeout(play, 2000);
  }
}

load();