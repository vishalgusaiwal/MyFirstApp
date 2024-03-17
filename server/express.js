const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const template = require('../template');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const devBundle = require('./devBundle');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { StaticRouter } = require('react-router-dom/server');
const MainRouter = require('./../client/MainRouter');
const { ServerStyleSheets, ThemeProvider } = require('@material-ui/styles');
const theme = require('./../client/theme');
const CURRENT_WORKING_DIR = process.cwd();

const app = express();
devBundle.compile(app);
/*...configure express...*/
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors({
    origin: ["https://deploy-mern-1whq.vercel.app"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));
app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', postRoutes);
/*app.get('/', (req, resp) => {
    resp.status(200).send(template());
});*/
/*app.get('*', (req, resp) => {
    const sheets = new ServerStyleSheets();
    const context = {};
    const markup = ReactDOMServer.renderToString(
        sheets.collect(
            <StaticRouter location={req.url} context={context}>
                <ThemeProvider theme={theme}>
                    <MainRouter />
                </ThemeProvider>
            </StaticRouter>
        )
    );
    if (context.url) {
        return resp.redirect(303, context.url);
    }
    const css = sheets.toString();
    const data = {
        markup: markup,
        css: css
    };
    resp.status(200).send(template(data));
});*/
app.use((err, req, resp, next) => {
    if (err.name === 'UnauthorizedError') {
        resp.status(401).json({ success: false, error: err.name + ":" + err.message });
    } else if (err) {
        resp.status(400).json({ success: false, error: err.name + ":" + err.message });
        console.log(err);
    }
});
export default app;