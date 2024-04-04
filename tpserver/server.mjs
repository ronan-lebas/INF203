import { createServer } from "http";
import { existsSync, readFileSync } from "fs";
import { extname, join, dirname } from "path";
import { fileURLToPath } from 'url';
import { parse, unescape } from "querystring";

let visitors = [];

function decodeURL(url) {
    return url.replace(/%([0-9A-F]{2})/gi, (match, p1) => String.fromCharCode(parseInt(p1, 16)));
}

// processing requests
function webserver(request, response) {
    let url = request.url;
    if (url === "/kill") {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>The server will stop now.</body></html>");
        process.exit(0);
    } else if (url.startsWith("/hello")) {
        let query = url.split("?")[1];
        let visitor = query.split("=")[1]
        visitor = unescape(visitor);
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(`<html><body><p>Hello ${visitor}</p></body></html>`);
    } else if (url.startsWith("/coucou")) {
        let query = url.split("?")[1];
        let visitor = query.split("=")[1].replace(/</g, "_").replace(/>/g, "_"); // Replace < and > with _
        let responseText = `coucou ${visitor}, the following users have already visited this page: ${visitors.join(", ")}`;
        visitors.push(visitor);
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(`<html><body><p>${responseText}</p></body></html>`);
    } else if (url === "/clear") {
        visitors = [];
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(`<html><body><p>Memory cleared.</p></body></html>`);
    } else if (url.startsWith("/www/")) {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        let filePath = join(__dirname, url.slice(5)); // Adjust slice to match '/www/'
        if (existsSync(filePath) && !filePath.includes("..") && !filePath.includes("~")) {
            let contentType = getContentType(filePath);
            response.setHeader("Content-Type", contentType);
            let fileContent = readFileSync(filePath);
            response.end(fileContent);
        } else {
            response.writeHead(404);
            response.end("404 Not Found");
        }
    } else {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>Server works.</body></html>");
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

// server starting
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
