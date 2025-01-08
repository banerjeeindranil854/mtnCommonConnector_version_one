'use strict';

const https = require('https')
const Queue = require('better-queue')
const nonameConfig = require('./conf')
const PacketPair = require('./packet-pair')
const options = nonameConfig.getBatchQueueParams()
const batchQueue = new Queue(process, options)
const nonamePluginPrefix = 'Noname Plugin'

let type = 4
let index = 0
let sourceKey = ''
let sourceVersion = ''
let engineHost = null
let enginePort = 443
let debugEnabled = false
let maxPayloadSizeBytes = 0

function log(msg) {
    console.log(`${nonamePluginPrefix}:: ${msg}`)
}

function errorLog(msg) {
    console.error(`${nonamePluginPrefix}:: ${msg}`)
}

function dlog(msg) {
    if (debugEnabled) {
        log(msg)
    }
}

function process(batch, cb) {
    dlog(`batch size: ${batch.length}`)
    const payload = JSON.stringify(batch)

    const requestOptions = {
        port: enginePort,
        host: engineHost,
        path: '/engine',
        method: 'POST',
        rejectUnauthorized: false,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': payload.length,
            Host: engineHost,
        },
    }
    requestOptions.agent = new https.Agent(requestOptions);
    
    const req = https.request(requestOptions)
    req.on('error', error => {
        log(`error sending to noname engine: ${error}`)
    })
    req.on('timeout', () => {
        log('timeout sending to noname engine')
    })
    req.on('finish', () => {
        dlog('sending to noname engine has finish!!!')
    })
    
    dlog(`sending payload to engine: ${payload.length}`)
    req.write(payload)
    req.end()
    dlog('done with batch')
    cb()
}

function proxyPortFromReq(req) {
    let parts = req.transactionContextData.host.split(":");
    if (parts?.length === 2) {
        let port = Number(parts[1])
        return !isNaN(port) ? port.toString() : "0";
    }

    return "0";
}

function sourcePortFromReq(req) {
    let parts = req.transactionContextData.remoteAddress.split(":");
    if (parts?.length > 1) {
        let port = Number(parts[parts.length - 1])
        return !isNaN(port) ? port.toString() : "0";
    }

    return "0";
}

function requestEnded(req) {
    req._packetPair.updateHttpRequest({
        "body": req._reqChunks.toString()
    });
}

// Build a Map of headers as required in Packet Pair.
function headersAsObject(res) {
    let headersString = res._header;
    let headersArray = headersString.split("\r\n").slice(1, -2)
    let headers = {}
    let headersArrOfObjects = headersArray.map((str) => {
        let parts = str.split(":")
        return {
            [parts[0].trim()]: parts[1].trim()
        }
    });
    return Object.assign(headers, ...headersArrOfObjects)
}

function responseEnded(req, res) {
    req._packetPair.updateHttpResponse({
        ts: Date.now(),
        status: res.statusCode,
        headers: headersAsObject(res),
        body: res._resChunks.toString(),
    });
}

function initState(req, res) {
    req._packetPair = new PacketPair(type, index, sourceKey, sourceVersion);
    req._packetPair.setIp(req.transactionContextData.clientIP, req.targetHostname);
    req._packetPair.setTcp(sourcePortFromReq(req), proxyPortFromReq(req));
    req._packetPair.setHttpVersion(req.httpVersion);
    req._packetPair.updateHttpRequest({
        "ts": Date.now(),
        "method": req.method,
        "url": req.url,
        "headers": req.headers,
    });
    req._reqChunks = [];
    req._reqChunksLengthBytes = 0;
    req._reqChunksMaxSizeReached = false
    
    res._resChunks = [];
    res._resChunksLengthBytes = 0;
    res._resChunksMaxSizeReached = false
}

function accumulateRequestData(req, data) {
    req._reqChunksLengthBytes += data.length
    if (req._reqChunksLengthBytes > maxPayloadSizeBytes) {
        if (!req._reqChunksMaxSizeReached) {
            req._reqChunks = [] // Request size max limit reached, clear what we collected so far.
            req._reqChunksMaxSizeReached = true
            dlog(`Request payload max size limit reached: ${req._reqChunksLengthBytes}`)
        }
    }
    if (data && data.length > 0 && !req._reqChunksMaxSizeReached) req._reqChunks.push(data);
}

function accumulateResponse(res, data) {
    res._resChunksLengthBytes += data.length
    if (res._resChunksLengthBytes > maxPayloadSizeBytes) {
        if (!res._resChunksMaxSizeReached) {
            res._resChunks = [] // Response size max limit reached, clear what we collected so far.
            res._resChunksMaxSizeReached = true
            dlog(`Response payload max size limit reached: ${res._resChunksLengthBytes}`)
        }
    }
    if (data && data.length > 0 && !res._resChunksMaxSizeReached) res._resChunks.push(data);
}

// Read configuration from MicroGateway configuration file.
function readConfig(config) {
    log(`readConfig:: reading noname-plugin configuration from edgemicro...`)

    // debug (Optional).
    debugEnabled = typeof config.debug === 'boolean' && config.debug
    dlog(`readConfig:: debug: ${debugEnabled}`)

    // index (Optional).
    index = nonameConfig.getSourceIndex()
    if (typeof config.index !== 'undefined') {
        if (isNaN(config.index) || config.index <= 0) {
            log(`readConfig:: error: index value is invalid, got: ${config.index}, using default value: ${index}`)
        } else {
            index = Number(config.index)
            log(`readConfig:: index set by config: ${index}`)
        }
    }

    // sourceKey (Optional).
    sourceKey = nonameConfig.getSourceKey()
    if (typeof config.sourceKey !== 'undefined') {
        log(`readConfig:: sourceKey set by config: ${sourceKey}`)
    }

    // sourceVersion (Optional).
    sourceVersion = nonameConfig.getSourceVersion()
    if (typeof config.sourceVersion !== 'undefined') {
        log(`readConfig:: sourceVersion set by config: ${sourceVersion}`)
    }

    // engineHost (Mandatory).
    engineHost = null
    switch (typeof config.engineHost) {
        case 'undefined':
            errorLog('readConfig:: missing engineHost parameter value, please add "engineHost" parameter to you microgateway yaml configuration.')
            break;
        case 'string':
            engineHost = config.engineHost
            log(`readConfig:: engineHost set by config: ${engineHost}`)
            break;
        default:
            errorLog(`readConfig:: invalid engineHost type: ${typeof config.engineHost} please enter a valid FQDN or IP Address string`)
    }

    // enginePort (Optional).
    enginePort = nonameConfig.getEnginePort()
    if (typeof config.enginePort !== 'undefined') {
        if (isNaN(config.enginePort) || config.enginePort <= 0) {
            log(`readConfig:: error: enginePort value is invalid, got: ${config.enginePort}, using default value: ${enginePort}`)
        } else {
            enginePort = Number(config.enginePort)
            log(`readConfig:: enginePort set by config: ${enginePort}`)
        }
    }

    // maxPayloadSizeBytes (Optional).
    maxPayloadSizeBytes = nonameConfig.getMaxPayloadSizeBytes()
    if (typeof config.maxPayloadSizeBytes !== 'undefined') {
        if (isNaN(config.maxPayloadSizeBytes) || config.maxPayloadSizeBytes <= 0) {
            log(`readConfig:: error: maxPayloadSizeBytes value is invalid, got: ${config.maxPayloadSizeBytes}, using default value: ${maxPayloadSizeBytes}`)
        } else {
            maxPayloadSizeBytes = Number(config.maxPayloadSizeBytes)
            log(`readConfig:: maxPayloadSizeBytes set by config: ${maxPayloadSizeBytes}`)
        }
    }

    log(`readConfig:: Done.`)
}

module.exports.init = function (config, logger, stats) {
    readConfig(config);

    if (engineHost === null) {
        errorLog("Unknown engineHost! Traffic is NOT being monitored, please set engineHost.  Check readme.md for more info.")
        // Return without registering any event listeners.
        return {}
    }

    return {
        onrequest: function (req, res, next) {
            initState(req, res);
            next();
        },
        
        ondata_request: function (req, res, data, next) {
            accumulateRequestData(req, data);
            next(null, data);
        },
        
        onend_request: function (req, res, data, next) {
            accumulateRequestData(req, data);
            requestEnded(req);
            next(null, data);
        },
        
        onresponse: function (req, res, data, next) {
            next();
        },
        
        onerror_request: function (req, res, err, next) {
            next();
        },
        
        ondata_response: function (req, res, data, next) {
            accumulateResponse(res, data);
            next(null, data);
        },
        
        onend_response: function (req, res, data, next) {
            accumulateResponse(res, data);
            responseEnded(req, res);
            try {
                batchQueue.push(req._packetPair.getPacket())
                .on('failed', function (err) {
                    dlog(`failed to send packet: ${err}`)
                })
            } catch (error) {
                dlog(`error trying to push item to queue`)
            }
            delete res._reqChunks;
            delete res._resChunks;
            next(null, data);
        }
    };
}