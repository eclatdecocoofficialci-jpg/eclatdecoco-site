emailjs.init("wSP62MSM78UlgV4eF");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;

const stock = {
  "Pétales de Bissap": 100,
  "Rose & Vanille": 100,
  "Douceur de Coco": 100,
  "Câlin d’Orange": 100,
  "Élixir de Ruche": 100,
  "Organique Pur Olive": 100,
  "Éclat de Laurier": 100,
  "Éclat de Romarin": 100,
  "Masque Capillaire Nourrissant": 100,
  "Baby Rose": 100,
  "Bubble Gum": 100,
  "Lotion Câlin d’Orange": 100,
  "El Mango": 100,
  "Rose & Vanille Butter": 100,
  "Bubble Gum Butter": 100,
  "Calin d’Orange Butter": 100,
  "El Mango Butter": 100,
  "Eclat Naturel Coco Butter": 100,
  "Délice de Mangue": 100,
  "Cafféchino": 100,
  "Sérum Anti-Pellicules": 100,
"Sérum Royal Ivoirien": 100,
  "The Revolution of She": 100,
  "Cheesecake Fondant": 100
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

function filterProducts(category, btn){
  const products = document.querySelectorAll(".product-card.product, .custom-section.product");
  const mainHero = document.querySelector(".hero");
  const lotionHero = document.getElementById("lotionHero");
  const maskHero = document.getElementById("maskHero");
  const butterHero = document.getElementById("butterHero");
  const scrubHero = document.getElementById("scrubHero");
  const bestSellers = document.querySelector(".best-sellers");
  const collectionTitle = document.querySelector(".collection-title");

  products.forEach(product => {
    product.style.display =
      category === "all" || product.dataset.category === category
      ? "block"
      : "none";
  });

  if(lotionHero) lotionHero.classList.remove("active");
  if(maskHero) maskHero.classList.remove("active");
  if(butterHero) butterHero.classList.remove("active");
  if(scrubHero) scrubHero.classList.remove("active");

  if(mainHero){
    mainHero.style.display =
      category === "all" || category === "savons"
      ? "flex"
      : "none";
  }

  if(bestSellers){
    bestSellers.style.display =
      category === "all" || category === "savons"
      ? "block"
      : "none";
  }

  if(category === "lotions" && lotionHero){
    lotionHero.classList.add("active");
  }

  if(category === "masques" && maskHero){
    maskHero.classList.add("active");
  }

  if(category === "beurres" && butterHero){
    butterHero.classList.add("active");
  }

  if(category === "scrubs" && scrubHero){
    scrubHero.classList.add("active");
  }

  document.querySelectorAll(".menu-list button").forEach(button => {
    button.classList.remove("active");
  });

  if(btn){
    btn.classList.add("active");
  }
if(collectionTitle){
  collectionTitle.style.display =
    category === "personnaliser" ? "none" : "block";
}
  const activeHero =
    category === "lotions" ? lotionHero :
    category === "masques" ? maskHero :
    category === "beurres" ? butterHero :
    category === "scrubs" ? scrubHero :
    mainHero;

  if(activeHero){
    window.scrollTo({
      top: activeHero.offsetTop - 80,
      behavior:"smooth"
    });
  }

  closeDrawers();
}

function removeItem(name){
  cart = cart.filter(item => item.name !== name);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function changeQty(name, price, change){
  let item = cart.find(product => product.name === name);
  let currentQty = item ? item.quantity : 0;

  const productStock = stock[name] ?? 999;

  if(change > 0 && currentQty >= productStock){
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
    if(qtySpan) qtySpan.innerText = item.quantity;

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

  totalEl.innerText = "Total : " + total.toLocaleString() + " FCFA";
  updateCartCount();
}

function confirmOrder(){
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if(cart.length === 0){
    alert("Votre panier est vide.");
    return;
  }

  if(!name || !phone || !address){
    alert("Veuillez remplir toutes les informations.");
    return;
  }

  const orderDetails = cart.map(item =>
    `${item.name} x${item.quantity} = ${(item.price * item.quantity).toLocaleString()} FCFA`
  ).join("\n");

  const templateParams = {
    to_email: "sarahajamii@icloud.com",
    customer_name: name,
    customer_phone: phone,
    customer_address: address,
    order_details: orderDetails,
    order_total: total.toLocaleString() + " FCFA",
    delivery_note: "Livraison à partir de 2 000 FCFA selon la commune. Paiement à la livraison.",
    order_id: "EDC-" + Date.now()
  };

  emailjs.send("service_buy8fox", "template_97nbk68", templateParams)
    .then(function(){
      alert("Commande envoyée avec succès !");
      localStorage.removeItem("cart");
      cart = [];
      renderCart();
      closeDrawers();
    })
    .catch(function(error){
      alert("Erreur EmailJS : " + JSON.stringify(error));
      console.log("Erreur EmailJS :", error);
    });
}

document.addEventListener("DOMContentLoaded", function(){
  renderCart();
  filterProducts("savons", document.querySelector(".menu-list button.active"));
});
