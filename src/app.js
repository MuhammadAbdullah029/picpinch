const express = require('express');

const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('./middlewares/flash.middleware');

const routes = require('./routes/index');
const viewsRoutes = require('./routes/views.routes');
const logger = require('./middlewares/logger.middleware');
const { node_env, session_secret } = require('./config/config');

const app = express();
const useSecureCookies = node_env === 'production' && process.env.SESSION_SECURE !== 'false';

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.use(logger);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwd(), 'public')));

app.use(session({
    secret: session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: useSecureCookies,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

app.use(flash);

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

app.use('/api/v1', routes);
app.use('/picpinch', viewsRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptimeSeconds: Math.floor(process.uptime())
    });
});

app.use((req, res) => {
    req.flash('error_msg', 'The requested page does not exist.');
    res.redirect('/picpinch/');
});

module.exports = app;