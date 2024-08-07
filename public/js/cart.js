document.addEventListener("DOMContentLoaded", () => {
  const cartId = new URLSearchParams(window.location.search).get("cid");

  if (!cartId) {
    console.error("Cart ID is missing");
    return;
  }

  async function fetchCart() {
    try {
      const response = await fetch(`/api/carts/${cartId}`);
      const result = await response.json();
      if (result.status === "success") {
        console.log("Fetched cart data:", result.payload); // Add this line
        updateCartUI(result.payload);
      } else {
        console.error("Error fetching cart:", result.message);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }

  function updateCartUI(cartData) {
    console.log("Updating UI with cart data:", cartData); // Add this line
    // Implement UI update logic here
    // For example, iterate over cartData.products and append items to the cart UI
  }

  fetchCart();
});
