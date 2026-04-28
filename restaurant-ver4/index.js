//import { recipes } from './recipes.js'

let recipes = [];

let showAdded;

async function getRecipes() {
    const menuEl = document.querySelector('.menu');
    const menuLoading = document.querySelector('.menu-loading');
    menuEl.style.display = 'none';
    menuLoading.style.display = 'flex';
    try {
        const response = await fetch('./recipes.json');
        if (!response.ok) {
            menuEl.style.display = 'none';
            menuLoading.textContent = 'Failed to load the menu, try again later';
            return
        } else {
            const jsonRecipes = await response.json();
            menuLoading.style.display = 'none';
            menuEl.style.display = 'flex';
            
            recipes = jsonRecipes
                
            renderMenu(recipes);
            renderCart();
        }
    } catch (error) {
        console.error(error)
        menuEl.textContent = 'Failed to load the menu, try again later';
    }
}
getRecipes()
let addedToCart = JSON.parse(localStorage.getItem('addedToCart')) || [];
let total = 0;
const waNumber = "212XXXXXXXXX";

function renderMenu(recipes) {
    recipes.forEach(recipe => {document.querySelector(`.${recipe.category}s-recipes`).innerHTML = '';})
    recipes.forEach(recipe => {
        document.querySelector(`.${recipe.category}s-recipes`).insertAdjacentHTML('beforeend', createRecipeHTML(recipe, recipe.category))
    })
}

function createRecipeHTML(recipe, category) {
    return `
    <div class="recipe-cards ${category}">
    <img src="${recipe.img}" class="recipe-img" alt="${recipe.name}">
            <div class="recipe-card ${category}">
            <div class="recipe-name">${recipe.name}</div>
            <div class="recipe-price">${recipe.price} DH</div>
                <div class="recipe-description-container">${recipe.description}</div>
                </div>
                <div class="recipe-btn-container">
                <button class="order-from-recipe-link" data-name="${recipe.name}">
                <div class="add-to-cart-btn">Add to Cart</div>
                <img class="wha-svg" src="svgs/whatsapp-glyph-black-logo-svgrepo-com.svg">
                </button>
                </div>
                </div>
                `
            }
            
            
function deleteFromCart(btn) {
    const recipeName = btn.dataset.name;
    const targetedRecipe = addedToCart.find(recipe => recipe.name === recipeName);
    if (!targetedRecipe) return;
    targetedRecipe.quantity = 0;
    addedToCart = addedToCart.filter(recipe => recipe !== targetedRecipe);
    renderCart();
    localStorage.setItem('addedToCart', JSON.stringify(addedToCart));
}

function renderCart() {
    let totalPrice$ = 0;
    total = 0;
    const recipesDOM = document.querySelector('.to-Order-recipes');
    recipesDOM.innerHTML = '';
    if (addedToCart.length === 0) {
        document.querySelector('.order-cart-on-wa').style.display = 'none';
        document.querySelector('.total-price').style.display = 'none';
        recipesDOM.textContent = 'Your cart is empty - add something from the menu';
    } else {
        document.querySelector('.order-cart-on-wa').style.display = 'initial';
        document.querySelector('.total-price').style.display = 'initial';
        addedToCart.forEach(recipe => {
            totalPrice$ += recipe.price * recipe.quantity
            const totalRecipePrice = recipe.price * recipe.quantity;
            total += recipe.quantity;
            recipesDOM.insertAdjacentHTML('beforeend', 
                `
                <div class="added-recipe">
                <div class="added-recipe-info">
                <div class="added-recipe-quantity">${recipe.quantity}x </div>
                <div class="added-recipe-name">${recipe.name} (${recipe.price} DH) </div>
                </div>
                        <div class="added-recipe-total-price">Total: ${totalRecipePrice} DH</div>
                        <div class="remove-btn-container">
                        <button class="remove-from-cart-btn" data-name="${recipe.name}">Remove from Cart</button>
                        </div>
                        </div>
                        `
                    )
                })
                document.querySelector('.total-price').textContent = `Your Total: ${totalPrice$} DH`;
            }
            
            const badge = document.querySelector('.cart-badge');
            if (total === 0 ) {
                badge.style.display = 'none';
            } else {
                badge.style.display = 'flex';
                badge.textContent = total
            }
        }
        
function addToCart(btn) {
    clearTimeout(showAdded)
    const recipeName = btn.dataset.name;
    const targetedRecipe = recipes.find(recipe => recipe.name === recipeName);
    const isItIn = addedToCart.find(recipe => recipe.name === recipeName);
    if (!isItIn) {
        addedToCart.push({
            ...targetedRecipe, 
            quantity: 1,
        });
    } else {
        isItIn.quantity++;
    }
    renderCart()
    localStorage.setItem('addedToCart', JSON.stringify(addedToCart));
    btn.textContent = 'Added !';
    //btn.style.color = 'green';
    showAdded = setTimeout(() => {
        btn.innerHTML = '';
        btn.insertAdjacentHTML('beforeend', `<div class="add-to-cart-btn">Add to Cart</div>
            <img class="wha-svg" src="svgs/whatsapp-glyph-black-logo-svgrepo-com.svg"></img>`)
            //btn.style.color = 'white';
    }, 1000)
}
    
    
    document.querySelector('.order-cart-on-wa').addEventListener('click', () => {
        let waMessage = 'My order:\n\n'
    let totalPrice$ = 0;
    addedToCart.forEach(recipe => {
        waMessage += ` - ${recipe.quantity}x ${recipe.name} -- ${recipe.price} DH\n`;
        totalPrice$ += recipe.price * recipe.quantity;
    })
    waMessage += `\n\nTotal: ${totalPrice$} DH`;
    waMessage += `\n\nAdrn'ml'loi'''''''''ljl;ess: `;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`, "_blank")
})


document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.order-from-recipe-link');
    const DeleteBtn = e.target.closest('.remove-from-cart-btn');
    const showCartBtn = e.target.closest('.show-cart-btn');
    const closeCartBtn = e.target.closest('.close-cart-btn');
    if (addBtn) {addToCart(addBtn);}
    if (DeleteBtn) {deleteFromCart(DeleteBtn);}
    if (showCartBtn) {
        showCartBtn.style.display = 'none';
        document.querySelector('.cart').style.display = 'flex';
    }
    if (closeCartBtn) {
        document.querySelector('.show-cart-btn').style.display = 'initial';
        document.querySelector('.cart').style.display = 'none';
    }
});

let message = "Hi! I am interested to order something.";

document.querySelectorAll(".order-on-wha, .book-table, .floating-wa").forEach(btn => {
    btn.addEventListener("click", () => {
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, "_blank");
    });
});

document.querySelectorAll('.insta-btn, .floating-insta').forEach(btn => {
    btn.addEventListener('click', () => {
        window.open('https://instagram.com/moroccanfastfood', '_blank');
    });
});