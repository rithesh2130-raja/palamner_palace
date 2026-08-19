import { Router } from 'express';
import multer from 'multer';
import {
  getHealthStatus,
  generateAdvertisement,
  getAdvertisements,
  getAdvertisementById,
  editAdvertisement,
  publishAdvertisementAsReel
} from '../controllers/advertisementController.js';

const router = Router();

// Configure Multer for handling multipart/form-data image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WEBP) are allowed!'), false);
    }
  }
});

// GET /api/v1/advertisements/health
router.get('/health', getHealthStatus);

// POST /api/v1/advertisements/generate
router.post('/generate', upload.single('image'), generateAdvertisement);

// GET /api/v1/advertisements
router.get('/', getAdvertisements);

// GET /api/v1/advertisements/:id
router.get('/:id', getAdvertisementById);

// POST /api/v1/advertisements/:id/edit
router.post('/:id/edit', editAdvertisement);

// POST /api/v1/advertisements/:id/publish
router.post('/:id/publish', publishAdvertisementAsReel);

export default router;
