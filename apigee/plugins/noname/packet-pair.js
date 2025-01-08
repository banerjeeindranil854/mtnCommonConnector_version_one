const nonameConfig = require('./conf')

const emptyPacket = ((type, index, sourceKey, sourceVersion) => {
  return {
    source: {
      type: type,
      index: index,
      key: sourceKey,
      version: sourceVersion
    },
    ip: {
      "v": "1",
      "src": "",
      "dst": ""
    },
    tcp: {
      "src": "",
      "dst": ""
    },
    http: {
      "v": "",
      "request": {
        "ts": 0,
        "method": "",
        "url": "",
        "headers": {},
        "body": "",
        "err": {}
      },
      "response": {
        "ts": 0,
        "status": 0,
        "headers": {},
        "body": "",
        "err": {}
      }
    }
  }
});

class PacketPair {
  constructor(type, index, sourceKey, sourceVersion) {
    this._packetPair = {...emptyPacket(type, index, sourceKey, sourceVersion)};
  }

  // set ip src/dst addresses.
  setIp(src, dst) {
    this._packetPair.ip.src = src;
    this._packetPair.ip.dst = dst;
  }

  // set tcp src/dst ports.
  setTcp(src, dst) {
    this._packetPair.tcp.src = src;
    this._packetPair.tcp.dst = dst;
  }

  // version should be in the form of "1.1" etc...
  setHttpVersion(version) {
    this._packetPair.http.v = `HTTP/${version}`
  }

  // merge "req" object with data that was already added to the packet pair http request.
  updateHttpRequest(req) {
    Object.assign(this._packetPair.http.request, req)
  }

  // merge "res" object with data that was already added to the packet pair http response.
  updateHttpResponse(res) {
    Object.assign(this._packetPair.http.response, res)
  }
  
  // get complete packet pair object.
  getPacket() {
    return {
      source: this._packetPair.source,
      ip: this._packetPair.ip,
      tcp: this._packetPair.tcp,
      http: this._packetPair.http
    }
  }
}

module.exports = PacketPair