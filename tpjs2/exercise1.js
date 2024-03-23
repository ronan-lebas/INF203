// Question 1a
function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("tarea").value = this.responseText;
      }
    };
    xhttp.open("GET", "text.txt", true);
    xhttp.send();
  }
  
  // Question 1b
  function loadDoc2() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var lines = this.responseText.split('\n');
        var div = document.getElementById("tarea2");
        div.innerHTML = ''; // Clear previous content
        lines.forEach(function(line, index) {
          var p = document.createElement("p");
          p.textContent = line;
          p.style.color = getRandomColor();
          div.appendChild(p);
        });
      }
    };
    xhttp.open("GET", "text.txt", true);
    xhttp.send();
  }
  
  // Utility function to generate random colors
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  