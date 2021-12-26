import uniqid from 'uniqid';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Types

export interface IUser {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	age: number;
	purchased_products: [string];
}

export const hashPassword = async (enteredPassword: string) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(enteredPassword, salt);
};

export const matchPassword = async (
	enteredPassword: string,
	password: string
) => {
	return await bcrypt.compare(enteredPassword, password);
};

export const createUser = async (
	id: string,
	first_name: string,
	last_name: string,
	email: string,
	password: string,
	age: number
) => {
	const result = await prisma.user.create({
		data: {
			id,
			first_name,
			last_name,
			email,
			password,
			age,
			purchased_products: '',
		},
	});

	return result;
};

export const findOneUser = async (id: string) => {	

	const user = await prisma.user.findFirst({
		where: { id: id }
	})

	return user;

	// const sql = `SELECT * FROM USERS WHERE ID = $id`;

	// database.get(sql, [id], async (error: any, userRow: IUser) => {
	// 	if (error) {
	// 		callback(error.message);
	// 	}

	// 	// check passwords
	// 	if (await bcrypt.compare(password, userRow.password)) {
	// 		userRow.password = '****';
	// 		callback(userRow);
	// 	} else {
	// 		callback(new Error('Passwords are not match!'));
	// 	}
	// });
};

// export const findUserById = (id: string, callback: any) => {
// 	const sql = `SELECT * FROM USERS WHERE ID = $id`;

// 	database.get(sql, [id], (error, row) => {
// 		if (error) {
// 			callback(error.message);
// 		}
// 		callback(row);
// 	});
// };

// export const updateUserPurchasedProducts = (
// 	user: string,
// 	newPurchasedProducts: string,
// 	callback: any
// ) => {
// 	const sql = `UPDATE USERS SET Purchased_products=$newPurchasedProducts WHERE ID=$user`;
// 	database.run(sql, [newPurchasedProducts, user], (error: any, row: any) => {
// 		if (error) {
// 			callback(error.message);
// 		}
// 		callback();
// 	});
// };

// Validations

export function validateRegisterUser(user: IUser) {
	const schema = Joi.object({
		first_name: Joi.string().required(),
		last_name: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(0).required(),
		age: Joi.string().required(),
	});

	return schema.validate(user);
}

export function validateGetUser(userInfo: { id: string; password: string }) {
	const schema = Joi.object({
		id: Joi.string().required(),
		password: Joi.string().min(0).required(),
	});

	return schema.validate(userInfo);
}
