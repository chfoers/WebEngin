export default {
	db: {
		uri: 'mongodb://localhost/angular-im'
	},
	server: {
		port: 8080
	},
	authentification: {
		cookieName: 'jwtToken',
		secret: 'super_angular'
	}
};