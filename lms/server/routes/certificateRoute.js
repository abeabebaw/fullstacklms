import express from 'express';
import { generateCertificate, getCertificate, viewCertificate, getUserCertificates, downloadCertificatePdf } from '../controllers/certificateController.js';

const router = express.Router();

router.post('/generate', generateCertificate);
router.get('/my', getUserCertificates);
router.get('/:id/pdf', downloadCertificatePdf);
router.get('/:id', getCertificate);
router.get('/:id/view', viewCertificate);

export default router;
