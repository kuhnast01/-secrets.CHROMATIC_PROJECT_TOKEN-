import jwt from 'jsonwebtoken';
export function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            const payload = (typeof user === 'object' && user !== null ? user : {});
            req.user = {
                ...payload,
                id: String(payload.id ?? ''),
            };
            next();
        });
    }
    else {
        res.sendStatus(401);
    }
}
