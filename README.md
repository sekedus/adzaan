# Adzaan - Jadwal Shalat

**Adzaan** is a comprehensive tool to provide prayer times.

This project combines reliable sources and algorithms to deliver Islamic prayer schedules for various locations in Indonesia.

## Features

- Calculation of prayer times based on location and timezone.
- Support for querying specific locations and timezones using parameters.
- Customizable background color.

## Usage

The API supports the following query parameters:

- **`tz`**: Specifies the [Indonesia timezone](https://en.wikipedia.org/wiki/Time_in_Indonesia) offset in hours from UTC.  
  Available values are:  
  - `7` = WIB (Waktu Indonesia Barat), UTC+7  
  - `8` = WITA (Waktu Indonesia Tengah), UTC+8  
  - `9` = WIT (Waktu Indonesia Timur), UTC+9  
- **`loc`**: Specifies the location ID. Location IDs correspond to predefined regions or cities.  
- **`bg`**: Specifies the background color in hexadecimal format without hash.  
  e.g., `212121` for gray13.  

### Example

```
https://sekedus.github.io/adzaan/?tz=7&loc=83&bg=212121
```

This example retrieves prayer times for Jakarta (location ID `83`) in timezone `UTC+7` WIB with a gray13 background (`212121`).

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
