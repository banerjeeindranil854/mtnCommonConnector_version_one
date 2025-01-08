'use strict';
//var debug = require('debug')

module.exports.init = function(config, logger, stats) {

  return {
	
	ondata_response: function(req, res, data, next) {
      //debug('plugin onrequest');
	  res.removeHeader('content-encoding');
      next();
    }
	
  };
}