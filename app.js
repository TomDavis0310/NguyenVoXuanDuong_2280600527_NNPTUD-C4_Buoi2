// Product class để chuyển đổi JSON sang Object
class Product {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.slug = data.slug;
        this.price = data.price;
        this.description = data.description;
        this.category = data.category;
        this.images = data.images;
        this.createdAt = new Date(data.creationAt);
        this.updatedAt = new Date(data.updatedAt);
    }

    formatPrice() {
        return `$${this.price.toLocaleString()}`;
    }

    getFirstImage() {
        return this.images && this.images.length > 0 ? this.images[0] : 'https://placehold.co/600x400';
    }

    getCategoryName() {
        return this.category ? this.category.name : 'Uncategorized';
    }
}

// Chuyển đổi tất cả dữ liệu JSON sang Object
let products = productsData.map(data => new Product(data));
let filteredProducts = [...products];

// DOM Elements
const productContainer = document.getElementById('productContainer');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');
const noResults = document.getElementById('noResults');

// Lấy danh sách categories unique
function getUniqueCategories() {
    const categories = products.map(p => p.category);
    const uniqueCategories = [...new Map(categories.map(cat => [cat.id, cat])).values()];
    return uniqueCategories;
}

// Tạo options cho category filter
function populateCategoryFilter() {
    const categories = getUniqueCategories();
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categoryFilter.appendChild(option);
    });
}

// Hiển thị sản phẩm
function displayProducts(productsToDisplay) {
    productContainer.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    productsToDisplay.forEach(product => {
        const productCard = createProductCard(product);
        productContainer.appendChild(productCard);
    });
}

// Tạo card cho mỗi sản phẩm
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => showProductDetails(product);
    
    card.innerHTML = `
        <img src="${product.getFirstImage()}" alt="${product.title}" class="product-image" onerror="this.src='https://placehold.co/600x400'">
        <div class="product-content">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">${product.formatPrice()}</span>
                <span class="product-category">${product.getCategoryName()}</span>
            </div>
            <div class="product-meta">
                <span>ID: ${product.id}</span>
                <span>Slug: ${product.slug || 'N/A'}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Hiển thị chi tiết sản phẩm (có thể mở rộng)
function showProductDetails(product) {
    console.log('Product Details:', product);
    alert(`
        Sản phẩm: ${product.title}
        Giá: ${product.formatPrice()}
        Danh mục: ${product.getCategoryName()}
        Mô tả: ${product.description}
    `);
}

// Filter products
function filterProducts() {
    const selectedCategory = categoryFilter.value;
    const searchTerm = searchInput.value.toLowerCase();
    
    filteredProducts = products.filter(product => {
        const matchesCategory = !selectedCategory || product.category.id == selectedCategory;
        const matchesSearch = product.title.toLowerCase().includes(searchTerm) || 
                            product.description.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });
    
    displayProducts(filteredProducts);
}

// Event Listeners
categoryFilter.addEventListener('change', filterProducts);
searchInput.addEventListener('input', filterProducts);

// Khởi tạo
function init() {
    populateCategoryFilter();
    displayProducts(products);
    
    // In thông tin về console để kiểm tra
    console.log('Total Products:', products.length);
    console.log('Products as Objects:', products);
    console.log('Categories:', getUniqueCategories());
}

// Chạy khi DOM đã load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
