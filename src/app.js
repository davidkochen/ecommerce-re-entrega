import express from 'express';
import productRouter from './routes/products.js';
import cartRouter from './routes/carts.js';

import { __dirname } from './utils.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

const port = 8080;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
