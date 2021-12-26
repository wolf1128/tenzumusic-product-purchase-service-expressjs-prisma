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

export const findOneProduct = async (id: string) => {
	return await prisma.product.findFirst({
		where: { id },
	});
};

export const findAllProductsAndFilter = async (
	minPrice: number,
	maxPrice: number
) => {
	if (minPrice & maxPrice) {
		// Way#1
		// const sql = `SELECT * FROM PRODUCTS WHERE Price BETWEEN $minPrice AND $maxPrice`;
		// return await prisma.$queryRaw`${sql}`;
		// Way#2
		return await prisma.product.findMany({
			where: {
				AND: [
					{
						price: {
							gte: minPrice,
						},
					},
					{
						price: {
							lte: maxPrice,
						},
					},
				],
			},
		});
	} else if (minPrice) {
		return await prisma.product.findMany({
			where: {
				price: {
					gte: minPrice,
				},
			},
		});
	} else if (maxPrice) {
		return await prisma.product.findMany({
			where: {
				price: {
					lte: maxPrice,
				},
			},
		});
	} else {
		return await prisma.product.findMany();
	}
};

export const updateProductStock = async (
	productId: string,
	newStock: number
) => {
	return await prisma.product.update({
		where: {
			id: productId,
		},
		data: {
			stock: newStock,
		},
	});
};

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
