const logger = (req, res, next) => {
    const isStaticAsset = 
        req.originalUrl.startsWith('/uploads/') ||
        req.originalUrl.startsWith('/styles/') ||
        req.originalUrl.startsWith('/scripts/') ||
        req.originalUrl === '/favicon.ico';

    if (isStaticAsset) {
        return next();
    }

    const start = Date.now();
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    res.on('finish', () => {
        const ms = Date.now() - start;
        const status = res.statusCode;
        
        let statusColor = '\x1b[32m'; 
        if (status >= 500) statusColor = '\x1b[31m'; 
        else if (status >= 400) statusColor = '\x1b[33m'; 
        else if (status >= 300) statusColor = '\x1b[36m'; 

        const resetColor = '\x1b[0m';
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '-';
        const userId = req.user ? `[User: ${req.user._id || req.user.id}]` : '[Guest]';

        console.log(
            `[${timestamp}] ${req.method} ${req.originalUrl} ${statusColor}${status}${resetColor} - ${ms}ms ${userId} (${clientIp})`
        );
    });

    next();
};

module.exports = logger;