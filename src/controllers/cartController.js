import CartService from "../services/cartService.js";

class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  async getAllCarts() {
    try {
      return await this.cartService.getAllCarts();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching carts");
    }
  }

  async createCart() {
    try {
      const newCart = await this.cartService.createCart();
      return newCart;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error creating cart");
    }
  }

  async getProductsFromCartByID(cartId) {
    try {
      return await this.cartService.getProductsFromCartByID(cartId);
    } catch (error) {
      console.error(error.message);
      throw new Error(`Products not found in cart ${cartId}`);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      return await this.cartService.addProductToCart(
        cartId,
        productId,
        quantity
      );
    } catch (error) {
      console.error(error.message);
      throw new Error("Error adding product to cart");
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      return await this.cartService.updateProductQuantity(
        cartId,
        productId,
        quantity
      );
    } catch (error) {
      console.error(error.message);
      throw new Error("Error updating product quantity");
    }
  }

  async deleteCart(id) {
    try {
      return await this.cartService.deleteCart(id);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error deleting cart");
    }
  }

  async deleteAllProductsFromCart(cartId) {
    try {
      return await this.cartService.deleteAllProductsFromCart(cartId);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error deleting all products from cart");
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      return await this.cartService.deleteProductFromCart(cartId, productId);
    } catch (error) {
      console.error(error.message);
      throw new Error("Error deleting product from cart");
    }
  }

  async getStockFromProducts(cartId) {
    try {
      return await this.cartService.getStockFromProducts(cartId);
    } catch (error) {
      console.error(error.message);
      throw new Error(`Could not get stock from products in cart ${cartId}`);
    }
  }

  async purchaseCart(cartId) {
    try {
      const notProcessed = await this.cartService.purchaseCart(cartId);

      // Calculate total amount from the processed items in cart
      const cart = await this.cartService.getProductsFromCartByID(cartId);
      let amount = 0;
      for (const cartProduct of cart.products) {
        const product = await Product.findById(cartProduct.product._id);
        amount += product.price * cartProduct.quantity;
      }

      // Create ticket for the purchase (assuming TicketController is correctly implemented)
      const ticket = await this.ticketController.createTicket(
        req.user.email,
        amount,
        cartId
      );

      // Send response
      return {
        ticket,
        notProcessed,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error purchasing cart");
    }
  }

  async updateCartWithNotProcessed(cartId, notProcessed) {
    try {
      return await this.cartService.updateCartWithNotProcessed(
        cartId,
        notProcessed
      );
    } catch (error) {
      console.error(error);
      throw new Error("Error updating cart with not processed products");
    }
  }
}

export default CartController;
