import { RequestHandler } from 'express';
import {
	createUser,
	findOneUser,
	hashPassword,
	matchPassword,
	validateGetUser,
	validateRegisterUser,
} from '../models/userModel';
import uniqid from 'uniqid';
import 'express-async-errors';


// @desc        Register a new user
// @route       POST /api/users
// @access      Public
export const registerUser: RequestHandler = async (req, res) => {
	const { error } = validateRegisterUser(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const { first_name, last_name, email, password, age } = req.body as {
		first_name: string;
		last_name: string;
		email: string;
		password: string;
		age: string;
	}; // Receive age in YYYY-MM-DD format

	const hashedPassword = await hashPassword(password);
	const decimalAge = new Date().getFullYear() - new Date(age).getFullYear();
	const uniqueId = uniqid();

	// Store in the databse
	await createUser(
		uniqueId,
		first_name,
		last_name,
		email,
		hashedPassword,
		decimalAge
	);

	const message = 'The user has been created successfully.';

	res.json(message);
};

// @desc        Get user info
// @route       POST /api/users/info
// @access      Public
export const getUser: RequestHandler = async (req, res) => {
	const { error } = validateGetUser(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const { id, password } = req.body as { id: string; password: string };

	let user = await findOneUser(id);

	if (user && (await matchPassword(password, user.password))) {
		user.password = '****';
		res.json(user);
	} else {
		res.status(401);
		throw new Error('Passwords are not match!');
	}
};
