import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function generateTokens(id) {
	const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '10m',
	});
	const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '7d',
	});
	return { accessToken, refreshToken };
}

async function updateRefreshToken(id, refreshToken) {
	const hashedRefreshToken = bcrypt.hash(refreshToken);
	await prisma.user.update({
		where: { id },
		data: { refreshToken: hashedRefreshToken },
	});
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
			await updateRefreshToken(user.id, refreshToken);
			return res.status(200).json({ token: accessToken });
		} catch (error) {
			return res.status(500).json({ error: `Server error: ${error}` });
		}
	}

	async signUp(req, res) {
		try {
			const { id, password } = req.body;
			const userExist = await prisma.user.findUnique({ where: id });
			if (userExist)
				res.status(409).json({ message: 'User already exist' });
			const hashedPassword = await bcrypt.hash(password, 4);
			const user = await prisma.user.create({
				data: { id, password: hashedPassword },
			});
			const tokens = await generateTokens(user.id);
			await updateRefreshToken(user.id, tokens.refreshToken);
			return res.status(200).json(tokens);
		} catch (error) {
			return res.status(500).json({ error: `Server error: ${error}` });
		}
	}

	async refresh(req, res) {
		try {
			const { id, refreshToken } = req.body;
		} catch (error) {
			return res.status(500).json({ error: `Server error: ${error}` });
		}
	}
}

export default new Auth();
