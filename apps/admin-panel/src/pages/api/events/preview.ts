import type { NextApiRequest, NextApiResponse } from 'next';

// Example event preview handler
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Preview logic (replace with real preview logic)
    const eventConfig = req.body;
    // Simulate preview response
    res.status(200).json({ preview: true, eventConfig });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
