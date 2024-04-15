import { createServer } from "http";
import { existsSync, readFileSync, write, writeFileSync } from "fs";
import { extname, join, dirname } from "path";
import { fileURLToPath } from 'url';
import { parse, unescape } from "querystring";

let storage = [];

function cleanInput(input) {
    return input.replace(/</g, "_").replace(/>/g, "_");
}

// processing requests
function webserver(request, response) {
    const { url } = request;
    const parsedUrl = new URL(url, `http://${request.headers.host}`);
    const { pathname, searchParams } = parsedUrl;

    if (pathname === "/exit") {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>The server will stop now.</body></html>");
        process.exit(0);
    }
    else if (url === "/") {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        //response.end(readFileSync("tpwebapp/client/test2.html"));
        response.end("<!doctype html><html><body>Server works.</body></html>");
    }
    else if (pathname === "/Items") {
      const storage = readStorage();  
      response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify(storage));
    }
    else if (pathname.startsWith("/WWW")){ // && existsSync(join(dirname(fileURLToPath(import.meta.url)), pathname))) {
        let filePath = join(dirname(fileURLToPath(import.meta.url)), pathname.slice(4));
        console.log(filePath);
        let contentType = getContentType(filePath);
        response.setHeader("Content-Type", contentType);
        let fileContent = readFileSync(filePath);
        response.end(fileContent);
    }

    else if (pathname === '/clear') {
        storage = [{"title": "empty", "color": "red", "value": 1}];
        writeStorage(storage);
        response.end('JSON cleared.');
      }
    
      else if (pathname === '/restore') {
        storage = [
          {"title": "foo", "color": "red", "value": 20},
          {"title": "bar", "color": "ivory", "value": 100},
          {"title": "baz", "color": "green", "value": 30}
        ];
        writeStorage(storage);
        response.end('JSON restored.');
      }
    
      else if (pathname === '/add') {
        console.log("DEBUT ADD");
        const title = searchParams.get('title');
        const color = searchParams.get('color');
        const value = parseInt(searchParams.get('value'));
        let storage = readStorage();
        storage.push({ title, color, value });
        writeStorage(storage);
        response.end('Element added.');
        console.log("FIN ADD");
      }
    
      else if (pathname === "/PChart") {
        const storage = readStorage();
        let svg = createPieChartSVG(storage);
        response.setHeader("Content-Type", "image/svg+xml");
        response.end(svg);
      }
      

      else if (pathname === '/remove') {
        const index = parseInt(searchParams.get('index'));
        let storage = readStorage();
        storage.splice(index, 1);
        writeStorage(storage);
        response.end('Element removed.');
      }

    else {
        response.writeHead(404);
        response.end("404 Not Found");
    }
}

function getContentType(filePath) {
    switch (extname(filePath).toLowerCase()) {
        case ".html":
            return "text/html";
        case ".css":
            return "text/css";
        case ".js":
            return "text/javascript";
        case ".mjs":
            return "text/javascript";
        case ".json":
            return "application/json";
        case ".png":
            return "image/png";
        case ".jpg":
        case ".jpeg":
            return "image/jpeg";
        default:
            return "application/octet-stream";
    }
}

// server instanciation
const port = process.argv[2] || 8000; // Port from command line argument or default to 8000
const server = createServer(webserver);

// Load initial data from storage.json
if (existsSync("storage.json")) {
    storage = JSON.parse(readFileSync("storage.json"));
} else {
    // Create storage.json with initial data
    storage = [{"title": "foo", "color": "red", "value": 20}, {"title": "bar", "color": "ivory", "value": 100}];
    writeStorage(storage);
}

// server starting
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


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
  

function readStorage() {
  try {
    const rawData = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'storage.json'), 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading storage.json:', error);
    return [];
  }
}

function writeStorage(data) {
  try {
    writeFileSync(join(dirname(fileURLToPath(import.meta.url)),'storage.json'
    ), JSON.stringify(data));
  } catch (error) {
    console.error('Error writing storage.json:', error);
  }
}