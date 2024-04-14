import { body, oneOf } from 'express-validator';

export const validator = {
	auth: [
		oneOf([
			body('id', 'Should be email or phone number')
				.isEmail()
				.toLowerCase()
				.trim(),
			body('id', 'Should be email or phone number')
				.isMobilePhone()
				.toLowerCase()
				.trim(),
		]),
		body('password', 'Password is empty').notEmpty().trim(),
	],
};
