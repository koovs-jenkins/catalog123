module.exports = {
	base_url: 'http://alphagen-api.koovs.com',
	base_email_url: 'http://18.136.23.209:9096',
	proxy_api_prefix : [
		'/jarvis-home-service/*',
		'/jarvis-service/*',
		'/jarvis-order-service/*',
	],
	proxy_email_prefix : [
		'/email/*',
	],
};