// "Date" to an ISO 8601 string with local timezone https://stackoverflow.com/a/17415677
function toLocalISOString(date) {
  var tzo = -date.getTimezoneOffset();
  var dif = tzo >= 0 ? '+' : '-';
  var pad = function(num) {
    return (num < 10 ? '0' : '') + num;
  };

  return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds()) +
    dif + pad(Math.floor(Math.abs(tzo) / 60)) +
    ':' + pad(Math.abs(tzo) % 60);
}

// PrayTimes.js: Prayer Times Calculator (ver 2.3)
function PrayTimes(method) {

  // Constants
  var

  // Time Names
  timeNames = {
    imsak    : 'Imsak',
    fajr     : 'Fajr',
    sunrise  : 'Sunrise',
    dhuhr    : 'Dhuhr',
    asr      : 'Asr',
    sunset   : 'Sunset',
    maghrib  : 'Maghrib',
    isha     : 'Isha',
    midnight : 'Midnight'
  },

  // Calculation Methods
  // https://github.com/islamic-network/prayer-times/blob/6ecb7f964e2c72ad797582aa1b5fee8d3363cae3/src/PrayerTimes/Method.php#L352
  methods = {
    Kemenag: {
      name: 'Kementerian Agama Republik Indonesia',
      params: { fajr: 20, isha: 18 } },
    MWL: {
      name: 'Muslim World League',
      params: { fajr: 18, isha: 17 } },
    ISNA: {
      name: 'Islamic Society of North America (ISNA)',
      params: { fajr: 15, isha: 15 } },
    Egypt: {
      name: 'Egyptian General Authority of Survey',
      params: { fajr: 19.5, isha: 17.5 } },
    Makkah: {
      name: 'Umm Al-Qura University, Makkah',
      params: { fajr: 18.5, isha: '90 min' } },  // fajr was 19 degrees before 1430 hijri
    Karachi: {
      name: 'University of Islamic Sciences, Karachi',
      params: { fajr: 18, isha: 18 } },
    Tehran: {
      name: 'Institute of Geophysics, University of Tehran',
      params: { fajr: 17.7, isha: 14, maghrib: 4.5, midnight: 'Jafari' } },  // isha is not explicitly specified in this method
    Jafari: {
      name: 'Shia Ithna-Ashari, Leva Institute, Qum',
      params: { fajr: 16, isha: 14, maghrib: 4, midnight: 'Jafari' } }
  },

  // Default Parameters in Calculation Methods
  defaultParams = {
    maghrib: '0 min', midnight: 'Standard'

  },

  // Parameter Values
  /*

  // Asr Juristic Methods
  asrJuristics = [
    'Standard',    // Shafi`i, Maliki, Ja`fari, Hanbali
    'Hanafi'       // Hanafi
  ],

  // Midnight Mode
  midnightMethods = [
    'Standard',    // Mid Sunset to Sunrise
    'Jafari'       // Mid Sunset to Fajr
  ],

  // Adjust Methods for Higher Latitudes
  highLatMethods = [
    'NightMiddle', // middle of night
    'AngleBased',  // angle/60th of night
    'OneSeventh',  // 1/7th of night
    'None'         // No adjustment
  ],

  // Time Formats
  timeFormats = [
    '24h',         // 24-hour format
    '12h',         // 12-hour format
    '12hNS',       // 12-hour format with no suffix
    'Float'        // floating point number
  ],
  */

  // Default Settings
  calcMethod = 'Kemenag',

  // do not change anything here; use adjust method instead
  setting = {
    imsak    : '10 min',
    dhuhr    : '0 min',
    asr      : 'Standard',
    highLats : 'NightMiddle'
  },

  timeFormat = '24h',
  timeSuffixes = ['am', 'pm'],
  invalidTime =  '-----',

  numIterations = 1,
  offset = {},

  // Local Variables

  lat, lng, elv,       // coordinates
  timeZone, jDate;     // time variables


  // Initialization

  // set methods defaults
  var defParams = defaultParams;
  for (var i in methods) {
    var params = methods[i].params;
    for (var j in defParams)
      if ((typeof(params[j]) == 'undefined'))
        params[j] = defParams[j];
  };

  // initialize settings
  calcMethod = methods[method] ? method : calcMethod;
  var params = methods[calcMethod].params;
  for (var id in params)
    setting[id] = params[id];

  // init time offsets
  for (var i in timeNames)
    offset[i] = 0;

  // Public Functions
  return {

  // set calculation method
  setMethod: function(method) {
    if (methods[method]) {
      this.adjust(methods[method].params);
      calcMethod = method;
    }
  },

  // set calculating parameters
  adjust: function(params) {
    for (var id in params)
      setting[id] = params[id];
  },

  // set time offsets
  tune: function(timeOffsets) {
    for (var i in timeOffsets)
      offset[i] = timeOffsets[i];
  },

  // get current calculation method
  getMethod: function() { return calcMethod; },

  // get current setting
  getSetting: function() { return setting; },

  // get current time offsets
  getOffsets: function() { return offset; },

  // get default calc parametrs
  getDefaults: function() { return methods; },

  // return prayer times for a given date
  getTimes: function(date, coords, timezone, dst, format) {
    lat = 1* coords[0];
    lng = 1* coords[1];
    elv = coords[2] ? 1* coords[2] : 0;
    timeFormat = format || timeFormat;
    if (date.constructor === Date)
      date = [date.getFullYear(), date.getMonth()+ 1, date.getDate()];
    if (typeof(timezone) == 'undefined' || timezone == 'auto')
      timezone = this.getTimeZone(date);
    if (typeof(dst) == 'undefined' || dst == 'auto')
      dst = this.getDst(date);
    timeZone = 1* timezone+ (1* dst ? 1 : 0);
    jDate = this.julian(date[0], date[1], date[2])- lng/ (15* 24);

    return this.computeTimes();
  },

  // convert float time to the given format (see timeFormats)
  getFormattedTime: function(time, format, suffixes) {
    if (isNaN(time))
      return invalidTime;
    if (format == 'Float') return time;
    suffixes = suffixes || timeSuffixes;

    time = DMath.fixHour(time+ 0.5/ 60);  // add 0.5 minutes to round
    var hours = Math.floor(time);
    var minutes = Math.floor((time- hours)* 60);
    var suffix = (format == '12h') ? suffixes[hours < 12 ? 0 : 1] : '';
    var hour = (format == '24h') ? this.twoDigitsFormat(hours) : ((hours+ 12 -1)% 12+ 1);
    return hour+ ':'+ this.twoDigitsFormat(minutes)+ (suffix ? ' '+ suffix : '');
  },

  // Calculation Functions

  // compute mid-day time
  midDay: function(time) {
    var eqt = this.sunPosition(jDate+ time).equation;
    var noon = DMath.fixHour(12- eqt);
    return noon;
  },

  // compute the time at which sun reaches a specific angle below horizon
  sunAngleTime: function(angle, time, direction) {
    var decl = this.sunPosition(jDate+ time).declination;
    var noon = this.midDay(time);
    var t = 1/15* DMath.arccos((-DMath.sin(angle)- DMath.sin(decl)* DMath.sin(lat))/
        (DMath.cos(decl)* DMath.cos(lat)));
    return noon+ (direction == 'ccw' ? -t : t);
  },

  // compute asr time
  asrTime: function(factor, time) {
    var decl = this.sunPosition(jDate+ time).declination;
    var angle = -DMath.arccot(factor+ DMath.tan(Math.abs(lat- decl)));
    return this.sunAngleTime(angle, time);
  },

  // compute declination angle of sun and equation of time
  // Ref: http://aa.usno.navy.mil/faq/docs/SunApprox.php
  sunPosition: function(jd) {
    var D = jd - 2451545.0;
    var g = DMath.fixAngle(357.529 + 0.98560028* D);
    var q = DMath.fixAngle(280.459 + 0.98564736* D);
    var L = DMath.fixAngle(q + 1.915* DMath.sin(g) + 0.020* DMath.sin(2*g));

    var R = 1.00014 - 0.01671* DMath.cos(g) - 0.00014* DMath.cos(2*g);
    var e = 23.439 - 0.00000036* D;

    var RA = DMath.arctan2(DMath.cos(e)* DMath.sin(L), DMath.cos(L))/ 15;
    var eqt = q/15 - DMath.fixHour(RA);
    var decl = DMath.arcsin(DMath.sin(e)* DMath.sin(L));

    return {declination: decl, equation: eqt};
  },

  // convert Gregorian date to Julian day
  // Ref: Astronomical Algorithms by Jean Meeus
  julian: function(year, month, day) {
    if (month <= 2) {
      year -= 1;
      month += 12;
    };
    var A = Math.floor(year/ 100);
    var B = 2- A+ Math.floor(A/ 4);

    var JD = Math.floor(365.25* (year+ 4716))+ Math.floor(30.6001* (month+ 1))+ day+ B- 1524.5;
    return JD;
  },

  // Compute Prayer Times

  // compute prayer times at given julian date
  computePrayerTimes: function(times) {
    times = this.dayPortion(times);
    var params  = setting;

    var imsak   = this.sunAngleTime(this.eval(params.imsak), times.imsak, 'ccw');
    var fajr    = this.sunAngleTime(this.eval(params.fajr), times.fajr, 'ccw');
    var sunrise = this.sunAngleTime(this.riseSetAngle(), times.sunrise, 'ccw');
    var dhuhr   = this.midDay(times.dhuhr);
    var asr     = this.asrTime(this.asrFactor(params.asr), times.asr);
    var sunset  = this.sunAngleTime(this.riseSetAngle(), times.sunset);;
    var maghrib = this.sunAngleTime(this.eval(params.maghrib), times.maghrib);
    var isha    = this.sunAngleTime(this.eval(params.isha), times.isha);

    return {
      imsak: imsak, fajr: fajr, sunrise: sunrise, dhuhr: dhuhr,
      asr: asr, sunset: sunset, maghrib: maghrib, isha: isha
    };
  },

  // compute prayer times
  computeTimes: function() {
    // default times
    var times = {
      imsak: 5, fajr: 5, sunrise: 6, dhuhr: 12,
      asr: 13, sunset: 18, maghrib: 18, isha: 18
    };

    // main iterations
    for (var i=1 ; i<=numIterations ; i++)
      times = this.computePrayerTimes(times);

    times = this.adjustTimes(times);

    // add midnight time
    times.midnight = (setting.midnight == 'Jafari') ?
        times.sunset+ this.timeDiff(times.sunset, times.fajr)/ 2 :
        times.sunset+ this.timeDiff(times.sunset, times.sunrise)/ 2;

    times = this.tuneTimes(times);
    return this.modifyFormats(times);
  },

  // adjust times
  adjustTimes: function(times) {
    var params = setting;
    for (var i in times)
      times[i] += timeZone- lng/ 15;

    if (params.highLats != 'None')
      times = this.adjustHighLats(times);

    if (this.isMin(params.imsak))
      times.imsak = times.fajr- this.eval(params.imsak)/ 60;
    if (this.isMin(params.maghrib))
      times.maghrib = times.sunset+ this.eval(params.maghrib)/ 60;
    if (this.isMin(params.isha))
      times.isha = times.maghrib+ this.eval(params.isha)/ 60;
    times.dhuhr += this.eval(params.dhuhr)/ 60;

    return times;
  },

  // get asr shadow factor
  asrFactor: function(asrParam) {
    var factor = {Standard: 1, Hanafi: 2}[asrParam];
    return factor || this.eval(asrParam);
  },

  // return sun angle for sunset/sunrise
  riseSetAngle: function() {
    //var earthRad = 6371009; // in meters
    //var angle = DMath.arccos(earthRad/(earthRad+ elv));
    var angle = 0.0347* Math.sqrt(elv); // an approximation
    return 0.833+ angle;
  },

  // apply offsets to the times
  tuneTimes: function(times) {
    for (var i in times)
      times[i] += offset[i]/ 60;
    return times;
  },

  // convert times to given time format
  modifyFormats: function(times) {
    for (var i in times)
      times[i] = this.getFormattedTime(times[i], timeFormat);
    return times;
  },

  // adjust times for locations in higher latitudes
  adjustHighLats: function(times) {
    var params = setting;
    var nightTime = this.timeDiff(times.sunset, times.sunrise);

    times.imsak = this.adjustHLTime(times.imsak, times.sunrise, this.eval(params.imsak), nightTime, 'ccw');
    times.fajr  = this.adjustHLTime(times.fajr, times.sunrise, this.eval(params.fajr), nightTime, 'ccw');
    times.isha  = this.adjustHLTime(times.isha, times.sunset, this.eval(params.isha), nightTime);
    times.maghrib = this.adjustHLTime(times.maghrib, times.sunset, this.eval(params.maghrib), nightTime);

    return times;
  },

  // adjust a time for higher latitudes
  adjustHLTime: function(time, base, angle, night, direction) {
    var portion = this.nightPortion(angle, night);
    var timeDiff = (direction == 'ccw') ?
      this.timeDiff(time, base):
      this.timeDiff(base, time);
    if (isNaN(time) || timeDiff > portion)
      time = base+ (direction == 'ccw' ? -portion : portion);
    return time;
  },

  // the night portion used for adjusting times in higher latitudes
  nightPortion: function(angle, night) {
    var method = setting.highLats;
    var portion = 1/2 // MidNight
    if (method == 'AngleBased')
      portion = 1/60* angle;
    if (method == 'OneSeventh')
      portion = 1/7;
    return portion* night;
  },

  // convert hours to day portions
  dayPortion: function(times) {
    for (var i in times)
      times[i] /= 24;
    return times;
  },

  // Time Zone Functions

  // get local time zone
  getTimeZone: function(date) {
    var year = date[0];
    var t1 = this.gmtOffset([year, 0, 1]);
    var t2 = this.gmtOffset([year, 6, 1]);
    return Math.min(t1, t2);
  },

  // get daylight saving for a given date
  getDst: function(date) {
    return 1* (this.gmtOffset(date) != this.getTimeZone(date));
  },

  // GMT offset for a given date
  gmtOffset: function(date) {
    var localDate = new Date(date[0], date[1]- 1, date[2], 12, 0, 0, 0);
    var GMTString = localDate.toGMTString();
    var GMTDate = new Date(GMTString.substring(0, GMTString.lastIndexOf(' ')- 1));
    var hoursDiff = (localDate- GMTDate) / (1000* 60* 60);
    return hoursDiff;
  },

  // Misc Functions

  // convert given string into a number
  eval: function(str) {
    return 1* (str+ '').split(/[^0-9.+-]/)[0];
  },

  // detect if input contains 'min'
  isMin: function(arg) {
    return (arg+ '').indexOf('min') != -1;
  },

  // compute the difference between two times
  timeDiff: function(time1, time2) {
    return DMath.fixHour(time2- time1);
  },

  // add a leading 0 if necessary
  twoDigitsFormat: function(num) {
    return (num <10) ? '0'+ num : num;
  }

}}

// PrayTimes: Degree-Based Math
const DMath = {

  dtr: function(d) { return (d * Math.PI) / 180.0; },
  rtd: function(r) { return (r * 180.0) / Math.PI; },

  sin: function(d) { return Math.sin(this.dtr(d)); },
  cos: function(d) { return Math.cos(this.dtr(d)); },
  tan: function(d) { return Math.tan(this.dtr(d)); },

  arcsin: function(d) { return this.rtd(Math.asin(d)); },
  arccos: function(d) { return this.rtd(Math.acos(d)); },
  arctan: function(d) { return this.rtd(Math.atan(d)); },

  arccot: function(x) { return this.rtd(Math.atan(1/x)); },
  arctan2: function(y, x) { return this.rtd(Math.atan2(y, x)); },

  fixAngle: function(a) { return this.fix(a, 360); },
  fixHour:  function(a) { return this.fix(a, 24 ); },

  fix: function(a, b) {
    a = a- b* (Math.floor(a/ b));
    return (a < 0) ? a+ b : a;
  }
}

function gregorianToHijri(date, data, method) {
  try {
    const gregorianDate = new Date(date); // input date in YYYY-MM-DD format
    const hijriData = data[method];
    const hijriYears = Object.keys(hijriData).map(year => parseInt(year, 10)); // convert year to an integer
    gregorianDate.setHours(0, 0, 0, 0); // normalize to midnight in local time

    for (const year of hijriYears) {
      const { start, dataByMonth } = hijriData[year];
      const startOfYear = new Date(start);
      startOfYear.setHours(0, 0, 0, 0); // normaliz to midnight in local time

      if (gregorianDate >= startOfYear) {
        // Calculate the number of days between the input date and the Hijri year's start date
        let dayOffset = Math.floor((gregorianDate - startOfYear) / (1000 * 60 * 60 * 24));

        for (let month = 0; month < dataByMonth.length; month++) {
          if (dayOffset < dataByMonth[month]) {
            const date = dayOffset + 1; // Days are 1-based index

            return {
              year: year,
              month: month,
              date
            };
          }
          dayOffset -= dataByMonth[month];
        }
      }
    }

    // if the input date is outside the range of the Hijri data, throw an error
    const startYear = Math.min.apply(null, hijriYears);
    const endYear = Math.max.apply(null, hijriYears);
    throw new Error(`Date is out of range for the provided Hijri data. Available range: ${startYear} to ${endYear} H.`);
  } catch (error) {
    return { error: true, message: error.message };
  }
}

/*
Source:
- https://simbi.kemenag.go.id/eliterasi/pencarian/kalender
- https://www.al-habib.info/kalender-islam/kalender-islam-global.htm
- https://www.ummulqura.org.sa/Index.aspx
- https://github.com/xsoh/moment-hijri/blob/1d8a04b0b3a887c73847d41451c7efbc2a1f4569/moment-hijri.js#L33
*/
const hijri_data = {
  kemenag: {
    1444: {
      start: "2022-07-30",
      dataByMonth: [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29] //354
    },
    1445: {
      start: "2023-07-19",
      dataByMonth: [30, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 29] //354
    },
    1446: {
      start: "2024-07-07",
      dataByMonth: [30, 30, 29, 30, 30, 29, 30, 29, 30, 29, 29, 30] //355
    },
    // 1447: {
    //   start: "2025-06-26",
    //   dataByMonth: [29, 30, 29, 30, 30, 29, ]
    // }
  },
  ummulqura: {
    1444: {
      start: "2022-07-30",
      dataByMonth: [29, 30, 29, 30, 30, 29, 29, 30, 29, 30, 29, 30] //354
    },
    1445: {
      start: "2023-07-19",
      dataByMonth: [29, 30, 30, 30, 29, 30, 29, 29, 30, 29, 29, 30] //354
    },
    1446: {
      start: "2024-07-07",
      dataByMonth: [29, 30, 30, 30, 29, 30, 30, 29, 29, 30, 29, 29] //354
    },
    1447: {
      start: "2025-06-26",
      dataByMonth: [30, 29, 30, 30, 30, 29, 30, 29, 30, 29, 30, 29] //355
    }
  }
}

// ./db/indonesia_cities.js
const loc_data = [
  {"name":"Ambon","id":"81.71","lat":-3.694636,"long":128.1812715,"tz":9},{"name":"Balikpapan","id":"64.71","lat":-1.2767308,"long":116.8276976,"tz":8},{"name":"Banda Aceh","id":"11.71","lat":5.5496311,"long":95.3180326,"tz":7},{"name":"Bandar Lampung","id":"18.71","lat":-5.4296977,"long":105.262766,"tz":7},{"name":"Bandung","id":"32.73","lat":-6.9108795,"long":107.6098588,"tz":7},{"name":"Banjar","id":"32.79","lat":-7.3624698,"long":108.5595577,"tz":7},{"name":"Banjarbaru","id":"63.72","lat":-3.4388957,"long":114.8310499,"tz":8},{"name":"Banjarmasin","id":"63.71","lat":-3.3272135,"long":114.588379,"tz":8},{"name":"Batam","id":"21.71","lat":1.1276777,"long":104.0554723,"tz":7},{"name":"Batu","id":"35.79","lat":-7.8664455,"long":112.5125194,"tz":7},{"name":"Baubau","id":"74.72","lat":-5.4854507,"long":122.5850448,"tz":8},{"name":"Bekasi","id":"32.75","lat":-6.2359827,"long":106.9941591,"tz":7},{"name":"Bengkulu","id":"17.71","lat":-3.7599846,"long":102.3030242,"tz":7},{"name":"Bima","id":"52.72","lat":-8.4618992,"long":118.7485375,"tz":8},{"name":"Binjai","id":"12.75","lat":3.60296,"long":98.4831859,"tz":7},{"name":"Bitung","id":"71.72","lat":1.4455765,"long":125.1834273,"tz":8},{"name":"Blitar","id":"35.72","lat":-8.0994186,"long":112.164511,"tz":7},{"name":"Bogor","id":"32.71","lat":-6.5952306,"long":106.7936912,"tz":7},{"name":"Bontang","id":"64.74","lat":0.0693849,"long":117.4441224,"tz":8},{"name":"Bukittinggi","id":"13.75","lat":-0.2855984,"long":100.3680793,"tz":7},{"name":"Cilegon","id":"36.72","lat":-6.0100651,"long":106.0420965,"tz":7},{"name":"Cimahi","id":"32.77","lat":-6.8707756,"long":107.5549314,"tz":7},{"name":"Cirebon","id":"32.74","lat":-6.7069067,"long":108.5581623,"tz":7},{"name":"Denpasar","id":"51.71","lat":-8.656042,"long":115.216314,"tz":8},{"name":"Depok","id":"32.76","lat":-6.3945686,"long":106.8223566,"tz":7},{"name":"Dumai","id":"14.72","lat":1.6054001,"long":101.3917345,"tz":7},{"name":"Gorontalo","id":"75.71","lat":0.5318892,"long":123.0595042,"tz":8},{"name":"Gunungsitoli","id":"12.78","lat":1.2825866,"long":97.6133933,"tz":7},{"name":"Jakarta","id":"31.71","lat":-6.1731003,"long":106.8186917,"tz":7},{"name":"Jambi","id":"15.71","lat":-1.6289777,"long":103.6082404,"tz":7},{"name":"Jayapura","id":"91.71","lat":-2.5628544,"long":140.6926452,"tz":9},{"name":"Kediri","id":"35.71","lat":-7.812428,"long":112.014252,"tz":7},{"name":"Kendari","id":"74.71","lat":-3.9729198,"long":122.5117401,"tz":8},{"name":"Kotamobagu","id":"71.74","lat":0.7429829,"long":124.3126466,"tz":8},{"name":"Kupang","id":"53.71","lat":-10.1540479,"long":123.6195501,"tz":8},{"name":"Langsa","id":"11.74","lat":4.4691405,"long":97.9664597,"tz":7},{"name":"Lhokseumawe","id":"11.73","lat":5.1790965,"long":97.1488972,"tz":7},{"name":"Lubuklinggau","id":"16.73","lat":-3.3260281,"long":102.8252793,"tz":7},{"name":"Madiun","id":"35.77","lat":-7.6247478,"long":111.5205848,"tz":7},{"name":"Magelang","id":"33.71","lat":-7.5040903,"long":110.221036,"tz":7},{"name":"Makassar","id":"73.71","lat":-5.1335271,"long":119.4080136,"tz":8},{"name":"Malang","id":"35.73","lat":-7.978075,"long":112.633868,"tz":7},{"name":"Manado","id":"71.71","lat":1.4843177,"long":124.8490822,"tz":8},{"name":"Mataram","id":"52.71","lat":-8.5830153,"long":116.1081277,"tz":8},{"name":"Medan","id":"12.71","lat":3.5904796,"long":98.6748504,"tz":7},{"name":"Metro","id":"18.72","lat":-5.1140417,"long":105.3066657,"tz":7},{"name":"Mojokerto","id":"35.76","lat":-7.4701596,"long":112.4402809,"tz":7},{"name":"Padang","id":"13.71","lat":-0.8758335,"long":100.3874282,"tz":7},{"name":"Padang Panjang","id":"13.74","lat":-0.4621319,"long":100.3903976,"tz":7},{"name":"Padangsidimpuan","id":"12.77","lat":1.3775075,"long":99.2716586,"tz":7},{"name":"Pagar Alam","id":"16.72","lat":-4.0393336,"long":103.1970199,"tz":7},{"name":"Palangka Raya","id":"62.71","lat":-2.1752362,"long":113.8794169,"tz":7},{"name":"Palembang","id":"16.71","lat":-2.9910862,"long":104.7567509,"tz":7},{"name":"Palopo","id":"73.73","lat":-3.0086436,"long":120.2015531,"tz":8},{"name":"Palu","id":"72.71","lat":-0.9001248,"long":119.8909599,"tz":8},{"name":"Pangkalpinang","id":"19.71","lat":-2.1410465,"long":106.1159086,"tz":7},{"name":"Parepare","id":"73.72","lat":-4.0280283,"long":119.6333168,"tz":8},{"name":"Pariaman","id":"13.77","lat":-0.6289225,"long":100.1387554,"tz":7},{"name":"Pasuruan","id":"35.75","lat":-7.6474192,"long":112.9084766,"tz":7},{"name":"Payakumbuh","id":"13.76","lat":-0.2223767,"long":100.6318454,"tz":7},{"name":"Pekalongan","id":"33.75","lat":-6.8971947,"long":109.6620809,"tz":7},{"name":"Pekanbaru","id":"14.71","lat":0.5171001,"long":101.5406378,"tz":7},{"name":"Pematangsiantar","id":"12.72","lat":2.9565527,"long":99.0617375,"tz":7},{"name":"Pontianak","id":"61.71","lat":0.0009995,"long":109.3222052,"tz":7},{"name":"Prabumulih","id":"16.74","lat":-3.3688982,"long":104.3084936,"tz":7},{"name":"Probolinggo","id":"35.74","lat":-7.753986,"long":113.214261,"tz":7},{"name":"Sabang","id":"11.72","lat":5.8924216,"long":95.3211172,"tz":7},{"name":"Salatiga","id":"33.73","lat":-7.3312525,"long":110.5005091,"tz":7},{"name":"Samarinda","id":"64.72","lat":-0.492215,"long":117.1458624,"tz":8},{"name":"Sawahlunto","id":"13.73","lat":-0.6749318,"long":100.7671885,"tz":7},{"name":"Semarang","id":"33.74","lat":-6.9820957,"long":110.412712,"tz":7},{"name":"Serang","id":"36.73","lat":-6.1326529,"long":106.191412,"tz":7},{"name":"Sibolga","id":"12.73","lat":1.7460105,"long":98.7755879,"tz":7},{"name":"Singkawang","id":"61.72","lat":0.9042823,"long":108.9773523,"tz":7},{"name":"Solok","id":"13.72","lat":-0.7989527,"long":100.6526681,"tz":7},{"name":"Sorong","id":"92.71","lat":-0.8811366,"long":131.2876403,"tz":9},{"name":"Subulussalam","id":"11.75","lat":2.6704565,"long":97.9930009,"tz":7},{"name":"Sukabumi","id":"32.72","lat":-6.9178948,"long":106.9315006,"tz":7},{"name":"Sungai Penuh","id":"15.72","lat":-2.0708368,"long":101.3951975,"tz":7},{"name":"Surabaya","id":"35.78","lat":-7.2591517,"long":112.7468971,"tz":7},{"name":"Surakarta","id":"33.72","lat":-7.5695366,"long":110.829342,"tz":7},{"name":"Tangerang","id":"36.71","lat":-6.1707294,"long":106.6406005,"tz":7},{"name":"Tangerang Selatan","id":"36.74","lat":-6.3223832,"long":106.7077614,"tz":7},{"name":"Tanjung Pinang","id":"21.72","lat":0.9654188,"long":104.4409818,"tz":7},{"name":"Tanjungbalai","id":"12.74","lat":2.9479469,"long":99.7641231,"tz":7},{"name":"Tarakan","id":"65.71","lat":3.3144425,"long":117.6050257,"tz":8},{"name":"Tasikmalaya","id":"32.78","lat":-7.3164295,"long":108.1969642,"tz":7},{"name":"Tebing Tinggi","id":"12.76","lat":3.3279492,"long":99.1664886,"tz":7},{"name":"Tegal","id":"33.76","lat":-6.8703086,"long":109.1378277,"tz":7},{"name":"Ternate","id":"82.71","lat":0.7857139,"long":127.3880831,"tz":9},{"name":"Tidore Kepulauan","id":"82.72","lat":0.6715522,"long":127.4467118,"tz":9},{"name":"Tomohon","id":"71.73","lat":1.3142381,"long":124.8277264,"tz":8},{"name":"Tual","id":"81.72","lat":-5.6346362,"long":132.7517315,"tz":9},{"name":"Yogyakarta","id":"34.71","lat":-7.8001814,"long":110.3913493,"tz":7}
];

const getData = function(data) {
  loc_id = Number(loc_id);
  if (data.length <= loc_id) loc_id = 29; // Jakarta
  return data[loc_id - 1];
};

const genSelectOption = function(id, data) {
  let selected;
  let options = '';

  for (let i = 0; i < data.length; i++) {
    if (data[i]) {
      const num  = i + 1;
      selected = num == id ? ' selected="selected" ' : ' ';
      options += `<option${selected}value="${num}">${data[i].name}</option>`;
    }
  }

  return options;
};

function nextTime(prayerTimes) {
  const now = currentTime(loc_tz);
  const date = toLocalISOString(now).split('T')[0]; // Get today's date in YYYY-MM-DD format

  // Convert prayer times to an array with names and Date objects.
  const prayerEntries = Object.entries(prayerTimes)
    .filter(([name]) => !['imsak', 'sunrise', 'sunset', 'midnight'].includes(name))
    .map(([name, time]) => {
      const [hour, minute] = time.split(':').map(Number);
      const prayerTime = new Date(date);
      prayerTime.setHours(hour, minute, 0, 0);
      return {
        name,
        time: prayerTime
      };
    });

  // Find the first prayer time that is later than the current time.
  let nextPrayer = prayerEntries.find((prayer) => prayer.time > now);

  if (!nextPrayer) {
    // If no prayer is left today, wrap around to the first prayer of the next day.
    nextPrayer = { ...prayerEntries[0] };
    nextPrayer.time.setDate(nextPrayer.time.getDate() + 1);
  }

  return nextPrayer;
}

function displayRemain(el) {
  const time = currentTime(loc_tz);
  const r_time = Math.floor((next_prayer.time - time) / 1000);
  if (r_time > 0) {
    el.innerHTML = formatTime(r_time, true);
    timer_remain = setTimeout(() => { displayRemain(el) }, 1000);
  } else {
    updateTimeTable();
  }
}

function remainTime(times) {
  next_prayer = nextTime(times);
  let next, remain = p_el.querySelector('.remain');
  if (remain) {
    next = remain.parentElement;
    next.removeChild(remain);
    next.classList.remove('next');
    next.removeAttribute('title');
  }

  remain = document.createElement('div');
  remain.className = 'remain';
  remain.innerHTML = '00:00:00';
  remain.style.opacity = null;

  next = p_el.querySelector(`.${next_prayer.name}`).parentElement;
  next.appendChild(remain);
  next.classList.add('next');
  next.setAttribute('title', 'Selanjutnya');

  clearTimeout(timer_remain);
  displayRemain(remain);
  setTimeout(() => { remain.style.opacity = 1; }, 300);
}

function updateTimeTable() {
  const data = getData(loc_data);
  const loc = [data.lat, data.long];
  const times = prayerTimes.getTimes(today, loc, data.tz, 'auto', '24h');
  const names = {fajr: 'Subuh', dhuhr: 'Zhuhur', asr: 'Ashar', maghrib: 'Maghrib', isha: 'Isya'};

  for (const [key, value] of Object.entries(times)) {
    if (names[key]) {
      let time = p_el.querySelector(`.${key}`);
      if (time) {
        time.style.opacity = null;
        time.parentElement.querySelector('.time').textContent = value;
      } else {
        time = document.createElement('li');
        time.innerHTML = `<div class="name">${names[key]}</div><div class="time ${key}">${value}</div>`;
        p_el.appendChild(time);
      }
    }
  }

  setTimeout(() => {
    p_el.querySelectorAll('.time').forEach((el) => {
      el.style.opacity = 1;
    });
  }, 300);

  remainTime(times);
}

function formatTime(time, remain) {
  let hours = remain ? Math.floor(time / 3600) : time.getHours();
  let minutes = remain ? Math.floor((time % 3600) / 60) : time.getMinutes();
  let seconds = remain ? time % 60 : time.getSeconds();

  // Pad single digits with a leading zero
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  // Format time in HH:mm:ss
  const timeString = `${hours}:${minutes}:${seconds}`;

  return timeString;
}

function currentTime(offset = 0) {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
  const customTime = new Date(utc + offset * 3600000); // Offset in hours, converted to milliseconds

  return customTime;
}

function displayTime(el) {
  const time = currentTime(loc_tz);
  el.setAttribute('data-currentTime', time.getTime());
  el.querySelector('.clock').innerHTML = formatTime(time);
  timer_clock = setTimeout(() => { displayTime(el) }, 1000);

  if (today.toLocaleDateString() != time.toLocaleDateString()) {
    today = time;
    updateDate();
  }
}

function updateClock() {
  t_el.dataset.timezone = loc_tz;
  t_el.style.opacity = null;

  const timezoneLabel = loc_tz < 0 ? loc_tz : '+' + loc_tz;
  t_el.setAttribute('title', `Zona Waktu: ${time_ID[loc_tz]} UTC${timezoneLabel}`);
  t_el.querySelector('.zone').innerHTML = time_ID[loc_tz];

  clearTimeout(timer_clock);
  displayTime(t_el);
  setTimeout(() => { t_el.style.opacity = 1; }, 300);
}

function updateDate() {
  const days = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu'];
  const gregorianMonth = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const hijriMonth = ['Muharram', 'Shafar', "Rabi'ul Awal", "Rabi'ul Akhir", 'Jumadil Awal', 'Jumadil Akhir', 'Rajab', "Sya'ban", 'Ramadhan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah'];

  // d_el.setAttribute('data-date', toLocalISOString(today).split('T')[0]);
  d_gregorian.innerHTML = `${days[today.getDay()]}, ${today.getDate()} ${gregorianMonth[today.getMonth()]} ${today.getFullYear()}`;

  const hijriDate = gregorianToHijri(today, hijri_data, 'kemenag');
  if ('error' in hijriDate) {
    console.error(hijriDate.message);
    d_hijri.classList.add('no_items');
  } else {
    d_hijri.innerHTML = `${hijriDate.date} ${hijriMonth[hijriDate.month]} ${hijriDate.year} H`;
  }
  setTimeout(() => { d_el.style.opacity = 1; }, 300);
}


// Init
const prayerTimes = new PrayTimes();
const time_ID = {
  7: "WIB",
  8: "WITA",
  9: "WIT"
};

const t_el = document.querySelector('#time');
const l_el = document.querySelector('.location');
const l_name = l_el.querySelector('.location .name');
const l_city = l_el.querySelector('.city');
const p_el = document.querySelector('.pray');
const d_el = document.querySelector('.date');
const d_gregorian = d_el.querySelector('.gregorian');
const d_hijri = d_el.querySelector('.hijri');

let timer_clock, timer_remain, next_prayer;
let loc_id = localStorage.getItem('loc-id') || 29; // Jakarta Pusat
if (getParam('loc')) loc_id = getParam('loc')[0];
let loc_tz = getData(loc_data).tz;
let today = currentTime(loc_tz);

l_city.innerHTML = genSelectOption(loc_id, loc_data);
l_name.innerHTML = l_city.querySelector('option:checked').textContent;
setTimeout(() => { l_el.style.opacity = 1; }, 300);

updateClock();
updateTimeTable();
updateDate();

l_el.addEventListener('click', function(e){
  if (e.target.classList.contains('name')) l_city.focus();
});

l_city.addEventListener('change', function(e){
  loc_id = e.target.value;
  loc_tz = getData(loc_data).tz;
  today = currentTime(loc_tz);
  localStorage.setItem('loc-id', loc_id);

  if (e.type == 'change') {
    updateTimeTable();
    updateClock();
    const selected = this.options[this.selectedIndex].text;
    l_name.innerHTML = selected;
  }

  this.blur();
});
