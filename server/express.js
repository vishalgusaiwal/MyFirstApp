import bodyParser from 'body-parser';
import express from 'express';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import template from '../template';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import postRoutes from './routes/post.routes';
import devBundle from './devBundle';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom/server';
import MainRouter from './../client/MainRouter';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles';
import theme from './../client/theme';
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
app.get('*', (req, resp) => {
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
})
app.use((err, req, resp, next) => {
    if (err.name === 'UnauthorizedError') {
        resp.status(401).json({ success: false, error: err.name + ":" + err.message });
    } else if (err) {
        resp.status(400).json({ success: false, error: err.name + ":" + err.message });
        console.log(err);
    }
});
export default app;