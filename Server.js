const express = require("express");
const app = express();
const port = 3000;

// Serve static files (your HTML, CSS, JS)
app.use(express.static(__dirname));

// Sample products data
const products = [
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    price: 100,
    image: "images/product1.jpg"
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    price: 200,
    image: "images/product2.jpg"
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    price: 300,
    image: "images/product3.jpg"
  }
];

// API route to get products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
