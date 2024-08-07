document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-button");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-product-id");
      const cartId = button.getAttribute("data-cart-id");

      fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: "POST",
        headers: {
          // Fix `header` to `headers`
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Error adding product to cart: " + response.statusText
            );
          }
          return response.json();
        })
        .then((data) => {
          console.log("Product has been added to your cart correctly:", data);
          window.location.href = `/carts?cid=${cartId}`;
        })
        .catch((error) => {
          console.error("Error adding product to the cart:", error);
        });
    });
  });
});
