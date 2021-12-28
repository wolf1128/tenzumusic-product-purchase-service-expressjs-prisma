import { RequestHandler } from 'express';
import {
	addProduct,
	findAllProductsAndFilter,
	findOneProduct,
	updateProductStock,
	// findProduct,
	// updateProductStock,
	validateCreateProduct,
	validatePurchaseProduct,
} from '../models/productModel';
import // findUser,
// findUserById,
// updateUserPurchasedProducts,
'../models/userModel';
import 'express-async-errors';
import uniqid from 'uniqid';
import { findUserById, updateUserPurchasedProducts } from '../models/userModel';

// // @desc        Create a new product
// // @route       POST /api/products
// // @access      Public
export const createProduct: RequestHandler = async (req, res) => {
	const { error } = validateCreateProduct(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const { name, stock, price } = req.body as {
		name: string;
		stock: number;
		price: number;
	};
	const id = uniqid();

	await addProduct(id, name, stock, price);

	const message = 'The Product has been created successfully.';

	res.status(201).send(message);
};

// // @desc        Get product info
// // @route       GET /api/products/:id
// // @access      Public
export const getProduct: RequestHandler<{ id: string }> = async (req, res) => {
	const productId = req.params.id;

	const product = await findOneProduct(productId);

	res.json(product);
};

// // @desc        Get all products info
// // @route       GET /api/products?minPrice=xx&maxPrice=xx
// // @access      Public
export const getProducts: RequestHandler<
	any,
	any,
	any,
	{
		minPrice: string;
		maxPrice: string;
	}
> = async (req, res) => {
	const { minPrice, maxPrice } = req.query;

	const users = await findAllProductsAndFilter(
		parseInt(minPrice),
		parseInt(maxPrice)
	);

	res.json(users);
};

// // @desc        Purchase product
// // @route       PUT /api/products/purchase
// // @access      Public
export const purchaseProduct: RequestHandler = async (req, res) => {
	const { error } = validatePurchaseProduct(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const {
		user: userId,
		product: productId,
		count,
	}: { user: string; product: string; count: number } = req.body;

	let totalPrice: number;

	// (1) Find the product
	const product = await findOneProduct(productId);
	if (product) {
		if (product.stock < count) {
			res.status(500).send({
				message_fa: 'متاسفیم!تعداد درخواست بیشتر از موجودی است!',
				message_en: 'Sorry! Order count is greather than the stock!',
			});
		} else {
			// (2) Update product stock
			const newStock = product.stock - count;
			totalPrice = product.price * count;

			await updateProductStock(productId, newStock);

			// (3) Find the User
			const user = await findUserById(userId);
			if (user) {
				let userProducts = !user.purchased_products
					? null
					: user.purchased_products;

				// Convert string to array (SQLite constraint) | ['1234', '567', '89']
				let purchasedProducts = [];
				if (userProducts) {
					purchasedProducts = userProducts
						.split("'")
						.filter((p: string) => p !== '[' && p !== ']' && p !== ', ');

					purchasedProducts.push(product.id);
				} else {
					purchasedProducts = new Array(product.id);
				}

				// Convert back to string
				let updatedPurchasedProducts = purchasedProducts.toString();

				// (4) Update user Purchased Products
				await updateUserPurchasedProducts(userId, updatedPurchasedProducts);

				res.json({
					successMessage_fa: 'با تشکر از خرید شما!',
					successMessage_en: 'Thanks for purchasing from us!',
					totalPrice,
				});
			} else {
				res.status(404);
				throw new Error('User not found!');
			}
		}
	} else {
		res.status(404);
		throw new Error('Product not found!');
	}
};
