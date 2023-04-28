import express from 'express';
import productManager from '../models/productManager.js';

const router = express.Router();

// GET /api/products/
router.get('/', async (req, res) => {
  try{
    const { limit } = req.query;
    const products = await productManager.getAllProducts();
    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit));
      res.status(200).json(limitedProducts);
    }
    else{
      res.status(200).json(products);
    }
  }
  catch(error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  try{
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    if (product) {
      res.status(200).json(product);
    } 
    else {
      res.status(404).send(`Product with id ${productId} not found`);
    }
  }
  catch(error){
    res.status(500).json({ error: "Internal server error", "description":error.message });
  }
});



// POST /api/products/
router.post('/', async (req, res) => {
  try{
    const {title, description, code, price, status = true, category, thumbnails} = req.body;
    if(!title || !description || !code || !price || !category){
      res.status(400).json({ error: "Some of the required fields were not added"});
      return;
    }
    const newProduct = { title, description, code, price, status, category, thumbnails};
    const product = await productManager.addProduct(newProduct);
    res.status(201).json(product)
  }
  catch(error){
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  const toUpdateProduct = req.body;
  if(toUpdateProduct.id){
    res.status(400).json({ error: "ID cann't be update"});
  }
  try{
    const updateProduct = await productManager.updateProduct(productId, toUpdateProduct);
    res.status(201).json(updateProduct);
  }
  catch(error){
    res.status(500).json({ error: "Internal server error" });
  }
});

//DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  const pid = req.params.pid;
  try{
    const wasDeleted = await productManager.deleteProduct(pid);
    res.status(201).json({"wasDeleted": wasDeleted});
  }
  catch(error){
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
