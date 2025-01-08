
<!-- 
 Documentation file for skip-auth plugin for Edgemicro gateways.
-->

# skip-auth

Workaround plugin to inject authorization header if required. 

Use case is for legacy callers unable to provide auth, and are to be routed to public service.

This plugin avoids the need for standing up another gateway which has no auth. 


Caveat:  Ensure your Edgemicro config supports x-api-key as time-based OAuth tokens are impractical here.



### Processing:
Inject relevant authorization header if pathsegment matches.
* Do not overwrite existing auth key if present

#### Path fragment selection note:
 *   Ideally we don't want to match any substring, but also must avoid processing overhead on every call.
 *   In addition, we should support wildcard patterns.
 *   Seeing that full path matching with wildcards is already handled in the Edgemicro configuration,   
    compromised and reduced matching to a simple includes match and expecting a path-fragment only.

### Config stanza:
*skip-auth*
* *activate*
  * Toggle skip-auth functionality
  * Example: true
* *actionpathsegment*
  * Array of path segments to match against request path.
  * Example:  ["/skip", "/noauth/"]
* _authheader_
  * Name of the header in which to place the authorisation value.  If attribute missing from config file, defaults to 'x-api-key'
  * Example:  "x-api-key"
* _authkey_
  * Actual value of the auth header (client_key).   If attribute missing from config file, defaults to 'missing-real-value'
  * Example:  "neVuDvANfGF4R5C1KS5sulLIp8lNYzGC"


 

### Plugins Location:
Place ahead of the ` -oauth ` plugin in the plugins sequence.


### Dependency:
None

 
