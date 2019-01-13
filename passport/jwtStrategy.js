const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { User } = require('../models');

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    issuer: process.env.HOST, 
    audience: process.env.AUD, 
};

module.exports = (passport) => {
	passport.use(new JwtStrategy(
		jwtOptions, 
		async (payload, done) => {
			try {
				const user = await User.find({ where: { id: parseInt(payload.sub) } });
				if (user) {
					return done(null, user, payload);
				}
				return done(null, false); // done()
			} catch (error) {
				return done(error, false);	
			}
		}),
	);
};
