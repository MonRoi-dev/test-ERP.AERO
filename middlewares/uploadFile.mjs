import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'files');
	},
	filename: function (req, file, cb) {
		cb(
			null,
			path
				.basename(file.originalname, path.extname(file.originalname))
				.trim() +
				Date.now() +
				path.extname(file.originalname)
		);
	},
});
const upload = multer({ storage: storage });

export default upload.single('file');
