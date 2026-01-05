const menuData = [
  { id: 1, name: "ข้าวกะเพราหมู", price: 50, category: "food" },
  { id: 2, name: "ข้าวผัดหมู", price: 50, category: "food" },
  { id: 3, name: "ไข่ดาว", price: 10, category: "food" },
  { id: 4, name: "ชาเย็น", price: 25, category: "drink" },
  { id: 5, name: "น้ำอัดลม", price: 20, category: "drink" }
];

let cart = [];
let currentCategory = "food";
const tableNo = new URLSearchParams(window.location.search).get("table") || "-";

document.getElementById("tableInfo").innerText = `โต๊ะ ${tableNo}`;

function renderMenu() {
  const list = document.getElementById("menuList");
  list.innerHTML = "";

  menuData.filter(m => m.category === currentCategory)
    .forEach(item => {
      list.innerHTML += `
        <div class="menu-item">
          <div class="menu-info">
            <strong>${item.name}</strong><br>${item.price} บาท
          </div>
          <button onclick="addToCart(${item.id})">+</button>
        </div>
      `;
    });
}

function filterMenu(cat) {
  currentCategory = cat;
  document.querySelectorAll(".category-bar button")
    .forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");
  renderMenu();
}

function addToCart(id) {
  const item = menuData.find(i => i.id === id);
  const found = cart.find(i => i.id === id);

  found ? found.qty++ : cart.push({ ...item, qty: 1 });
  updateCartCount();
}

function updateCartCount() {
  document.getElementById("cartCount").innerText =
    cart.reduce((s, i) => s + i.qty, 0);
}

function openCart() {
  const box = document.getElementById("cartItems");
  box.innerHTML = "";
  let total = 0;

  cart.forEach(i => {
    total += i.price * i.qty;
    box.innerHTML += `
      <div>
        ${i.name}
        <button class="qty-btn" onclick="changeQty(${i.id},-1)">−</button>
        <span class="qty-number">${i.qty}</span>
        <button class="qty-btn" onclick="changeQty(${i.id},1)">+</button>
      </div>
    `;
  });

  document.getElementById("totalPrice").innerText = total;
  document.getElementById("cartModal").style.display = "block";
}

function changeQty(id, diff) {
  const item = cart.find(i => i.id === id);
  item.qty += diff;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  updateCartCount();
  openCart();
}

function closeCart() {
  document.getElementById("cartModal").style.display = "none";
}

function submitOrder() {
  const payload = {
    table: tableNo,
    items: cart,
    note: document.getElementById("customerNote").value
  };

  fetch("PASTE_WEB_APP_URL_HERE", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  alert("ส่งออเดอร์เรียบร้อย");
  cart = [];
  updateCartCount();
  closeCart();
}

renderMenu();
