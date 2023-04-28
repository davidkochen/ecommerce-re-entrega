import express from 'express';
import cartManager from '../models/cartManager.js';
import productManager from '../models/productManager.js';
const router = express.Router();

//POST /api/cart
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.addCart();
    res.status(201).json(newCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
  try{
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCartByID(cartId);
    const products = await Promise.all(cart.products.map(product => productManager.getProductById(product.id)));
    if (cart) {
      res.status(200).json(products);
    } 
    else {
      res.status(404).send(`Cart with id ${productId} not found`);
    }
  }
  catch(error){
    res.status(500).json({ error: "Internal server error", "description":error.message });
  }
});


// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const cid = parseInt(req.params.cid);
    const cart = await cartManager.getCartByID(cid);
    if (!cart) {
      return res.status(419).json({ error: 'Cart not found' });
    }
    const product = cart.products.find(p => p.id == pid);
    if (product) {
       product.quantity += 1;
    } else {
      cart.products.push({ id: pid, quantity: 1 });
    }
    const updatedCart = await cartManager.updateCart(cid, cart);
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
