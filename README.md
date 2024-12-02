# Adzaan - Jadwal Shalat

**Adzaan** is a comprehensive tool to provide prayer times.

This project combines reliable sources and algorithms to deliver Islamic prayer schedules for various locations in Indonesia.

## Features

- Calculation of prayer times based on location and timezone.
- Support for querying specific locations and timezones using parameters.

## Usage

The API supports the following query parameters:

- **`tz`**: Specifies the timezone offset in hours from UTC.  
- **`loc`**: Specifies the location ID. Location IDs correspond to predefined regions or cities.  

### Example

```
https://sekedus.github.io/adzaan/?tz=7&loc=83
```

This example retrieves prayer times for Jakarta (location ID `83`) in timezone `UTC+7` [WIB (Waktu Indonesia Barat)](https://en.wikipedia.org/wiki/Time_in_Indonesia).

## Data Sources

The prayer times and calendar calculations in this project are based on data from the following sources:

- [Pray Times v2.3](http://praytimes.org/)
- [ELIPSKI Kemenag RI](https://simbi.kemenag.go.id/eliterasi/pencarian/kalender)
- [Al-Habib Islamic Calendar](https://www.al-habib.info/kalender-islam/kalender-islam-global.htm)
- [Umm al-Qura Calendar](https://www.ummulqura.org.sa/Index.aspx)
- [Moment Hijri](https://github.com/xsoh/moment-hijri)
- [Adzan!](https://github.com/cahyadsn/adzan)
- [Prayer Times Library (PHP)](https://github.com/islamic-network/prayer-times)

## License

This project is licensed under a [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). See the [LICENSE](https://github.com/sekedus/adzaan/blob/main/LICENSE-CC-BY-NC-SA) file for more details.

[![CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
