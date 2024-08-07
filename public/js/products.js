document.addEventListener("DOMContentLoaded", () => {
  const cartId = new URLSearchParams(window.location.search).get("cid");
  const productId = "yourProductId"; // Replace with actual product ID
  const quantity = 1;

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
