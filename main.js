// Get URL Variables https://codepen.io/sekedus/pen/jOpNmja
function getParam(param, url) {
  var result = [];
  var loc = url ? new URL(url) : window.location;
  var query = loc.search.substring(1).split('&');
  for (var i = 0; i < query.length; i++) {
    var pair = query[i].split('=');
    if (pair[0] == param) {
      if (pair.length == 1) {
        return true;
      } else {
        result.push(decodeURIComponent(pair[1].replace(/\+/g, ' ')));
      }
    }
  }
  return result.length == 0 ? false : result;
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
    const gregorianDate = typeof date === 'string' ? new Date(date) : date; // input date in YYYY-MM-DD format
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

// Weather https://github.com/cahyadsn/adzan/blob/e07f3bca5d960bc741435b49ae3b31a250ed9780/data/indonesia.txt
const loc_gcs = '1!Ambarawa!7!16!1!110!24!1!7!0!0!0!-7.2599669!110.4000664|2!Ambon!3!42!1!128!10!1!9!0!0!0!-3.6974632!128.1771469|3!Amlapura!8!27!1!115!37!1!8!0!0!0!-8.4550535!115.601577|4!Amuntai!2!26!1!115!15!1!8!0!0!0!-2.4265661!115.246067|5!Argamakmur!3!26!1!102!16!1!7!0!0!0|6!Atambua!9!6!1!124!54!1!9!0!0!0|7!Babo!2!30!1!133!30!1!9!0!0!0|8!Bagan Siapiapi!2!12!0!100!50!1!7!0!0!0|9!Bajawa!8!47!1!120!58!1!8!0!0!0|10!Balige!2!20!0!99!4!1!7!0!0!0|11!Balikpapan!1!17!1!116!50!1!7!0!0!0|12!Banda Aceh!5!19!0!95!21!1!7!0!0!0|13!Bandarlampung!5!26!1!105!14!1!7!0!0!0|14!Bandung!6!55!1!107!36!1!7!0!0!0!-6.91!107.6|15!Bangkalan!7!2!1!112!46!1!7!0!0!0|16!Bangkinang!0!18!0!101!5!1!7!0!0!0|17!Bangko!2!5!1!102!9!1!7!0!0!0|18!Bangli!8!27!1!115!21!1!8!0!0!0|19!Banjar!7!22!1!108!31!1!7!0!0!0|20!Banjar Baru!3!25!1!114!50!1!8!0!0!0|21!Banjarmasin!3!19!1!114!32!1!8!0!0!0|22!Banjarnegara!7!24!1!109!42!1!7!0!0!0|23!Bantaeng!5!32!1!119!56!1!8!0!0!0|24!Banten!6!3!1!106!11!1!7!0!0!0|25!Bantul!7!33!1!110!11!1!7!0!0!0|26!Banyuwangi!8!12!1!114!22!1!7!0!0!0!-8.2!114.37|27!Barabai!2!32!1!115!34!1!8!0!0!0|28!Barito!4!0!1!114!50!1!8!0!0!0|29!Barru!4!24!1!119!36!1!8!0!0!0|30!Batam!1!8!0!104!3!1!7!0!0!0|31!Batang!6!55!1!109!45!1!7!0!0!0|32!Batu!7!52!1!112!32!1!7!0!0!0|33!Baturaja!4!8!1!104!8!1!7!0!0!0|34!Batusangkar!0!26!1!100!36!1!7!0!0!0|35!Baubau!5!25!1!122!38!1!9!0!0!0|36!Bekasi!6!14!1!106!59!1!7!0!0!0|37!Bengkalis!1!33!0!102!5!1!7!0!0!0|38!Bengkulu!3!49!1!102!19!1!7!0!0!0|39!Benteng!6!10!1!120!30!1!9!0!0!0|40!Biak!1!10!1!136!6!1!9!0!0!0|41!Bima!8!27!1!118!43!1!8!0!0!0!-8.46!118.72|42!Binjai!3!20!0!98!30!1!7!0!0!0|43!Bireuen!5!14!0!96!39!1!7!0!0!0|44!Bitung!1!26!0!125!9!1!9!0!0!0|45!Blitar!8!6!1!112!10!1!7!0!0!0|46!Blora!6!58!1!111!25!1!7!0!0!0|47!Bogor!6!36!1!106!48!1!7!0!0!0|48!Bojonegoro!7!9!1!111!53!1!7!0!0!0|49!Bondowoso!7!55!1!113!49!1!7!0!0!0|50!Bontang!0!4!0!117!30!1!8!0!0!0|51!Boyolali!7!32!1!110!35!1!7!0!0!0|52!Brebes!6!52!1!109!3!1!7!0!0!0|53!Bukit Tinggi!0!17!1!100!26!1!7!0!0!0|54!Bulukumba!5!53!1!120!11!1!8!0!0!0!-5.39!120.169|55!Buntok!1!40!1!114!58!1!8!0!0!0!|56!Cepu!7!9!1!111!35!1!7!0!0!0|57!Ciamis!7!20!1!108!21!1!7!0!0!0|58!Cianjur!6!49!1!107!8!1!7!0!0!0|59!Cibinong!6!24!1!106!41!1!7!0!0!0|60!Cilacap!7!44!1!109!0!1!7!0!0!0|61!Cilegon!6!1!1!106!3!1!7!0!0!0|62!Cimahi!6!52!1!107!33!1!7!0!0!0|63!Cirebon!6!44!1!107!35!1!7!0!0!0|64!Curup!3!28!1!102!31!1!7!0!0!0|65!Demak!6!53!1!110!40!1!7!0!0!0|66!Denpasar!8!39!1!115!13!1!8!0!0!0|67!Depok!6!24!1!106!49!1!7!0!0!0|68!Dili!8!34!1!125!35!1!9!0!0!0|69!Dompu!8!32!1!118!28!1!8!0!0!0|70!Donggala!1!11!0!119!59!1!8!0!0!0!-1.18!119.98|71!Dumai!1!46!0!101!22!1!7!0!0!0|72!Ende!8!51!1!121!39!1!8!0!0!0!-8.853!121.655|73!Enggano!5!20!1!102!40!1!7!0!0!0|74!Enrekang!3!34!1!119!46!1!8!0!0!0|75!Fakfak!2!51!1!132!21!1!9!0!0!0|76!Garut!7!14!1!107!53!1!7!0!0!0|77!Gianyar!8!32!1!115!20!1!8!0!0!0|78!Gombong!7!36!1!109!31!1!7!0!0!0|79!Gorontalo!0!32!0!123!4!1!8!0!0!0|80!Gresik!7!13!1!112!38!1!7!0!0!0|81!Gunung Sitoli!1!16!0!97!37!1!7!0!0!0|82!Indramayu!6!20!1!108!19!1!7!0!0!0|83!Jakarta!6!10!1!106!49!1!7!0!0!0|84!Jambi!1!37!1!103!34!1!7!0!0!0|85!Jayapura!0!32!1!140!27!1!9!0!0!0|86!Jember!8!10!1!113!41!1!7!0!0!0|87!Jeneponto!5!41!1!119!45!1!8!0!0!0|88!Jepara!6!36!1!110!40!1!7!0!0!0|89!Jombang!7!33!1!112!14!1!7!0!0!0|90!Kabanjahe!3!6!0!98!30!1!7!0!0!0|91!Kalabahi!8!13!1!124!31!1!8!0!0!0!|92!Kalianda!5!50!1!105!45!1!7!0!0!0|93!Kandangan!2!45!1!115!16!1!7!0!0!0!-2.7568!115.2668|94!Karanganyar Kebumen!7!38!1!109!34!1!7!0!0!0!-7.631!109.569|95!Karawang!6!19!1!107!20!1!7!0!0!0!-6.322, 107.337|96!Kasungan!1!58!1!113!24!1!8!0!0!0|97!Kayuagung!3!24!1!104!50!1!7!0!0!0|98!Kebumen!7!40!1!109!40!1!7!0!0!0|99!Kediri!7!49!1!112!1!1!7!0!0!0|100!Kefamenanu!9!26!1!124!28!1!8!0!0!0!-9.437!124.471|101!Kendal!6!55!1!110!12!1!7!0!0!0!-6.9213!110.2027|102!Kendari!3!57!1!122!34!1!8!0!0!0|103!Kertosono!7!35!1!112!6!1!7!0!0!0|104!Ketapang!1!45!1!109!54!1!7!0!0!0|105!Kisaran!2!59!0!99!37!1!7!0!0!0|106!Klaten!7!42!1!110!36!1!7!0!0!0|107!Kolaka!4!2!1!121!35!1!8!0!0!0|108!Kota Baru Pulau Laut!3!16!1!116!12!1!8!0!0!0|109!Kota Bumi!4!51!1!104!51!1!7!0!0!0|110!Kota Jantho!5!18!0!95!38!1!7!0!0!0|111!Kota Mobagu!0!44!0!124!18!1!8!0!0!0!0.7345!124.3089|112!Kuala Kapuas!2!59!1!114!23!1!8!0!0!0!-2.9802!114.3864|113!Kuala Kurun!1!10!1!113!50!1!8!0!0!0!-|114!Kuala Pembuang!3!14!1!112!38!1!8!0!0!0!-|115!Kuala Tungkal!0!49!1!103!28!1!7!0!0!0!-|116!Kudus!6!48!1!110!51!1!7!0!0!0|117!Kuningan!6!59!1!108!29!1!7!0!0!0!-6.982!108.483|118!Kupang!10!9!1!123!34!1!8!0!0!0|119!Kutacane!3!30!0!97!48!1!7!0!0!0|120!Kutoarjo!7!43!1!109!54!1!7!0!0!0|121!Labuhan!6!23!1!105!50!1!7!0!0!0|122!Lahat!3!49!1!103!31!1!7!0!0!0|123!Lamongan!7!7!1!112!25!1!7!0!0!0|124!Langsa!4!26!0!97!58!1!7!0!0!0|125!Larantuka!8!20!1!122!59!1!8!0!0!0!-8.338!122.979|126!Lawang!7!50!1!112!42!1!7!0!0!0|127!Lhoseumawe!5!11!0!97!9!1!7!0!0!0|128!Limboto!0!38!0!122!58!1!8!0!0!0|129!Lubuk Basung!0!20!1!100!4!1!7!0!0!0|130!Lubuk Linggau!3!15!1!102!55!1!7!0!0!0|131!Lubuk Pakam!3!33!0!98!52!1!7!0!0!0|132!Lubuk Sikaping!0!9!0!100!11!1!7!0!0!0|133!Lumajang!8!8!1!113!13!1!7!0!0!0|134!Luwuk!0!57!1!122!48!1!8!0!0!0|135!Madiun!7!38!1!111!31!1!7!0!0!0|136!Magelang!7!28!1!110!13!1!7!0!0!0|137!Magetan!7!39!1!111!20!1!7!0!0!0|138!Majalengka!6!50!1!108!13!1!7!0!0!0!-6.8341!108.2279|139!Majene!3!2!1!118!54!1!8!0!0!0!-3.027!118.906|140!Makale!3!6!1!119!51!1!8!0!0!0!-3.103!119.851|141!Makassar!5!9!1!119!28!1!8!0!0!0|142!Malang!7!59!1!112!45!1!7!0!0!0|143!Mamuju!2!41!1!118!55!1!8!0!0!0|144!Manna!4!25!1!102!55!1!7!0!0!0|145!Manokwari!0!54!1!134!0!1!7!0!0!0|146!Marabahan!3!0!1!114!45!1!8!0!0!0|147!Maros!5!0!1!119!35!1!8!0!0!0|148!Martapura!3!25!1!114!51!1!7!0!0!0!-3.4118!114.8452|149!Masohi!3!20!1!128!55!1!8!0!0!0!-3.335!128.920|150!Mataram!8!35!1!116!8!1!8!0!0!0|151!Maumere!8!37!1!122!12!1!8!0!0!0|152!Medan!3!35!0!98!39!1!7!0!0!0|153!Mempawah!0!22!0!108!57!1!7!0!0!0!0.3644, 108.9549|154!Menado!1!29!0!124!52!1!8!0!0!0|155!Mentok!2!4!1!105!11!1!7!0!0!0|156!Merauke!8!26!1!140!22!1!9!0!0!0|157!Metro!5!7!1!105!16!1!7!0!0!0|158!Meulaboh!4!8!0!96!7!1!7!0!0!0|159!Mojokerto!7!28!1!112!26!1!7!0!0!0!-7.473!112.433|160!Muara Bulian!1!43!1!103!15!1!7!0!0!0|161!Muara Bungo!1!28!1!102!52!1!7!0!0!0|162!Muara Enim!3!40!1!103!47!1!7!0!0!0|163!Muara Teweh!0!58!1!114!52!1!8!0!0!0!-|164!Muaro Sijunjung!0!42!1!100!58!1!7!0!0!0|165!Muntilan!7!35!1!110!18!1!7!0!0!0|166!Nabire!3!18!1!135!33!1!9!0!0!0|167!Negara!8!22!1!114!37!1!8!0!0!0|168!Nganjuk!7!36!1!111!55!1!7!0!0!0|169!Ngawi!7!25!1!111!27!1!7!0!0!0!-7.4096, 111.4446|170!Nunukan!4!6!0!117!40!1!8!0!0!0|171!Pacitan!8!12!1!111!7!1!7!0!0!0|172!Padang!0!56!1!100!27!1!7!0!0!0|173!Padang Panjang!0!40!1!100!20!1!7!0!0!0|174!Padang Sidempuan!1!23!0!99!16!1!7!0!0!0|175!Pagaralam!4!1!1!103!16!1!7!0!0!0|176!Painan!1!20!1!100!36!1!7!0!0!0|177!Palangkaraya!2!15!1!113!56!1!8!0!0!0|178!Palembang!2!59!1!104!45!1!7!0!0!0|179!Palopo!3!0!1!120!12!1!8!0!0!0!-3.000!120.200|180!Palu!0!54!1!119!52!1!8!0!0!0|181!Pamekasan!7!9!1!113!29!1!7!0!0!0|182!Pandeglang!6!25!1!106!5!1!7!0!0!0|183!Pangkajene!4!50!1!119!33!1!8!0!0!0!-4.832!119.545|184!Pangkajene Sidenreng!3!56!1!119!48!1!8!0!0!0|185!Pangkalanbun!2!41!1!111!37!1!7!0!0!0!-2.6890!111.6223|186!Pangkalpinang!2!8!1!106!6!1!7!0!0!0|187!Panyabungan!0!51!0!99!33!1!7!0!0!0|188!Pare!7!47!1!112!12!1!7!0!0!0!-7.776!112.201|189!Parepare!3!59!1!119!40!1!8!0!0!0|190!Pariaman!0!38!1!100!8!1!7!0!0!0|191!Pasuruan!7!39!1!112!54!1!7!0!0!0!-7.6445!112.9029|192!Pati!6!45!1!111!2!1!7!0!0!0!-6.7534!111.0400|193!Payakumbuh!0!12!1!100!38!1!7!0!0!0|194!Pekalongan!6!54!1!109!40!1!7!0!0!0|195!Pekan Baru!0!36!0!101!14!1!7!0!0!0|196!Pemalang!6!54!1!109!22!1!7!0!0!0|197!Pematangsiantar!2!56!0!99!3!1!7!0!0!0|198!Pendopo!3!47!1!102!58!1!7!0!0!0|199!Pinrang!3!46!1!119!41!1!8!0!0!0|200!Pleihari!3!48!1!114!45!1!8!0!0!0|201!Polewali!4!15!1!119!37!1!8!0!0!0|202!Pondok Gede!6!20!1!106!55!1!7!0!0!0|203!Ponorogo!7!52!1!111!27!1!7!0!0!0|204!Pontianak!0!0!0!109!19!1!7!0!0!0|205!Poso!1!20!1!120!55!1!8!0!0!0|206!Prabumulih!3!26!1!104!13!1!7!0!0!0|207!Praya!8!39!1!116!17!1!7!0!0!0|208!Probolinggo!7!46!1!113!13!1!7!0!0!0|209!Purbalingga!7!23!1!109!22!1!7!0!0!0|210!Purukcahu!0!35!1!114!35!1!7!0!0!0|211!Purwakarta!6!35!1!107!29!1!7!0!0!0|212!Purwodadigrobogan!7!7!1!110!55!1!7!0!0!0|213!Purwokerto!7!25!1!109!14!1!7!0!0!0|214!Purworejo!7!43!1!110!1!1!7!0!0!0|215!Putussibau!0!50!0!112!56!1!7!0!0!0|216!Raha!4!55!1!123!0!1!8!0!0!0|217!Rangkasbitung!6!21!1!106!15!1!7!0!0!0|218!Rantau!2!55!1!115!9!1!8!0!0!0|219!Rantauprapat!2!15!0!99!50!1!7!0!0!0|220!Rantepao!2!58!1!119!54!1!8!0!0!0|221!Rembang!6!42!1!111!21!1!7!0!0!0|222!Rengat!0!30!1!102!45!1!7!0!0!0|223!Ruteng!8!35!1!120!30!1!8!0!0!0|224!Sabang!5!53!0!95!20!1!7!0!0!0|225!Salatiga!7!19!1!110!30!1!7!0!0!0|226!Samarinda!0!27!1!117!9!1!8!0!0!0|227!Sampang!7!11!1!113!13!1!7!0!0!0|228!Sampit!2!34!1!113!0!1!7!0!0!0|229!Sanggau!0!15!0!110!15!1!7!0!0!0|230!Sawahlunto!0!40!1!100!52!1!7!0!0!0|231!Sekayu!2!51!1!103!51!1!7!0!0!0|232!Selong!8!39!1!116!32!1!8!0!0!0|233!Semarang!6!58!1!110!29!1!7!0!0!0|234!Sengkang!4!8!1!120!2!1!8!0!0!0|235!Serang!6!8!1!106!10!1!7!0!0!0|236!Serui!6!18!1!130!1!1!9!0!0!0|237!Sibolga!1!45!0!98!47!1!7!0!0!0|238!Sidikalang!2!45!0!98!19!1!7!0!0!0|239!Sidoarjo!7!27!1!112!43!1!7!0!0!0|240!Sigli!5!25!0!96!0!1!7!0!0!0|241!Singaparna!7!21!1!108!6!1!7!0!0!0|242!Singaraja!8!6!1!115!6!1!8!0!0!0|243!Singkawang!0!53!0!108!56!1!7!0!0!0|244!Sinjai!5!7!1!120!20!1!7!0!0!0|245!Sintang!0!4!0!111!30!1!7!0!0!0|246!Situbondo!7!42!1!114!0!1!7!0!0!0|247!Slawi!6!59!1!109!8!1!7!0!0!0|248!Sleman!7!43!1!110!21!1!7!0!0!0|249!Soasiu!1!42!0!127!36!1!8!0!0!0|250!Soe!9!52!1!124!17!1!8!0!0!0|251!Solo!7!42!1!110!48!1!7!0!0!0|252!Solok!0!48!1!100!39!1!7!0!0!0|253!Soreang!7!2!1!107!31!1!7!0!0!0|254!Sorong!0!48!1!131!13!1!9!0!0!0|255!Sragen!7!26!1!111!1!1!7!0!0!0|256!Stabat!3!46!0!98!23!1!7!0!0!0|257!Subang!6!35!1!107!47!1!7!0!0!0|258!Sukabumi!6!56!1!106!50!1!7!0!0!0|259!Sukoharjo!7!40!1!110!50!1!7!0!0!0|260!Sumbawa Besar!8!32!1!117!27!1!8!0!0!0|261!Sumedang!6!52!1!107!55!1!7!0!0!0|262!Sumenep!7!0!1!113!51!1!7!0!0!0|263!Sungai Liat!1!51!1!106!8!1!7!0!0!0|264!Sungai Penuh!2!5!1!101!23!1!7!0!0!0|265!Sungguminasa!5!11!1!119!28!1!8!0!0!0|266!Surabaya!7!14!1!112!45!1!7!0!0!0|267!Surakarta!7!32!1!110!50!1!7!0!0!0|268!Tabanan!8!32!1!115!8!1!8!0!0!0|269!Tahuna!3!37!0!125!29!1!8!0!0!0|270!Takalar!5!25!1!119!26!1!8!0!0!0|271!Takengon!4!38!0!96!50!1!7!0!0!0|272!Tamiang Layang!2!7!1!115!10!1!8!0!0!0|273!Tanah Grogot!1!55!1!116!12!1!8!0!0!0|274!Tangerang!6!11!1!106!38!1!7!0!0!0|275!Tanjung Balai!2!59!0!99!47!1!7!0!0!0|276!Tanjung Enim!3!45!1!103!48!1!7!0!0!0|277!Tanjung Pandan!2!45!1!107!37!1!7!0!0!0|278!Tanjung Pinang!0!55!0!104!27!1!7!0!0!0|279!Tanjung Redep!2!9!0!117!29!1!7!0!0!0|280!Tanjung Selor!2!51!0!117!22!1!7!0!0!0|281!Tapak Tuan!3!15!0!97!10!1!7!0!0!0|282!Tarakan!3!18!0!117!38!1!8!0!0!0|283!Tarutung!2!0!0!98!54!1!7!0!0!0|284!Tasikmalaya!7!20!1!108!14!1!7!0!0!0|285!Tebing Tinggi!3!20!0!99!8!1!7!0!0!0|286!Tegal!6!52!1!109!9!1!7!0!0!0|287!Temanggung!7!19!1!110!12!1!7!0!0!0|288!Tembilahan!0!19!1!103!9!1!7!0!0!0|289!Tenggarong!0!24!1!116!58!1!7!0!0!0|290!Ternate!1!48!0!127!24!1!9!0!0!0|291!Tolitoli!1!3!0!120!50!1!8!0!0!0|292!Tondano!1!35!0!124!54!1!8!0!0!0|293!Trenggalek!8!3!1!111!43!1!7!0!0!0|294!Tual!5!38!1!132!44!1!9!0!0!0|295!Tuban!6!54!1!112!4!1!7!0!0!0|296!Tulung Agung!8!4!1!111!54!1!7!0!0!0!-8.0500514!111.9000435|297!Ujung Berung!6!55!2!107!42!1!7!0!0!0|298!Ungaran!7!8!1!110!24!1!7!0!0!0!-7.12!110.4|299!Waikabubak!9!38!1!119!25!1!8!0!0!0|300!Waingapu!9!39!1!120!16!1!8!0!0!0!-9.66!120.26|301!Wamena!3!54!1!138!41!1!9!0!0!0|302!Watampone!4!29!1!120!25!1!8!0!0!0!-4.5416879!120.3289604|303!Watansoppeng!4!21!1!119!53!1!8!0!0!0|304!Wates!7!51!0!110!10!1!7!0!0!0|305!Wonogiri!7!49!1!110!55!1!7!0!0!0|306!Wonosari!7!58!1!110!36!1!7!0!0!0|307!Wonosobo!7!22!1!109!54!1!7!0!0!0|308!Yogyakarta!7!48!1!110!24!1!7!0!0!0!-7.7800503!110.3700256!-7.78!110.37|309!Karanganyar!7!36!1!110!58!1!7!0!0!0!-7.597!110.959';

const genLoc = function(data) {
  const arr = [];
  for (let i = 0; i < data.length; i++) {
    const loc = data[i].split('!');
    arr[loc[0]] = loc;
  }
  return arr;
};

const getLoc = function(id, data) {
  let lat = parseFloat(data[id][2] + '.' + data[id][3]);
  lat *= data[id][4] === '1' ? -1 : 1;

  let long = parseFloat(data[id][5] + '.' + data[id][6]);
  long *= data[id][7] === '1' ? 1 : -1;

  return [lat, long];
};

const buildSelectOption = function(id, data) {
  let selected;
  let options = '';

  for (var i = 1; i < data.length; i++) {
    if (data[i]) {
      selected = data[i][0] == id ? ' selected="selected" ' : ' ';
      options += '<option' + selected + 'value="' + data[i][0] + '">' + i + '. ' + data[i][1] + '</option>';
    }
  }

  return options;
};

function updateTimeTable() {
  const prayerLists = document.querySelectorAll('.pray li');
  const times = prayerTimes.getTimes(today, getLoc(loc_id, loc_data), loc_tz, 'auto', '24h');

  document.querySelectorAll('.pray .time').forEach(function(el) {
    el.style.opacity = 0;
  });

  setTimeout(function() {
    prayerLists[0].querySelector('.time').textContent = times.fajr;
    prayerLists[1].querySelector('.time').textContent = times.dhuhr;
    prayerLists[2].querySelector('.time').textContent = times.asr;
    prayerLists[3].querySelector('.time').textContent = times.maghrib;
    prayerLists[4].querySelector('.time').textContent = times.isha;

    document.querySelectorAll('.pray .time').forEach(function(el) {
      el.style.opacity = 1;
    });
  }, 300);
}

function currentTime(offset) {
  if (typeof offset === 'undefined') offset = 0;
  var now = new Date();

  var utc = now.getTime() + now.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
  var customTime = new Date(utc + offset * 3600000); // Offset in hours, converted to milliseconds

  return customTime;
}

function formatTime(time) {
  var hours = time.getHours();
  var minutes = time.getMinutes();
  var seconds = time.getSeconds();

  // Pad single digits with a leading zero
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  // Format time in HH:mm:ss
  var timeString = hours + ':' + minutes + ':' + seconds;

  return timeString;
}

function displayTime(el) {
  const time = currentTime(loc_tz);
  el.setAttribute('currentTime', time.getTime());
  el.querySelector('.clock .local').innerHTML = formatTime(time);
  timer = setTimeout(function() { displayTime(el) }, 1000);
}

function updateClock() {
  t_el.dataset.timezone = loc_tz;

  const timezoneLabel = loc_tz < 0 ? loc_tz : '+' + loc_tz;
  t_el.setAttribute('title', 'Zona Waktu: GMT' + timezoneLabel + ' (klik untuk mengganti)');
  t_el.querySelector('.clock .zone').innerHTML = time_ID[loc_tz];

  clearTimeout(timer);
  displayTime(t_el);
}

function updateDate() {
  const days = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu'];
  const gregorianMonth = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const hijriMonth = ['Muharram', 'Shafar', "Rabi'ul Awal", "Rabi'ul Akhir", 'Jumadil Awal', 'Jumadil Akhir', 'Rajab', "Sya'ban", 'Ramadhan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah'];

  document.querySelector('.date .gregorian').innerHTML = days[today.getDay()] + ', ' + today.getDate() + ' ' + gregorianMonth[today.getMonth()] + ' ' + today.getFullYear();

  hijriDate = gregorianToHijri(today, hijri_data, 'kemenag');
  if ('error' in hijriDate) {
    console.error(hijriDate.message);
  } else {
    document.querySelector('.date .hijri').innerHTML = hijriDate.date + ' ' + hijriMonth[hijriDate.month] + ' ' + hijriDate.year + ' H';
  }
}

function changeZone(e) {
  loc_tz = e.target.value;
  localStorage.setItem('loc-tz', loc_tz);
  if (e.type == 'change') {
    updateTimeTable();
    updateClock();
  }
  this.blur();
}

function changeCity(e) {
  loc_id = e.target.value;
  localStorage.setItem('loc-id', loc_id);
  if (e.type == 'change') updateTimeTable();

  const selectedOption = this.options[this.selectedIndex].text;
  l_name.innerHTML = selectedOption.replace(/^\d+\.\s/, '');
  this.blur();
}


// Init
const today = new Date();
const prayerTimes = new PrayTimes();
const loc_data = genLoc(loc_gcs.split(/\|/g));
const time_ID = {
  "7": "WIB",
  "8": "WITA",
  "9": "WIT"
};

const t_el = document.querySelector('#time');
const t_zone = t_el.querySelector('.timezone');
const l_el = document.querySelector('.location');
const l_name = l_el.querySelector('.location .name');
const l_city = l_el.querySelector('.city');

let timer;
let loc_id = localStorage.getItem('loc-id') || 83; // Jakarta
let loc_tz = localStorage.getItem('loc-tz') || (today.getTimezoneOffset() / 60) * -1;

if (getParam('tz')) loc_tz = getParam('tz')[0];
if (getParam('loc')) loc_id = getParam('loc')[0];
if (getParam('bg')) document.body.style.backgroundColor = '#' + getParam('bg')[0];

updateTimeTable();
updateClock();
updateDate();

t_zone.value = loc_tz;
l_city.innerHTML = buildSelectOption(loc_id, loc_data);
l_name.innerHTML = l_city.querySelector('option:checked').textContent.replace(/^\d+\.\s/, '');

t_el.querySelector('.clock').addEventListener('click', function() {
  t_zone.focus();
});

t_zone.addEventListener('change', changeZone);
t_zone.addEventListener('focusout', changeZone);

l_el.addEventListener('click', function(e) {
  if (e.target.classList.contains('name')) l_city.focus();
});

l_city.addEventListener('change', changeCity);
l_city.addEventListener('focusout', changeCity);
