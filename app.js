const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
require('dotenv').config(); // .env의 키들을 process.env에 넣어줌

const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');

const { sequelize } = require('./models');
const passportConfig = require('./passport'); // == ./passport/index.js

const app = express();
sequelize.sync();
passportConfig(passport);

app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false } ));
app.use(passport.initialize()); 

app.use(cors());
app.use('/auth', authRouter);
app.use('/post', postRouter);

// router 이후에는 에러 핸들링
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use((err, req, res) => {
	res.status(err.status || 500).json({
		code: err.status || 500,
		message: err.message,
	});
});

app.listen(app.get('port'), () => {
	console.log(app.get('port'), '번 포트에서 대기중');
});

