'use strict';

/*
 * Name: post-auth-countrycode
 * Descrip: Custom plugin to inject header with 3-char ISO country code.
 *      Based on the work of github.com/andymeek/iso-country-codes-converter
 *
 * Processing: Inject relevant country_header if possible.
 * - Custom authorisation claims has two or three-char `location` attribute.
 * - In older APIs a `countryCode` header is set to a numeric phone dialing prefix or an alphabetic country code
 * - If header is already set, we parse that value, otherwise we look for `attribute_name` in the custom authorisation claims
 *   - If the value is numeric, we keep it as is
 *   - If 2-char country code is recognised, replace it with the equivalent 3 letter code
 *   - If 3-char code, sets as uppercase
 * - If a value is not found in either of the above places, look for `alt_country_header`
 *   - If a numeric phone dialing prefix or 2-char country code is recognised, replace it with the equivalent 3 letter country code
 *   - If 3-char code, sets as uppercase
 * - If country code is not recognised, sets country-code to "XXX"
 * - If named attribute not found in claims array, sets country-code to "ZZZ"
 *
 * Config stanza:
 *  activate: Toggle post-auth-countrycode functionality
 *    example: true
 *  attribute_name: Name of custom attribute to examine, case sensitive as in "x-authorization-claims"
 *    example: location
 *  country_header: Name of the header in which to place the country code
 *    example:  "x-country-code"
 *  alt_country_header: Name of an alternate header to look for in incoming request
 *    example:  "countrycode"
 *
 *  Location: Place after your -oauth plugin in the plugin sequence.
 *  Dependency:  Custom edgemicro-auth proxy in Apigee Edge to retrieve App attributes and inject x-authorization-claims array
 *
 */


module.exports.init = function(config, logger, stats) {

	//== Initialisation (for each worker thread started )
	if (config.activate == true) {
		logger.info('-- Post-Auth-Country-Code plugin initialised and is active.');
	} else {
		logger.info('-- Post-Auth-Country-Code plugin present but inactive.');
	}

	//== Massive array to map 2-digit to 3-digit
	//== Updated 2022-08-31 from ISO 3166 Online Browsing Platform
	//== https://www.iso.org/iso-3166-country-codes.html
	const aCountries = [{
		countryName: 'Andorra',
		isoNum: '20',
		telCode: '376',
		isoAlpha2Code: 'AD',
		isoAlpha3Code: 'AND'
	}, {
		countryName: 'United Arab Emirates (the)',
		isoNum: '784',
		telCode: '971',
		isoAlpha2Code: 'AE',
		isoAlpha3Code: 'ARE'
	}, {
		countryName: 'Afghanistan',
		isoNum: '4',
		telCode: '93',
		isoAlpha2Code: 'AF',
		isoAlpha3Code: 'AFG'
	}, {
		countryName: 'Antigua and Barbuda',
		isoNum: '28',
		telCode: '1-268',
		isoAlpha2Code: 'AG',
		isoAlpha3Code: 'ATG'
	}, {
		countryName: 'Anguilla',
		isoNum: '660',
		telCode: '1-264',
		isoAlpha2Code: 'AI',
		isoAlpha3Code: 'AIA'
	}, {
		countryName: 'Albania',
		isoNum: '8',
		telCode: '355',
		isoAlpha2Code: 'AL',
		isoAlpha3Code: 'ALB'
	}, {
		countryName: 'Armenia',
		isoNum: '51',
		telCode: '374',
		isoAlpha2Code: 'AM',
		isoAlpha3Code: 'ARM'
	}, {
		countryName: 'Angola',
		isoNum: '24',
		telCode: '244',
		isoAlpha2Code: 'AO',
		isoAlpha3Code: 'AGO'
	}, {
		countryName: 'Antarctica',
		isoNum: '10',
		telCode: '672',
		isoAlpha2Code: 'AQ',
		isoAlpha3Code: 'ATA'
	}, {
		countryName: 'Argentina',
		isoNum: '32',
		telCode: '54',
		isoAlpha2Code: 'AR',
		isoAlpha3Code: 'ARG'
	}, {
		countryName: 'American Samoa',
		isoNum: '16',
		telCode: '1-684',
		isoAlpha2Code: 'AS',
		isoAlpha3Code: 'ASM'
	}, {
		countryName: 'Austria',
		isoNum: '40',
		telCode: '43',
		isoAlpha2Code: 'AT',
		isoAlpha3Code: 'AUT'
	}, {
		countryName: 'Australia',
		isoNum: '36',
		telCode: '61',
		isoAlpha2Code: 'AU',
		isoAlpha3Code: 'AUS'
	}, {
		countryName: 'Aruba',
		isoNum: '533',
		telCode: '297',
		isoAlpha2Code: 'AW',
		isoAlpha3Code: 'ABW'
	}, {
		countryName: 'Åland Islands',
		isoNum: '248',
		telCode: '297',
		isoAlpha2Code: 'AX',
		isoAlpha3Code: 'ALA'
	}, {
		countryName: 'Azerbaijan',
		isoNum: '31',
		telCode: '994',
		isoAlpha2Code: 'AZ',
		isoAlpha3Code: 'AZE'
	}, {
		countryName: 'Bosnia and Herzegovina',
		isoNum: '70',
		telCode: '387',
		isoAlpha2Code: 'BA',
		isoAlpha3Code: 'BIH'
	}, {
		countryName: 'Barbados',
		isoNum: '52',
		telCode: '1-246',
		isoAlpha2Code: 'BB',
		isoAlpha3Code: 'BRB'
	}, {
		countryName: 'Bangladesh',
		isoNum: '50',
		telCode: '880',
		isoAlpha2Code: 'BD',
		isoAlpha3Code: 'BGD'
	}, {
		countryName: 'Belgium',
		isoNum: '56',
		telCode: '32',
		isoAlpha2Code: 'BE',
		isoAlpha3Code: 'BEL'
	}, {
		countryName: 'Burkina Faso',
		isoNum: '854',
		telCode: '226',
		isoAlpha2Code: 'BF',
		isoAlpha3Code: 'BFA'
	}, {
		countryName: 'Bulgaria',
		isoNum: '100',
		telCode: '359',
		isoAlpha2Code: 'BG',
		isoAlpha3Code: 'BGR'
	}, {
		countryName: 'Bahrain',
		isoNum: '48',
		telCode: '973',
		isoAlpha2Code: 'BH',
		isoAlpha3Code: 'BHR'
	}, {
		countryName: 'Burundi',
		isoNum: '108',
		telCode: '257',
		isoAlpha2Code: 'BI',
		isoAlpha3Code: 'BDI'
	}, {
		countryName: 'Benin',
		isoNum: '204',
		telCode: '229',
		isoAlpha2Code: 'BJ',
		isoAlpha3Code: 'BEN'
	}, {
		countryName: 'Saint Barthélemy',
		isoNum: '652',
		telCode: '590',
		isoAlpha2Code: 'BL',
		isoAlpha3Code: 'BLM'
	}, {
		countryName: 'Bermuda',
		isoNum: '60',
		telCode: '1-441',
		isoAlpha2Code: 'BM',
		isoAlpha3Code: 'BMU'
	}, {
		countryName: 'Brunei Darussalam',
		isoNum: '96',
		telCode: '673',
		isoAlpha2Code: 'BN',
		isoAlpha3Code: 'BRN'
	}, {
		countryName: 'Bolivia (Plurinational State of)',
		isoNum: '68',
		telCode: '591',
		isoAlpha2Code: 'BO',
		isoAlpha3Code: 'BOL'
	}, {
		countryName: 'Bonaire, Sint Eustatius and Saba',
		isoNum: '535',
		telCode: '591',
		isoAlpha2Code: 'BQ',
		isoAlpha3Code: 'BES'
	}, {
		countryName: 'Brazil',
		isoNum: '76',
		telCode: '55',
		isoAlpha2Code: 'BR',
		isoAlpha3Code: 'BRA'
	}, {
		countryName: 'Bahamas (the)',
		isoNum: '44',
		telCode: '1-242',
		isoAlpha2Code: 'BS',
		isoAlpha3Code: 'BHS'
	}, {
		countryName: 'Bhutan',
		isoNum: '64',
		telCode: '975',
		isoAlpha2Code: 'BT',
		isoAlpha3Code: 'BTN'
	}, {
		countryName: 'Bouvet Island',
		isoNum: '74',
		telCode: '975',
		isoAlpha2Code: 'BV',
		isoAlpha3Code: 'BVT'
	}, {
		countryName: 'Botswana',
		isoNum: '72',
		telCode: '267',
		isoAlpha2Code: 'BW',
		isoAlpha3Code: 'BWA'
	}, {
		countryName: 'Belarus',
		isoNum: '112',
		telCode: '375',
		isoAlpha2Code: 'BY',
		isoAlpha3Code: 'BLR'
	}, {
		countryName: 'Belize',
		isoNum: '84',
		telCode: '501',
		isoAlpha2Code: 'BZ',
		isoAlpha3Code: 'BLZ'
	}, {
		countryName: 'Canada',
		isoNum: '124',
		telCode: '1',
		isoAlpha2Code: 'CA',
		isoAlpha3Code: 'CAN'
	}, {
		countryName: 'Cocos (Keeling) Islands (the)',
		isoNum: '166',
		telCode: '61',
		isoAlpha2Code: 'CC',
		isoAlpha3Code: 'CCK'
	}, {
		countryName: 'Congo (the Democratic Republic of the)',
		isoNum: '180',
		telCode: '243',
		isoAlpha2Code: 'CD',
		isoAlpha3Code: 'COD'
	}, {
		countryName: 'Central African Republic (the)',
		isoNum: '140',
		telCode: '236',
		isoAlpha2Code: 'CF',
		isoAlpha3Code: 'CAF'
	}, {
		countryName: 'Congo (the)',
		isoNum: '178',
		telCode: '242',
		isoAlpha2Code: 'CG',
		isoAlpha3Code: 'COG'
	}, {
		countryName: 'Switzerland',
		isoNum: '756',
		telCode: '41',
		isoAlpha2Code: 'CH',
		isoAlpha3Code: 'CHE'
	}, {
		countryName: "Côte d'Ivoire",
		isoNum: '384',
		telCode: '225',
		isoAlpha2Code: 'CI',
		isoAlpha3Code: 'CIV'
	}, {
		countryName: 'Cook Islands (the)',
		isoNum: '184',
		telCode: '682',
		isoAlpha2Code: 'CK',
		isoAlpha3Code: 'COK'
	}, {
		countryName: 'Chile',
		isoNum: '152',
		telCode: '56',
		isoAlpha2Code: 'CL',
		isoAlpha3Code: 'CHL'
	}, {
		countryName: 'Cameroon',
		isoNum: '120',
		telCode: '237',
		isoAlpha2Code: 'CM',
		isoAlpha3Code: 'CMR'
	}, {
		countryName: 'China',
		isoNum: '156',
		telCode: '86',
		isoAlpha2Code: 'CN',
		isoAlpha3Code: 'CHN'
	}, {
		countryName: 'Colombia',
		isoNum: '170',
		telCode: '57',
		isoAlpha2Code: 'CO',
		isoAlpha3Code: 'COL'
	}, {
		countryName: 'Costa Rica',
		isoNum: '188',
		telCode: '506',
		isoAlpha2Code: 'CR',
		isoAlpha3Code: 'CRI'
	}, {
		countryName: 'Cuba',
		isoNum: '192',
		telCode: '53',
		isoAlpha2Code: 'CU',
		isoAlpha3Code: 'CUB'
	}, {
		countryName: 'Cabo Verde',
		isoNum: '132',
		telCode: '238',
		isoAlpha2Code: 'CV',
		isoAlpha3Code: 'CPV'
	}, {
		countryName: 'Curaçao',
		isoNum: '531',
		telCode: '599',
		isoAlpha2Code: 'CW',
		isoAlpha3Code: 'CUW'
	}, {
		countryName: 'Christmas Island',
		isoNum: '162',
		telCode: '61',
		isoAlpha2Code: 'CX',
		isoAlpha3Code: 'CXR'
	}, {
		countryName: 'Cyprus',
		isoNum: '196',
		telCode: '357',
		isoAlpha2Code: 'CY',
		isoAlpha3Code: 'CYP'
	}, {
		countryName: 'Czechia',
		isoNum: '203',
		telCode: '420',
		isoAlpha2Code: 'CZ',
		isoAlpha3Code: 'CZE'
	}, {
		countryName: 'Germany',
		isoNum: '276',
		telCode: '49',
		isoAlpha2Code: 'DE',
		isoAlpha3Code: 'DEU'
	}, {
		countryName: 'Djibouti',
		isoNum: '262',
		telCode: '253',
		isoAlpha2Code: 'DJ',
		isoAlpha3Code: 'DJI'
	}, {
		countryName: 'Denmark',
		isoNum: '208',
		telCode: '45',
		isoAlpha2Code: 'DK',
		isoAlpha3Code: 'DNK'
	}, {
		countryName: 'Dominica',
		isoNum: '212',
		telCode: '1-767',
		isoAlpha2Code: 'DM',
		isoAlpha3Code: 'DMA'
	}, {
		countryName: 'Dominican Republic (the)',
		isoNum: '214',
		telCode: '1-809, 1-829, 1-849',
		isoAlpha2Code: 'DO',
		isoAlpha3Code: 'DOM'
	}, {
		countryName: 'Algeria',
		isoNum: '12',
		telCode: '213',
		isoAlpha2Code: 'DZ',
		isoAlpha3Code: 'DZA'
	}, {
		countryName: 'Ecuador',
		isoNum: '218',
		telCode: '593',
		isoAlpha2Code: 'EC',
		isoAlpha3Code: 'ECU'
	}, {
		countryName: 'Estonia',
		isoNum: '233',
		telCode: '372',
		isoAlpha2Code: 'EE',
		isoAlpha3Code: 'EST'
	}, {
		countryName: 'Egypt',
		isoNum: '818',
		telCode: '20',
		isoAlpha2Code: 'EG',
		isoAlpha3Code: 'EGY'
	}, {
		countryName: 'Western Sahara*',
		isoNum: '732',
		telCode: '212',
		isoAlpha2Code: 'EH',
		isoAlpha3Code: 'ESH'
	}, {
		countryName: 'Eritrea',
		isoNum: '232',
		telCode: '291',
		isoAlpha2Code: 'ER',
		isoAlpha3Code: 'ERI'
	}, {
		countryName: 'Spain',
		isoNum: '724',
		telCode: '34',
		isoAlpha2Code: 'ES',
		isoAlpha3Code: 'ESP'
	}, {
		countryName: 'Ethiopia',
		isoNum: '231',
		telCode: '251',
		isoAlpha2Code: 'ET',
		isoAlpha3Code: 'ETH'
	}, {
		countryName: 'Finland',
		isoNum: '246',
		telCode: '358',
		isoAlpha2Code: 'FI',
		isoAlpha3Code: 'FIN'
	}, {
		countryName: 'Fiji',
		isoNum: '242',
		telCode: '679',
		isoAlpha2Code: 'FJ',
		isoAlpha3Code: 'FJI'
	}, {
		countryName: 'Falkland Islands (the) [Malvinas]',
		isoNum: '238',
		telCode: '500',
		isoAlpha2Code: 'FK',
		isoAlpha3Code: 'FLK'
	}, {
		countryName: 'Micronesia (Federated States of)',
		isoNum: '583',
		telCode: '691',
		isoAlpha2Code: 'FM',
		isoAlpha3Code: 'FSM'
	}, {
		countryName: 'Faroe Islands (the)',
		isoNum: '234',
		telCode: '298',
		isoAlpha2Code: 'FO',
		isoAlpha3Code: 'FRO'
	}, {
		countryName: 'France',
		isoNum: '250',
		telCode: '33',
		isoAlpha2Code: 'FR',
		isoAlpha3Code: 'FRA'
	}, {
		countryName: 'Gabon',
		isoNum: '266',
		telCode: '241',
		isoAlpha2Code: 'GA',
		isoAlpha3Code: 'GAB'
	}, {
		countryName: 'United Kingdom of Great Britain and Northern Ireland (the)',
		isoNum: '826',
		telCode: '44',
		isoAlpha2Code: 'GB',
		isoAlpha3Code: 'GBR'
	}, {
		countryName: 'Grenada',
		isoNum: '308',
		telCode: '1-473',
		isoAlpha2Code: 'GD',
		isoAlpha3Code: 'GRD'
	}, {
		countryName: 'Georgia',
		isoNum: '268',
		telCode: '995',
		isoAlpha2Code: 'GE',
		isoAlpha3Code: 'GEO'
	}, {
		countryName: 'French Guiana',
		isoNum: '254',
		telCode: '995',
		isoAlpha2Code: 'GF',
		isoAlpha3Code: 'GUF'
	}, {
		countryName: 'Guernsey',
		isoNum: '831',
		telCode: '44-1481',
		isoAlpha2Code: 'GG',
		isoAlpha3Code: 'GGY'
	}, {
		countryName: 'Ghana',
		isoNum: '288',
		telCode: '233',
		isoAlpha2Code: 'GH',
		isoAlpha3Code: 'GHA'
	}, {
		countryName: 'Gibraltar',
		isoNum: '292',
		telCode: '350',
		isoAlpha2Code: 'GI',
		isoAlpha3Code: 'GIB'
	}, {
		countryName: 'Greenland',
		isoNum: '304',
		telCode: '299',
		isoAlpha2Code: 'GL',
		isoAlpha3Code: 'GRL'
	}, {
		countryName: 'Gambia (the)',
		isoNum: '270',
		telCode: '220',
		isoAlpha2Code: 'GM',
		isoAlpha3Code: 'GMB'
	}, {
		countryName: 'Guinea',
		isoNum: '324',
		telCode: '224',
		isoAlpha2Code: 'GN',
		isoAlpha3Code: 'GIN'
	}, {
		countryName: 'Guadeloupe',
		isoNum: '312',
		telCode: '224',
		isoAlpha2Code: 'GP',
		isoAlpha3Code: 'GLP'
	}, {
		countryName: 'Equatorial Guinea',
		isoNum: '226',
		telCode: '240',
		isoAlpha2Code: 'GQ',
		isoAlpha3Code: 'GNQ'
	}, {
		countryName: 'Greece',
		isoNum: '300',
		telCode: '30',
		isoAlpha2Code: 'GR',
		isoAlpha3Code: 'GRC'
	}, {
		countryName: 'South Georgia and the South Sandwich Islands',
		isoNum: '239',
		telCode: '30',
		isoAlpha2Code: 'GS',
		isoAlpha3Code: 'SGS'
	}, {
		countryName: 'Guatemala',
		isoNum: '320',
		telCode: '502',
		isoAlpha2Code: 'GT',
		isoAlpha3Code: 'GTM'
	}, {
		countryName: 'Guam',
		isoNum: '316',
		telCode: '1-671',
		isoAlpha2Code: 'GU',
		isoAlpha3Code: 'GUM'
	}, {
		countryName: 'Guinea-Bissau',
		isoNum: '624',
		telCode: '245',
		isoAlpha2Code: 'GW',
		isoAlpha3Code: 'GNB'
	}, {
		countryName: 'Guyana',
		isoNum: '328',
		telCode: '592',
		isoAlpha2Code: 'GY',
		isoAlpha3Code: 'GUY'
	}, {
		countryName: 'Hong Kong',
		isoNum: '344',
		telCode: '852',
		isoAlpha2Code: 'HK',
		isoAlpha3Code: 'HKG'
	}, {
		countryName: 'Heard Island and McDonald Islands',
		isoNum: '334',
		telCode: '852',
		isoAlpha2Code: 'HM',
		isoAlpha3Code: 'HMD'
	}, {
		countryName: 'Honduras',
		isoNum: '340',
		telCode: '504',
		isoAlpha2Code: 'HN',
		isoAlpha3Code: 'HND'
	}, {
		countryName: 'Croatia',
		isoNum: '191',
		telCode: '385',
		isoAlpha2Code: 'HR',
		isoAlpha3Code: 'HRV'
	}, {
		countryName: 'Haiti',
		isoNum: '332',
		telCode: '509',
		isoAlpha2Code: 'HT',
		isoAlpha3Code: 'HTI'
	}, {
		countryName: 'Hungary',
		isoNum: '348',
		telCode: '36',
		isoAlpha2Code: 'HU',
		isoAlpha3Code: 'HUN'
	}, {
		countryName: 'Indonesia',
		isoNum: '360',
		telCode: '62',
		isoAlpha2Code: 'ID',
		isoAlpha3Code: 'IDN'
	}, {
		countryName: 'Ireland',
		isoNum: '372',
		telCode: '353',
		isoAlpha2Code: 'IE',
		isoAlpha3Code: 'IRL'
	}, {
		countryName: 'Israel',
		isoNum: '376',
		telCode: '972',
		isoAlpha2Code: 'IL',
		isoAlpha3Code: 'ISR'
	}, {
		countryName: 'Isle of Man',
		isoNum: '833',
		telCode: '44-1624',
		isoAlpha2Code: 'IM',
		isoAlpha3Code: 'IMN'
	}, {
		countryName: 'India',
		isoNum: '356',
		telCode: '91',
		isoAlpha2Code: 'IN',
		isoAlpha3Code: 'IND'
	}, {
		countryName: 'British Indian Ocean Territory (the)',
		isoNum: '86',
		telCode: '246',
		isoAlpha2Code: 'IO',
		isoAlpha3Code: 'IOT'
	}, {
		countryName: 'Iraq',
		isoNum: '368',
		telCode: '964',
		isoAlpha2Code: 'IQ',
		isoAlpha3Code: 'IRQ'
	}, {
		countryName: 'Iran (Islamic Republic of)',
		isoNum: '364',
		telCode: '98',
		isoAlpha2Code: 'IR',
		isoAlpha3Code: 'IRN'
	}, {
		countryName: 'Iceland',
		isoNum: '352',
		telCode: '354',
		isoAlpha2Code: 'IS',
		isoAlpha3Code: 'ISL'
	}, {
		countryName: 'Italy',
		isoNum: '380',
		telCode: '39',
		isoAlpha2Code: 'IT',
		isoAlpha3Code: 'ITA'
	}, {
		countryName: 'Jersey',
		isoNum: '832',
		telCode: '44-1534',
		isoAlpha2Code: 'JE',
		isoAlpha3Code: 'JEY'
	}, {
		countryName: 'Jamaica',
		isoNum: '388',
		telCode: '1-876',
		isoAlpha2Code: 'JM',
		isoAlpha3Code: 'JAM'
	}, {
		countryName: 'Jordan',
		isoNum: '400',
		telCode: '962',
		isoAlpha2Code: 'JO',
		isoAlpha3Code: 'JOR'
	}, {
		countryName: 'Japan',
		isoNum: '392',
		telCode: '81',
		isoAlpha2Code: 'JP',
		isoAlpha3Code: 'JPN'
	}, {
		countryName: 'Kenya',
		isoNum: '404',
		telCode: '254',
		isoAlpha2Code: 'KE',
		isoAlpha3Code: 'KEN'
	}, {
		countryName: 'Kyrgyzstan',
		isoNum: '417',
		telCode: '996',
		isoAlpha2Code: 'KG',
		isoAlpha3Code: 'KGZ'
	}, {
		countryName: 'Cambodia',
		isoNum: '116',
		telCode: '855',
		isoAlpha2Code: 'KH',
		isoAlpha3Code: 'KHM'
	}, {
		countryName: 'Kiribati',
		isoNum: '296',
		telCode: '686',
		isoAlpha2Code: 'KI',
		isoAlpha3Code: 'KIR'
	}, {
		countryName: 'Comoros (the)',
		isoNum: '174',
		telCode: '269',
		isoAlpha2Code: 'KM',
		isoAlpha3Code: 'COM'
	}, {
		countryName: 'Saint Kitts and Nevis',
		isoNum: '659',
		telCode: '1-869',
		isoAlpha2Code: 'KN',
		isoAlpha3Code: 'KNA'
	}, {
		countryName: "Korea (the Democratic People's Republic of)",
		isoNum: '408',
		telCode: '850',
		isoAlpha2Code: 'KP',
		isoAlpha3Code: 'PRK'
	}, {
		countryName: 'Korea (the Republic of)',
		isoNum: '410',
		telCode: '82',
		isoAlpha2Code: 'KR',
		isoAlpha3Code: 'KOR'
	}, {
		countryName: 'Kuwait',
		isoNum: '414',
		telCode: '965',
		isoAlpha2Code: 'KW',
		isoAlpha3Code: 'KWT'
	}, {
		countryName: 'Cayman Islands (the)',
		isoNum: '136',
		telCode: '1-345',
		isoAlpha2Code: 'KY',
		isoAlpha3Code: 'CYM'
	}, {
		countryName: 'Kazakhstan',
		isoNum: '398',
		telCode: '7',
		isoAlpha2Code: 'KZ',
		isoAlpha3Code: 'KAZ'
	}, {
		countryName: "Lao People's Democratic Republic (the)",
		isoNum: '418',
		telCode: '856',
		isoAlpha2Code: 'LA',
		isoAlpha3Code: 'LAO'
	}, {
		countryName: 'Lebanon',
		isoNum: '422',
		telCode: '961',
		isoAlpha2Code: 'LB',
		isoAlpha3Code: 'LBN'
	}, {
		countryName: 'Saint Lucia',
		isoNum: '662',
		telCode: '1-758',
		isoAlpha2Code: 'LC',
		isoAlpha3Code: 'LCA'
	}, {
		countryName: 'Liechtenstein',
		isoNum: '438',
		telCode: '423',
		isoAlpha2Code: 'LI',
		isoAlpha3Code: 'LIE'
	}, {
		countryName: 'Sri Lanka',
		isoNum: '144',
		telCode: '94',
		isoAlpha2Code: 'LK',
		isoAlpha3Code: 'LKA'
	}, {
		countryName: 'Liberia',
		isoNum: '430',
		telCode: '231',
		isoAlpha2Code: 'LR',
		isoAlpha3Code: 'LBR'
	}, {
		countryName: 'Lesotho',
		isoNum: '426',
		telCode: '266',
		isoAlpha2Code: 'LS',
		isoAlpha3Code: 'LSO'
	}, {
		countryName: 'Lithuania',
		isoNum: '440',
		telCode: '370',
		isoAlpha2Code: 'LT',
		isoAlpha3Code: 'LTU'
	}, {
		countryName: 'Luxembourg',
		isoNum: '442',
		telCode: '352',
		isoAlpha2Code: 'LU',
		isoAlpha3Code: 'LUX'
	}, {
		countryName: 'Latvia',
		isoNum: '428',
		telCode: '371',
		isoAlpha2Code: 'LV',
		isoAlpha3Code: 'LVA'
	}, {
		countryName: 'Libya',
		isoNum: '434',
		telCode: '218',
		isoAlpha2Code: 'LY',
		isoAlpha3Code: 'LBY'
	}, {
		countryName: 'Morocco',
		isoNum: '504',
		telCode: '212',
		isoAlpha2Code: 'MA',
		isoAlpha3Code: 'MAR'
	}, {
		countryName: 'Monaco',
		isoNum: '492',
		telCode: '377',
		isoAlpha2Code: 'MC',
		isoAlpha3Code: 'MCO'
	}, {
		countryName: 'Moldova (the Republic of)',
		isoNum: '498',
		telCode: '373',
		isoAlpha2Code: 'MD',
		isoAlpha3Code: 'MDA'
	}, {
		countryName: 'Montenegro',
		isoNum: '499',
		telCode: '382',
		isoAlpha2Code: 'ME',
		isoAlpha3Code: 'MNE'
	}, {
		countryName: 'Saint Martin (French part)',
		isoNum: '663',
		telCode: '590',
		isoAlpha2Code: 'MF',
		isoAlpha3Code: 'MAF'
	}, {
		countryName: 'Madagascar',
		isoNum: '450',
		telCode: '261',
		isoAlpha2Code: 'MG',
		isoAlpha3Code: 'MDG'
	}, {
		countryName: 'Marshall Islands (the)',
		isoNum: '584',
		telCode: '692',
		isoAlpha2Code: 'MH',
		isoAlpha3Code: 'MHL'
	}, {
		countryName: 'North Macedonia',
		isoNum: '807',
		telCode: '389',
		isoAlpha2Code: 'MK',
		isoAlpha3Code: 'MKD'
	}, {
		countryName: 'Mali',
		isoNum: '466',
		telCode: '223',
		isoAlpha2Code: 'ML',
		isoAlpha3Code: 'MLI'
	}, {
		countryName: 'Myanmar',
		isoNum: '104',
		telCode: '95',
		isoAlpha2Code: 'MM',
		isoAlpha3Code: 'MMR'
	}, {
		countryName: 'Mongolia',
		isoNum: '496',
		telCode: '976',
		isoAlpha2Code: 'MN',
		isoAlpha3Code: 'MNG'
	}, {
		countryName: 'Macao',
		isoNum: '446',
		telCode: '853',
		isoAlpha2Code: 'MO',
		isoAlpha3Code: 'MAC'
	}, {
		countryName: 'Northern Mariana Islands (the)',
		isoNum: '580',
		telCode: '1-670',
		isoAlpha2Code: 'MP',
		isoAlpha3Code: 'MNP'
	}, {
		countryName: 'Martinique',
		isoNum: '474',
		telCode: '1-670',
		isoAlpha2Code: 'MQ',
		isoAlpha3Code: 'MTQ'
	}, {
		countryName: 'Mauritania',
		isoNum: '478',
		telCode: '222',
		isoAlpha2Code: 'MR',
		isoAlpha3Code: 'MRT'
	}, {
		countryName: 'Montserrat',
		isoNum: '500',
		telCode: '1-664',
		isoAlpha2Code: 'MS',
		isoAlpha3Code: 'MSR'
	}, {
		countryName: 'Malta',
		isoNum: '470',
		telCode: '356',
		isoAlpha2Code: 'MT',
		isoAlpha3Code: 'MLT'
	}, {
		countryName: 'Mauritius',
		isoNum: '480',
		telCode: '230',
		isoAlpha2Code: 'MU',
		isoAlpha3Code: 'MUS'
	}, {
		countryName: 'Maldives',
		isoNum: '462',
		telCode: '960',
		isoAlpha2Code: 'MV',
		isoAlpha3Code: 'MDV'
	}, {
		countryName: 'Malawi',
		isoNum: '454',
		telCode: '265',
		isoAlpha2Code: 'MW',
		isoAlpha3Code: 'MWI'
	}, {
		countryName: 'Mexico',
		isoNum: '484',
		telCode: '52',
		isoAlpha2Code: 'MX',
		isoAlpha3Code: 'MEX'
	}, {
		countryName: 'Malaysia',
		isoNum: '458',
		telCode: '60',
		isoAlpha2Code: 'MY',
		isoAlpha3Code: 'MYS'
	}, {
		countryName: 'Mozambique',
		isoNum: '508',
		telCode: '258',
		isoAlpha2Code: 'MZ',
		isoAlpha3Code: 'MOZ'
	}, {
		countryName: 'Namibia',
		isoNum: '516',
		telCode: '264',
		isoAlpha2Code: 'NA',
		isoAlpha3Code: 'NAM'
	}, {
		countryName: 'New Caledonia',
		isoNum: '540',
		telCode: '687',
		isoAlpha2Code: 'NC',
		isoAlpha3Code: 'NCL'
	}, {
		countryName: 'Niger (the)',
		isoNum: '562',
		telCode: '227',
		isoAlpha2Code: 'NE',
		isoAlpha3Code: 'NER'
	}, {
		countryName: 'Norfolk Island',
		isoNum: '574',
		telCode: '227',
		isoAlpha2Code: 'NF',
		isoAlpha3Code: 'NFK'
	}, {
		countryName: 'Nigeria',
		isoNum: '566',
		telCode: '234',
		isoAlpha2Code: 'NG',
		isoAlpha3Code: 'NGA'
	}, {
		countryName: 'Nicaragua',
		isoNum: '558',
		telCode: '505',
		isoAlpha2Code: 'NI',
		isoAlpha3Code: 'NIC'
	}, {
		countryName: 'Netherlands (the)',
		isoNum: '528',
		telCode: '31',
		isoAlpha2Code: 'NL',
		isoAlpha3Code: 'NLD'
	}, {
		countryName: 'Norway',
		isoNum: '578',
		telCode: '47',
		isoAlpha2Code: 'NO',
		isoAlpha3Code: 'NOR'
	}, {
		countryName: 'Nepal',
		isoNum: '524',
		telCode: '977',
		isoAlpha2Code: 'NP',
		isoAlpha3Code: 'NPL'
	}, {
		countryName: 'Nauru',
		isoNum: '520',
		telCode: '674',
		isoAlpha2Code: 'NR',
		isoAlpha3Code: 'NRU'
	}, {
		countryName: 'Niue',
		isoNum: '570',
		telCode: '683',
		isoAlpha2Code: 'NU',
		isoAlpha3Code: 'NIU'
	}, {
		countryName: 'New Zealand',
		isoNum: '554',
		telCode: '64',
		isoAlpha2Code: 'NZ',
		isoAlpha3Code: 'NZL'
	}, {
		countryName: 'Oman',
		isoNum: '512',
		telCode: '968',
		isoAlpha2Code: 'OM',
		isoAlpha3Code: 'OMN'
	}, {
		countryName: 'Panama',
		isoNum: '591',
		telCode: '507',
		isoAlpha2Code: 'PA',
		isoAlpha3Code: 'PAN'
	}, {
		countryName: 'Peru',
		isoNum: '604',
		telCode: '51',
		isoAlpha2Code: 'PE',
		isoAlpha3Code: 'PER'
	}, {
		countryName: 'French Polynesia',
		isoNum: '258',
		telCode: '689',
		isoAlpha2Code: 'PF',
		isoAlpha3Code: 'PYF'
	}, {
		countryName: 'Papua New Guinea',
		isoNum: '598',
		telCode: '675',
		isoAlpha2Code: 'PG',
		isoAlpha3Code: 'PNG'
	}, {
		countryName: 'Philippines (the)',
		isoNum: '608',
		telCode: '63',
		isoAlpha2Code: 'PH',
		isoAlpha3Code: 'PHL'
	}, {
		countryName: 'Pakistan',
		isoNum: '586',
		telCode: '92',
		isoAlpha2Code: 'PK',
		isoAlpha3Code: 'PAK'
	}, {
		countryName: 'Poland',
		isoNum: '616',
		telCode: '48',
		isoAlpha2Code: 'PL',
		isoAlpha3Code: 'POL'
	}, {
		countryName: 'Saint Pierre and Miquelon',
		isoNum: '666',
		telCode: '508',
		isoAlpha2Code: 'PM',
		isoAlpha3Code: 'SPM'
	}, {
		countryName: 'Pitcairn',
		isoNum: '612',
		telCode: '64',
		isoAlpha2Code: 'PN',
		isoAlpha3Code: 'PCN'
	}, {
		countryName: 'Puerto Rico',
		isoNum: '630',
		telCode: '1-787, 1-939',
		isoAlpha2Code: 'PR',
		isoAlpha3Code: 'PRI'
	}, {
		countryName: 'Palestine, State of',
		isoNum: '275',
		telCode: '970',
		isoAlpha2Code: 'PS',
		isoAlpha3Code: 'PSE'
	}, {
		countryName: 'Portugal',
		isoNum: '620',
		telCode: '351',
		isoAlpha2Code: 'PT',
		isoAlpha3Code: 'PRT'
	}, {
		countryName: 'Palau',
		isoNum: '585',
		telCode: '680',
		isoAlpha2Code: 'PW',
		isoAlpha3Code: 'PLW'
	}, {
		countryName: 'Paraguay',
		isoNum: '600',
		telCode: '595',
		isoAlpha2Code: 'PY',
		isoAlpha3Code: 'PRY'
	}, {
		countryName: 'Qatar',
		isoNum: '634',
		telCode: '974',
		isoAlpha2Code: 'QA',
		isoAlpha3Code: 'QAT'
	}, {
		countryName: 'Réunion',
		isoNum: '638',
		telCode: '262',
		isoAlpha2Code: 'RE',
		isoAlpha3Code: 'REU'
	}, {
		countryName: 'Romania',
		isoNum: '642',
		telCode: '40',
		isoAlpha2Code: 'RO',
		isoAlpha3Code: 'ROU'
	}, {
		countryName: 'Serbia',
		isoNum: '688',
		telCode: '381',
		isoAlpha2Code: 'RS',
		isoAlpha3Code: 'SRB'
	}, {
		countryName: 'Russian Federation (the)',
		isoNum: '643',
		telCode: '7',
		isoAlpha2Code: 'RU',
		isoAlpha3Code: 'RUS'
	}, {
		countryName: 'Rwanda',
		isoNum: '646',
		telCode: '250',
		isoAlpha2Code: 'RW',
		isoAlpha3Code: 'RWA'
	}, {
		countryName: 'Saudi Arabia',
		isoNum: '682',
		telCode: '966',
		isoAlpha2Code: 'SA',
		isoAlpha3Code: 'SAU'
	}, {
		countryName: 'Solomon Islands',
		isoNum: '90',
		telCode: '677',
		isoAlpha2Code: 'SB',
		isoAlpha3Code: 'SLB'
	}, {
		countryName: 'Seychelles',
		isoNum: '690',
		telCode: '248',
		isoAlpha2Code: 'SC',
		isoAlpha3Code: 'SYC'
	}, {
		countryName: 'Sudan (the)',
		isoNum: '729',
		telCode: '249',
		isoAlpha2Code: 'SD',
		isoAlpha3Code: 'SDN'
	}, {
		countryName: 'Sweden',
		isoNum: '752',
		telCode: '46',
		isoAlpha2Code: 'SE',
		isoAlpha3Code: 'SWE'
	}, {
		countryName: 'Singapore',
		isoNum: '702',
		telCode: '65',
		isoAlpha2Code: 'SG',
		isoAlpha3Code: 'SGP'
	}, {
		countryName: 'Saint Helena, Ascension and Tristan da Cunha',
		isoNum: '654',
		telCode: '290',
		isoAlpha2Code: 'SH',
		isoAlpha3Code: 'SHN'
	}, {
		countryName: 'Slovenia',
		isoNum: '705',
		telCode: '386',
		isoAlpha2Code: 'SI',
		isoAlpha3Code: 'SVN'
	}, {
		countryName: 'Svalbard and Jan Mayen',
		isoNum: '744',
		telCode: '47',
		isoAlpha2Code: 'SJ',
		isoAlpha3Code: 'SJM'
	}, {
		countryName: 'Slovakia',
		isoNum: '703',
		telCode: '421',
		isoAlpha2Code: 'SK',
		isoAlpha3Code: 'SVK'
	}, {
		countryName: 'Sierra Leone',
		isoNum: '694',
		telCode: '232',
		isoAlpha2Code: 'SL',
		isoAlpha3Code: 'SLE'
	}, {
		countryName: 'San Marino',
		isoNum: '674',
		telCode: '378',
		isoAlpha2Code: 'SM',
		isoAlpha3Code: 'SMR'
	}, {
		countryName: 'Senegal',
		isoNum: '686',
		telCode: '221',
		isoAlpha2Code: 'SN',
		isoAlpha3Code: 'SEN'
	}, {
		countryName: 'Somalia',
		isoNum: '706',
		telCode: '252',
		isoAlpha2Code: 'SO',
		isoAlpha3Code: 'SOM'
	}, {
		countryName: 'Suriname',
		isoNum: '740',
		telCode: '597',
		isoAlpha2Code: 'SR',
		isoAlpha3Code: 'SUR'
	}, {
		countryName: 'South Sudan',
		isoNum: '728',
		telCode: '211',
		isoAlpha2Code: 'SS',
		isoAlpha3Code: 'SSD'
	}, {
		countryName: 'Sao Tome and Principe',
		isoNum: '678',
		telCode: '239',
		isoAlpha2Code: 'ST',
		isoAlpha3Code: 'STP'
	}, {
		countryName: 'El Salvador',
		isoNum: '222',
		telCode: '503',
		isoAlpha2Code: 'SV',
		isoAlpha3Code: 'SLV'
	}, {
		countryName: 'Sint Maarten (Dutch part)',
		isoNum: '534',
		telCode: '1-721',
		isoAlpha2Code: 'SX',
		isoAlpha3Code: 'SXM'
	}, {
		countryName: 'Syrian Arab Republic (the)',
		isoNum: '760',
		telCode: '963',
		isoAlpha2Code: 'SY',
		isoAlpha3Code: 'SYR'
	}, {
		countryName: 'Eswatini',
		isoNum: '748',
		telCode: '268',
		isoAlpha2Code: 'SZ',
		isoAlpha3Code: 'SWZ'
	}, {
		countryName: 'Turks and Caicos Islands (the)',
		isoNum: '796',
		telCode: '1-649',
		isoAlpha2Code: 'TC',
		isoAlpha3Code: 'TCA'
	}, {
		countryName: 'Chad',
		isoNum: '148',
		telCode: '235',
		isoAlpha2Code: 'TD',
		isoAlpha3Code: 'TCD'
	}, {
		countryName: 'French Southern Territories (the)',
		isoNum: '260',
		telCode: '235',
		isoAlpha2Code: 'TF',
		isoAlpha3Code: 'ATF'
	}, {
		countryName: 'Togo',
		isoNum: '768',
		telCode: '228',
		isoAlpha2Code: 'TG',
		isoAlpha3Code: 'TGO'
	}, {
		countryName: 'Thailand',
		isoNum: '764',
		telCode: '66',
		isoAlpha2Code: 'TH',
		isoAlpha3Code: 'THA'
	}, {
		countryName: 'Tajikistan',
		isoNum: '762',
		telCode: '992',
		isoAlpha2Code: 'TJ',
		isoAlpha3Code: 'TJK'
	}, {
		countryName: 'Tokelau',
		isoNum: '772',
		telCode: '690',
		isoAlpha2Code: 'TK',
		isoAlpha3Code: 'TKL'
	}, {
		countryName: 'Timor-Leste',
		isoNum: '626',
		telCode: '670',
		isoAlpha2Code: 'TL',
		isoAlpha3Code: 'TLS'
	}, {
		countryName: 'Turkmenistan',
		isoNum: '795',
		telCode: '993',
		isoAlpha2Code: 'TM',
		isoAlpha3Code: 'TKM'
	}, {
		countryName: 'Tunisia',
		isoNum: '788',
		telCode: '216',
		isoAlpha2Code: 'TN',
		isoAlpha3Code: 'TUN'
	}, {
		countryName: 'Tonga',
		isoNum: '776',
		telCode: '676',
		isoAlpha2Code: 'TO',
		isoAlpha3Code: 'TON'
	}, {
		countryName: 'Türkiye',
		isoNum: '792',
		telCode: '90',
		isoAlpha2Code: 'TR',
		isoAlpha3Code: 'TUR'
	}, {
		countryName: 'Trinidad and Tobago',
		isoNum: '780',
		telCode: '1-868',
		isoAlpha2Code: 'TT',
		isoAlpha3Code: 'TTO'
	}, {
		countryName: 'Tuvalu',
		isoNum: '798',
		telCode: '688',
		isoAlpha2Code: 'TV',
		isoAlpha3Code: 'TUV'
	}, {
		countryName: 'Taiwan (Province of China)',
		isoNum: '158',
		telCode: '886',
		isoAlpha2Code: 'TW',
		isoAlpha3Code: 'TWN'
	}, {
		countryName: 'Tanzania, the United Republic of',
		isoNum: '834',
		telCode: '255',
		isoAlpha2Code: 'TZ',
		isoAlpha3Code: 'TZA'
	}, {
		countryName: 'Ukraine',
		isoNum: '804',
		telCode: '380',
		isoAlpha2Code: 'UA',
		isoAlpha3Code: 'UKR'
	}, {
		countryName: 'Uganda',
		isoNum: '800',
		telCode: '256',
		isoAlpha2Code: 'UG',
		isoAlpha3Code: 'UGA'
	}, {
		countryName: 'United States Minor Outlying Islands (the)',
		isoNum: '581',
		telCode: '256',
		isoAlpha2Code: 'UM',
		isoAlpha3Code: 'UMI'
	}, {
		countryName: 'United States of America (the)',
		isoNum: '840',
		telCode: '1',
		isoAlpha2Code: 'US',
		isoAlpha3Code: 'USA'
	}, {
		countryName: 'Uruguay',
		isoNum: '858',
		telCode: '598',
		isoAlpha2Code: 'UY',
		isoAlpha3Code: 'URY'
	}, {
		countryName: 'Uzbekistan',
		isoNum: '860',
		telCode: '998',
		isoAlpha2Code: 'UZ',
		isoAlpha3Code: 'UZB'
	}, {
		countryName: 'Holy See (the)',
		isoNum: '336',
		telCode: '379',
		isoAlpha2Code: 'VA',
		isoAlpha3Code: 'VAT'
	}, {
		countryName: 'Saint Vincent and the Grenadines',
		isoNum: '670',
		telCode: '1-784',
		isoAlpha2Code: 'VC',
		isoAlpha3Code: 'VCT'
	}, {
		countryName: 'Venezuela (Bolivarian Republic of)',
		isoNum: '862',
		telCode: '58',
		isoAlpha2Code: 'VE',
		isoAlpha3Code: 'VEN'
	}, {
		countryName: 'Virgin Islands (British)',
		isoNum: '92',
		telCode: '1-284',
		isoAlpha2Code: 'VG',
		isoAlpha3Code: 'VGB'
	}, {
		countryName: 'Virgin Islands (U.S.)',
		isoNum: '850',
		telCode: '1-340',
		isoAlpha2Code: 'VI',
		isoAlpha3Code: 'VIR'
	}, {
		countryName: 'Viet Nam',
		isoNum: '704',
		telCode: '84',
		isoAlpha2Code: 'VN',
		isoAlpha3Code: 'VNM'
	}, {
		countryName: 'Vanuatu',
		isoNum: '548',
		telCode: '678',
		isoAlpha2Code: 'VU',
		isoAlpha3Code: 'VUT'
	}, {
		countryName: 'Wallis and Futuna',
		isoNum: '876',
		telCode: '681',
		isoAlpha2Code: 'WF',
		isoAlpha3Code: 'WLF'
	}, {
		countryName: 'Samoa',
		isoNum: '882',
		telCode: '685',
		isoAlpha2Code: 'WS',
		isoAlpha3Code: 'WSM'
	}, {
		countryName: 'Yemen',
		isoNum: '887',
		telCode: '967',
		isoAlpha2Code: 'YE',
		isoAlpha3Code: 'YEM'
	}, {
		countryName: 'Mayotte',
		isoNum: '175',
		telCode: '262',
		isoAlpha2Code: 'YT',
		isoAlpha3Code: 'MYT'
	}, {
		countryName: 'South Africa',
		isoNum: '710',
		telCode: '27',
		isoAlpha2Code: 'ZA',
		isoAlpha3Code: 'ZAF'
	}, {
		countryName: 'Zambia',
		isoNum: '894',
		telCode: '260',
		isoAlpha2Code: 'ZM',
		isoAlpha3Code: 'ZMB'
	}, {
		countryName: 'Zimbabwe',
		isoNum: '716',
		telCode: '263',
		isoAlpha2Code: 'ZW',
		isoAlpha3Code: 'ZWE'
	}];


	//== On traffic ...
	return {

		onrequest: function(req, res, next) {

			//logger.info('--PACC:  country-code plugin entered');
			//logger.info('--SA:',config.actionpathsegment, ', typeof:', typeof config.actionpathsegment, ', isArray:', Array.isArray(config.actionpathsegment) );

			//== Check we have sufficient information to proceed
			var countryCode3 = "";
			if (config.activate == true && config.attribute_name && config.country_header ) {
				var locationFound = "";
				if (req.headers[config.country_header]) {
					locationFound = req.headers[config.country_header];
					logger.info('--PACC: Using existing header value :-', locationFound);
				} else {
					try {
						//== We should get a custom header with App attributes. Translate from base64.
						let buff = new Buffer.from(req.headers['x-authorization-claims'], 'base64');
						let jClaims = JSON.parse(buff.toString('ascii'));
						let attrs = jClaims.app_custom_attributes;
						locationFound = attrs[config.attribute_name];
						//logger.info('--PACC: locationFound=',locationFound);
					} catch (e) {
						logger.info('--PACC: General error :-', e.stack);
					}
				}
				if (locationFound) {
					//== Keep numeric codes as is
					if (!isNaN(locationFound)) {
						countryCode3 = locationFound;
					} else if (locationFound.length === 2) {
					//== For 2 letter non-numeric codes, look up the 3 letter code
						locationFound = locationFound.toUpperCase();
						var i=0,
							sIsoCode = 'isoAlpha2Code',
							sReturnIsoCode = 'isoAlpha3Code',
							bFound = false;
						for (i; i < aCountries.length; i++) {
							if (aCountries[i][sIsoCode] === locationFound) {
								countryCode3 = aCountries[i][sReturnIsoCode];
								bFound = true;
								logger.info('--PACC: location found - injecting header ... ', config.country_header, countryCode3);
								break;
							}
						}
						if (!bFound) {
							countryCode3 = "XXX";
							logger.info('--PACC: location value not found in list ... ', config.country_header, countryCode3);
						}
					} else if (locationFound.length === 3) {
					//== Allow 3-digit code in anyway
						countryCode3 = locationFound.toUpperCase();
					} else {
						countryCode3 = "XXX";
						logger.info('--PACC: location value not found in list ... ', config.country_header, countryCode3);
					}
				} else if (config.alt_country_header && req.headers[config.alt_country_header]) {
					locationFound = req.headers[config.alt_country_header];
					logger.info('--PACC: Trying existing alternate header value :-', locationFound);
					//== Keep numeric codes as is
					if (!isNaN(locationFound)) {
					//== For numeric codes, look up the 3 letter code
						var i=0,
							sIsoCode = 'telCode',
							sReturnIsoCode = 'isoAlpha3Code',
							bFound = false;
						for (i; i < aCountries.length; i++) {
							if (aCountries[i][sIsoCode] === locationFound) {
								countryCode3 = aCountries[i][sReturnIsoCode];
								bFound = true;
								logger.info('--PACC: location found - injecting header ... ', config.country_header, countryCode3);
								break;
							}
						}
						if (!bFound) {
							countryCode3 = "XXX";
							logger.info('--PACC: location value not found in list ... ', config.country_header, countryCode3);
						}
					} else if (locationFound.length === 2) {
					//== For 2 letter non-numeric codes, look up the 3 letter code
						locationFound = locationFound.toUpperCase();
						var i=0,
							sIsoCode = 'isoAlpha2Code',
							sReturnIsoCode = 'isoAlpha3Code',
							bFound = false;
						for (i; i < aCountries.length; i++) {
							if (aCountries[i][sIsoCode] === locationFound) {
								countryCode3 = aCountries[i][sReturnIsoCode];
								bFound = true;
								logger.info('--PACC: location found - injecting header ... ', config.country_header, countryCode3);
								break;
							}
						}
						if (!bFound) {
							countryCode3 = "XXX";
							logger.info('--PACC: location value not found in list ... ', config.country_header, countryCode3);
						}
					} else if (locationFound.length === 3) {
					//== Allow 3-digit code in anyway
						countryCode3 = locationFound.toUpperCase();
					} else {
						countryCode3 = "XXX";
						logger.info('--PACC: location value not found in list ... ', config.country_header, countryCode3);
					}
				} else {
					countryCode3 = "ZZZ";
					logger.info('--PACC: location attribute not found in claims ... ', config.country_header, countryCode3);
				}
				logger.info('--PACC: location attribute original & final ... ', locationFound, countryCode3);
				//== Inject a header anyway, hoping we can inject first time without wakeup first then overwrite. !
				req.headers[config.country_header] = countryCode3;
				//logger.info('--PACC :- Header injected', config.country_header);

			}

			//== Traffic must flow to next (plugin)
			next();

		}

	};

}
