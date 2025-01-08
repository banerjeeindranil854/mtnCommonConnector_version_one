'use strict';

/*
 * Name: post-auth-channelid
 * Descrip: Custom plugin to inject header with developer email.
 *
 * Processing: Inject relevant header if authorisation claims header is present.
 * * If named attribute not found in claims array, sets x-origin-channelid to the value of x-origin-channel-id
 * * If header name not specified, defaults to "x-orign-channel-id". 
 * * If claims attribute not specified, defaults to "DisplayName".
 *
 * Config stanza:
 *  activate: Toggle post-auth-channelid functionality
 *    example: true
 *  attribute: Name of attribute, case sensitive as in "x-authorization-claims"
 *    example: partnerName  
 *  header: Name of the header in which to place the channelId
 *    example:  "x-origin-channelid"
 *
 *  Location: Place after your -oauth plugin in the plugin sequence.
 *  Dependency:  Custom edgemicro-auth proxy in Apigee Edge to retrieve App attributes and inject x-authorization-claims array
 *  
 */


module.exports.init = function(config, logger, stats) {
	//== On traffic ...
	return {
	  
		onrequest: function(req, res, next) {

			if (config.activate) {
				
				//== Extract the dev.email.
				var originChannelId = "";
				var regChannelId = "";
				var preCharged = "";
				var devMail = "";
				try {
					//== We should get a custom header with App attributes. Translate from base64.
					let buff = new Buffer.from(req.headers['x-authorization-claims'], 'base64');
					let jClaims = JSON.parse(buff.toString('ascii'));
					let attrs = jClaims.app_custom_attributes;

					delete req.headers['x-comviva-precharged'];
					delete req.headers['x-registration-channel-id'];
					delete req.headers['x-origin-channeelid'];
					delete req.headers['x-developer-email'];
					
					devMail = attrs['developer_email'] ? attrs['developer_email'] : "";
					if (devMail) {
						req.headers['x-developer-email'] = devMail;
					}

					originChannelId = attrs['partnerName'] ? attrs['partnerName'] : attrs['DisplayName'];
					if (originChannelId) {
							req.headers['x-origin-channelid'] = originChannelId;
					}

					regChannelId = attrs['regChannel'] ? attrs['regChannel'] : "";
					if (regChannelId) {
						req.headers['x-registration-channel-id'] = regChannelId;
					}

					preCharged = attrs['preCharged'] ? attrs['preCharged'] : "";
					if (preCharged) {
						req.headers['x-comviva-precharged'] = preCharged;
					}

				} catch (e) {
					console.log('post-auth-channelid error :-', e.stack);
				}
			}

			//== Traffic must flow to next (plugin)
			next();

		}
	
	};

}
