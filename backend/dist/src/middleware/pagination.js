export function paginate(req, res, next) {
    const parsedPage = Number.parseInt(String(req.query.page ?? '1'), 10);
    const parsedLimit = Number.parseInt(String(req.query.limit ?? '20'), 10);
    req.query.page = String(Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1);
    req.query.limit = String(Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 20);
    next();
}
