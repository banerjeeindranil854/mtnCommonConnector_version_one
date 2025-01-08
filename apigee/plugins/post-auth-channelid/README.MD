
<!-- 
 Documentation file for post-auth-channelid plugin for Edgemicro gateways.
-->

# post-auth-channelid

Custom plugin to inject header with developer email. 

### Processing:
Inject relevant header if authorisation claims header is present.
* If named attribute not found in claims array, sets channelid to "missing.channelid@checksequence.com".
* If header name not specified, defaults to "x-channel-id".
* If claims attribute not specified, defaults to "developer_email".

### Config stanza:
    activate: true
    defaultid: "hello@nowhere.com"
    headername:  "x-robins-key"
    devmail_attrib: "developer_email"
*post-auth-channelid*
* *activate*
  * Toggle post-auth-channelid functionality
  * Example: true
* *defaultid*
  * Default value for developer email if not found
  * Example:  hello@nowhere.com
* *devmail_attrib*
  * Name of attribute, case sensitive in "x-authorization-claims"
  * Example:  developer_email  
* _channel_header_
  * Name of the header in which to place the channel-id
  * Example:  "x-channel-id"
 

### Plugins Location:
Place after your <code>-oauth</code> plugin in the plugins sequence.

### Dependency:
The microgateway configuration yaml must refer to the custom <code>edgemicro-custom-auth</code> proxy in Apigee Edge.
 This enhanced proxy will inject App attributes into the <code>x-authorization-claims</code> array of attributes.


.
.
.
