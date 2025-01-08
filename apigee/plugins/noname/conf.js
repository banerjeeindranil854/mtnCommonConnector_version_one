// Engine config
const ENGINE_PORT = 443
const SOURCE_INDEX = 1 // Replaced on runtime.
const SOURCE_KEY = "8c0bf7e8-3675-4d87-9c55-a41fc959ab31" // Replaced on runtime.
const SOURCE_VERSION = "3.0.1" // Replaced on runtime.

// Batch queue config
const BATCH_SIZE = 100
const RETRY_DELAY = 3000
const CONCURENT = 1
const MAX_RETRIES = 0
const BATCH_DELAY = 1000

// Payload
const MAX_PAYLOAD_SIZE_BYTES = 5242880 //==5MB

class NonameConfig {
  static getSourceIndex() {
    return SOURCE_INDEX
  }

  static getSourceKey() {
    return SOURCE_KEY
  }
  
  static getSourceVersion() {
    return SOURCE_VERSION
  }
  
  static getEnginePort() {
    return ENGINE_PORT
  }

  static getMaxPayloadSizeBytes() {
    return MAX_PAYLOAD_SIZE_BYTES
  }

  static getBatchQueueParams() {
    return {
      concurrent: CONCURENT,
      batchSize: BATCH_SIZE,
      maxRetries: MAX_RETRIES,
      retryDelay: RETRY_DELAY,
      batchDelay: BATCH_DELAY,
    }
  }
}

module.exports = NonameConfig
