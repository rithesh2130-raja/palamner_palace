import { Router } from 'express';
import {
  generateAdvertisement,
  getAdvertisements,
  getAdvertisementById,
  editAdvertisement,
  publishAdvertisementAsReel
} from '../controllers/advertisementController.js';

const router = Router();

router.post('/generate', generateAdvertisement);
router.get('/', getAdvertisements);
router.get('/:id', getAdvertisementById);
router.post('/:id/edit', editAdvertisement);
router.post('/:id/publish', publishAdvertisementAsReel);

export default router;
