import { createServer } from "http";
import { existsSync, readFileSync } from "fs";
import { extname, join, dirname } from "path";
import { fileURLToPath } from 'url';
import { parse, unescape } from "querystring";

let visitors = [];

function cleanInput(input) {
    return input.replace(/</g, "_").replace(/>/g, "_");
}

// processing requests
function webserver(request, response) {
    const { url } = request;
    const parsedUrl = new URL(url, `http://${request.headers.host}`);
    const { pathname, searchParams } = parsedUrl;


    if (pathname === "/kill") {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>The server will stop now.</body></html>");
        process.exit(0);
    } 
    
    else if (pathname === "/hello" && searchParams.has("visiteur")) {
        const visitor = searchParams.get("visiteur");
        const cleanedVisitor = unescape(visitor);
        let responseText = 'Hello ' + cleanedVisitor;
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(`<html><body><p>${responseText}</p></body></html>`);
    }
    
    else if (pathname === "/coucou" && searchParams.has("visiteur")) {
        const visitor = searchParams.get("visiteur");
        const cleanedVisitor = cleanInput(visitor);
        let responseText = `coucou ${cleanedVisitor}, the following users have already visited this page: ${visitors.join(", ")}`;
        visitors.push(cleanedVisitor);
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(`<html><body><p>${responseText}</p></body></html>`);
    }
    
    else if (pathname === "/clear") {
        visitors = [];
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(`<html><body><p>Memory cleared.</p></body></html>`);
    }
    
    else if (url.startsWith("/www/")) {
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
    }
    
    else {
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
