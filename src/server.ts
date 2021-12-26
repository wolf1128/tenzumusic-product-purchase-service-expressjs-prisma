import express from 'express';
import routes from './startup/routes';
import config from './startup/config';

const app = express();

config();
routes(app);

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
	console.log(
		`Server running in ${process.env.NODE_ENV} mode, listening on ${port}...`
	)
);

export default server;
