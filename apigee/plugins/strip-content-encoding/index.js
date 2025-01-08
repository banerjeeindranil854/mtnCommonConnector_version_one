'use strict';

/*
 * Name: strip-content-encoding
 * Descrip: Custom plugin to remove the content-encoding header due to errant Eswatini CIS backend response.
 *
 * **Errancy note:**
 *   Eswatini CIS sends 'content-encoding' : 'utf8' which is invalid as per RFC7231 and RFC7694.
 *   ... should be gzip, deflate, br.
 *   Apigee sees this as a carefully-crafted penetration attempt and therefor responds with HTTP 415 Unsupported Media Type.
 *   {
 *     "fault": {
 *         "faultstring": "Unsupported Encoding \"UTF-8\"",
 *         "detail": {
 *             "errorcode": "protocol.http.UnsupportedEncoding"
 *         }
 *     }
 *   }
 *
 * Config stanza:
 *  activate:   Toggle strip-content-encoding functionality
 *    example: true
 *  actionpaths: Array of paths to match against the FULL request path.  This allows only certain requests to be corrected.  
 *    example:  ["/eswatini/system/cis", "/something/else"]
 *
 *  Caveat:  The proxy basepath must be included along with the path-fix levels, i.e. 
 *    -  /eswatini/system/cis/cisBusiness/service/fulfillmentService
 *
*/

const url = require('url');


module.exports.init = function(config, logger, stats) {

    var plugId = "-- SCE: ";
	//== Initialisation (for each worker thread started )
	var idMsg = plugId + ' Strip-Content-Encoding';
	if (config.activate) {
		idMsg += " initialised and active";
		if (config.actionpaths && Array.isArray(config.actionpaths)) {
			idMsg  += " on paths " + config.actionpaths;
		}
	} else {
		idMsg += ' present but inactive.';
	}
	console.log(idMsg);
	
	//== On traffic
	return {
	
		//== Events.
		//==  Originally this was placed on the "ondata_response"
		//==  According to doc, this should rather be "onresponse", BUT IT DOESN'T WORK properly
		//==    Although the code executes, the header is not removed. !
		//==    So going back to original, not ... onresponse: function(req, res, data, next) {
		ondata_response: function(req, res, data, next) {	
			
			//== Check we have sufficient information to proceed
			if (config.activate == true && config.actionpaths && Array.isArray(config.actionpaths) ) {

				//== check the request path that was called.  ( Yes this is the response section :) )
				var reqpath = url.parse(req.url).pathname;
				//console.log(plugId +'Checking :-', reqpath );
				var pathMatched = false;
				//== Match each path against the request path	
				try {
					config.actionpaths.forEach(function(path) {
						//console.log(plugId +'against :-', path );
						if ( reqpath == path ) {
							//console.log(plugId +' matched' );
							pathMatched = true;
						}
					});

				} catch (e) {
					//console.log(plugId +'Invalid segment :-', e.stack);
				}
				if (pathMatched) {
					//== Here's hoping we can inject first time already !
					//res.setHeader('gottit', 'we found one');	
					console.log(plugId +' removing content-encoding header' );
					res.removeHeader('content-encoding');
				}

				
				//== Traffic must flow to next (plugin)
				next();		
			}			
		}
	
	};

}
