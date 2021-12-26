import dotenv from 'dotenv';

dotenv.config();

export default function () {
	if (!process.env.JWT_SECRET) {
		throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
	}
}
