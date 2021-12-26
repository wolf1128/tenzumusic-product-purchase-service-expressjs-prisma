import uniqid from 'uniqid';
import Joi from 'joi';
import { prisma } from '../startup/db';

// Types

export interface IProduct {
	id: string;
	name: string;
	stock: number;
	price: number;
	date: string;
}

// Database Queries

export const addProduct = async (
	id: string,
	name: string,
	stock: number,
	price: number
) => {
	const result = await prisma.product.create({
		data: {
			id,
			name,
			stock,
			price,
		},
	});

	return result;
};

// export const findProduct = (id: string, callback: any) => {
// 	const sql = `SELECT * FROM PRODUCTS WHERE id = $id`;
// 	database.get(sql, [id], (error, row) => {
// 		if (error) {
// 			callback(error.message);
// 		}
// 		callback(row);
// 	});
// };

// export const findAllProductsAndFilter = (
// 	minPrice: number,
// 	maxPrice: number,
// 	callback: any
// ) => {
// 	if (minPrice & maxPrice) {
// 		const sql = `SELECT * FROM PRODUCTS WHERE Price BETWEEN $minPrice AND $maxPrice`;
// 		database.all(sql, [minPrice, maxPrice], (error, products: IProduct[]) => {
// 			if (error) {
// 				callback(error.message);
// 			}
// 			callback(products);
// 		});
// 	} else if (minPrice) {
// 		const sql = `SELECT * FROM PRODUCTS WHERE Price >= $minPrice`;
// 		database.all(sql, [minPrice], (error, products: IProduct[]) => {
// 			if (error) {
// 				callback(error.message);
// 			}
// 			callback(products);
// 		});
// 	} else if (maxPrice) {
// 		const sql = `SELECT * FROM PRODUCTS WHERE Price <= $maxPrice`;
// 		database.all(sql, [maxPrice], (error, products: IProduct[]) => {
// 			if (error) {
// 				callback(error.message);
// 			}
// 			callback(products);
// 		});
// 	} else {
// 		const sql = `SELECT * FROM PRODUCTS`;
// 		database.all(sql, [], (error, products: IProduct[]) => {
// 			if (error) {
// 				callback(error.message);
// 			}
// 			callback(products);
// 		});
// 	}
// };

// export const updateProductStock = (
// 	product: string,
// 	newStock: number,
// 	callback: any
// ) => {
// 	const sql = `UPDATE PRODUCTS SET Stock=$newStock WHERE ID=$product`;
// 	database.run(sql, [newStock, product], (error: any) => {
// 		if (error) {
// 			callback(error.message);
// 		}
// 		callback();
// 	});
// };

// Validations

export function validateCreateProduct(product: IProduct) {
	const schema = Joi.object({
		name: Joi.string().required(),
		stock: Joi.number().min(0).required(),
		price: Joi.number().min(0).required(),
	});

	return schema.validate(product);
}

export function validatePurchaseProduct(purchaseInfo: {
	user: string;
	product: string;
	count: number;
}) {
	const schema = Joi.object({
		user: Joi.string().required(),
		product: Joi.string().required(),
		count: Joi.number().min(0).required(),
	});

	return schema.validate(purchaseInfo);
}
