// js/cart.js
document.addEventListener("DOMContentLoaded", () => {
  try {
    loadCart();
    attachCartHandlers();
    updateNavCount();
    loadPreview(); // 🔥 preview section
  } catch (e) {
    console.error("cart init error", e);
  }
});

/* ----------------------------
   LOAD MAIN CART LIST
-----------------------------*/
function showMessage(text) {
  const msg = document.getElementById("cart-msg");
  if (!msg) return;

  msg.innerHTML = text;
  msg.classList.add("show");

  setTimeout(() => {
    msg.classList.remove("show");
  }, 3000);
}

function loadCart() {
  const list = JSON.parse(localStorage.getItem("comic_cart") || "[]");
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  if (!container) return;

  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = "<p>Your cart is empty</p>";
    if (totalEl) totalEl.textContent = "0";
    return;
  }

  let total = 0;

  list.forEach((item) => {
    const comic = (window.COMICS || []).find((c) => c.id === item.id);

    if (!comic) return;

    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <img src="${item.cover}" width="80" height="110" alt="${comic.title}">
      
      <div style="flex:1; padding-left:10px">
        <h4>${comic.title}</h4>
        <p>₹ ${comic.price} × 
          <input class="qty-input" 
            data-id="${comic.id}" 
            type="number" 
            min="1" 
            value="${item.qty}" 
            style="width:60px">
        </p>
      </div>

      <div style="text-align:right">
        <p>₹ ${comic.price * item.qty}</p>
        <button class="remove-item" data-id="${comic.id}">Remove</button>
      </div>
    `;

    container.appendChild(row);
    total += comic.price * item.qty;
  });

  if (totalEl) totalEl.textContent = total;

  loadPreview(); // refresh preview
}

/* ----------------------------
   PREVIEW SECTION (IMAGES ONLY)
-----------------------------*/
function loadPreview() {
  const preview = document.getElementById("cart-preview");
  if (!preview) return;

  const list = JSON.parse(localStorage.getItem("comic_cart") || "[]");

  preview.innerHTML = "";

  list.forEach((item) => {
    const comic = (window.COMICS || []).find((c) => c.id === item.id);
    if (!comic) return;

    const card = document.createElement("div");
    card.className = "preview-card";

    card.innerHTML = `
      <img src="${item.cover}" alt="${comic.title}">
      <p>${comic.title}</p>
    `;

    preview.appendChild(card);
  });
}

/* ----------------------------
   CART HANDLERS
-----------------------------*/
function attachCartHandlers() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  // quantity change
  container.addEventListener("change", (e) => {
    if (e.target.classList.contains("qty-input")) {
      const id = parseInt(e.target.dataset.id);
      const qty = Math.max(1, parseInt(e.target.value));

      let cart = JSON.parse(localStorage.getItem("comic_cart") || "[]");
      const it = cart.find((x) => x.id === id);

      if (it) {
        it.qty = qty;
        localStorage.setItem("comic_cart", JSON.stringify(cart));
        loadCart();
        updateNavCount();
      }
    }
  });

  // remove item
  // remove item
  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-item")) {
      const id = parseInt(e.target.dataset.id);

      let cart = JSON.parse(localStorage.getItem("comic_cart") || "[]");
      const it = cart.find((x) => x.id === id);

      if (!it) return;

      if (it.qty > 1) {
        // reduce only 1 qty
        it.qty -= 1;
      } else {
        // remove full item if qty == 1
        cart = cart.filter((x) => x.id !== id);
      }

      localStorage.setItem("comic_cart", JSON.stringify(cart));
      loadCart();
      updateNavCount();
    }
  });

  // checkout
  const checkout = document.getElementById("checkout");
  if (checkout) {
    checkout.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("comic_cart") || "[]");

      if (!cart.length) {
        showMessage("our cart is empty!");

        return;
      }

      localStorage.removeItem("comic_cart");
      loadCart();
      updateNavCount();
      showMessage("Thank you for your simulated order!");
    });
  }
}

/* ----------------------------
   UPDATE CART COUNT IN HEADER
-----------------------------*/
function updateNavCount() {
  try {
    const cart = JSON.parse(localStorage.getItem("comic_cart") || "[]");
    const count = cart.reduce((sum, item) => sum + item.qty, 0);

    document
      .querySelectorAll("#cart-count, .cart-count")
      .forEach((el) => (el.textContent = count));
  } catch (e) {
    console.error("updateNavCount error", e);
  }
}
