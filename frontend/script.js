const cart_items= document.querySelector('#cart .cart-items');

window.addEventListener('DOMContentLoaded', () => {
    axios.get('http://localhost:3000/products')
    .then(data => {
        console.log(data);
        if(data.request.status===200)
        {
            const products= data.data.products;
            const parentSection= document.getElementById('f1-merch');

            products.forEach(product => {
                const prodHtml= `<div id="team-content">
                                    <div id="${product.title}">
                                        <h3>${product.description}</h3>
                                        <div class="image-container">
                                            <img src="${product.imageUrl}" alt="${product.title}" class="prod-images">
                                        </div>
                                        <div class="prod-details">
                                            <span>
                                                Rs <span>${product.price}</span>
                                            </span>
                                            <button class="shop-item-button" type="button" onclick="addToCart(${product.id})">Add to Cart</button>
                                        </div>
                                    </div>
                                </div>`
                parentSection.innerHTML +=prodHtml;
            })
        }
    })
    .catch(err => console.log(err));
});

const parentContainer= document.getElementById('Ecommerce-Container');
parentContainer.addEventListener('click', (e) => {
    if(e.target.className=='shop-item-button')
    {
        const id= e.target.parentNode.parentNode.id;
        const name= document.querySelector(`#${id} h3`).innerText;
        const img_src= document.querySelector(`#${id} img`).src;
        const price= e.target.parentNode.firstElementChild.firstElementChild.innerText;

        let total_cart_price= document.querySelector('#total-value').innerText;
        if(document.querySelector(`#in-cart-${id}`)){
            alert('This item is already added to the cart');
            return;
        }
        document.querySelector('.cart-number').innerText= parseInt(document.querySelector('.cart-number').innerText)+1;
        const cart_item= document.createElement('div');
        cart_item.classList.add('cart-row');
        cart_item.setAttribute('id', `in-cart-${id}`);
        total_cart_price= parseFloat(total_cart_price) + parseFloat(price);
        total_cart_price= total_cart_price.toFixed(2);
        document.querySelector('#total-value').innerText= `${total_cart_price}`;
        cart_item.innerHTML = `<span class="cart-item cart-column">
                                <img class="cart-img" src="${img_src}" alt="">
                                    <span>${name}</span>
                                </span>
                                <span class="cart-price cart-column">${price}</span>
                                <span class="cart-quantity cart-column">
                                    <input type="text" value="1">
                                    <button>REMOVE</button>
                                </span>`;
        cart_items.appendChild(cart_item);

        const container= document.getElementById('container');
        const notification= document.createElement('div');
        notification.classList.add('notification');
        notification.innerHTML= `<h4><span>${name}</span> is added to the cart successfully!!</h4>`;
        container.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 2500);
    }
    if(e.target.className=='cart-btn-bottom' || e.target.className=='cart-bottom' || e.target.className=='cart-holder')
    {
        const cartContainer= document.getElementById('cart');
        cartContainer.innerHTML= '';
        getCartDetails();
    }
    if(e.target.className=='cancel')
    {
        document.querySelector('#cart').style="display:none;";
    }
    if(e.target.className=='purchase-btn')
    {
        if(parseInt(document.querySelector('.cart-number').innerText) === 0)
        {
            alert('You have Nothing in Cart, Add some products to purchase!');
            return;
        }
        alert('Thanks for the purchase');
        cart_items.innerHTML= "";
        document.querySelector('.cart-number').innerText= 0;
        document.querySelector('#total-value').innerText= 0;
    }
    if(e.target.innerText=='REMOVE')
    {
        let total_cart_price= document.querySelector('#total-value').innerText;
        total_cart_price= parseFloat(total_cart_price).toFixed(2) - parseFloat(document.querySelector(`#${e.target.parentNode.parentNode.id} .cart-price`).innerText).toFixed(2);
        document.querySelector('.cart-number').innerText= parseInt(document.querySelector('.cart-number').innerText) - 1;
        document.querySelector('#total-value').innerText= `${total_cart_price.toFixed(2)}`;
        e.target.parentNode.parentNode.remove();
    }
})

function addToCart(productId)
{
    axios.post('http://localhost:3000/cart', {productId: productId})
    .then(resposne => {
        //console.log(resposne);
    })
    .catch(error => {
        console.log(error);
    });
}

function getCartDetails()
{
    axios.get('http://localhost:3000/cart')
    .then(resposne => {
        if(resposne.status===200)
        {
            resposne.data.products.forEach(product => {
                const cartContainer= document.getElementById('cart');
                cartContainer.innerHTML= `<li>${product.description}-${product.cartItem.quantity}-${product.price}</li>`
            })
        }
        document.querySelector('#cart').style= "display: block;"
    })
    .catch(err => console.log(err));
}