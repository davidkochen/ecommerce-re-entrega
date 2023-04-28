import { promises as fs } from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cartsPath = path.join(__dirname, '..', 'data', 'carts.json');

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getAllCarts() {
    try {
      const fileContent = await fs.readFile(this.filePath, "utf-8");
      const carts = JSON.parse(fileContent);
      return carts;
    } catch (error) {
      console.log(`Error reading file: ${error}`);
      throw error;
    }
  }

  async addCart() {
    try {
      const carts = await this.getAllCarts();
      const newId = carts.length + 1;
      const newCart = {
        products: [],
        id: newId,
      };
      carts.push(newCart);
      await fs.writeFile(this.filePath, JSON.stringify(carts));
      return newCart;
    } catch (error) {
        console.log(`Error adding cart: ${error}`);
        throw error;
    }
  }

  async getCartByID(id){
    try {
      const carts = await this.getAllCarts();
      const cart = carts.find(cart => cart.id == id);
      if (!cart) {
        throw new Error(`Cart with ID ${id} not found`);
      }
      return cart;
    } catch (error) {
      //console.log(`Error getting cart by ID: ${error}`);
      throw error;
    }
  }

  async updateCart(id, updatedCart) {
    try {
      const carts = await this.getAllCarts();
      const cartIndex = carts.findIndex(cart => cart.id == id);
      if (cartIndex == -1) {
        throw new Error(`Cart ${id} not found`);
      }
      carts[cartIndex] = updatedCart;
      await fs.writeFile(this.filePath, JSON.stringify(carts));
      return updatedCart;
    } catch (error) {
      console.log(error)
      console.log(`Error updating cart: ${error}`);
      throw error;
    }
  }
}

const cartManager = new CartManager(cartsPath);
export default cartManager;