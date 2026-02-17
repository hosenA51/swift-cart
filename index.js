const mainContent = document.getElementById("main-content");
const productsLink = document.getElementById("products-link");
const aboutLink = document.getElementById("about-link");
const contactLink = document.getElementById("contact-link");

function setActive(link) {
    navLinks.forEach(l => l.classList.remove("active-link"));
    link.classList.add("active-link");
}

productsLink.addEventListener("click", function (e) {
    e.preventDefault();
    setActive(productsLink);
    showProductsPage();
});

aboutLink.addEventListener("click", function (e) {
    e.preventDefault();

    mainContent.innerHTML = `
        <section class="w-10/12 mx-auto my-16">
            <h1 class="text-3xl font-bold mb-8">About</h1>
            <div id="about-container" class="grid md:grid-cols-3 gap-6"></div>
        </section>
    `;

    loadAllProducts();
});

contactLink.addEventListener("click", function (e) {
    e.preventDefault();

    mainContent.innerHTML = `
        <section class="w-10/12 mx-auto my-16">
            <h1 class="text-3xl font-bold mb-8">Contact</h1>
            <div id="contact-container" class="grid md:grid-cols-3 gap-6"></div>
        </section>
    `;

    loadAllProducts();
});

document.getElementById("home-link").addEventListener("click", function (e) {
    e.preventDefault();
    location.reload();
});

const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {
    link.addEventListener("click", function () {
        navLinks.forEach(l => l.classList.remove("active-link"));
        this.classList.add("active-link");
    });
});

function showProductsPage() {

    mainContent.innerHTML = `
        <section class="w-10/12 mx-auto my-10">
            <h1 class="text-3xl font-bold mb-8 text-center">Our Products</h1>
            <div id="category-container" class="flex gap-4 flex-wrap justify-center mb-10"></div>
            <div id="product-container" class="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-6"></div>
        </section>
    `;

    loadCategories();
    loadAllProducts();
}

// Load Categories

async function loadCategories() {

    const res = await fetch("https://fakestoreapi.com/products/categories");
    const categories = await res.json();

    const container = document.getElementById("category-container");

    // All Button
    container.innerHTML = `
        <button class="btn btn-sm btn-primary category-btn active-cat rounded-full">All</button>
    `;

    categories.forEach(cat => {
        container.innerHTML += `
            <button class="btn btn-sm btn-outline category-btn rounded-full">
                ${cat}
            </button>
        `;
    });

    // Click Event
    const buttons = document.querySelectorAll(".category-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", function () {

            buttons.forEach(b => b.classList.remove("btn-primary"));
            buttons.forEach(b => b.classList.add("btn-outline"));

            this.classList.remove("btn-outline");
            this.classList.add("btn-primary");

            const category = this.textContent.trim();

            if (category === "All") {
                loadAllProducts();
            } else {
                loadProductsByCategory(category);
            }
        });
    });
}

// Load All Products

async function loadAllProducts() {

    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();

    displayProducts(data);
}

// Load Products by Category

async function loadProductsByCategory(category) {

    const res = await fetch(`https://fakestoreapi.com/products/category/${category}`);
    const data = await res.json();

    displayProducts(data);
}

// Display Products

function displayProducts(products) {

    const container = document.getElementById("product-container");
    container.innerHTML = "";

    products.forEach(product => {

        container.innerHTML += `
            <div class="card bg-base-100 shadow-md">
                
                <figure class="h-52 p-4 bg-gray-100">
                    <img src="${product.image}" class="h-full object-contain"/>
                </figure>

                <div class="card-body p-4">

                <div class="flex items-center justify-between mt-2">
                        <span class="badge capitalize text-xs bg-[#EEF2FF] text-[#4F39F6]">
                            ${product.category}
                        </span>
                        <span class="text-sm text-gray-500">
                            <span class="text-yellow-400"><i class="fa-solid fa-star"></i></span> ${product.rating.rate} (${product.rating.count})
                        </span>
                    </div>

                    <h2 class="text-md font-semibold mt-2 w-full truncate">
                        ${product.title}
                    </h2>

                    <div class="flex items-center justify-between mt-2">
                        <span class="font-bold">$${product.price}</span>
                    </div>

                    <div class="card-actions justify-between mt-4 flex">
                        <button onclick="loadProductDetail(${product.id})" class="btn btn-sm btn-outline rounded-lg flex-1"><i class="fa-solid fa-eye"></i> Details</button>
                        <button class="btn btn-sm btn-primary rounded-lg flex-1"><i class="fa-solid fa-cart-plus"></i> Add</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Display Products details Modal

const loadProductDetail = async (id) => {
    const url = `https://fakestoreapi.com/products/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayProductDetails(details);
};

const displayProductDetails = (product) => {
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `
    
        <div>
            <h2 class="text-xl font-bold mb-3">
                    ${product.title}
                </h2>

                <p class="text-gray-600 mb-4">
                    ${product.description}
                </p>

                <div class="flex items-center justify-between mb-4">
                    <span class="text-lg font-bold">
                        $${product.price}
                    </span>
                    <span class="text-yellow-500">
                        ⭐ ${product.rating.rate} (${product.rating.count})
                    </span>
                </div>

                <button class="btn btn-primary w-full">
                    Buy Now
                </button>
        </div>
    `;
    document.getElementById("product_modal").showModal();
};