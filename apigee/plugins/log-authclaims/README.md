# log-authclaims

Custom plugin to log some custom auth information

### Processing:

Log information obtained by edgemicro-custom-auth

### Config stanza:

- *activate*
  - Toggle log-authclaims functionality
  - Example: true
- *format*: In what format should the data be logged:
  - valid values: `json` (JSON string), `pipe` (pipe seperated values)
  - default: `pipe`

### Plugins Location:

Place after your `-oauth` plugin in the plugins sequence.

### Dependency:

The microgateway configuration yaml must refer to the custom `edgemicro-custom-auth` proxy in Apigee Edge.
 This enhanced proxy will inject App attributes into the `x-authorization-claims` array of attributes.
