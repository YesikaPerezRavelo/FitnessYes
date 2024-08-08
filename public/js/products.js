document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-to-cart-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = event.target.dataset.productId;
      const cartId = event.target.dataset.cartId;
      const quantity = 1; // Adjust quantity as needed

      if (!cartId) {
        console.error("Cart ID is missing");
        return;
      }

      console.log(
        `Sending request to add product ${productId} to cart ${cartId} with quantity ${quantity}`
      );

      fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Data:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });
});
