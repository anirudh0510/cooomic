// js/browse.js
document.addEventListener("DOMContentLoaded", () => {
  try {
    initBrowse();
    updateCartCount();
  } catch (e) {
    console.error("browse init error", e);
  }
});

function updateCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem("comic_cart") || "[]");
    const count = cart.reduce((sum, item) => sum + item.qty, 0);

    document
      .querySelectorAll("#cart-count, .cart-count")
      .forEach((el) => (el.textContent = count));
  } catch (e) {
    console.error("updateCartCount error", e);
  }
}

function initBrowse() {
  buildPublisherFilter();
  renderComics(window.COMICS);
  attachBrowseHandlers();
}

/**
 * Build publisher dropdown dynamically
 */
function buildPublisherFilter() {
  const select = document.getElementById("filter-publisher");
  if (!select || !window.COMICS) return;

  const pubs = [...new Set(window.COMICS.map((c) => c.publisher))];
  pubs.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    select.appendChild(opt);
  });
}

/**
 * RENDER ALL CARDS
 */
function renderComics(list) {
  const grid = document.getElementById("comics-grid");
  if (!grid) return;

  grid.innerHTML = "";

  if (!list.length) {
    grid.innerHTML = "<p>No comics found.</p>";
    return;
  }

  list.forEach((c) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${c.cover}" alt="${c.title}">
      <div>
        <h3>${c.title}</h3>
        <p class="muted">${c.publisher}</p>
        <p class="price">₹ ${c.price}</p>
        <a class="btn" href="comic-detail.html?id=${c.id}">View</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

/**
 * SEARCH + FILTER + SORT
 */
function attachBrowseHandlers() {
  const search = document.getElementById("search");
  const filter = document.getElementById("filter-publisher");
  const sort = document.getElementById("sort-by");

  function update() {
    let list = [...window.COMICS];

    // search
    const q = search.value.toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.characters.some((ch) => ch.toLowerCase().includes(q))
      );
    }

    // filter
    if (filter.value !== "all") {
      list = list.filter((c) => c.publisher === filter.value);
    }

    // sort
    if (sort.value === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sort.value === "title-az") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort.value === "date-desc") {
      list.sort((a, b) => new Date(b.release) - new Date(a.release));
    }

    renderComics(list);
  }

  search.addEventListener("input", update);
  filter.addEventListener("change", update);
  sort.addEventListener("change", update);
}
