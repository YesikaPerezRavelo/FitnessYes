import cartService from "../services/cartService.js";
import cartDTO from "../dao/DTOs/cartDto.js";

class cartController {
  async getAllCarts() {
    try {
      return await cartService.getAllCarts();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching carts");
    }
  }

  async createCart() {
    try {
      const newCartDTO = new cartDTO({ products: [] });
      const newCart = await cartService.createCart(newCartDTO);
      return newCart;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error creating cart");
    }
  }

  async getProductsFromCartByID(cid) {
    try {
      const cart = await cartService
        .findById(cid)
        .populate("products.product")
        .lean();
      if (!cart) throw new Error(`Cart with ID ${cid} not found`);
      return cart;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching cart products");
    }
  }

  async addProductToCart(cartid, productId, quantity = 1) {
    try {
      const cart = await cartService.addProductToCart({ _id: cartid });
      if (!cart) throw new Error(`Cart with ID ${cartid} not found`);

      console.log("Cart retrieved:", cart); // Logging the cart

      const existingProduct = cart.products.find(
        (product) => product.product.toString() === productId.toString()
      );

      console.log("Existing product:", existingProduct); // Logging the existing product

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await cart.save();
      return cart;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error adding product to cart");
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      return await cartService.updateOne(
        { _id: cartId, "products.product": productId },
        { $set: { "products.$.quantity": quantity } }
      );
    } catch (error) {
      console.error(error.message);
      throw new Error("Error updating product quantity");
    }
  }

  async deleteCart(id) {
    try {
      return await cartModel.deleteOne({ _id: id });
    } catch (error) {
      console.error(error.message);
      throw new Error("Error deleting cart");
    }
  }

  async deleteAllProductsFromCart(cartId) {
    try {
      return await cartService.findByIdAndUpdate(cartId, { products: [] });
    } catch (error) {
      console.error(error.message);
      throw new Error("Error deleting all products from cart");
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      return await cartService.findOneAndUpdate(
        { _id: cartId },
        { $pull: { products: { product: productId } } }
      );
    } catch (error) {
      console.error(error.message);
      throw new Error("Error deleting product from cart");
    }
  }
}

export default cartController;
