document.getElementById('BUTSHOW').addEventListener('click', showJSON);
document.getElementById('BUT_ADD').addEventListener('click', showAddForm);
document.getElementById('REMOVE').addEventListener('click', showRemoveForm);
document.getElementById('CLEAR').addEventListener('click', clearJSON);
document.getElementById('RESTORE').addEventListener('click', restoreJSON);
document.getElementById('DOADD').addEventListener('click', addElement);
document.getElementById('VALIDREM').addEventListener('click', removeElement);
document.getElementById("LOC_PIEB").addEventListener("click", showLocalPieChart);
document.getElementById("BUTPIE").addEventListener("click", showPieChart);

function showLocalPieChart() {
    fetch("../../Items")
      .then((response) => response.json())
      .then((data) => {
        let svg = createPieChartSVG(data);
        document.getElementById("MAINSHOW").innerHTML = svg;
      });
  }

  function createPieChartSVG(data) {
    let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">';
  
    let totalValue = data.reduce((acc, curr) => acc + curr.value, 0);
    let startAngle = 0;
  
    for (let i = 0; i < data.length; i++) {
      let slice = data[i];
      let angle = (slice.value / totalValue) * 2 * Math.PI;
  
      let x1 = 250 + Math.cos(startAngle) * 200;
      let y1 = 250 + Math.sin(startAngle) * 200;
      let x2 = 250 + Math.cos(startAngle + angle) * 200;
      let y2 = 250 + Math.sin(startAngle + angle) * 200;
  
      let largeArcFlag = angle > Math.PI ? 1 : 0;
  
      svg += `
        <path
          d="M 250 250 L ${x1} ${y1} A 200 200 0 ${largeArcFlag} 1 ${x2} ${y2} Z"
          fill="${slice.color}"
        />
        <text
          x="${(x1 + x2) / 2}"
          y="${(y1 + y2) / 2}"
          dominant-baseline="middle"
          text-anchor="middle"
          fill="${getContrastingColor(slice.color)}"
        >
          ${slice.title}
        </text>
      `;
  
      startAngle += angle;
    }
  
    svg += "</svg>";
    return svg;
  }

  function getContrastingColor(hexColor) {
    let r = parseInt(hexColor.substr(0, 2), 16);
    let g = parseInt(hexColor.substr(2, 2), 16);
    let b = parseInt(hexColor.substr(4, 2), 16);
    let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? "#000000" : "#FFFFFF";
  }
  

function showPieChart() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "../../PChart", true);
    xhr.responseType = "blob";
  
    xhr.onload = function () {
      if (this.status === 200) {
        const url = URL.createObjectURL(this.response);
        const img = document.createElement("img");
        img.src = url;
        img.alt = "Pie Chart";
        document.getElementById("MAINSHOW").innerHTML = "";
        document.getElementById("MAINSHOW").appendChild(img);
      }
    };
  
    xhr.send();
  }
  

async function showJSON() {
  try {
    const response = await fetch('/WWW/storage.json');
    const data = await response.json();
    console.log(data);
    // Display data in the browser
    let table = '<table border="1"><tr><th>Title</th><th>Color</th><th>Value</th></tr>';
    for (let i = 0; i < data.length; i++) {
      table += `<tr><td>${data[i].title}</td><td>${data[i].color}</td><td>${data[i].value}</td></tr>`;
    }
    table += '</table>';
    document.getElementById('MAINSHOW').innerHTML = table;

  } catch (error) {
    console.error('Error fetching JSON data:', error);
  }
}


function showAddForm() {
  document.getElementById('addForm').style.display = 'block';
}

function showRemoveForm() {
  document.getElementById('removeForm').style.display = 'block';
}

function clearJSON() {
  fetch('../../clear', { method: 'POST' })
    .then(() => {
      document.getElementById('MAINSHOW').innerHTML = 'JSON cleared.';
    });
}

function restoreJSON() {
  fetch('../../restore', { method: 'POST' })
    .then(() => {
      document.getElementById('MAINSHOW').innerHTML = 'JSON restored.';
    });
}

function addElement() {
  const title = document.getElementById('titleTF').value;
  const color = document.getElementById('colorTF').value;
  const value = parseInt(document.getElementById('valueTF').value);

  fetch('../../add?title=' + title + '&color=' + color + '&value=' + value)
  .then(() => {
    console.log("added");
    document.getElementById('MAINSHOW').innerHTML = 'Element added.';
  });
}

function removeElement() {
  const index = parseInt(document.getElementById('indexTF').value);

  fetch('../../remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index }),
  })
  .then(() => {
    document.getElementById('MAINSHOW').innerHTML = 'Element removed.';
  });
}
