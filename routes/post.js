/**
 * ref. https://codeforgeek.com/2016/01/multiple-file-upload-node-js/
 */
const AWS = require('aws-sdk');
const express = require('express');
const fs = require('fs');
const multer = require('multer'); 
const multerS3 = require('multer-s3'); 
const path = require('path');

const passport = require('passport');

const { Post, Hashtag, User } = require('../models');

const { SUCCESS, ERROR } = require('./status')

const router = express.Router();

AWS.config.update({
  "accessKeyId": process.env.S3_ACCESS_KEY_ID,
  "secretAccessKey": process.env.S3_SECRET_ACCESS_KEY,
  "region": "ap-northeast-2"
});
const s3 = new AWS.S3();

const upload = multer({
	storage: multerS3({
		s3,
		bucket: 'pprn',
		key(req, file, cb) {
			const ext = path.extname(file.originalname);	
			cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
		},
		acl: 'public-read-write',
	}),
	limits: { fileSize: 10 * 1024 * 1024 },
});

router.post('/upload-multiple-imgs', (req, res) => {
	upload.array('photos', 10)(req, res, (err) => {
		if (err && err instanceof multer.MulterError) {
			console.error('Error!', err);
			// status 500 명시할 경우 클라이언트에서 메시지를 못받네
			// 클라이언트에서 500 받을 경우 따로 처리해야해
			return res.json({
				status: ERROR,
				message: err.message, 
			});	
		}
		console.log('Success!', req.files);
		res.json({ 
			status: SUCCESS,
			message: '업로드 되었습니다',
			root: '/img/',
			files: req.files, // req.files[i].location 이 path 
		});
	});
});

// 테스트 용도의 글 생성
router.post('/', 
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const { content, img } = req.body;
		try {
			console.log('create user id', req.user.id);
			const post = await Post.create({
				content,
				img, 
				UserId: req.user.id
			})
			res.json({
				status: SUCCESS,
				message: 'post successfully created',
				post: post.get({plain: true})
			});
		} catch (error) {
			console.error(error);	
			next(error);
		}
	});

router.get('/my/',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const user = req.user;
		let posts = [];
		try {
			/*
			posts = await Post.findAll({
				where: {
					UserId: user.id,	
				}	
			});
			*/
			posts = await user.getPosts();
			return res.json({
				status: SUCCESS,
				message: 'my posts',
				posts: posts,
			});
		} catch (error) {
				console.error(error);	
				next(error);
		}
	});


const upload2 = multer();
router.post('/', upload2.none(), async (req, res, next) => {
	try {
		const post = await Post.create({
			content: req.body.content,
			img: req.body.url,
			userId: req.user.id,
		});	
		const hashtags = req.body.content.match(/#[^\s]*/g);
		if (hashtags) {
			const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({	
				where: { title: tag.slice(1).toLowerCase() },
			})));
			await post.addHashtags(result.map(r => r[0]));
		}
		res.redirect('/');
	} catch (error) {
		console.error(error);	
		next(error);
	}
});


router.get('/hashtag', async (req, res, next) => {
	const query = req.query.string;
	if (!query) {
		return res.redirect('/');	
	}
	try {
		const hashtag = await Hashtag.find({ where: { title: query } });	
		let posts = [];
		if (hashtag) {
			posts = await hashtag.getPosts({ include: [{model: User}] });	
		}
		return res.render('main', {
			title: `${query} | NodeBird`,
			user: req.user,
			twits: posts,
		});
	} catch (error) {
		console.error(error);	
		return next(error);
	}
});

module.exports = router;
