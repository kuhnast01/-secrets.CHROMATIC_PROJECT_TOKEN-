import type { NextApiRequest, NextApiResponse } from 'next';

// Example event draft handler
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Save draft logic (replace with DB integration)
    const draft = req.body;
    // Simulate success
    res.status(200).json({ success: true, draft });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
