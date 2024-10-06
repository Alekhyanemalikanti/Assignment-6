const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

// File to store user data
const dataFilePath = path.join(__dirname, 'users.json');

// Helper function to read user data from file
const getUsersData = () => {
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, JSON.stringify([])); // Initialize file if not present
    }
    return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
};

// Helper function to write user data to file
const setUsersData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Create server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Serve HTML files
    if (pathname === '/' || pathname === '/index') {
        fs.readFile('./index.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index page');
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (pathname === '/login') {
        fs.readFile('./login.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading login page');
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (pathname === '/signup') {
        fs.readFile('./signup.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading signup page');
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } 

    // Serve CSS files
    else if (pathname === '/styles.css') {
        fs.readFile('./styles.css', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading styles.css');
            }
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);
        });
    } else if (pathname === '/css/style.css') {
        fs.readFile('./css/style.css', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading css/style.css');
            }
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);
        });
    }

    // Serve JavaScript files
    else if (pathname === '/login.js') {
        fs.readFile('./login.js', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading login.js');
            }
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
    } else if (pathname === '/signup.js') {
        fs.readFile('./signup.js', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading signup.js');
            }
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
    } 

    // Serve images
    else if (pathname.startsWith('/PHOTOS/')) {
        const imagePath = path.join(__dirname, pathname);
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                return res.end('404 Not Found');
            }
            const ext = path.extname(imagePath).toLowerCase();
            let contentType = 'application/octet-stream';
            if (ext === '.jpeg' || ext === '.jpg') contentType = 'image/jpeg';
            else if (ext === '.png') contentType = 'image/png';
            else if (ext === '.gif') contentType = 'image/gif';

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    }

    // Handle login requests
    else if (pathname === '/loginUser' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            const { username, password } = JSON.parse(body);
            const users = getUsersData();
            const user = users.find(user => user.username === username);

            if (user && user.password === password) {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Login successful!'); // Successful login response
            } else {
                res.writeHead(401, { 'Content-Type': 'text/plain' });
                res.end('Invalid credentials. Please try again.'); // Invalid credentials response
            }
        });
    } 
    // Handle signup requests
    else if (pathname === '/signupUser' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            const { username, password, email } = JSON.parse(body);
            const users = getUsersData();

            // Check if user already exists
            if (users.find(user => user.username === username)) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('User already exists. Try logging in.'); // Existing user response
            } else {
                users.push({ username, password, email });
                setUsersData(users);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Signup successful! You can now login.'); // Successful signup response
            }
        });
    } 
    // Fallback for other routes
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
