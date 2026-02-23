"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
// Dummy user for demonstration
// Password is 'admin123' (bcrypt hash generated for this password)
const users = [
    { id: 1, username: 'admin', password: '$2b$10$DGzamxvGNaV0pNGw88LgfOraFwiCUEeaTUcVDwo7.S/HY1wWDbrsy', role: 'admin' },
];
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user)
        return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcryptjs_1.default.compare(password, user.password);
    if (!valid)
        return res.status(401).json({ message: 'Invalid credentials' });
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});
exports.default = router;
