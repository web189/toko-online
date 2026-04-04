// ===== DATA STORE =====
let products = JSON.parse(localStorage.getItem("rky_products")) || getDefaultProducts();
let cart = JSON.parse(localStorage.getItem("rky_cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("rky_wishlist")) || [];
let orders = JSON.parse(localStorage.getItem("rky_orders")) || [];
let isAdmin = false;
let currentCategory = "all";
let currentSort = "default";
let editingIndex = -1;

// ===== DEFAULT PRODUCTS =====
function getDefaultProducts() {
  return [
    {
      id: Date.now() + 1,
      name: "iPhone 15 Pro Max 256GB",
      category: "elektronik",
      price: 21999000,
      origPrice: 25000000,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
      stock: 15,
      rating: 4.9,
      sold: 234,
      desc: "Smartphone terbaru Apple dengan chip A17 Pro, kamera 48MP, dan layar Super Retina XDR 6.7 inci. Baterai tahan lama seharian penuh.",
      flash: true,
      createdAt: Date.now()
    },
    {
      id: Date.now() + 2,
      name: "Samsung Galaxy S24 Ultra",
      category: "elektronik",
      price: 19500000,
      origPrice: 22000000,
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
      stock: 8,
      rating: 4.8,
      sold: 178,
      desc: "Flagship Samsung terbaru dengan S Pen terintegrasi, kamera 200MP, dan layar Dynamic AMOLED 2X 6.8 inci.",
      flash: true,
      createdAt: Date.now()
    },
    {
      id: Date.now() + 3,
      name: "Nike Air Jordan 1 Retro",
      category: "fashion",
      price: 2800000,
      origPrice: 3500000,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      stock: 25,
      rating: 4.7,
      sold: 456,
      desc: "Sepatu ikonik Nike Air Jordan 1 Retro High OG. Upper kulit asli berkualitas tinggi dengan bantalan udara yang nyaman.",
      flash: false,
      createdAt: Date.now()
    },
    {
      id: Date.now() + 4,
      name: "Mie Ayam Premium Pak Kumis",
      category: "makanan",
      price: 45000,
      origPrice: null,
      image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=400&fit=crop",
      stock: 100,
      rating: 4.9,
      sold: 1230,
      desc: "Mie ayam premium dengan kuah kaldu ayam kampung asli, topping ayam melimpah, dan bakso sapi kenyal. Dijamin enak!",
      flash: false,
      createdAt: Date.now()
    },
    {
      id: Date.now() + 5,
      name: "SK-II Facial Treatment Essence",
      category: "kecantikan",
      price: 1250000,
      origPrice: 1650000,
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
      stock: 30,
      rating: 4.8,
      sold: 892,
      desc: "Essence perawatan wajah mewah SK-II dengan kandungan Pitera™ untuk kulit lebih cerah, lembab, dan awet muda.",
      flash: true,
      createdAt: Date.now()
    },
    {
      id: Date.now() + 6,
      name: "Sepatu Futsal Specs Accelerator",
      category: "olahraga",
      price: 380000,
      origPrice: 450000,
      image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&h=400&fit=crop",
      stock: 40,
      rating: 4.6,
      sold: 320,
      desc: "Sepatu futsal Specs dengan sol anti-slip khusus indoor, upper TPU yang tahan lama, dan desain aerodinamis untuk performa terbaik.",
      flash: false,
      createdAt: Date.now()
    },
    {
      id: Date.now() + 7,
      name: "Kursi Gaming RGB Ergonomis",
      category: "rumah",
      price: 1800000,
      origPrice: 2500000,
      image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=400&fit=crop",
      stock: 12,
      rating: 4.5,
      sold: 67,
      desc: "Kursi gaming dengan sandaran lumbar adjustable, sandaran tangan 4D, dan lampu RGB. Bahan kulit PU premium, nyaman untuk gaming marathom.",
      flash: false,
      createdAt: Date.now()
    },
    {
      id: Date.now() + 8,
      name: "Laptop ASUS ROG Strix G16",
      category: "elektronik",
      price: 24500000,
      origPrice: 28000000,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop",
      stock: 5,
      rating: 4.9,
      sold: 45,
      desc: "Laptop gaming ASUS ROG dengan Intel Core i9 Gen 13, RTX 4080, RAM 32GB, dan layar 165Hz QHD. Performa gaming tak tertandingi!",
      flash: true,
      createdAt: Date.now()
    },
  ];
}

// ===== SAVE FUNCTIONS =====
function saveProducts() { localStorage.setItem("rky_products", JSON.stringify(products)); }
function saveCart() { localStorage.setItem("rky_cart", JSON.stringify(cart)); }
function saveWishlist() { localStorage.setItem("rky_wishlist", JSON.stringify(wishlist)); }
function saveOrders() { localStorage.setItem("rky_orders", JSON.stringify(orders)); }

// ===== FORMAT RUPIAH =====
function formatRp(num) {
  return "Rp " + parseInt(num).toLocaleString("id-ID");
}

// ===== DISCOUNT PERCENT =====
function discountPct(price, orig) {
  if (!orig || orig <= price) return 0;
  return Math.round((1 - price / orig) * 100);
}

// ===== RENDER STARS =====
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let s = "";
  for (let i = 0; i < full; i++) s += "⭐";
  if (half) s += "✨";
  return s;
}

// ===== TOAST NOTIFICATION =====
function showToast(msg, emoji = "✅") {
  const t = document.getElementById("toast");
  t.textContent = emoji + " " + msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

// ===== RENDER PRODUCT CARD =====
function renderCard(p, idx, inWishlist = false) {
  const disc = discountPct(p.price, p.origPrice);
  const isWished = wishlist.includes(p.id);
  const stockPct = Math.min(100, (p.stock / 50) * 100);
  const isLowStock = p.stock <= 5;

  return `
    <div class="product-card" onclick="openModal(${idx})">
      <div class="card-img-wrap">
        <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400x300/f1f5f9/94a3b8?text=No+Image'" loading="lazy" />
        <div class="card-badges">
          ${disc > 0 ? `<span class="badge-discount">-${disc}%</span>` : ""}
          ${p.flash ? `<span class="badge-flash">⚡ Flash</span>` : ""}
          ${p.stock <= 0 ? `<span class="badge-discount">Habis</span>` : ""}
        </div>
        <button class="card-wish-btn ${isWished ? "wished" : ""}"
          onclick="toggleWishlist(event, ${p.id})"
          title="${isWished ? "Hapus dari wishlist" : "Tambah ke wishlist"}">
          ${isWished ? "❤️" : "🤍"}
        </button>
      </div>
      <div class="card-body">
        <div class="card-category">${p.category}</div>
        <h4>${p.name}</h4>
        <div class="card-price">
          <span class="price-current">${formatRp(p.price)}</span>
          ${p.origPrice ? `<span class="price-original">${formatRp(p.origPrice)}</span>` : ""}
        </div>
        <div class="card-meta">
          <span class="card-rating">${renderStars(p.rating)} ${p.rating}</span>
          <span class="card-sold">${p.sold?.toLocaleString("id-ID") || 0} terjual</span>
        </div>
        <div class="card-stock ${isLowStock ? "low" : ""}">
          ${p.stock <= 0 ? "❌ Stok habis" : isLowStock ? `⚠️ Sisa ${p.stock} lagi!` : `📦 Stok: ${p.stock}`}
        </div>
        ${p.flash && p.stock > 0 ? `
        <div class="stock-bar">
          <div class="stock-fill" style="width: ${100 - stockPct}%"></div>
        </div>` : ""}
        <button class="btn-add-cart"
          onclick="addToCart(event, ${p.id})"
          ${p.stock <= 0 ? "disabled" : ""}>
          ${p.stock <= 0 ? "Stok Habis" : "🛒 Beli"}
        </button>
      </div>
    </div>
  `;
}

// ===== RENDER SHOP =====
function renderShop(filtered = null) {
  const list = filtered !== null ? filtered : getFilteredProducts();
  const productList = document.getElementById("productList");
  const emptyState = document.getElementById("emptyState");
  const flashList = document.getElementById("flashSaleList");

  // Flash sale
  const flashProducts = products.filter(p => p.flash && p.stock > 0).slice(0, 6);
  flashList.innerHTML = flashProducts.map((p, i) => renderCard(p, products.indexOf(p))).join("");

  // Main list
  if (list.length === 0) {
    productList.innerHTML = "";
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
    productList.innerHTML = list.map((p) => renderCard(p, products.indexOf(p))).join("");
  }

  document.getElementById("statProducts").textContent = products.length;
}

// ===== FILTER & SORT =====
function getFilteredProducts() {
  let list = [...products];
  const q = document.getElementById("searchInput")?.value.toLowerCase() || "";

  if (currentCategory !== "all") list = list.filter(p => p.category === currentCategory);
  if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.desc?.toLowerCase().includes(q));

  switch (currentSort) {
    case "price-asc": list.sort((a, b) => a.price - b.price); break;
    case "price-desc": list.sort((a, b) => b.price - a.price); break;
    case "rating": list.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
    case "newest": list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); break;
  }

  return list;
}

function filterCategory(cat, btn) {
  currentCategory = cat;
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  showPage("shop");
  renderShop();
}

function sortProducts(val) {
  currentSort = val;
  renderShop();
}

function handleSearch() {
  renderShop();
}

// ===== WISHLIST =====
function toggleWishlist(e, id) {
  e.stopPropagation();
  const idx = wishlist.indexOf(id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast("Dihapus dari wishlist", "💔");
  } else {
    wishlist.push(id);
    showToast("Ditambahkan ke wishlist!", "❤️");
  }
  saveWishlist();
  updateWishBadge();
  renderShop();
  if (document.getElementById("wishlistPage").classList.contains("active")) renderWishlist();
}

function updateWishBadge() {
  document.getElementById("wishBadge").textContent = wishlist.length;
}

function renderWishlist() {
  const grid = document.getElementById("wishlistGrid");
  const empty = document.getElementById("wishlistEmpty");
  const wishedProducts = products.filter(p => wishlist.includes(p.id));
  if (wishedProducts.length === 0) {
    grid.innerHTML = "";
    empty.style.display = "block";
  } else {
    empty.style.display = "none";
    grid.innerHTML = wishedProducts.map(p => renderCard(p, products.indexOf(p))).join("");
  }
}

// ===== CART =====
function addToCart(e, id) {
  e.stopPropagation();
  const p = products.find(x => x.id === id);
  if (!p || p.stock <= 0) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    if (existing.qty >= p.stock) { showToast("Stok tidak mencukupi!", "⚠️"); return; }
    existing.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }

  saveCart();
  updateCartBadge();
  showToast(`${p.name} ditambahkan ke keranjang!`, "🛒");
}

function updateCartBadge() {
  const total = cart.reduce((sum, c) => sum + c.qty, 0);
  document.getElementById("cartBadge").textContent = total;
}

function openCart() {
  document.getElementById("cartSidebar").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
  renderCart();
}

function closeCart() {
  document.getElementById("cartSidebar").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
}

function renderCart() {
  const container = document.getElementById("cartItems");
  if (cart.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">🛒</div><h3>Keranjang kosong</h3><p>Yuk belanja dulu!</p></div>`;
    document.getElementById("cartTotal").textContent = "Rp 0";
    return;
  }

  let total = 0;
  container.innerHTML = cart.map(c => {
    const p = products.find(x => x.id === c.id);
    if (!p) return "";
    const sub = p.price * c.qty;
    total += sub;
    return `
      <div class="cart-item">
        <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/60x60/f1f5f9/94a3b8?text=?'" />
        <div class="cart-item-info">
          <h4>${p.name}</h4>
          <div class="cart-price">${formatRp(p.price)}</div>
          <div class="cart-qty">
            <button class="qty-btn" onclick="changeQty(${c.id}, -1)">−</button>
            <span class="qty-num">${c.qty}</span>
            <button class="qty-btn" onclick="changeQty(${c.id}, 1)">+</button>
          </div>
        </div>
        <button class="cart-item-del" onclick="removeCart(${c.id})">🗑️</button>
      </div>
    `;
  }).join("");
  document.getElementById("cartTotal").textContent = formatRp(total);
}

function changeQty(id, delta) {
  const c = cart.find(x => x.id === id);
  const p = products.find(x => x.id === id);
  if (!c || !p) return;
  c.qty += delta;
  if (c.qty <= 0) removeCart(id);
  else if (c.qty > p.stock) { showToast("Stok tidak mencukupi!", "⚠️"); c.qty = p.stock; }
  saveCart();
  updateCartBadge();
  renderCart();
}

function removeCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  updateCartBadge();
  renderCart();
}

function checkout() {
  if (cart.length === 0) return;

  const order = {
    id: "ORD-" + Date.now(),
    items: cart.map(c => {
      const p = products.find(x => x.id === c.id);
      return { name: p?.name, qty: c.qty, price: p?.price };
    }),
    total: cart.reduce((sum, c) => {
      const p = products.find(x => x.id === c.id);
      return sum + (p?.price || 0) * c.qty;
    }, 0),
    date: new Date().toLocaleDateString("id-ID"),
    status: "Diproses"
  };

  // Reduce stock
  cart.forEach(c => {
    const p = products.find(x => x.id === c.id);
    if (p) { p.stock -= c.qty; p.sold = (p.sold || 0) + c.qty; }
  });
  saveProducts();

  orders.unshift(order);
  saveOrders();

  cart = [];
  saveCart();
  updateCartBadge();
  closeCart();
  renderShop();

  showToast("Pesanan berhasil dibuat! Terima kasih 🎉", "🎉");
  updateDashboard();
}

// ===== PRODUCT MODAL =====
function openModal(idx) {
  const p = products[idx];
  if (!p) return;
  const disc = discountPct(p.price, p.origPrice);

  document.getElementById("modalContent").innerHTML = `
    <img class="modal-product-img" src="${p.image}" alt="${p.name}"
      onerror="this.src='https://via.placeholder.com/520x280/f1f5f9/94a3b8?text=No+Image'" />
    <div class="modal-product-body">
      <div class="modal-product-cat">📂 ${p.category} ${p.flash ? "• ⚡ Flash Sale" : ""}</div>
      <h2>${p.name}</h2>
      <div class="modal-product-rating">${renderStars(p.rating)} ${p.rating} · ${(p.sold||0).toLocaleString("id-ID")} terjual</div>
      <div class="modal-product-price">${formatRp(p.price)} ${disc > 0 ? `<span style="background:#fee2e2;color:#ef4444;padding:3px 8px;border-radius:6px;font-size:.75rem;font-weight:700;margin-left:6px;">-${disc}%</span>` : ""}</div>
      ${p.origPrice ? `<div class="modal-orig-price">${formatRp(p.origPrice)}</div>` : ""}
      <div class="modal-stock">📦 Stok: <strong>${p.stock} tersedia</strong></div>
      <div class="modal-product-desc">${p.desc || "Produk berkualitas tinggi dengan jaminan keaslian."}</div>
      <div class="modal-qty-row">
        <label>Jumlah:</label>
        <div class="modal-qty-ctrl">
          <button class="qty-btn" onclick="modalQty(-1)">−</button>
          <span class="qty-num" id="modalQtyNum">1</span>
          <button class="qty-btn" onclick="modalQty(1)">+</button>
        </div>
      </div>
      <div class="modal-actions">
        <button class="modal-btn-cart" onclick="modalAddCart(${p.id})" ${p.stock<=0?"disabled":""}>🛒 Keranjang</button>
        <button class="modal-btn-buy" onclick="modalBuyNow(${p.id})" ${p.stock<=0?"disabled":""}>⚡ Beli Sekarang</button>
      </div>
    </div>
  `;

  window._modalProductId = p.id;
  window._modalQty = 1;
  window._modalMaxQty = p.stock;
  document.getElementById("productModal").classList.add("open");
}

function modalQty(delta) {
  const newQty = (window._modalQty || 1) + delta;
  if (newQty < 1 || newQty > (window._modalMaxQty || 99)) return;
  window._modalQty = newQty;
  document.getElementById("modalQtyNum").textContent = newQty;
}

function modalAddCart(id) {
  const qty = window._modalQty || 1;
  const p = products.find(x => x.id === id);
  if (!p || p.stock <= 0) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, p.stock);
  } else {
    cart.push({ id, qty });
  }

  saveCart();
  updateCartBadge();
  closeModal();
  showToast(`${p.name} ditambahkan ke keranjang!`, "🛒");
}

function modalBuyNow(id) {
  modalAddCart(id);
  setTimeout(openCart, 300);
}

function closeModal(e) {
  if (!e || e.target === document.getElementById("productModal") || !e.target) {
    document.getElementById("productModal").classList.remove("open");
  }
}

// ===== ADMIN =====
function handleAdminClick() {
  if (isAdmin) {
    showPage("admin");
  } else {
    document.getElementById("loginModal").classList.add("open");
  }
}

function doLogin() {
  const user = document.getElementById("loginUser").value;
  const pass = document.getElementById("loginPass").value;

  if (user === "admin" && pass === "admin123") {
    isAdmin = true;
    closeLoginModal();
    document.getElementById("adminToggle").textContent = "⚙️ Panel Admin";
    showPage("admin");
    updateDashboard();
    renderAdminProducts();
    renderAdminOrders();
    showToast("Selamat datang, Admin! 👋", "🔑");
  } else {
    showToast("Username atau password salah!", "❌");
    document.getElementById("loginPass").value = "";
    document.getElementById("loginPass").focus();
  }
}

function closeLoginModal(e) {
  if (!e || e.target === document.getElementById("loginModal") || !e.target) {
    document.getElementById("loginModal").classList.remove("open");
  }
}

function logout() {
  isAdmin = false;
  document.getElementById("adminToggle").textContent = "⚙️ Admin";
  showPage("shop");
  showToast("Berhasil keluar dari panel admin", "👋");
}

// ===== ADMIN TABS =====
function showAdminTab(tab, btn) {
  document.querySelectorAll(".admin-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".admin-nav-btn").forEach(b => b.classList.remove("active"));
  document.getElementById("tab-" + tab).classList.add("active");
  if (btn) btn.classList.add("active");

  if (tab === "products") renderAdminProducts();
  if (tab === "orders") renderAdminOrders();
  if (tab === "dashboard") updateDashboard();
  if (tab === "addProduct") { resetForm(); document.getElementById("addProductTitle").textContent = "➕ Tambah Produk Baru"; }
}

// ===== ADMIN PRODUCT LIST =====
function renderAdminProducts(filter = "") {
  const list = document.getElementById("adminProductList");
  const filtered = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

  if (filtered.length === 0) {
    list.innerHTML = `<p class="empty-msg">Tidak ada produk ditemukan.</p>`;
    return;
  }

  list.innerHTML = filtered.map((p, i) => {
    const realIdx = products.indexOf(p);
    const disc = discountPct(p.price, p.origPrice);
    return `
      <div class="admin-product-row">
        <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/60x60/f1f5f9/94a3b8?text=?'" />
        <div class="admin-product-info">
          <h4>${p.name}</h4>
          <p>${p.category} · ${formatRp(p.price)} ${disc > 0 ? `(-${disc}%)` : ""} · Stok: ${p.stock} · Terjual: ${p.sold || 0}</p>
        </div>
        <div class="admin-product-actions">
          <button class="btn-edit" onclick="editProduct(${realIdx})">✏️ Edit</button>
          <button class="btn-delete" onclick="deleteProduct(${realIdx})">🗑️ Hapus</button>
        </div>
      </div>
    `;
  }).join("");
}

function adminSearch(q) {
  renderAdminProducts(q);
}

// ===== ADD / EDIT PRODUCT =====
function saveProduct() {
  const name = document.getElementById("pName").value.trim();
  const category = document.getElementById("pCategory").value;
  const price = parseInt(document.getElementById("pPrice").value);
  const origPrice = parseInt(document.getElementById("pOrigPrice").value) || null;
  const stock = parseInt(document.getElementById("pStock").value);
  const rating = parseFloat(document.getElementById("pRating").value) || 4.5;
  const desc = document.getElementById("pDesc").value.trim();
  const image = document.getElementById("pImage").value.trim();
  const flash = document.getElementById("pFlash").checked;
  const editIdx = parseInt(document.getElementById("editIndex").value);

  if (!name || !category || isNaN(price) || isNaN(stock) || !image) {
    showToast("Harap isi semua kolom wajib!", "⚠️");
    return;
  }

  if (editIdx >= 0) {
    // Edit mode
    products[editIdx] = { ...products[editIdx], name, category, price, origPrice, stock, rating, desc, image, flash };
    showToast("Produk berhasil diperbarui!", "✅");
  } else {
    // Add mode
    products.push({
      id: Date.now(),
      name, category, price, origPrice, stock, rating, desc, image, flash,
      sold: 0,
      createdAt: Date.now()
    });
    showToast("Produk berhasil ditambahkan!", "✅");
  }

  saveProducts();
  resetForm();
  renderShop();
  updateDashboard();
  showAdminTab("products", document.querySelectorAll(".admin-nav-btn")[1]);
}

function editProduct(idx) {
  const p = products[idx];
  document.getElementById("editIndex").value = idx;
  document.getElementById("pName").value = p.name;
  document.getElementById("pCategory").value = p.category;
  document.getElementById("pPrice").value = p.price;
  document.getElementById("pOrigPrice").value = p.origPrice || "";
  document.getElementById("pStock").value = p.stock;
  document.getElementById("pRating").value = p.rating;
  document.getElementById("pDesc").value = p.desc || "";
  document.getElementById("pImage").value = p.image;
  document.getElementById("pFlash").checked = p.flash;
  document.getElementById("addProductTitle").textContent = "✏️ Edit Produk";
  previewImage();
  showAdminTab("addProduct", document.querySelectorAll(".admin-nav-btn")[2]);
}

function deleteProduct(idx) {
  const p = products[idx];
  if (!confirm(`Hapus produk "${p.name}"?`)) return;
  products.splice(idx, 1);
  saveProducts();
  renderAdminProducts();
  renderShop();
  updateDashboard();
  showToast("Produk dihapus!", "🗑️");
}

function resetForm() {
  document.getElementById("editIndex").value = -1;
  document.getElementById("pName").value = "";
  document.getElementById("pCategory").value = "";
  document.getElementById("pPrice").value = "";
  document.getElementById("pOrigPrice").value = "";
  document.getElementById("pStock").value = "";
  document.getElementById("pRating").value = "";
  document.getElementById("pDesc").value = "";
  document.getElementById("pImage").value = "";
  document.getElementById("pFlash").checked = false;
  document.getElementById("imgPreview").style.display = "none";
  document.getElementById("imgPlaceholder").style.display = "block";
  document.getElementById("addProductTitle").textContent = "➕ Tambah Produk Baru";
}

function previewImage() {
  const url = document.getElementById("pImage").value;
  const preview = document.getElementById("imgPreview");
  const placeholder = document.getElementById("imgPlaceholder");
  if (url) {
    preview.src = url;
    preview.style.display = "block";
    placeholder.style.display = "none";
  } else {
    preview.style.display = "none";
    placeholder.style.display = "block";
  }
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast("File terlalu besar! Maks 5MB", "⚠️"); return; }

  const reader = new FileReader();
  reader.onload = (ev) => {
    document.getElementById("pImage").value = ev.target.result;
    previewImage();
    showToast("Gambar berhasil diupload!", "📸");
  };
  reader.readAsDataURL(file);
}

// ===== ADMIN ORDERS =====
function renderAdminOrders() {
  const container = document.getElementById("ordersList");
  if (orders.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><h3>Belum ada pesanan</h3><p>Pesanan dari pelanggan akan muncul di sini</p></div>`;
    return;
  }

  container.innerHTML = orders.map(o => `
    <div class="order-card">
      <div class="order-card-header">
        <span class="order-id">📋 ${o.id}</span>
        <span class="order-date">📅 ${o.date}</span>
        <span class="order-status">${o.status}</span>
      </div>
      <div class="order-items">${o.items.map(i => `${i.name} (×${i.qty})`).join(", ")}</div>
      <div class="order-total">💰 ${formatRp(o.total)}</div>
    </div>
  `).join("");
}

// ===== DASHBOARD =====
function updateDashboard() {
  document.getElementById("dashProducts").textContent = products.length;
  document.getElementById("dashOrders").textContent = orders.length;
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  document.getElementById("dashRevenue").textContent = formatRp(revenue);
  document.getElementById("dashVisitors").textContent = Math.floor(Math.random() * 900 + 100).toLocaleString("id-ID");

  // Recent orders
  const recentEl = document.getElementById("recentOrdersList");
  if (orders.length === 0) {
    recentEl.innerHTML = `<p class="empty-msg">Belum ada pesanan masuk.</p>`;
  } else {
    recentEl.innerHTML = orders.slice(0, 5).map(o => `
      <div style="padding:10px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;font-size:.85rem">
        <div>
          <strong>${o.id}</strong><br>
          <small style="color:var(--text-muted)">${o.items.length} item · ${o.date}</small>
        </div>
        <div style="text-align:right">
          <strong style="color:var(--primary)">${formatRp(o.total)}</strong><br>
          <small style="color:var(--success)">${o.status}</small>
        </div>
      </div>
    `).join("");
  }
}

// ===== PAGE NAVIGATION =====
function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(page + "Page").classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (page === "wishlist") renderWishlist();
  if (page === "admin" && !isAdmin) { handleAdminClick(); return; }
}

// ===== COUNTDOWN TIMER =====
function updateCountdown() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 0);
  const diff = end - now;
  const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
  const el = document.getElementById("countdown");
  if (el) el.textContent = `${h}:${m}:${s}`;
}

// ===== ENTER TO LOGIN =====
document.addEventListener("keydown", e => {
  if (e.key === "Enter" && document.getElementById("loginModal").classList.contains("open")) doLogin();
});

// ===== INIT =====
window.addEventListener("DOMContentLoaded", () => {
  renderShop();
  updateCartBadge();
  updateWishBadge();
  updateCountdown();
  setInterval(updateCountdown, 1000);
});