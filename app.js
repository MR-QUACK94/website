const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to restrict access to localhost only
app.use((req, res, next) => {
  const ipAddress = req.ip;
  if (ipAddress === '::ffff:127.0.0.1') {
    // Allow requests from localhost
    console.log("Connection request accepted from " + req.ip);
    next();
  } else {
    // Deny access for other IP addresses
    console.log("Connection request denied from " + req.ip);
    res.status(403).send('Forbidden');
  }
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Render HTML files using EJS
app.get('/:page', (req, res) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, 'pages', `${page}.ejs`);

  res.render(filePath, (err, html) => {
    if (err) {
      console.log(err);
      res.status(404).render(path.join(__dirname, 'pages', `error.ejs`), { message: 'Page not found' }); // Assuming you have an error.ejs file
    } else {
      res.send(html);
    }
  });
});

// Error handling middleware for 404 Not Found
app.use((req, res, next) => {
  res.status(404).render('error'); // Assuming you have an error.ejs file
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
