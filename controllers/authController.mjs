import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { blacklist } from '../middlewares/checkToken.mjs';

const prisma = new PrismaClient();

function generateTokens(id) {
	const accessToken = jwt.sign({ id }, process.env.ACCESS_SECRET, {
		expiresIn: '10s',
	});
	const refreshToken = jwt.sign({ id }, process.env.REFRESH_SECRET, {
		expiresIn: '7d',
	});
	return { accessToken, refreshToken };
}

class Auth {
	async signIn(req, res) {
		try {
			const { id, password } = req.body;
			const user = await prisma.user.findUnique({ where: { id } });
			if (!user)
				return res.status(404).json({ message: 'User not found' });
			const isPass = await bcrypt.compare(password, user.password);
			if (!isPass)
				return res.status(401).json({ message: 'Invalid password' });
			const { accessToken, refreshToken } = generateTokens(user.id);
			return res
				.cookie('accessToken', accessToken, { httpOnly: true })
				.cookie('refreshToken', refreshToken, { httpOnly: true })
				.status(200)
				.json({ token: accessToken });
		} catch (error) {
			res.status(500).json({ error: `${error}` });
		}
	}

	async signUp(req, res) {
		try {
			const { id, password } = req.body;
			const userExist = await prisma.user.findUnique({ where: { id } });
			if (userExist)
				return res.status(409).json({ message: 'User already exist' });
			const hashedPassword = await bcrypt.hash(password, 4);
			const user = await prisma.user.create({
				data: { id, password: hashedPassword },
			});
			const tokens = generateTokens(user.id);
			return res.status(200).json(tokens);
		} catch (error) {
			res.status(500).json({ error: `${error}` });
		}
	}

	async refresh(req, res) {
		try {
			const token = req.cookies.refreshToken;
			const { accessToken, refreshToken } = this.updateAccessToken(token);
			return res
				.cookie('accessToken', accessToken, {
					httpOnly: true,
				})
				.cookie('refreshToken', refreshToken, {
					httpOnly: true,
				})
				.status(200)
				.json({ token: accessToken });
		} catch (error) {
			res.status(500).json({ error: `${error}` });
		}
	}

	info(req, res) {
		try {
			const accessToken = req.cookies.accessToken;
			jwt.verify(
				accessToken,
				process.env.ACCESS_SECRET,
				(err, decoded) => {
					if (err) return res.status(500).json({ error: `${err}` });
					return res.status(200).json({ id: decoded.id });
				}
			);
		} catch (error) {
			res.status(500).json({ error: `${error}` });
		}
	}

	async logOut(req, res) {
		try {
			const accessToken = req.cookies.accessToken;
			blacklist.add(accessToken);
			return res
				.clearCookie('accessToken')
				.clearCookie('refreshToken')
				.status(200)
				.json({ message: 'Logged out' });
		} catch (error) {
			res.status(500).json({ error: `${error}` });
		}
	}

	async updateAccessToken(refreshToken) {
		try {
			const decoded = jwt.verify(
				refreshToken,
				process.env.REFRESH_SECRET
			);
			return generateTokens(decoded.id);
		} catch (error) {
			console.log(error);
		}
	}
}

export default new Auth();
