'use strict';

module.exports.init = function(config, logger, stats) {

  return {
	  
	onrequest: function(req, res, next) {
      //debug('plugin onrequest');
	  if (req.targetPath.includes("/*/")){
			let proxy = req.url.split("/");
			let target = req.targetPath.split("/");
			let number = 0;
			while (number < target.length){
				if (proxy[proxy.length-1-number] == target[target.length-1-number]){
					target[target.length-1-number]=proxy[proxy.length-1-number];
				} else if (target[target.length-1-number]=="*"){
					target[target.length-1-number]=proxy[proxy.length-1-number];
				} else {
					break;
				}
				number += 1;
			}
			req.targetPath = target.join('/')
	  }
      next();
    }
	
  };
}