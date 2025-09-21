const productList = document.getElementById("productList");

// Fetch products from backend
fetch("/api/products")
  .then((res) => res.json())
  .then((products) => {
    productList.innerHTML = products
      .map(
        (product) => `
      <div class="card">
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
      </div>
    `
      )
      .join("");
  })
  .catch((err) => {
    console.error("Error loading products:", err);
    productList.innerHTML = "<p>Failed to load products.</p>";
  });
