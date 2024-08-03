$(document).ready(function () {
  $(".add-to-cart-button").click(function () {
    const productId = $(this).data("product-id");
    const cartId = $(this).data("cart-id");

    $.ajax({
      type: "POST",
      url: `/api/cart/${cartId}/products/${productId}`,
      contentType: "application/json",
      success: function (response) {
        console.log("Product added to cart successfully:", response);
        window.location.href = `/cart?cid=${cartId}`; // Redirect to cart page
      },
      error: function (xhr, status, error) {
        console.error("Error adding product to cart:", error);
      },
    });
  });
});
