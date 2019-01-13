const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

/**
 *	passport.authenticate('local', (authError, user, info) => {});
 *	호출시 실행되는 부분
 *	localStrategy의 로직을 passport 객체에 등록하는 듯 하다.
 */
module.exports = (passport) => {
	passport.use(new LocalStrategy({
		usernameField: 'email', // req.body.email
		passwordField: 'password', // req.body.password
	}, async (email, password, done) => { // 실제 Strategy 수행 로직
		// done 함수는 passport.authenticate의 콜백 (authError, user, info) => {}
		try {
			const exUser = await User.find({ where: { email } });	
			if (exUser) {
				const result = await bcrypt.compare(password, exUser.password);
				if (result) {
					done(null, exUser);	
				} else {
					done(null, false, { message: '비밀번호 불일치' });
				}
			} else {
				done(null, false, { message: '가입되지 않은 회원' });
			}
		} catch (error) {
			console.error(error);	
			done(error);
		}
	}));
};
