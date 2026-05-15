$(document).ready(function() {
    // Sample cars data
    const cars = [
        {
            id: 1,
            name: "Mercedes-Benz S-Class",
            price: "₹120,00,000",
            icon: "🚗",
            features: ["V8 Engine", "Leather Seats", "Sunroof", "Navigation"]
        },
        {
            id: 2,
            name: "BMW X7",
            price: "₹120,95,000",
            icon: "🚙",
            features: ["M Sport", "Panoramic Roof", "360 Camera", "Premium Sound"]
        },
        {
            id: 3,
            name: "Audi R8",
            price: "₹3,53,10,000",
            icon: "🏎️",
            features: ["V10 Engine", "Carbon Fiber", "Magnetic Ride", "Quattro"]
        },
        {
            id: 4,
            name: "Tesla Model S",
            price: "₹200,89,000",
            icon: "🔋",
            features: ["Autopilot", "0-60 in 2.4s", "450+ mi Range", "Full Self-Driving"]
        },
        {
            id: 5,
            name: "Porsche 911 Turbo",
            price: "₹,10,85,000",
            icon: "🏁",
            features: ["3.7s 0-60", "All-Wheel Drive", "Adaptive Suspension", "Ceramic Brakes"]
        },
        {
            id: 6,
            name: "Range Rover SV",
            price: "₹2,13,00,000",
            icon: "🚜",
            features: ["SV Custom", "Air Suspension", "Executive Class", "Diamond Quilted Leather"]
        }
    ];

    // Load cars on index page
    if ($('#cars-grid').length) {
        loadCars(cars);
    }

    // Navigation active state
    $('.nav-link').click(function(e) {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
    });

    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartCount() {
        $('#cart-items').text(cart.length);
    }

    function addToCart(car) {
        cart.push(car);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert('Car added to cart!');
    }

    function loadCars(carsData) {
        $('#cars-grid').empty();
        carsData.forEach(car => {
            const carHTML = `
                <div class="car-card" data-car='${JSON.stringify(car)}'>
                    <div class="car-image">${car.icon}</div>
                    <div class="car-info">
                        <h3 class="car-title">${car.name}</h3>
                        <div class="car-price">${car.price}</div>
                        <ul class="car-features">
                            ${car.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                        <button class="btn-add-to-cart" onclick="addToCart(${JSON.stringify(car)})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;
            $('#cars-grid').append(carHTML);
        });
    }

    // Initialize cart count
    updateCartCount();

    // Mobile menu toggle
    $('.hamburger').click(function() {
        $('.nav-menu').toggleClass('active');
    });

    // Smooth scrolling
    $('a[href^="#"]').click(function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 80
        }, 800);
    });

    // Load cart page if exists
    if ($('#cart-page').length) {
        loadCartPage();
    }
});

function addToCart(car) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(car);
    localStorage.setItem('cart', JSON.stringify(cart));
    $('#cart-items').text(cart.length);
    alert(`${car.name} added to cart!`);
}