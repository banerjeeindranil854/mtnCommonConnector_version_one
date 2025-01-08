'use strict';

/*
 * Name: add-response-headers
 * Descrip: Custom plugin to add HTTP response headers
 *
 * Config stanza:
 *  activate:  Toggle add-response-headers functionality
 *    example: true
 *  headers: header names & values to add
 *    example:
 *      Strict-Transport-Security: 'max-age=86400 ; includeSubDomains'
 *      X-Frame-Options: 'deny, X-Frame-Options: sameorigin'
 *      X-Content-Type-Options: 'nosniff'
 *      X-XSS-Protection: '1; mode=block'
 */


// var debug = require('debug')('plugin:add-response-headers');

// required
module.exports.init = function(config, logger, stats) {

 console.log('-- SH: Security Headers plugin initialized');

  return {

    onrequest: function(req, res, next) {
      if ((config.activate == true) && (typeof config.headers !== "undefined")) {
        // console.log('-- SH: adding response headers');
        for (const [key, value] of Object.entries(config.headers)) {
          // console.log('-- SH: adding ' + key + ' header');
          res.setHeader(key, value);
        }
      }
      next();
    }

  };

}
