const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const jwt = require('./jwtStrategy');

module.exports = (passport) => {
	// no need to add de/serialize
	// because now we do not use session
	local(passport);
	kakao(passport);
	jwt(passport);
};
