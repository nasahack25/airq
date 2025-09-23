import multer from 'multer';

// Configure multer to use memory storage
// This is efficient because we're just passing the file buffer to Cloudinary
// without saving it to the server's disk.
const storage = multer.memoryStorage();

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.') as any, false);
        }
    },
});

