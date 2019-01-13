const KakaoStrategy = require('passport-kakao').Strategy;

const { User } = require('../models');

module.exports = (passport) => {
	passport.use(new KakaoStrategy({
		clientID: process.env.KAKAO_ID,
		callbackURL: '/auth/kakao/callback', 
	}, async (accessToken, refreshToken, profile, done) => {
		try {
			const exUser = await User.find({ where: { snsId: profile.id, provider: 'kakao' } });	
			if (exUser) {
				done(null, exUser);	
			} else {
				console.log('profile', profile);
				const newUser = await User.create({
					nick: profile.displayName,
					snsId: profile.id,
					provider: 'kakao',
				});	
				done(null, newUser);
			}
		} catch (error) {
			console.error(error);	
			done(error);
		}	
	}));
};
