<!-- 
 Documentation file for log-paylod plugin for Edgemicro gateways.
-->

# log-payload

  An Apigee Edge Microgateway plugin that logs request/response payload and headers.
  Based on the work of meccles here:  https://github.com/mecclesgoogle/edgemicro-log-payload
  
  The enhancement has additional features and honours config settings
  

### Processing:
Write the request and response payloads to the logger location.
The logger object is passed to every plugin on initialisation.

### Config stanza:
*log-payload*
* _activate_
  * Toggle log-payload functionality
  * Example: true
* _maskAuth_
  * Mask the x-api-key header value.
  * Extended by MosesBett to mask both 'Authorization' and 'x-authorization-claims' header values.
  * Note:  Body responses are not examined.
  * Example:  true
* _collapseFormatting_
  * Courtesy of MosesBett ... Replace carriage-return and line-feed sequences with vertical bar.
  This to avoid verbosity and also as a precendent for logging to external systems such as ELK,
		... which may break a single transaction log event into multiple events.
  * Example:  true


 

### Plugins Location:

**Important note:** This depends on the accumulate-request and accumulate-response plugins being enabled.
Configure this plugin between those two, like in the example below.
```
...
plugins:
    sequence:
      ...
      - accumulate-request
      - log-payload
      - accumulate-response
      ...
...
```
Being that the traffic flows top down for a request and bottom-up for a response, the order of plugins is important.

With other plugins in the sequence, you may want to place the accumulate-response plugin
 as the last in the list, i.e. first to be executed on response.
 (  Some instances of this error noticed : 
 {"message":"write after end","code":"ERR_STREAM_WRITE_AFTER_END"}  )
	

### Dependency:
Standard Apigee plugins `accumulate-request` and `accumulate-response` as noted.

.
.
.
