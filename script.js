let cart = JSON.parse(localStorage.getItem("cart")) || [];

let total = 0;

const stock = {
  "Rose & Vanille":21,
  "Douceur de Coco":8,
  
};

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

  } else if(change > 0){

    cart.push({
      name:name,
      price:price,
      quantity:1
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
