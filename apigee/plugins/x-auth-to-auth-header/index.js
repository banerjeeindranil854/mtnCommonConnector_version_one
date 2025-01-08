'use strict';
module.exports.init = function(config, logger, stats) {
    return {
        onrequest: function(req, res, next) {
            if (config.activate) {
                var xAuth = req.headers['x-authorization'];
                console.log('--req header before', xAuth);
                if(xAuth){
                    req.headers['authorization'] = xAuth;
                    delete req.headers['x-authorization'];
                    console.log('--req header after', req.headers['x-authorization']);
                }
            }
            next();
        }
    };
}