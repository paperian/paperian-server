const axios = require('axios');

// join test
const join_test = async () => {
	try {
		const resp = await axios.post('http://localhost:3000/auth/join', {
			email: 'jeinsong200@gmail.com',
			nick: 'jeins',
			password: 'mypassword',
		});
		console.log(resp.data);
	} catch (error) {
		console.error(error);	
	}
};
//join_test();

// secure test
const secure_test = async (accessToken) => {
	try {
		const resp = await axios.get(
			'http://localhost:3000/auth/secure_test', {
				headers: { Authorization: 'bearer ' + accessToken },	
			});
		console.log(resp.data);
	} catch (error) {
		console.error(error);	
	}
};

// profile test
const profile_test = async (accessToken) => {
	try {
		const resp = await axios.get(
			'http://localhost:3000/profile', {
				headers: { Authorization: 'bearer ' + accessToken },	
			});
		console.log(resp.data);
	} catch (error) {
		console.error(error);	
	}
};

// create post test
const create_test = async (accessToken) => {
	try {
		const resp = await axios.post(
			'http://localhost:3000/post', {
				img: 'https://via.placeholder.com/300',
				content: 'sequelize 실습중',	
			}, {
				headers: { Authorization: 'bearer ' + accessToken },
		});	
		console.log(resp.data);
	} catch (error) {
		console.error(error);
	}
};

// create binder test 
const create_binder = async (accessToken) => {
	try {
		const resp = await axios.post(
			'http://localhost:3000/binder', {
				title: 'test binder 3', 
				desc: 'description of test binder 3',
			}, {
				headers: { Authorization: 'bearer ' + accessToken },
			}
		);
		console.log(resp.data);

		// do get binders also
		const resp2 = await axios.get(
			'http://localhost:3000/binder',
			{
				headers: { Authorization: 'bearer ' + accessToken },
			});
		console.log(resp2.data);
	} catch (error) {
		console.error(error);	
	}
};

// login test
// 로그인 후 실행이 필요한 테스트는 여기에 추가한다 
const login_test = async () => {
	try {
		const resp = await axios.post('http://localhost:3000/auth/login', {
			email: 'jeinsong200@gmail.com',
			password: '1234',
		});
		console.log('token!', resp.data);
		accessToken = resp.data.accessToken;

		// Do test
		secure_test(accessToken);
		profile_test(accessToken);
		create_test(accessToken);
		create_binder(accessToken);

	} catch (error) {
		console.error(error);	
	}
};
login_test();

/*
const index_test = async () => {
	try {
		const resp = await axios.get('http://localhost:3000/');
		console.log(resp.data);
	} catch (error) {
		console.error(error);	
	}
};
index_test();
*/
