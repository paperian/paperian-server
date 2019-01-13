const bcrypt = require('bcrypt');
const express = require('express');
const passport = require('passport');

const { generateUserToken } = require('./middlewares');
const { User } = require('../models');

const { SUCCESS, ERROR } = require('./status')

const router = express.Router();

router.get('/token_check', 
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		res.json({
			status: SUCCESS,
			message: 'token is valid',
			// 남은 시간도 계산해서 알려주면 좋을 듯
		});	
	});


// 회원가입
router.post('/join', async (req, res, next) => {
	const { email, nick, password } = req.body;
	try {
		const user = await User.find({ where: { email } });
		if (user) {
			return res.json({
				status: ERROR,
				message: '이미 가입된 이메일',
			});
		}
		const hash = await bcrypt.hash(password, 12); // 암호화 반복 횟수
		await User.create({
			email,
			nick,
			password: hash,
		});
		return res.json({
			status: SUCCESS,
			message: '가입 완료',
		});
	} catch (error) {
		console.error(error);
		return next(error);
	}
});


// local 로그인
router.post('/login', (req, res, next) => {
	passport.authenticate('local', (authError, user, info) => {
		if (authError) {
			console.log(authError);	
			return next(authError);
		}	
		if (!user) {
			return res.json({
				status: ERROR,
				message: info.message, 
			});
		}
		// {session:false} -> now passport do not try to serialize anything
		// google: passportjs-custom-callback-and-set-session-to-false
		return req.login(user, { session: false }, (loginError) => {
			if (loginError) {
				console.error(loginError);	
				return next(loginError);
			}	
			next();
		});
	})(req, res, next);
}, generateUserToken);


// kakao 로그인
router.get('/kakao', 
	passport.authenticate('kakao', {
		session: false,
	}));
router.get('/kakao/callback', 
	passport.authenticate('kakao', { 
		failureRedirect: '/',
		session: false,
	}), 
	generateUserToken);

// TODO: google, facebook

// TEST
router.get('/secure_test',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const { id, email, nick, provider } = req.user;
		res.json({
			status: SUCCESS,
			message: 'secure test passed',
			user: JSON.stringify({ id, email, nick, provider }),
		});	
	});

router.get('/insecure_test',
	(req, res) => {
		res.json({
			status: SUCCESS,
			message: 'insecure test passed',
		});	
	});


module.exports = router;
