# noname-plugin
## Setup
### My MicroGateway runs on a Linux host
1. Locate your edgemicro plugin folder by running:  
    ``pluginsFolder=`npm config get prefix`/lib/node_modules/edgemicro/plugins``
2. Create a folder for the noname-plugin: `mkdir $pluginsFolder/noname-plugin`
3. Copy the contents of the tar file downloaded from noname platform into plugins folder:  
    cp extractedFolder/* $pluginsFolder/noname-plugin/
4. The plugin folder should now have files directly inside it, for example `.../plugins/noname-plugin/index.js`
5. Configure microgateway to enable noname-plugin and required parameters by adding the following section into your microgateway yaml configuration file:
---
**NOTE**

Plugins are executed in the order they appear in this list.  For more info: https://docs.apigee.com/api-platform/microgateway/3.3.x/use-plugins#addingandconfiguringplugins

---
```
noname-plugin:
  engineHost: string:<noname-engine-host> (Mandatory, a list of configured engines can be found using the noname platform)
  enginePort: number:<noname-engine-port> (Optional, default: 443)
  index: number:<source-index> (Optional, you don't need this, unless you want to override your original source index.)
  sourceKey: string:<source-key> (Optional, in case the source on Noname side requires authentication - the sourceKey must be provided.)
  maxPayloadSizeBytes: number:<noname-engine-port> (Optional, default: 5242880 [5MB])
  debug: boolean:<is-debug> (Optional, default: false ; Enables more log messages for debugging purposes.)
```
Example:
```
noname-plugin:
  engineHost: "engine.example.com"
  enginePort: 443
  index: 200
  sourceKey: "c4fad058-f253-415d-855e-eb3b9314f33a"
  maxPayloadSizeBytes: 1048576
  debug: false
```
6. Reload edgemicro.
7. Done.

### My MicroGateway runs inside a container
Similar to the instructions above, the plugin needs to be placed under the plugins folder inside the container and the yaml configuration file needs to be updated.  
Please consult customer support if you need help.

## How can I disable the plugin?
1. Remove the plugin configuration from inside the yaml configuration file.
2. Reload edgemicro.