import express, { Express } from 'express';
import userRoutes from '../routes/userRoutes';
import productRoutes from '../routes/productRoutes';

export default function (app: Express) {
	app.use(express.json());

	app.use('/api/users', userRoutes);
	app.use('/api/products', productRoutes);
}
