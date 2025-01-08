'use strict';

/*
 * Name: log-authclaims
 * Descrip: Custom plugin to log information obtained by edgemicro-custom-auth
 *
 * Processing: Extract relevant authorisation claim attributes and log them
 *
 * Config stanza:
 *  activate: Toggle log-authclaims functionality
 *    example: true
 *  format: In what format should the data be logged:
 *    valid values: json, pipe
 *    default: pipe
 *  alsojson: If format isn't JSON, also log JSON data (handy for debugging)
 *    default: false
 *
 *  Location: Place after your -oauth plugin in the plugin sequence.
 *  Dependency:  Custom edgemicro-auth proxy in Apigee Edge to retrieve App attributes and inject x-authorization-claims array
 *
 */


module.exports.init = function(config, logger, stats) {

	//== Initialisation (for each worker thread started )
	var plugId = '-- AUTHLOG: ';
	var idMsg = plugId + 'Log Custom Auth Claims';

	var idDefault;
	var idHeader;
	var idAttribname;
	let format = 'pipe';
	if (config.format) {
		format = config.format;
	}
	if ((format != 'json') && (format != 'pipe')) {
		logger.info(plugId + 'Invalid format "' + format + '" - defaulting to "pipe"');
		format = 'pipe';
	}
	if (config.activate) {
		idMsg += ' initialised and active - using format ' + format;
	} else {
		idMsg += ' present but inactive - using format' + format;
	}
	logger.info(idMsg);

	const url = require('url');


	//== On traffic ...
	return {

		// onend_request: function(req, res, next)
		onresponse: function(req, res, next) {

			if (config.activate) {

				// logger.info(plugId + 'entering onresponse handler');

				//== Extract x-authorization-claims
				var xAuth = '';
				var jClaims = '';
				var now = new Date;
				var jResult = {
						'time': {
							'ms': now.getTime(),
							'iso8601': now.toISOString()
						},
						'url': url.parse(req.url).pathname,
						'statusCode': res.statusCode,
						'transactionId': null,
						'developer_email': null,
						'app_custom_attributes': {}
					};
				if (req.headers['transactionid']) {
					jResult['transactionId'] = req.headers['transactionid'];
				}
				if (req.headers['x-authorization-claims']) {
					logger.info(plugId + 'x-authorization-claims: [' + req.headers['x-authorization-claims'] + ']');
					try {
						//== We should get a custom header with App attributes. Translate from base64.
						xAuth = new Buffer.from(req.headers['x-authorization-claims'], 'base64');
					} catch (e) {
						logger.info(plugId + 'x-authorization-claims General error :-', e.stack);
					}
				} else {
					logger.info(plugId + 'x-authorization-claims header not found');
				}
				if (xAuth) {
					//== Extract JWT Token
					// logger.info(plugId + 'extracting JWT');
					try {
						jClaims = JSON.parse(xAuth.toString('ascii'));
						logger.info(plugId + 'JWT detail:' + JSON.stringify(jClaims));
					} catch (e) {
						logger.info(plugId + 'JWT General error :-', e.stack);
					}
				}

				//== Extract the dev.email
				if (jClaims) {
					if (jClaims['developer_email']) {
						logger.info(plugId + 'developer_email = ' + jClaims['developer_email']);
						jResult['developer_email'] = jClaims['developer_email'];
					} else {
						logger.info(plugId + 'developer_email not found');
					}
				}

				//== Extract app_custom_attributes
				if (jClaims) {
					if (jClaims['app_custom_attributes']) {
						jResult['app_custom_attributes'] = jClaims['app_custom_attributes'];
						if (jClaims['app_custom_attributes']['DisplayName']) {
							logger.info(plugId + 'app_custom_attributes.DisplayName = ' + jClaims['app_custom_attributes']['DisplayName'])
						} else {
							logger.info(plugId + 'app_custom_attributes.DisplayName not found')
						}
					} else {
						logger.info(plugId + 'app_custom_attributes not found')
					}
				}
				if (format == 'json') {
					logger.info(plugId + 'LOGDATA/JSON: ' + JSON.stringify(jResult));
				} else if (format == 'pipe') {
					let appname1 = (jResult['app_custom_attributes']['DisplayName'] ?  jResult['app_custom_attributes']['DisplayName'] : '');
					let appname = appname1.replace(/ /g, '_');
					logger.info(plugId + 'LOGDATA/PIPE: ' + jResult.transactionId + '|' + jResult.transactionId + '|' + jResult.time.iso8601 + '|' + appname + jResult.url);
					if (config.alsojson) {
						logger.info(plugId + 'LOGDATA/JSON: ' + JSON.stringify(jResult));
					}
				}
			}

			//== Traffic must flow to next (plugin)
			next();

		}

	};

}
