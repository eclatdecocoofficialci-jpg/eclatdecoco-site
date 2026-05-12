emailjs.init("uXzUSZQODQlmyuGgb");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;

const stock = {
  "Rose & Vanille": 21,
  "Douceur de Coco": 8,
  "Câlin d’Orange": 6,
  "Élixir de Ruche": 10,
  "Organique Pur Olive": 14,
  "Éclat de Laurier": 14,
  "Éclat de Romarin": 14
};

function openMenu(){
  closeDrawers();
  document.getElementById("sideMenu").classList.add("active");
  document.getElementById("drawerBg").classList.add("active");
}

function openCart(){
  closeDrawers();
  document.getElementById("cartDrawer").classList.add("active");
  document.getElementById("drawerBg").classList.add("active");
}

function closeDrawers(){
  document.getElementById("sideMenu").classList.remove("active");
  document.getElementById("cartDrawer").classList.remove("active");
  document.getElementById("drawerBg").classList.remove("active");
}

function updateCartCount(){
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cartCount").innerText = count;
}

function changeQty(name, price, change){
  let item = cart.find(product => product.name === name);
  let currentQty = item ? item.quantity : 0;

  if(change > 0 && currentQty >= stock[name]){
    alert("Ce produit est en rupture de stock.");
    return;
  }

  if(item){
    item.quantity += change;

    if(item.quantity <= 0){
      cart = cart.filter(product => product.name !== name);
    }
  }else if(change > 0){
    cart.push({
      name: name,
      price: price,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(name){
  cart = cart.filter(item => item.name !== name);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function renderCart(){
  const cartItems = document.getElementById("cartItems");
  const totalEl = document.getElementById("total");

  cartItems.innerHTML = "";
  total = 0;

  document.querySelectorAll(".qty-box span").forEach(span=>{
    span.innerText = "0";
  });

  if(cart.length === 0){
    cartItems.innerHTML = "<p>Votre panier est vide.</p>";
  }

  cart.forEach(item=>{
    total += item.price * item.quantity;

    const qtySpan = document.getElementById("qty-" + item.name);
    if(qtySpan){
      qtySpan.innerText = item.quantity;
    }

    cartItems.innerHTML += `
      <div class="cart-item">
        <div>
          <h4>${item.name}</h4>
          <p>Quantité : ${item.quantity}</p>
          <p>Sous-total : ${(item.price * item.quantity).toLocaleString()} FCFA</p>
        </div>
        <button class="remove-btn" onclick="removeItem('${item.name}')">×</button>
      </div>
    `;
  });

  Object.keys(stock).forEach(product => {
    const item = cart.find(i => i.name === product);
    const qty = item ? item.quantity : 0;
    const remain = stock[product] - qty;

    const stockEl = document.getElementById("stock-" + product);
    const outEl = document.getElementById("out-" + product);
    const plusBtn = document.getElementById("plus-" + product);
    const minusBtn = document.getElementById("minus-" + product);

    if(stockEl){
      stockEl.innerText = "Stock : " + Math.max(remain, 0);
    }

    if(outEl){
      outEl.style.display = remain <= 0 ? "inline-block" : "none";
    }

    if(plusBtn){
      plusBtn.disabled = remain <= 0;
    }

    if(minusBtn){
      minusBtn.disabled = qty <= 0;
    }
  });

  totalEl.innerText = "Total : " + total.toLocaleString() + " FCFA";
  updateCartCount();
}

function confirmOrder(){
  alert("Commande confirmée.");
}

renderCart();
