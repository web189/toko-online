// ===== DATA STORE =====
let products = JSON.parse(localStorage.getItem("rky_products")) || getDefaultProducts();
let cart = JSON.parse(localStorage.getItem("rky_cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("rky_wishlist")) || [];
let orders = JSON.parse(localStorage.getItem("rky_orders")) || [];
let isAdmin = false;
let currentCategory = "all";
let currentSort = "default";
let editingIndex = -1;
let chatHistory = [];
let heroSlideIndex = 0;
let heroInterval = null;

// ===== DEFAULT PRODUCTS =====
function getDefaultProducts() {
  const base = Date.now();
  return [
    { id: base+1, name: "iPhone 15 Pro Max 256GB", category: "elektronik", price: 21999000, origPrice: 25000000, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop", stock: 15, rating: 4.9, sold: 234, desc: "Smartphone terbaru Apple dengan chip A17 Pro, kamera 48MP, dan layar Super Retina XDR 6.7 inci. Baterai tahan lama seharian penuh.", flash: true, createdAt: base },
    { id: base+2, name: "Samsung Galaxy S24 Ultra", category: "elektronik", price: 19500000, origPrice: 22000000, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop", stock: 8, rating: 4.8, sold: 178, desc: "Flagship Samsung terbaru dengan S Pen terintegrasi, kamera 200MP, dan layar Dynamic AMOLED 2X 6.8 inci.", flash: true, createdAt: base },
    { id: base+3, name: "Nike Air Jordan 1 Retro", category: "fashion", price: 2800000, origPrice: 3500000, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", stock: 25, rating: 4.7, sold: 456, desc: "Sepatu ikonik Nike Air Jordan 1 Retro High OG. Upper kulit asli berkualitas tinggi dengan bantalan udara yang nyaman.", flash: false, createdAt: base },
    { id: base+4, name: "Mie Ayam Premium Pak Kumis", category: "makanan", price: 45000, origPrice: null, image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=400&fit=crop", stock: 100, rating: 4.9, sold: 1230, desc: "Mie ayam premium dengan kuah kaldu ayam kampung asli, topping ayam melimpah, dan bakso sapi kenyal. Dijamin enak!", flash: false, createdAt: base },
    { id: base+5, name: "SK-II Facial Treatment Essence", category: "kecantikan", price: 1250000, origPrice: 1650000, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop", stock: 30, rating: 4.8, sold: 892, desc: "Essence perawatan wajah mewah SK-II dengan kandungan Pitera™ untuk kulit lebih cerah, lembab, dan awet muda.", flash: true, createdAt: base },
    { id: base+6, name: "Sepatu Futsal Specs Accelerator", category: "olahraga", price: 380000, origPrice: 450000, image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&h=400&fit=crop", stock: 40, rating: 4.6, sold: 320, desc: "Sepatu futsal Specs dengan sol anti-slip khusus indoor, upper TPU yang tahan lama, dan desain aerodinamis.", flash: false, createdAt: base },
    { id: base+7, name: "Kursi Gaming RGB Ergonomis", category: "rumah", price: 1800000, origPrice: 2500000, image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=400&fit=crop", stock: 12, rating: 4.5, sold: 67, desc: "Kursi gaming dengan sandaran lumbar adjustable, sandaran tangan 4D, dan lampu RGB. Bahan kulit PU premium.", flash: false, createdAt: base },
    { id: base+8, name: "Laptop ASUS ROG Strix G16", category: "elektronik", price: 24500000, origPrice: 28000000, image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop", stock: 5, rating: 4.9, sold: 45, desc: "Laptop gaming ASUS ROG dengan Intel Core i9 Gen 13, RTX 4080, RAM 32GB, dan layar 165Hz QHD.", flash: true, createdAt: base },
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

// ===== DARK MODE =====
function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark");
  document.getElementById("darkModeBtn").textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("rky_dark", isDark ? "1" : "0");
}

function initDarkMode() {
  const saved = localStorage.getItem("rky_dark");
  if (saved === "1") {
    document.body.classList.add("dark");
    document.getElementById("darkModeBtn").textContent = "☀️";
  }
}

// ===== HERO SLIDER =====
function goToSlide(idx) {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  if (!slides.length) return;
  slides.forEach(s => s.classList.remove("active"));
  dots.forEach(d => d.classList.remove("active"));
  heroSlideIndex = (idx + slides.length) % slides.length;
  slides[heroSlideIndex].classList.add("active");
  if (dots[heroSlideIndex]) dots[heroSlideIndex].classList.add("active");
}

function startHeroSlider() {
  clearInterval(heroInterval);
  heroInterval = setInterval(() => goToSlide(heroSlideIndex + 1), 4500);
}

// ===== BACK TO TOP =====
function initBackToTop() {
  window.addEventListener("scroll", () => {
    const btn = document.getElementById("backToTop");
    if (btn) {
      if (window.scrollY > 400) btn.classList.add("visible");
      else btn.classList.remove("visible");
    }
  });
}

// ===== RENDER PRODUCT CARD =====
function renderCard(p, idx) {
  const disc = discountPct(p.price, p.origPrice);
  const isWished = wishlist.includes(p.id);
  const stockPct = Math.min(100, (p.stock / 50) * 100);
  const isLowStock = p.stock <= 5 && p.stock > 0;

  return `
    <div class="product-card" onclick="openModal(${idx})">
      <div class="card-img-wrap">
        <img src="${p.image}" alt="${p.name}" onerror="this.src='https://placehold.co/400x300/f1f5f9/94a3b8?text=No+Image'" loading="lazy" />
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
          <span class="card-sold">${(p.sold || 0).toLocaleString("id-ID")} terjual</span>
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
  flashList.innerHTML = flashProducts.map(p => renderCard(p, products.indexOf(p))).join("");

  // Main list
  if (list.length === 0) {
    productList.innerHTML = "";
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
    productList.innerHTML = list.map(p => renderCard(p, products.indexOf(p))).join("");
  }

  document.getElementById("statProducts").textContent = products.length;
}

// ===== FILTER & SORT =====
function getFilteredProducts() {
  let list = [...products];
  const q = document.getElementById("searchInput")?.value.toLowerCase() || "";
  if (currentCategory !== "all") list = list.filter(p => p.category === currentCategory);
  if (q) list = list.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    (p.desc || "").toLowerCase().includes(q)
  );
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
        <img src="${p.image}" alt="${p.name}" onerror="this.src='https://placehold.co/60x60/f1f5f9/94a3b8?text=?'" />
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
      return { name: p?.name || "?", qty: c.qty, price: p?.price || 0 };
    }),
    total: cart.reduce((sum, c) => {
      const p = products.find(x => x.id === c.id);
      return sum + (p?.price || 0) * c.qty;
    }, 0),
    date: new Date().toLocaleDateString("id-ID", { day:"2-digit", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit" }),
    status: "Diproses"
  };
  // Reduce stock
  cart.forEach(c => {
    const p = products.find(x => x.id === c.id);
    if (p) { p.stock = Math.max(0, p.stock - c.qty); p.sold = (p.sold || 0) + c.qty; }
  });
  saveProducts();
  orders.unshift(order);
  saveOrders();
  cart = [];
  saveCart();
  updateCartBadge();
  closeCart();
  renderShop();
  showToast("Pesanan berhasil! Struk ditampilkan 🎉", "🎉");
  updateDashboard();
  showReceipt(order);
}

// ===== RECEIPT / STRUK =====
function showReceipt(order) {
  document.getElementById("receiptOrderId").textContent = order.id;
  document.getElementById("receiptDate").textContent = order.date;

  // Render item rows
  let subtotal = 0;
  const rows = order.items.map(item => {
    const lineTotal = item.price * item.qty;
    subtotal += lineTotal;
    return `
      <div class="receipt-item-row">
        <div class="receipt-item-name">${item.name}</div>
        <div class="receipt-item-detail">
          <span class="receipt-item-qty">${item.qty} x ${formatRp(item.price)}</span>
          <span class="receipt-item-total">${formatRp(lineTotal)}</span>
        </div>
      </div>`;
  }).join("");

  document.getElementById("receiptItemsList").innerHTML = rows;
  document.getElementById("receiptSubtotal").textContent = formatRp(subtotal);
  document.getElementById("receiptGrandTotal").textContent = formatRp(subtotal);

  // Store order ref for WA send
  window._lastOrder = order;

  document.getElementById("receiptOverlay").classList.add("open");
}

function closeReceipt() {
  document.getElementById("receiptOverlay").classList.remove("open");
}

function downloadReceiptJPG() {
  const el = document.getElementById("receiptContent");
  const btn = document.querySelector(".receipt-btn-download");
  if (btn) { btn.textContent = "⏳ Memproses..."; btn.disabled = true; }

  // Use html2canvas if available, else fallback
  if (typeof html2canvas !== "undefined") {
    html2canvas(el, { scale: 2, backgroundColor: "#fff", useCORS: true }).then(canvas => {
      const link = document.createElement("a");
      link.download = `struk-${window._lastOrder?.id || "belanja"}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      link.click();
      if (btn) { btn.textContent = "⬇️ Download JPG"; btn.disabled = false; }
    });
  } else {
    // Load html2canvas dynamically
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    script.onload = () => {
      html2canvas(el, { scale: 2, backgroundColor: "#fff", useCORS: true }).then(canvas => {
        const link = document.createElement("a");
        link.download = `struk-${window._lastOrder?.id || "belanja"}.jpg`;
        link.href = canvas.toDataURL("image/jpeg", 0.95);
        link.click();
        if (btn) { btn.textContent = "⬇️ Download JPG"; btn.disabled = false; }
      });
    };
    document.head.appendChild(script);
  }
}

function sendReceiptWA() {
  const order = window._lastOrder;
  if (!order) return;
  const items = order.items.map(i => `• ${i.name} x${i.qty} = ${formatRp(i.price * i.qty)}`).join("\n");
  const msg = `🧾 *STRUK BELANJA @benyoriki Store*\n\n` +
    `No. Pesanan: *${order.id}*\n` +
    `Tanggal: ${order.date}\n\n` +
    `*DAFTAR BELANJA:*\n${items}\n\n` +
    `─────────────────\n` +
    `Ongkir: GRATIS 🎉\n` +
    `*TOTAL BAYAR: ${formatRp(order.total)}*\n\n` +
    `Terima kasih sudah belanja di @benyoriki Store! 🙏\nInstagram: @benyoriki`;
  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/628988995637?text=${encoded}`, "_blank");
}

// ===== PRODUCT MODAL =====
function openModal(idx) {
  const p = products[idx];
  if (!p) return;
  const disc = discountPct(p.price, p.origPrice);
  document.getElementById("modalContent").innerHTML = `
    <img class="modal-product-img" src="${p.image}" alt="${p.name}"
      onerror="this.src='https://placehold.co/520x280/f1f5f9/94a3b8?text=No+Image'" />
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
  if (isAdmin) showPage("admin");
  else document.getElementById("loginModal").classList.add("open");
}

function doLogin() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value;
  if (user === "admin" && pass === "6969") {
    isAdmin = true;
    closeLoginModal();
    const btn = document.getElementById("adminToggle");
    btn.textContent = "⚙️ Panel Admin";
    btn.classList.add("admin-visible");
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
  list.innerHTML = filtered.map((p) => {
    const realIdx = products.indexOf(p);
    const disc = discountPct(p.price, p.origPrice);
    return `
      <div class="admin-product-row">
        <img src="${p.image}" alt="${p.name}" onerror="this.src='https://placehold.co/60x60/f1f5f9/94a3b8?text=?'" />
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

function adminSearch(q) { renderAdminProducts(q); }

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
    showToast("Harap isi semua kolom wajib!", "⚠️"); return;
  }

  if (editIdx >= 0) {
    products[editIdx] = { ...products[editIdx], name, category, price, origPrice, stock, rating, desc, image, flash };
    showToast("Produk berhasil diperbarui!", "✅");
  } else {
    products.push({ id: Date.now(), name, category, price, origPrice, stock, rating, desc, image, flash, sold: 0, createdAt: Date.now() });
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
  if (!p) return;
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
  if (!p || !confirm(`Hapus produk "${p.name}"?`)) return;
  products.splice(idx, 1);
  saveProducts();
  renderAdminProducts();
  renderShop();
  updateDashboard();
  showToast("Produk dihapus!", "🗑️");
}

function resetForm() {
  document.getElementById("editIndex").value = -1;
  ["pName","pPrice","pOrigPrice","pStock","pRating","pDesc","pImage"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("pCategory").value = "";
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
  const recentEl = document.getElementById("recentOrdersList");
  if (orders.length === 0) {
    recentEl.innerHTML = `<p class="empty-msg">Belum ada pesanan masuk.</p>`;
  } else {
    recentEl.innerHTML = orders.slice(0, 5).map(o => `
      <div style="padding:10px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;font-size:.85rem">
        <div>
          <strong style="color:var(--text)">${o.id}</strong><br>
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
  const target = document.getElementById(page + "Page");
  if (!target) return;
  target.classList.add("active");
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

// ===== AI CHATBOT =====
function toggleChatbot() {
  const container = document.getElementById("chatbotContainer");
  const overlay = document.getElementById("chatbotOverlay");
  const isOpen = container.classList.contains("open");
  container.classList.toggle("open");
  overlay.classList.toggle("open");

  // Hide fab badge on open
  if (!isOpen) {
    document.getElementById("chatFabBadge").style.display = "none";
    // Scroll to bottom
    setTimeout(() => {
      const msgs = document.getElementById("chatMessages");
      msgs.scrollTop = msgs.scrollHeight;
    }, 300);
  }
}

function closeChatbot(e) {
  if (!e || e.target === document.getElementById("chatbotOverlay")) {
    document.getElementById("chatbotContainer").classList.remove("open");
    document.getElementById("chatbotOverlay").classList.remove("open");
  }
}

function clearChat() {
  chatHistory = [];
  const msgs = document.getElementById("chatMessages");
  msgs.innerHTML = `
    <div class="chat-msg bot">
      <div class="chat-bubble">
        <p>Chat telah dihapus. Halo lagi! Saya <strong>Beny AI</strong> 👋</p>
        <p>Ada yang bisa saya bantu?</p>
      </div>
      <div class="chat-time">Asisten AI</div>
    </div>
    <div class="chat-quick-btns">
      <button onclick="quickChat('Produk apa yang lagi promo?')">🔥 Promo terbaru</button>
      <button onclick="quickChat('Rekomendasi produk elektronik terbaik')">📱 Elektronik</button>
      <button onclick="quickChat('Cara melakukan pembayaran?')">💳 Cara bayar</button>
      <button onclick="quickChat('Produk fashion terpopuler')">👗 Fashion</button>
    </div>
  `;
}

function quickChat(text) {
  document.getElementById("chatInput").value = text;
  sendChat();
}

function addChatMessage(role, text) {
  const msgs = document.getElementById("chatMessages");
  const isUser = role === "user";
  const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  const div = document.createElement("div");
  div.className = `chat-msg ${isUser ? "user" : "bot"}`;

  // Format bot text with line breaks
  const formatted = isUser ? text : text.replace(/\n/g, "<br>");

  div.innerHTML = `
    <div class="chat-bubble">${isUser ? text : `<p>${formatted}</p>`}</div>
    <div class="chat-time">${time}</div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function buildProductContext() {
  const flashItems = products.filter(p => p.flash && p.stock > 0).slice(0, 5);
  const topRated = [...products].sort((a,b) => (b.rating||0) - (a.rating||0)).slice(0, 5);
  const categories = [...new Set(products.map(p => p.category))];

  return `Kamu adalah asisten belanja AI yang ramah bernama "Beny AI" untuk toko online "@benyoriki Store". 
Toko ini berbasis di Indonesia dengan mata uang Rupiah (Rp).

Info Toko:
- Total produk: ${products.length}
- Kategori: ${categories.join(", ")}
- Gratis ongkir ke seluruh Indonesia
- Return 30 hari
- Rating toko: 4.9/5
- Pembayaran: VISA, Mastercard, Transfer Bank, GoPay, OVO

Flash Sale saat ini (${flashItems.length} produk):
${flashItems.map(p => `- ${p.name}: ${formatRp(p.price)}${p.origPrice ? ` (diskon dari ${formatRp(p.origPrice)})` : ""}, stok: ${p.stock}, rating: ${p.rating}`).join("\n")}

Produk rating terbaik:
${topRated.map(p => `- ${p.name} (${p.category}): ${formatRp(p.price)}, rating: ${p.rating}, terjual: ${p.sold||0}`).join("\n")}

Gunakan bahasa Indonesia yang santai, ramah, dan helpful. Rekomendasikan produk dari toko ini. Jika ditanya harga, berikan informasi yang akurat dari data di atas. Jawaban singkat dan to-the-point. Gunakan emoji sesekali. Maksimal 3-4 kalimat per jawaban.`;
}

async function sendChat() {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  addChatMessage("user", text);
  chatHistory.push({ role: "user", content: text });

  // Show typing
  const typing = document.getElementById("chatTyping");
  typing.style.display = "flex";
  document.getElementById("chatMessages").scrollTop = document.getElementById("chatMessages").scrollHeight;

  try {
    const systemPrompt = buildProductContext();
    const messages = chatHistory.slice(-10); // Keep last 10 for context

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages
      })
    });

    const data = await response.json();
    typing.style.display = "none";

    if (data.content && data.content[0]) {
      const reply = data.content[0].text;
      addChatMessage("bot", reply);
      chatHistory.push({ role: "assistant", content: reply });
    } else if (data.error) {
      throw new Error(data.error.message || "API error");
    }
  } catch (err) {
    typing.style.display = "none";
    // Fallback offline responses
    const offlineReply = getOfflineReply(text);
    addChatMessage("bot", offlineReply);
    chatHistory.push({ role: "assistant", content: offlineReply });
    console.warn("AI API error, using offline mode:", err.message);
  }
}

function getOfflineReply(text) {
  const lower = text.toLowerCase();
  const flashItems = products.filter(p => p.flash && p.stock > 0).slice(0, 3);
  const topRated = [...products].sort((a,b) => (b.rating||0)-(a.rating||0)).slice(0, 3);

  if (lower.includes("promo") || lower.includes("flash") || lower.includes("diskon")) {
    return `🔥 Flash Sale sekarang:\n${flashItems.map(p => `• ${p.name} — ${formatRp(p.price)}`).join("\n")}\n\nBuruan sebelum kehabisan! ⚡`;
  }
  if (lower.includes("elektronik") || lower.includes("hp") || lower.includes("laptop") || lower.includes("gadget")) {
    const elProd = products.filter(p => p.category === "elektronik").slice(0, 3);
    return `📱 Produk elektronik terpopuler:\n${elProd.map(p => `• ${p.name} — ${formatRp(p.price)}`).join("\n")}\n\nKlik produk untuk lihat detail lengkapnya!`;
  }
  if (lower.includes("fashion") || lower.includes("baju") || lower.includes("sepatu")) {
    const fProd = products.filter(p => p.category === "fashion").slice(0, 3);
    return `👗 Produk fashion trending:\n${fProd.map(p => `• ${p.name} — ${formatRp(p.price)}`).join("\n")}\n\nSemua produk 100% original!`;
  }
  if (lower.includes("bayar") || lower.includes("pembayaran") || lower.includes("transfer")) {
    return `💳 Metode pembayaran yang tersedia:\n• Transfer Bank\n• GoPay\n• OVO\n• VISA / Mastercard\n\nSemua transaksi aman & terenkripsi! 🔒`;
  }
  if (lower.includes("ongkir") || lower.includes("pengiriman") || lower.includes("kirim")) {
    return `🚀 Kabar baik! Pengiriman GRATIS ke seluruh Indonesia tanpa minimum pembelian. Estimasi tiba 2-5 hari kerja. 📦`;
  }
  if (lower.includes("return") || lower.includes("retur") || lower.includes("kembali")) {
    return `🔄 Kebijakan return kami: 30 hari garansi uang kembali jika produk tidak sesuai. Hubungi kami via Instagram @benyoriki untuk proses return.`;
  }
  if (lower.includes("rekomendasi") || lower.includes("saran") || lower.includes("terbaik")) {
    return `⭐ Produk terlaris dengan rating tertinggi:\n${topRated.map(p => `• ${p.name} ⭐${p.rating} — ${formatRp(p.price)}`).join("\n")}\n\nSemuanya best seller di toko kami!`;
  }
  if (lower.includes("halo") || lower.includes("hi") || lower.includes("hello")) {
    return `Halo! 👋 Selamat datang di @benyoriki Store! Saya Beny AI, siap bantu kamu belanja. Ada yang bisa saya rekomendasikan? 🛍️`;
  }
  return `Terima kasih sudah bertanya! 😊 Kami punya ${products.length} produk pilihan dengan harga terbaik. Coba tanya tentang produk spesifik, promo, atau cara pemesanan ya!`;
}

// ===== KEYBOARD SHORTCUTS =====
let _secretBuf = "";
let _secretTimer = null;

document.addEventListener("keydown", e => {
  // Enter to login
  if (e.key === "Enter" && document.getElementById("loginModal").classList.contains("open")) {
    doLogin();
  }
  // Escape to close modals
  if (e.key === "Escape") {
    closeModal();
    closeLoginModal();
    closeChatbot();
    closeCart();
    closeReceipt();
  }
  // Secret admin shortcut - works even inside input fields
  // Ketik "benyoadmin" kapan saja untuk buka login
  if (e.key.length === 1) {
    _secretBuf += e.key.toLowerCase();
    if (_secretBuf.length > 12) _secretBuf = _secretBuf.slice(-12);
    // Reset buffer after 3 seconds of inactivity
    clearTimeout(_secretTimer);
    _secretTimer = setTimeout(() => { _secretBuf = ""; }, 3000);
    if (_secretBuf.includes("benyoadmin")) {
      _secretBuf = "";
      if (!isAdmin) {
        document.getElementById("loginModal").classList.add("open");
        // Focus username field
        setTimeout(() => {
          const u = document.getElementById("loginUser");
          if (u) u.focus();
        }, 100);
      }
    }
  }
});

// ===== SECRET ADMIN BUTTON (logo klik 5x) =====
let _logoClickCount = 0;
let _logoClickTimer = null;
window.adminSecretLogoClick = function() {
  _logoClickCount++;
  clearTimeout(_logoClickTimer);
  _logoClickTimer = setTimeout(() => { _logoClickCount = 0; }, 2000);
  if (_logoClickCount >= 5) {
    _logoClickCount = 0;
    if (!isAdmin) {
      document.getElementById("loginModal").classList.add("open");
      setTimeout(() => {
        const u = document.getElementById("loginUser");
        if (u) u.focus();
      }, 100);
    } else {
      showPage("admin");
    }
  }
};

// ===== INIT =====
window.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  renderShop();
  updateCartBadge();
  updateWishBadge();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  startHeroSlider();
  initBackToTop();

  // Secret URL access: tambahkan ?admin di URL
  if (window.location.search.includes("admin") || window.location.hash === "#admin") {
    if (!isAdmin) {
      setTimeout(() => {
        document.getElementById("loginModal").classList.add("open");
        const u = document.getElementById("loginUser");
        if (u) u.focus();
      }, 600);
    }
  }

  // Show chatbot badge after delay to attract attention
  setTimeout(() => {
    const badge = document.getElementById("chatFabBadge");
    if (badge) badge.style.display = "flex";
  }, 3000);
});