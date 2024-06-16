import cartRepository from "../repository/cartRepository.js";

export default class CartService {
  constructor() {
    this.cartRepository = new cartRepository();
  }

  async getAllCarts() {
    return await this.cartRepository.getAllCarts();
  }

  async createCart() {
    return await this.cartRepository.createCart();
  }

  async getProductsFromCartByID(cid) {
    return await this.cartRepository.getProductsFromCartByID(cid);
  }

  async addProductToCart(cartid, productId, quantity) {
    return await this.cartRepository.addProductToCart(
      cartid,
      productId,
      quantity
    );
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await this.cartRepository.updateProductQuantity(
      cartId,
      productId,
      quantity
    );
  }

  async deleteCart(id) {
    return await this.cartRepository.deleteCart(id);
  }

  async deleteAllProductsFromCart(cartId) {
    return await this.cartRepository.deleteAllProductsFromCart(cartId);
  }

  async deleteProductFromCart(cartId, productId) {
    return await this.cartRepository.deleteProductFromCart(cartId, productId);
  }

  async getStockFromProducts(cid) {
    return await this.cartRepository.getStockFromProducts(cid);
  }

  async purchaseCart(cartId) {
    try {
      const cart = await this.cartRepository.getProductsFromCartByID(cartId);

      // Check and update each product's stock
      const notProcessed = [];
      for (const cartProduct of cart.products) {
        const productId = cartProduct.product._id;
        const quantityToPurchase = cartProduct.quantity;

        // Fetch the product
        const product = await Product.findById(productId);

        // Check if the product exists and has sufficient stock
        if (!product) {
          throw new Error(`Product with ID ${productId} not found`);
        }

        if (product.stock >= quantityToPurchase) {
          // Deduct the purchased quantity from the product stock
          product.stock -= quantityToPurchase;
          await product.save();
        } else {
          // Add to notProcessed list if there's insufficient stock
          notProcessed.push({
            product: productId,
            quantity: quantityToPurchase,
          });
        }
      }

      // Return products that couldn't be processed due to insufficient stock
      return notProcessed;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error purchasing cart");
    }
  }

  async updateCartWithNotProcessed(cartId, notProcessed) {
    try {
      // Update cart with products that were not successfully processed
      return await this.cartRepository.updateCartWithNotProcessed(
        cartId,
        notProcessed
      );
    } catch (error) {
      console.error(error.message);
      throw new Error("Error updating cart with not processed products");
    }
  }
}
