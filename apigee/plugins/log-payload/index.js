'use strict';

/*
  Based on the work of meccles here:  https://github.com/mecclesgoogle/edgemicro-log-payload
  
  This version honours configuration file settings
  activate : true false
  maskAuth : true
		Mask the x-api-key header value. 
		Extended by MosesBett to mask both 'Authorization' and 'x-authorization-claims' header values.
		Note:  Body responses are not examined.
  collapseFormatting: true 
		Courtesy of MosesBett .... Replace carriage-return and line-feed sequences with vertical bar.
		This to avoid verbosity and also as a precendent for logging to external systems such as ELK,
		... which may break a single transaction log event into multiple events. 


# edgemicro-log-payload
An Apigee Edge Microgateway plugin that logs request/response payload and headers.

**Important note:** This depends on the accumulate-request and accumulate-response plugins being enabled.
Configure this plugin between those two, like in the example below.

```
...
plugins:
    sequence:
      ...
      - accumulate-request
      - log-payload
      - accumulate-response
      ...
...
```

Note:  Being that the traffic flows top down for a request and bottom-up for a response, the order of plugins is important.
    With other plugins in the sequence, you may want to place the accumulate-response plugin as the last in the list, i.e. first to be executed on response.
	We have noticed instances of this error:  {"message":"write after end","code":"ERR_STREAM_WRITE_AFTER_END"}

*/

var os = require('os');

module.exports.init = function(config, logger, stats) {

  var plugId = "-- LP: ";
	//== Initialisation (for each worker thread started )
	var idMsg = plugId + ' Log-Payload';
	if (config.activate) {
		idMsg += " initialised and active";
		if (config.maskAuth) {
			idMsg  += ". Masking Auth headers.";
		} else {
			idMsg  += ". Not masking Auth headers.";
		}
		if (config.collapseFormatting) {
			idMsg  += ". Collapsing formatting.";
		} else {
			idMsg  += ". Not collapsing formatting.";
		}
	} else {
		idMsg += ' present but inactive.';
	}
	console.log(idMsg);
	
	
	const formatHeaders = (headers) => {
		let requestHeadersString = "";
		for(var header in headers) {
			requestHeadersString += os.EOL;
			if (config.maskAuth && ((/authorization/i).test(header) || (/x-api-key/i).test(header)) ) {
				requestHeadersString += `${header}: ***`;
			} else {
				requestHeadersString += `${header}: ${headers[header]}`;
			}		  
		}
		if (config.collapseFormatting) {
			return requestHeadersString.replace(/(\r\n|\n|\r)/gm, "|");
		} else {
			return requestHeadersString;
		}
	}


	//== On traffic ... 
	return {

		onend_request: function(req, res, data, next) {
			if (config.activate) {
				//console.log(plugId + 'log-request entered');
				if (config.collapseFormatting) {
					logger.info(`request headers: ${formatHeaders(req.headers)}`);
					if (data.length > 0) {
						logger.info(`request body: ${JSON.stringify(JSON.parse(`${os.EOL}${data}`))}`);
					} else {
						logger.info('request body: empty');
					}
				} else {
					logger.info(plugId + `log-request entered`);
					logger.info(`Request Headers: ${formatHeaders(req.headers)}`);
					logger.info(`Request payload: ${os.EOL}${data}`);
				}
			}
		  next(null, data);
		},

		onend_response: function(req, res, data, next) {
			if (config.activate) {
				//console.log(plugId + `log-response entered`);
				if (config.collapseFormatting) {
					logger.info(`response: ${formatHeaders(res.getHeaders())} "|" ${JSON.stringify(JSON.parse(`${os.EOL}${data}`))}`);
				} else {
					logger.info(plugId + `log-response entered`);
					logger.info(`Response Headers: ${formatHeaders(res.getHeaders())}`);
					logger.info(`Response payload:${os.EOL}${data}`);
				}
			}
		  next(null, data);
		},


		onerror_response: function(req, res, data, next) {
			if (config.activate) {
				if (config.collapseFormatting) {
					logger.info(`error response: ${formatHeaders(res.getHeaders())} "|" ${JSON.stringify(JSON.parse(`${os.EOL}${data}`))}`);
				} else {
					logger.info(plugId + `log-error entered`);
					logger.info(`Response Headers: ${formatHeaders(res.getHeaders())}`);
					logger.info(`Response payload:${os.EOL}${data}`);;
				}
			}
		  next(null, data);
		}	


  };
}
