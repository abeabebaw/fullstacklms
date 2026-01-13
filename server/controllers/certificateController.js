import Certificate from '../models/Certificate.js';
import User from '../models/user.js';
import Course from '../models/Course.js';
import Progress from '../models/Progress.js';
import QuizResult from '../models/QuizResult.js';
import crypto from 'crypto';
import puppeteer from 'puppeteer';

// Generate a certificate if criteria met (completed course and score >= 50)
export const generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.body;
    let userId = null;
    try { userId = req.auth && typeof req.auth === 'function' ? req.auth().userId : null; } catch (e) { userId = null; }

    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });
    if (!courseId) return res.status(400).json({ success: false, message: 'courseId required' });
    
    // Look up latest quiz result for this course
    const latestResult = await QuizResult.findOne({ userId: String(userId), courseId }).sort({ createdAt: -1 });
    const numericScore = Number(latestResult?.scorePercent || 0);

    // ensure enrolled and progress at least 50%
    const progress = await Progress.findOne({ userId: String(userId), courseId });
    const percent = Number(progress?.progressPercent || 0);
    if (!progress || percent < 50) {
      return res.status(400).json({ success: false, message: 'Progress must be at least 50% to receive certificate' });
    }

    // check score threshold
    if (numericScore < 50) {
      return res.status(400).json({ success: false, message: 'Score must be at least 50% to receive certificate' });
    }

    // avoid duplicate certificate
    const existing = await Certificate.findOne({ userId: String(userId), courseId });
    if (existing) return res.json({ success: true, message: 'You already have a certificate for this course', alreadyIssued: true, certificate: existing });

    const certId = `cert_${crypto.randomBytes(8).toString('hex')}`;

    let cert;
    try {
      cert = await Certificate.create({ certificateId: certId, userId: String(userId), courseId, score: numericScore });
    } catch (e) {
      // Handle race condition with unique index
      if (e && e.code === 11000) {
        const existingCert = await Certificate.findOne({ userId: String(userId), courseId });
        return res.json({ success: true, message: 'You already have a certificate for this course', alreadyIssued: true, certificate: existingCert });
      }
      throw e;
    }

    // Optionally attach a certificateUrl (a simple view route) - frontend can render /api/certificate/:id/view
    cert.certificateUrl = `/api/certificate/${cert.certificateId}/view`;
    await cert.save();

    res.json({ success: true, message: 'Certificate issued', certificate: cert });
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const getCertificate = async (req, res) => {
  try {
    const { id } = req.params; // certificateId
    const cert = await Certificate.findOne({ certificateId: id });
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
    res.json({ success: true, certificate: cert });
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const getUserCertificates = async (req, res) => {
  try {
    let userId = null;
    try { userId = req.auth && typeof req.auth === 'function' ? req.auth().userId : null; } catch (e) { userId = null; }
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    const certs = await Certificate.find({ userId: String(userId) }).sort({ issuedAt: -1 });
    res.json({ success: true, certificates: certs });
  } catch (error) {
    console.error('Get user certificates error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// Simple HTML view for certificate (printable)
export const viewCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const cert = await Certificate.findOne({ certificateId: id });
    if (!cert) return res.status(404).send('Certificate not found');

    // Restrict HTML view to owners only
    let userId = null;
    try { userId = req.auth && typeof req.auth === 'function' ? req.auth().userId : null; } catch (e) { userId = null; }
    if (!userId) return res.status(401).send('Authentication required');
    if (String(cert.userId) !== String(userId)) return res.status(403).send('Not allowed to view this certificate');

    const user = await User.findById(cert.userId);
    const course = await Course.findById(cert.courseId);

    const name = user?.name || 'Student';
    const courseTitle = course?.courseTitle || 'Course';
    const dateStr = (cert.issuedAt || new Date()).toDateString();

    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Certificate</title><style>body{font-family:Arial, sans-serif;text-align:center;padding:60px} .card{border:10px solid #f0f0f0;padding:40px;border-radius:8px} h1{color:#333} .subtitle{color:#666;margin-bottom:30px;} .meta{margin-top:40px;color:#444}</style></head><body><div class="card"><h1>Certificate of Completion</h1><p class="subtitle">This certifies that</p><h2>${name}</h2><p class="subtitle">has completed the course</p><h3>${courseTitle}</h3><p class="meta">Score: ${cert.score}% • Issued: ${dateStr}</p></div></body></html>`;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('View certificate error:', error);
    res.status(500).send('Server error');
  }
}

  // Generate PDF for certificate and return as application/pdf
  export const downloadCertificatePdf = async (req, res) => {
    try {
      const { id } = req.params; // certificateId
      let userId = null;
      try { userId = req.auth && typeof req.auth === 'function' ? req.auth().userId : null; } catch (e) { userId = null; }
      if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

      const cert = await Certificate.findOne({ certificateId: id });
      if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
      if (String(cert.userId) !== String(userId)) return res.status(403).json({ success: false, message: 'Not allowed to download this certificate' });

      // Track download count; allow subsequent downloads but signal via headers
      const downloads = Number(cert.downloadCount || 0);

      // Verify course completion and minimum score
      const progress = await Progress.findOne({ userId: String(userId), courseId: cert.courseId });
      const percent = Number(progress?.progressPercent || 0);
      if (!progress || percent < 50) {
        return res.status(403).json({ success: false, message: 'Progress must be at least 50% to download' });
      }
      if (Number(cert.score || 0) < 50) {
        return res.status(403).json({ success: false, message: 'Minimum score of 50% required' });
      }

      const user = await User.findById(cert.userId);
      const course = await Course.findById(cert.courseId);

      const name = user?.name || 'Student';
      const courseTitle = course?.courseTitle || 'Course';
      const dateStr = (cert.issuedAt || new Date()).toDateString();

      const html = `<!doctype html><html><head><meta charset="utf-8"><title>Certificate</title><style>body{font-family:Arial, sans-serif;text-align:center;padding:60px} .card{border:10px solid #f0f0f0;padding:40px;border-radius:8px} h1{color:#333} .subtitle{color:#666;margin-bottom:30px;} .meta{margin-top:40px;color:#444}</style></head><body><div class="card"><h1>Certificate of Completion</h1><p class="subtitle">This certifies that</p><h2>${name}</h2><p class="subtitle">has completed the course</p><h3>${courseTitle}</h3><p class="meta">Score: ${cert.score}% • Issued: ${dateStr}</p></div></body></html>`;

      // Launch puppeteer and render the HTML to PDF
      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
      await browser.close();

      // Log size for diagnostics
      console.log(`Generated PDF for ${cert.certificateId} size=${pdfBuffer?.length || 0}`);

      if (!pdfBuffer || !pdfBuffer.length) {
        return res.status(500).json({ success: false, message: 'PDF generation produced empty result' });
      }

      // Update download count only after successful generation
      cert.downloadCount = downloads + 1;
      cert.lastDownloadedAt = new Date();
      await cert.save();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('X-Download-Count', String(cert.downloadCount));
      res.setHeader('X-Download-Notice', downloads >= 1 ? 'already-downloaded' : 'first-download');
      res.setHeader('Content-Disposition', `attachment; filename="certificate_${cert.certificateId}.pdf"`);
      res.setHeader('Content-Length', String(pdfBuffer.length));
      return res.end(pdfBuffer);
    } catch (error) {
      console.error('Download PDF error:', error);
      res.status(500).json({ success: false, message: 'Failed to generate PDF' });
    }
  }
