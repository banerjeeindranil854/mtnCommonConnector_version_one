
<!-- 
 Documentation file for remove-bearer-token-siebel plugin for Edgemicro gateways.
-->

# wildcard-mapping

Custom plugin to remove bearer token authorization header as Siebel sends it and they dont have option to disable it.



### Processing
* Get authorization value from header.
* If present, remove authorization header.

### Config stanza:
No configuration provided


### Plugins Location:
Before oauth plugin

### Dependency:
None
