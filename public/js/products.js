// Define the addToCart function
async function addToCart(productId, cartId) {
  try {
    const response = await fetch(`/api/cart/${cartId}/products/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: 1 }), // Adjust quantity as needed
    });

    const result = await response.json();

    if (response.ok) {
      alert("Product added to cart successfully");
    } else {
      alert(`Error adding product to cart: ${result.message}`);
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    alert("There was an error adding the product to the cart");
  }
}

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add event listeners to all add-to-cart buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const productId = button.dataset.productId;
      const cartId = button.dataset.cartId; // Assuming the cart ID is available on the button
      await addToCart(productId, cartId);
    });
  });
});
