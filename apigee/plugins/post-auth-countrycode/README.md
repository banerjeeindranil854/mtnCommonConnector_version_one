
<!-- 
 Documentation file for post-auth-countrycode plugin for Edgemicro gateways.
-->

# post-auth-countrycode

Custom plugin to inject header with 3-char ISO country code. 

Based on the work of [AndyMeek](https://github.com/andymeek/iso-country-codes-converter) at https://github.com/andymeek/iso-country-codes-converter

### Processing:

Inject relevant country_header if possible.

- Custom authorisation claims has two or three-char `location` attribute.
- In older APIs a `countryCode` header is set to a numeric phone dialing prefix or an alphabetic country code
- If header is already set, we parse that value, otherwise we look for `attribute_name` in the custom authorisation claims
  - If the value is numeric, we keep it as is
  - If 2-char country code is recognised, replace it with the equivalent 3 letter code
  - If 3-char code, sets as uppercase
- If a value is not found in either of the above places, look for `alt_country_header`
  - If a numeric phone dialing prefix or 2-char country code is recognised, replace it with the equivalent 3 letter country code
  - If 3-char code, sets as uppercase
- If country code is not recognised, sets country-code to "XXX"
- If named attribute not found in claims array, sets country-code to "ZZZ"

### Config stanza:
*post-auth-countrycode*
* *activate*
  * Toggle post-auth-countrycode functionality
  * Example: true
* *attribute_name*
  * Name of custom attribute, case sensitive due to location in "x-authorization-claims"
  * Example:  location
* _country_header_
  * Name of the header in which to place the country code
  * Example:  "x-country-code"
 

### Plugins Location:
Place after your ` -oauth ` plugin in the plugins sequence.

### Dependency:
The microgateway configuration yaml must refer to the custom `edgemicro-custom-auth` proxy in Apigee Edge.
 This enhanced proxy will retrieve App attributes and inject these into the `x-authorization-claims` array of attributes.


.
.
.
 
