import { Router } from 'express';
import { validateReceiptWithPlatform, grantEntitlements, logTransaction } from '../services/purchaseService';
import { auditLogger } from '../middleware/auditLogger';
const router = Router();
// POST /shop/purchase
router.post('/purchase', auditLogger, async (req, res) => {
    const { userId, itemId, receipt } = req.body;
    try {
        // 1. Validate receipt with platform (App Store/Play)
        const receiptValid = await validateReceiptWithPlatform(receipt);
        if (!receiptValid) {
            await logTransaction({ userId, itemId, receipt, status: 'failed', reason: 'invalid_receipt' });
            return res.status(400).json({ error: 'Invalid purchase receipt.' });
        }
        // 2. Grant entitlements (currency/items)
        const grantResult = await grantEntitlements(userId, itemId);
        // 3. Log transaction
        await logTransaction({ userId, itemId, receipt, status: 'success', grantResult });
        return res.json({ success: true, grantResult });
    }
    catch (err) {
        await logTransaction({ userId, itemId, receipt, status: 'error', reason: err.message });
        return res.status(500).json({ error: 'Purchase processing failed.' });
    }
});
export default router;
