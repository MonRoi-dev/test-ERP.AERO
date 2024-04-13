import jwt from 'jsonwebtoken';
import { updateAccessToken } from '../controllers/authController.mjs';

const blacklist = new Set();

function checkToken(req, res, next) {
	const { accessToken } = req.cookies;
	const refresh = req.signedCookies.refreshToken;
	if (!accessToken || !refresh)
		return res.status(400).json({ message: 'Provide token' });
	if (blacklist.has(accessToken))
		return res.status(401).json({ message: 'Token in black list' });
	jwt.verify(accessToken, process.env.ACCESS_SECRET, (err, decoded) => {
		if (err) {
			if (err instanceof jwt.TokenExpiredError) {
				const { accessToken, refreshToken } =
					updateAccessToken(refresh);
				res.cookie('accessToken', accessToken, {
					httpOnly: true,
				}).cookie('refreshToken', refreshToken, { httpOnly: true });
				next();
			} else {
				return res.status(400).json({ err });
			}
		}
		if (decoded) next();
	});
}

export { checkToken, blacklist };
