const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token.model');

class TokenService {
	
	generateTokens(payload) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
			expiresIn: '5s'
		});
		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
			expiresIn: '30d'
		});
		return { accessToken, refreshToken }
	};
	
	async saveToken(userId, refreshToken) {
		const tokenData = await tokenModel.findOne({ user: userId });
		
		// refresh token
		if(tokenData) {
			tokenData.refreshToken = refreshToken;
			return tokenData.save();
		}
		
		// add new token to db
		return await tokenModel.create({
			user: userId,
			refreshToken
		});
	};
	
	async removeToken(refreshToken) {
		const token = await tokenModel.deleteOne({ refreshToken });
		return token;
	}
	
	async findToken(refreshToken) {
		console.log('findToken', refreshToken);
		const tokenData = await tokenModel.findOne({ refreshToken });
		return tokenData;
	}
	
	validateAccessToken(token) {
		try {
			return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
		} catch(e) {
			return null;
		}
	}
	
	validateRefreshToken(token) {
		try {
			return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
		} catch(e) {
			return null;
		}
	}
	
}

module.exports = new TokenService();