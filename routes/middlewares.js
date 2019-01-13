const jwt = require('jsonwebtoken');

const { SUCCESS, ERROR } = require('./status') ;

// Generate an Access Token for the given User ID
// [TODO] req.user를 전달해 줄 수 있기 때문에, 유저가 설정한 유효기간을 설정할 수 있을 듯 
const generateAccessToken = (userId) => {
	const expiresIn = process.env.EXP;
	const audience = process.env.AUD;
	const issuer = process.env.HOST;
	const secret = process.env.JWT_SECRET;

	const token = jwt.sign({
		id: userId,
	}, secret, {
		expiresIn,
		audience,
		issuer,
		subject: userId.toString(), // 'sub'
	});

	return token;
}

// Generate the Token for the user authenticated in the request
exports.generateUserToken = (req, res)/* middleware */ => {
	const accessToken = generateAccessToken(req.user.id); 
	const { email, nick, provider } = req.user;
	res.json({ 
		status: SUCCESS,
		message: '로그인 성공, 토큰이 발급되었습니다.',
		accessToken,
		user: { email, nick, provider },
	});
}
