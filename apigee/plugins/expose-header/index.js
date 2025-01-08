'use strict';

// var debug = require('debug')('plugin:expose-header');

module.exports.init = function(config, logger, stats) {
  console.log('-- EH: Expose Header initialized');
  return {
    onresponse: function(req, res, next) {      
      console.log('-- EH: plugin onresponse');     
      console.log('plugin onresponse');     
      res.setHeader('header','mtnTxID')    
    next(); 
    }    
  };
}
