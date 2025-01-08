'use strict';

/*
 * Name: skip-auth
 * Descrip: Custom plugin to allow oauth bypass.
 * Processing: Inject relevant authorization header if pathsegment matches.
 * * Do not overwrite existing auth key if present
 *
 *   Path fragment selection note:
 *   Ideally we don't want to match any substring, but also must avoid processing overhead on every call.
 *   In addition, we should support wildcard patterns.
 *   Seeing that full path matching with wildcards is already handled in the Edgemicro configuration,   
 *   compromised and reduced matching to a simple includes match and expecting a path-fragment only.
 *
 * Config stanza:
 *  activate:   Toggle skip-auth functionality
 *    example: true
 *  actionpathsegment: Array of path segments to match against request path.  
 *    example:  ["/skip", "/noauth/"]
 *  authheader: Name of the header in which to place the authorisation value.  If attribute missing from config file, defaults to 'x-api-key'
 *    example:  "x-api-key"
 *  authkey:     Actual value of the auth header (client_key).   If attribute missing from config file, defaults to 'missing-real-value'
 *    example:  "neVuDvANfGF4R5C1KS5sulLIp8lNYzGC" 
 *
 *  Location:     Place ahead of the -oauth plugin in the plugin sequence.
 *  Dependency:   None
 *  Caveat:  Ensure your Edgemicro config supports at least x-api-key.  Time-based OAuth tokens are not practical here.
 *  
 *

*/


module.exports.init = function(config, logger, stats) {

	//== Initialisation (for each worker thread started )
	var idMsg = '-- SA: Skip-Auth';
	if (config.activate == true) {
		idMsg += " initialised and active";
		if (config.actionpathsegment && Array.isArray(config.actionpathsegment)) {
			idMsg  += " on paths " + config.actionpathsegment;
		}
	} else {
		idMsg += ' present but inactive.';
	}
	console.log(idMsg);

	const url = require('url');

	//== On traffic ...
	return {
	  
		onrequest: function(req, res, next) {

			//== Temp: see what we get ...
			console.log('-- SA:  Skip-Auth entered. Config is :\n', JSON.stringify(config,null,4));
			console.log('-- SA:  Skip-Auth entered. req is :\n', JSON.stringify(req.headers,null,4));
			console.log('-- SA:',config.actionpathsegment, ', typeof:', typeof config.actionpathsegment, ', isArray:', Array.isArray(config.actionpathsegment) );


			//== Check we have sufficient information to proceed
			if (config.activate == true && config.actionpathsegment && Array.isArray(config.actionpathsegment) ) {
				var path = url.parse(req.url).pathname;
				var headerName = config.hasOwnProperty("authheader") ? config.authheader : 'x-api-key';
				var headerValue = config.hasOwnProperty("authkey") ? config.authkey : 'missing-real-value';
				
				//== Don't overwrite any existing key ...
				if (req.headers[headerName]) {
					console.log('-- SA: Existing key found, skipping ....');
				} else {
					var pathMatched = false;
					//== Match each segment against the request path	
					try {
						config.actionpathsegment.forEach(function(segment) {
							if ( path.includes(segment ) ) {
								pathMatched = true;
							}
						});

					} catch (e) {
						console.log('--SA: Invalid segment :-', e.stack);
					}
					if (pathMatched) {
						console.log('--SA segment matched - injecting auth ... ', headerName, headerValue);
						//== Here's hoping we can inject first time already !
						req.headers[headerName] = headerValue;	
					} else {
						console.log('--SA: segment not matched');
					}
					
				}

			}

			//== Whaddeva, traffic must flow to next (plugin)
			next();

		}
	
	};

}
