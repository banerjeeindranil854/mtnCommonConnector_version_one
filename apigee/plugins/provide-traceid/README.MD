
<!-- 
 Documentation file for provide-traceid plugin for Edgemicro gateways.
-->

# provide-traceid

Custom plugin to inject a traceId header. 
* Uses the correlationId as generated by the microgateway for every request.
* This same correlationId is used as the "i=" parameter to identify each entry in the logger routine.

* Example header:  "traceId": "emg-42db5220-3480-11eb-bc5b-1be2b6bff410" 


### Config stanza:
_provide-traceid_
* _activate_
  * Toggle provide-traceid functionality
  * Example: true
* _prefix_
  * Prefix to the correlationId. (4-digit)
  * Example: "emg-"  
 

### Plugins Location:
Non-specific

### Dependency:
Availablility of the request correlationId, which is currently core functionality of the edgemicro gateway.


.
.
.
 
 


 
 
