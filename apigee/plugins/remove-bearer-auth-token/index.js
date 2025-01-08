'use strict';

module.exports.init = function(config, logger, stats) {

  return {
	  
	onrequest: function(req, res, next) {		
      if (config.activate) {
		
		var bearerAuth = req.headers['authorization'];
		console.log('--req header before', bearerAuth);
			if(bearerAuth){
				delete req.headers['authorization'];
				console.log('--req header after', req.headers['authorization']);
			}	
	   }	   
	   //== Traffic must flow to next (plugin)
		next();
    }
	
  };
}