var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

var server = http.createServer((req, res) => {
    let q = url.parse(req.url, true);
    let pathname = q.pathname;
    let query = q.query;

    // 1. Serve file statis dari /public/
    if (pathname.startsWith('/public/')) {
        const filePath = path.join(__dirname, pathname);
        const ext = path.extname(filePath);

        const contentTypes = {
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.ico': 'image/x-icon',
        };

        const contentType = contentTypes[ext] || 'application/octet-stream';

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });
        return;
    }

    // 2. Routing halaman HTML berdasarkan query string
    let fileLocation;

    switch (query.menu) {
        case undefined:
        case '/':
        case 'home':
            fileLocation = 'pages/index.html';
            break;
        case 'about':
            fileLocation = 'pages/about.html';
            break;
        case 'edit':
            fileLocation = 'pages/dosen/edit.html';
            break;
        default:
            fileLocation = 'pages/index.html';
    }

    fs.readFile(fileLocation, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });

        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
});

server.listen(8000);
