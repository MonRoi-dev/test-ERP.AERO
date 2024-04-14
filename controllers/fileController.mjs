import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const primsa = new PrismaClient();

class File {
	async create(req, res) {
		try {
			const fileData = req.file;
			const data = {
				name: fileData.filename,
				extension: path.extname(fileData.originalname),
				MIME: fileData.mimetype,
				size: fileData.size,
			};
			await primsa.file.create({ data });
			return res.status(200).json({ messsage: 'Successfuly uploaded' });
		} catch (error) {
			res.status(500).json({ error: `${error}` });
		}
	}

	async findAll(req, res) {
		try {
			const list_size = +req.query.list_size || 10;
			const page = +req.query.page || 1;
			const files = await primsa.file.findMany({
				skip: list_size * (page - 1),
				take: list_size,
			});
			if (files.length < 1)
				return res.status(404).json({ message: 'Page not found' });
			return res.status(200).json(files);
		} catch (error) {
			res.status(500).json({ error: `${error}` });
		}
	}

	async findOne(req, res) {
		try {
			const id = req.params.id;
			const file = await primsa.file.findUnique({ where: { id } });
			return res.status(200).json(file);
		} catch (error) {
			res.status(500).json({ error: `${error}` });
		}
	}

	async update(req, res) {
		try {
			const id = req.params.id;
			const fileData = req.file;
			const data = {
				name: fileData.filename,
				extension: path.extname(fileData.originalname),
				MIME: fileData.mimetype,
				size: fileData.size,
			};
			const beforeUpdate = await primsa.file.findUnique({
				where: { id },
			});
			fs.unlink(`files/${beforeUpdate.name}`, (err) => {
				if (err) return console.log(err);
			});
			const updated = await primsa.file.update({
				where: { id },
				data,
			});
			return res.status(200).json(updated);
		} catch (error) {
			res.status(500).json({ error });
		}
	}

	async delete(req, res) {
		try {
			const id = req.params.id;
			const file = await primsa.file.delete({ where: { id } });
			fs.unlink(`files/${file.name}`, (err) => {
				if (err) console.log(err);
			});
			return res
				.status(200)
				.json({ messsage: 'File deleted successfully' });
		} catch (error) {
			res.status(500).json({ error: `${error}` });
		}
	}

	async download(req, res) {
		try {
			const id = req.params.id;
			const file = await primsa.file.findUnique({ where: { id } });
			return res.download(`files/${file.name}`);
		} catch (error) {
			res.status(500).json({ error: `${error}` });
		}
	}
}

export default new File();
