'use strict';
module.exports.init = function(config, logger, stats) {
    return {
        onrequest: function(req, res, next) {
            if (config.activate  && (typeof config.headers !== "undefined")) {
                var forwardIp = req.headers['X-Forwarded-For'];
                console.log('--req header Ip', forwardIp);
                res.setHeader("client-ip", forwardIp);
            }
            next();
        }
    };
}