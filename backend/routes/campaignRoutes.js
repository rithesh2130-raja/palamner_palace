import express from 'express';
import { getCampaigns, createCampaign } from '../controllers/campaignController.js';

const router = express.Router();

router.get('/', getCampaigns);
router.post('/', createCampaign);

export default router;
