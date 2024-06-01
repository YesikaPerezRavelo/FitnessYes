async function addToCart(productId, cartId) {
  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: 1 }), // You can change the quantity as needed
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
