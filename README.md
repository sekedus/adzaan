# Adzaan - Jadwal Shalat

**Adzaan** is a comprehensive tool to provide prayer times.

This project combines reliable sources and algorithms to deliver Islamic prayer schedules for various locations in Indonesia.

## Features

- Calculation of prayer times based on location.
- Support for querying specific locations using parameters.
- Customizable background color.

## Usage

The API supports the following query parameters:

- **`loc`**: Specifies the location ID. Location IDs correspond to predefined regions or cities.  
- **`bg`**: Specifies the background color in hexadecimal format without hash.  
  e.g., `137333` for green.  

### Example

```
https://sekedus.github.io/adzaan/?loc=29&bg=137333
```

This example retrieves prayer times for Jakarta (location ID `29`) with a green background (`137333`).

## Data Sources

The prayer times and calendar calculations in this project are based on data from the following sources:

### Pray Times

- [Pray Times v2.3](http://praytimes.org/)
- [Prayer Times Library (PHP)](https://github.com/islamic-network/prayer-times)

### Hijri Calendar

- [ELIPSKI Kemenag RI](https://simbi.kemenag.go.id/eliterasi/pencarian/kalender)
- [Al-Habib Islamic Calendar](https://www.al-habib.info/kalender-islam/kalender-islam-global.htm)
- [Umm al-Qura Calendar](https://www.ummulqura.org.sa/Index.aspx)
- [Moment Hijri](https://github.com/xsoh/moment-hijri)

### Indonesia Cities

- [Daftar kota di Indonesia](https://id.wikipedia.org/wiki/Daftar_kota_di_Indonesia_menurut_provinsi)
- [Kode Wilayah Indonesia](https://github.com/cahyadsn/wilayah)
- [List of Cities and Towns in Indonesia](https://www.back4app.com/database/back4app/indonesia-cities-database)

### Images

- [Background pattern by Freepik](https://www.freepik.com/free-vector/flat-arabic-pattern-background_15365516.htm)

## License

This project is licensed under a [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). See the [LICENSE](https://github.com/sekedus/adzaan/blob/main/LICENSE-CC-BY-NC-SA) file for more details.

[![CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
