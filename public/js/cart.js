document.addEventListener("DOMContentLoaded", () => {
  const cartId = new URLSearchParams(window.location.search).get("cid"); // Get cartId from URL

  if (!cartId) {
    console.error("Cart ID is missing");
    return;
  }

  async function fetchCart() {
    try {
      const response = await fetch(`/api/carts/${cartId}`);
      const result = await response.json();
      if (result.status === "success") {
        updateCartUI(result.payload);
      } else {
        console.error("Error fetching cart:", result.message);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }

  function updateCartUI(cartData) {
    // Update your cart UI with cartData
    console.log("Cart data:", cartData);
    // Implement UI update logic
  }

  fetchCart();
});
