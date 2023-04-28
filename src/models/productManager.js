import { promises as fs } from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsPath = path.join(__dirname, '..', 'data', 'products.json');

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getAllProducts() {
    try {
      const fileContent = await fs.readFile(this.filePath, "utf-8");
      const products = JSON.parse(fileContent);
      return products;
    } catch (error) {
      console.log(`Error reading file: ${error}`);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getAllProducts();
      const product = products.find(product => product.id == id);
      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      console.log(`Error getting product by ID: ${error}`);
      throw error;
    }
  }

  async addProduct(product) {
    const {title, description, code, price, category} = product;
    if(!title || !description || !code || !price || !category){
      console.log("Required fields not added");
      throw new Error("Some of the required fields were not added");
    }
    try {
      const products = await this.getAllProducts();
      const newId = products.length + 1;
      const newProduct = {
        ...product,
        id: newId,
      };
      products.push(newProduct);
      await fs.writeFile(this.filePath, JSON.stringify(products));
      return newProduct;
    } catch (error) {
        console.log(`Error adding product: ${error}`);
        throw error;
    }
  }

  async updateProduct(id, updatedProduct) {
    if(updatedProduct.id){
      throw new Error("ID cann't be update");
    }
    try {
      const products = await this.getAllProducts();
      const productIndex = products.findIndex((product) => product.id == id);
      if (productIndex == -1) {
        throw new Error(`Product with ID ${id} not found`);
      }
      const updatedProductWithId = {
        ...updatedProduct,
        id,
      };
      products[productIndex] = updatedProductWithId;
      await fs.writeFile(this.filePath, JSON.stringify(products));
      return updatedProductWithId;
    } catch (error) {
      console.log(`Error updating product: ${error}`);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getAllProducts();
      const productIndex = products.findIndex(product => product.id == id);
      if (productIndex == -1) {
        throw new Error(`Product with ID ${id} not found`);
      }
      products.splice(productIndex, 1);
      await fs.writeFile(this.filePath, JSON.stringify(products));
      return true;
    } catch (error) {
      console.log(`Error deleting product: ${error}`);
      throw error;
    }
  }
}

const productManager = new ProductManager(productsPath);
export default productManager;