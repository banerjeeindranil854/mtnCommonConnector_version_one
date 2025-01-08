
<!-- 
 Documentation file for strip-content-encoding plugin for Edgemicro gateways.
-->

# strip-content-encoding

Custom plugin to remove the content-encoding header from the response.

This workaround is due to errant Eswatini CIS backend response.

**Errancy note:**
* On some responses, Eswatini CIS sends 'content-encoding' : 'utf8' which is invalid as per RFC7231 and RFC7694.
*   ... should be gzip, deflate, br.
*   Apigee Edge sees this as a carefully-crafted penetration attempt and responds with HTTP 415 Unsupported Media Type.
```
   {
     "fault": {
         "faultstring": "Unsupported Encoding \"UTF-8\"",
         "detail": {
             "errorcode": "protocol.http.UnsupportedEncoding"
         }
     }
   }
```

### Processing
* Plugin matches the request URL pathname against specified paths (sans queryparms)
* URL pathname equates to the full path as defined in the edgemicro_* proxy and
  must include any path-suffix resource levels. 

### Config stanza:
_strip-content-encoding_
* _activate_
  * Toggle strip-content-encoding functionality
  * Example: true
* _actionpaths_
  * Array of paths to match against the FULL request path.  This allows only certain requests to be corrected.
  * Example: ['/eswatini/system/cis', '/something/else']  
  * Caveat:  The proxy basepath must be included along with the path-suffix levels supported, 
   e.g "/eswatini/system/cis/cisBusiness/service/fulfillmentService"
 

### Plugins Location:
Non-specific.

### Dependency:
Availablility of the url module, which is currently core functionality of the edgemicro gateway.


.
.
.
  
 
