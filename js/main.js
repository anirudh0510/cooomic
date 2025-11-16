// main.js – home page functionality

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("comic_cart") || "[]");
  const count = cart.reduce((s, i) => s + (i.qty || 1), 0);
  document.getElementById("cart-count").textContent = count;
}
updateCartCount();

// Generic card generator
function createCard(comic) {
  return `
    <div class="comic-card" onclick="openComic(${comic.id})">
      <div class="comic-img">
        <img src="${comic.image}" alt="${comic.title}" />
      </div>
      <h3>${comic.title}</h3>
      <p class="price">₹${comic.price}</p>
      <button class="add-btn" onclick="event.stopPropagation(); addToCart(${comic.id})">
        Add to Cart
      </button>
    </div>
  `;
}

// Render comics by category
function loadSection(sectionId, category) {
  const container = document.getElementById(sectionId);
  if (!container) return;

  const filtered = window.COMICS.filter((c) => c.category === category);

  container.innerHTML = filtered.map(createCard).join("");
}

// Open detail page
function openComic(id) {
  window.location.href = `comic-detail.html?id=${id}`;
}

// Add to cart
function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("comic_cart") || "[]");

  const item = cart.find((c) => c.id === id);
  if (item) item.qty += 1;
  else cart.push({ id, qty: 1 });

  localStorage.setItem("comic_cart", JSON.stringify(cart));
  updateCartCount();
  alert("Added to cart!");
}

// INIT
loadSection("new-releases", "new");
loadSection("popular-series", "popular");
