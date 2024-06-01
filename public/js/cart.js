// cart.js

// Establish socket connection
const socket = io();

// Function to fetch cart data from the server and render it
const renderCart = async () => {
  try {
    const cartId = document.querySelector(".add-to-cart-button").dataset.cartId;
    const response = await fetch(`/api/carts/${cartId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch cart data");
    }
    const cart = await response.json();

    // Render the cart HTML using the received data
    // Code to dynamically update the cart HTML
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
};

// Function to handle adding items to the cart
const addToCart = async (productId, cartId, quantity = 1) => {
  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) {
      throw new Error("Failed to add item to cart");
    }
    // Refresh the cart after adding item
    renderCart();
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
};

// Function to initialize cart functionality
const initCart = () => {
  // Call renderCart() to render cart data initially
  renderCart();

  // Add event listener to handle adding items to cart
  const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const cartId = button.dataset.cartId;
      addToCart(productId, cartId);
    });
  });

  // Socket.io event listeners for real-time updates
  socket.on("cart_updated", () => {
    renderCart();
  });
};

// Call initCart() when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initCart);
