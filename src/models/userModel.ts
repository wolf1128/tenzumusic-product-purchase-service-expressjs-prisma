import uniqid from 'uniqid';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { prisma } from '../startup/db';

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

// Helper Functions:

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

// Queries

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
		where: { id: id },
	});

	return user;
};

export const findUserById = async (id: string) => {
	return await prisma.user.findFirst({
		where: { id },
	});
};

export const updateUserPurchasedProducts = async (
	userId: string,
	newPurchasedProducts: string
) => {
	return await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			purchased_products: newPurchasedProducts,
		},
	});
};

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
