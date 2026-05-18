$(document).ready(function(){

/* ================= CARS DATA ================= */

const cars = [

{

    id: 1,

    name: "Mercedes-Benz S-Class",

    price: "₹1,20,00,000",

    image:
    "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200",

    features: [
        "Luxury Interior",
        "V8 Engine",
        "Sunroof",
        "Ambient Lighting"
    ]

},

{

    id: 2,

    name: "BMW X7",

    price: "₹1,25,95,000",

    image:
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200",

    features: [
        "M Sport",
        "Panoramic Roof",
        "360 Camera",
        "Premium Audio"
    ]

},

{

    id: 3,

    name: "Audi R8",

    price: "₹3,53,10,000",

    image:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200",

    features: [
        "V10 Engine",
        "Carbon Fiber",
        "Sports Exhaust",
        "Quattro AWD"
    ]

},

{

    id: 4,

    name: "Tesla Model S",

    price: "₹2,00,89,000",

    image:
    "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200",

    features: [
        "Autopilot",
        "Electric",
        "450+ Range",
        "Futuristic Dashboard"
    ]

},

{

    id: 5,

    name: "Porsche 911 Turbo",

    price: "₹3,10,85,000",

    image:
    "https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?q=80&w=1200",

    features: [
        "Turbo Engine",
        "Sport Mode",
        "AWD",
        "Ceramic Brakes"
    ]

},

{

    id: 6,

    name: "Range Rover SV",

    price: "₹2,13,00,000",

    image:
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200",

    features: [
        "Luxury SUV",
        "Air Suspension",
        "Executive Seats",
        "Premium Leather"
    ]

}

];

/* ================= LOAD CARS ================= */

if($('#cars-grid').length){

    loadCars(cars);

}

/* ================= CART ================= */

let cart =
JSON.parse(localStorage.getItem('cart'))
|| [];

updateCartCount();

/* ================= LOAD CAR CARDS ================= */

function loadCars(carsData){

    $('#cars-grid').empty();

    carsData.forEach(function(car){

        let featuresHTML = '';

        car.features.forEach(function(feature){

            featuresHTML += `
                <li>
                    ✅ ${feature}
                </li>
            `;

        });

        const carHTML = `

        <div class="car-card">

            <img
            src="${car.image}"
            class="car-image"
            alt="${car.name}">

            <div class="car-info">

                <h3 class="car-title">

                    ${car.name}

                </h3>

                <div class="car-price">

                    ${car.price}

                </div>

                <ul class="car-features">

                    ${featuresHTML}

                </ul>

                <div class="car-buttons">

                    <button
                    class="btn-add-to-cart"
                    onclick='addToCart(${JSON.stringify(car)})'>

                        <i class="fas fa-cart-plus"></i>

                        Add To Cart

                    </button>

                    <button
                    class="btn-wishlist"
                    onclick="addWishlist()">

                        ❤️

                    </button>

                </div>

            </div>

        </div>

        `;

        $('#cars-grid').append(carHTML);

    });

}

/* ================= ADD TO CART ================= */

window.addToCart = function(car){

    cart.push(car);

    localStorage.setItem(
        'cart',
        JSON.stringify(cart)
    );

    updateCartCount();

    showNotification(
        `${car.name} added to cart`,
        'success'
    );

}

/* ================= REMOVE FROM CART ================= */

window.removeFromCart = function(index){

    cart.splice(index,1);

    localStorage.setItem(
        'cart',
        JSON.stringify(cart)
    );

    updateCartCount();

    if($('#cart-page').length){

        loadCartPage();

    }

}

/* ================= CART COUNT ================= */

function updateCartCount(){

    $('#cart-items').text(cart.length);

}

/* ================= WISHLIST ================= */

window.addWishlist = function(){

    showNotification(
        '❤️ Added To Wishlist',
        'success'
    );

}

/* ================= MOBILE MENU ================= */

$('.hamburger').click(function(){

    $('.nav-menu').toggleClass('active');

});

/* ================= SEARCH ================= */

$('#searchCar').on('keyup',function(){

    let value =
    $(this).val().toLowerCase();

    $('.car-card').filter(function(){

        $(this).toggle(

            $(this)
            .text()
            .toLowerCase()
            .indexOf(value) > -1

        );

    });

});

/* ================= QUIZ ================= */

$('#carQuizForm').submit(function(e){

    e.preventDefault();

    let budget =
    $('#budget').val();

    let type =
    $('#carType').val();

    let result = '';

    if(type === 'sports'){

        result =
        '🔥 Recommended : Porsche 911 Turbo';

    }

    else if(type === 'electric'){

        result =
        '⚡ Recommended : Tesla Model S';

    }

    else if(type === 'luxury'){

        result =
        '👑 Recommended : Mercedes S-Class';

    }

    else{

        result =
        '🚙 Recommended : BMW X7';

    }

    $('#quiz-result').html(`

        <div class="quiz-result-box">

            <h2>

                ${result}

            </h2>

            <p>

                Budget:
                ${budget}

            </p>

        </div>

    `);

});

/* ================= SMOOTH SCROLL ================= */

$('a[href^="#"]').click(function(e){

    e.preventDefault();

    $('html, body').animate({

        scrollTop:
        $($(this).attr('href')).offset().top - 80

    },800);

});

/* ================= LOAD CART PAGE ================= */

if($('#cart-page').length){

    loadCartPage();

}

/* ================= CART PAGE ================= */

window.loadCartPage = function(){

    const cartList =
    $('#cart-items-list');

    let total = 0;

    cartList.empty();

    if(cart.length === 0){

        cartList.html(`

            <div class="empty-cart">

                <h2>
                    🛒 Cart Is Empty
                </h2>

                <a href="index.html"
                class="btn-primary">

                    Continue Shopping

                </a>

            </div>

        `);

        $('#cart-total').text(0);

        return;

    }

    cart.forEach(function(car,index){

        let priceNumber =
        parseInt(
            car.price.replace(/[₹,]/g,'')
        );

        total += priceNumber;

        cartList.append(`

            <div class="cart-item">

                <div class="cart-item-info">

                    <img
                    src="${car.image}"
                    class="cart-img">

                    <div>

                        <h3>
                            ${car.name}
                        </h3>

                        <p>
                            ${car.price}
                        </p>

                    </div>

                </div>

                <button
                class="btn-wishlist"
                onclick="removeFromCart(${index})">

                    Remove

                </button>

            </div>

        `);

    });

    $('#cart-total').text(
        total.toLocaleString()
    );

}

/* ================= NOTIFICATION ================= */

function showNotification(message,type){

    const notification = `

    <div class="notification ${type}">

        ${message}

    </div>

    `;

    $('body').append(notification);

    $('.notification')
    .fadeIn();

    setTimeout(function(){

        $('.notification')
        .fadeOut(function(){

            $(this).remove();

        });

    },2500);

}

});