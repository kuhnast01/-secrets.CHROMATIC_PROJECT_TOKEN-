import cors from 'cors';
export const corsMiddleware = cors({
    origin: [
        'http://localhost:3000', // Next.js frontend
        'http://localhost:4000', // Backend itself (for local testing)
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});
