document.addEventListener("DOMContentLoaded", () => {
  const removeButtons = document.querySelectorAll(".remove-item");
  const clearCartButton = document.querySelector(".clear-cart-btn");
  const checkoutButton = document.querySelector(".checkout-btn");

  removeButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const productId = button.dataset.productId;
      const cartId = button.dataset.cartId;

      try {
        await fetch(`/api/cart/${cartId}/products/${productId}`, {
          method: "DELETE",
        });
        location.reload();
      } catch (error) {
        console.error("Error removing item:", error);
      }
    });
  });

  clearCartButton.addEventListener("click", async () => {
    const cartId = clearCartButton.dataset.cartId;

    try {
      await fetch(`/api/cart/${cartId}`, {
        method: "DELETE",
      });
      location.reload();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  });

  checkoutButton.addEventListener("click", async () => {
    const cartId = checkoutButton.dataset.cartId;

    try {
      await fetch(`/api/cart/${cartId}/purchase`, {
        method: "POST",
      });
      location.href = `/checkout?cartId=${cartId}`;
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  });
});
