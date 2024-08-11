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

      fetch(`/api/cart/${cartId}/products/${productId}`, {
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
          Swal.fire({
            title: "Success!",
            text: "Product has been added to your cart.",
            icon: "success",
            imageUrl:
              "https://yesikaperezravelo.github.io/FitnessPlanYes/img/i.webp",
            confirmButtonText: "Ok",
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire({
            title: "Error!",
            text: "An error occurred while adding the product to your cart.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        });
    });
  });
});
