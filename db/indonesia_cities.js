/*
Source:
- Indonesia cities: https://id.wikipedia.org/wiki/Daftar_kota_di_Indonesia_menurut_provinsi
- Region code: https://github.com/cahyadsn/wilayah/blob/59995d5921674509d4da5efea0ac65a8611d9b1c/db/wilayah.sql
- Example: https://www.back4app.com/database/back4app/indonesia-cities-database
*/

const indonesia_cities = [
  {
    "name": "Banda Aceh",
    "id": "11.71",
    "latitude": 5.5496311,
    "longitude": 95.3180326,
    "timezone": 7
  },
  {
    "name": "Langsa",
    "id": "11.74",
    "latitude": 4.4691405,
    "longitude": 97.9664597,
    "timezone": 7
  },
  {
    "name": "Lhokseumawe",
    "id": "11.73",
    "latitude": 5.1790965,
    "longitude": 97.1488972,
    "timezone": 7
  },
  {
    "name": "Sabang",
    "id": "11.72",
    "latitude": 5.8924216,
    "longitude": 95.3211172,
    "timezone": 7
  },
  {
    "name": "Subulussalam",
    "id": "11.75",
    "latitude": 2.6704565,
    "longitude": 97.9930009,
    "timezone": 7
  },
  {
    "name": "Denpasar",
    "id": "51.71",
    "latitude": -8.656042,
    "longitude": 115.216314,
    "timezone": 8
  },
  {
    "name": "Pangkalpinang",
    "id": "19.71",
    "latitude": -2.1410465,
    "longitude": 106.1159086,
    "timezone": 7
  },
  {
    "name": "Cilegon",
    "id": "36.72",
    "latitude": -6.0100651,
    "longitude": 106.0420965,
    "timezone": 7
  },
  {
    "name": "Serang",
    "id": "36.73",
    "latitude": -6.1326529,
    "longitude": 106.191412,
    "timezone": 7
  },
  {
    "name": "Tangerang Selatan",
    "id": "36.74",
    "latitude": -6.3223832,
    "longitude": 106.7077614,
    "timezone": 7
  },
  {
    "name": "Tangerang",
    "id": "36.71",
    "latitude": -6.1707294,
    "longitude": 106.6406005,
    "timezone": 7
  },
  {
    "name": "Bengkulu",
    "id": "17.71",
    "latitude": -3.7599846,
    "longitude": 102.3030242,
    "timezone": 7
  },
  {
    "name": "Yogyakarta",
    "id": "34.71",
    "latitude": -7.8001814,
    "longitude": 110.3913493,
    "timezone": 7
  },
  {
    "name": "Jakarta Pusat",
    "id": "31.71",
    "latitude": -6.1731003,
    "longitude": 106.8186917,
    "timezone": 7
  },
  {
    "name": "Gorontalo",
    "id": "75.71",
    "latitude": 0.5318892,
    "longitude": 123.0595042,
    "timezone": 8
  },
  {
    "name": "Sungai Penuh",
    "id": "15.72",
    "latitude": -2.0708368,
    "longitude": 101.3951975,
    "timezone": 7
  },
  {
    "name": "Jambi",
    "id": "15.71",
    "latitude": -1.6289777,
    "longitude": 103.6082404,
    "timezone": 7
  },
  {
    "name": "Bandung",
    "id": "32.73",
    "latitude": -6.9108795,
    "longitude": 107.6098588,
    "timezone": 7
  },
  {
    "name": "Bekasi",
    "id": "32.75",
    "latitude": -6.2359827,
    "longitude": 106.9941591,
    "timezone": 7
  },
  {
    "name": "Bogor",
    "id": "32.71",
    "latitude": -6.5952306,
    "longitude": 106.7936912,
    "timezone": 7
  },
  {
    "name": "Cimahi",
    "id": "32.77",
    "latitude": -6.8707756,
    "longitude": 107.5549314,
    "timezone": 7
  },
  {
    "name": "Cirebon",
    "id": "32.74",
    "latitude": -6.7069067,
    "longitude": 108.5581623,
    "timezone": 7
  },
  {
    "name": "Depok",
    "id": "32.76",
    "latitude": -6.3945686,
    "longitude": 106.8223566,
    "timezone": 7
  },
  {
    "name": "Sukabumi",
    "id": "32.72",
    "latitude": -6.9178948,
    "longitude": 106.9315006,
    "timezone": 7
  },
  {
    "name": "Tasikmalaya",
    "id": "32.78",
    "latitude": -7.3164295,
    "longitude": 108.1969642,
    "timezone": 7
  },
  {
    "name": "Banjar",
    "id": "32.79",
    "latitude": -7.3624698,
    "longitude": 108.5595577,
    "timezone": 7
  },
  {
    "name": "Magelang",
    "id": "33.71",
    "latitude": -7.5040903,
    "longitude": 110.221036,
    "timezone": 7
  },
  {
    "name": "Pekalongan",
    "id": "33.75",
    "latitude": -6.8971947,
    "longitude": 109.6620809,
    "timezone": 7
  },
  {
    "name": "Salatiga",
    "id": "33.73",
    "latitude": -7.3312525,
    "longitude": 110.5005091,
    "timezone": 7
  },
  {
    "name": "Semarang",
    "id": "33.74",
    "latitude": -6.9820957,
    "longitude": 110.412712,
    "timezone": 7
  },
  {
    "name": "Surakarta",
    "id": "33.72",
    "latitude": -7.5695366,
    "longitude": 110.829342,
    "timezone": 7
  },
  {
    "name": "Tegal",
    "id": "33.76",
    "latitude": -6.8703086,
    "longitude": 109.1378277,
    "timezone": 7
  },
  {
    "name": "Batu",
    "id": "35.79",
    "latitude": -7.8664455,
    "longitude": 112.5125194,
    "timezone": 7
  },
  {
    "name": "Blitar",
    "id": "35.72",
    "latitude": -8.0994186,
    "longitude": 112.164511,
    "timezone": 7
  },
  {
    "name": "Kediri",
    "id": "35.71",
    "latitude": -7.812428,
    "longitude": 112.014252,
    "timezone": 7
  },
  {
    "name": "Madiun",
    "id": "35.77",
    "latitude": -7.6247478,
    "longitude": 111.5205848,
    "timezone": 7
  },
  {
    "name": "Malang",
    "id": "35.73",
    "latitude": -7.978075,
    "longitude": 112.633868,
    "timezone": 7
  },
  {
    "name": "Mojokerto",
    "id": "35.76",
    "latitude": -7.4701596,
    "longitude": 112.4402809,
    "timezone": 7
  },
  {
    "name": "Pasuruan",
    "id": "35.75",
    "latitude": -7.6474192,
    "longitude": 112.9084766,
    "timezone": 7
  },
  {
    "name": "Probolinggo",
    "id": "35.74",
    "latitude": -7.753986,
    "longitude": 113.214261,
    "timezone": 7
  },
  {
    "name": "Surabaya",
    "id": "35.78",
    "latitude": -7.2591517,
    "longitude": 112.7468971,
    "timezone": 7
  },
  {
    "name": "Pontianak",
    "id": "61.71",
    "latitude": 0.0009995,
    "longitude": 109.3222052,
    "timezone": 7
  },
  {
    "name": "Singkawang",
    "id": "61.72",
    "latitude": 0.9042823,
    "longitude": 108.9773523,
    "timezone": 7
  },
  {
    "name": "Banjarbaru",
    "id": "63.72",
    "latitude": -3.4388957,
    "longitude": 114.8310499,
    "timezone": 8
  },
  {
    "name": "Banjarmasin",
    "id": "63.71",
    "latitude": -3.3272135,
    "longitude": 114.588379,
    "timezone": 8
  },
  {
    "name": "Palangka Raya",
    "id": "62.71",
    "latitude": -2.1752362,
    "longitude": 113.8794169,
    "timezone": 7
  },
  {
    "name": "Balikpapan",
    "id": "64.71",
    "latitude": -1.2767308,
    "longitude": 116.8276976,
    "timezone": 8
  },
  {
    "name": "Bontang",
    "id": "64.74",
    "latitude": 0.0693849,
    "longitude": 117.4441224,
    "timezone": 8
  },
  {
    "name": "Samarinda",
    "id": "64.72",
    "latitude": -0.492215,
    "longitude": 117.1458624,
    "timezone": 8
  },
  {
    "name": "Nusantara (IKN)",
    "id": "",
    "latitude": -0.9729866,
    "longitude": 116.7088379,
    "timezone": 8
  },
  {
    "name": "Tarakan",
    "id": "65.71",
    "latitude": 3.3144425,
    "longitude": 117.6050257,
    "timezone": 8
  },
  {
    "name": "Batam",
    "id": "21.71",
    "latitude": 1.1276777,
    "longitude": 104.0554723,
    "timezone": 7
  },
  {
    "name": "Tanjung Pinang",
    "id": "21.72",
    "latitude": 0.9654188,
    "longitude": 104.4409818,
    "timezone": 7
  },
  {
    "name": "Bandar Lampung",
    "id": "18.71",
    "latitude": -5.4296977,
    "longitude": 105.262766,
    "timezone": 7
  },
  {
    "name": "Metro",
    "id": "18.72",
    "latitude": -5.1140417,
    "longitude": 105.3066657,
    "timezone": 7
  },
  {
    "name": "Ternate",
    "id": "82.71",
    "latitude": 0.7857139,
    "longitude": 127.3880831,
    "timezone": 9
  },
  {
    "name": "Tidore Kepulauan",
    "id": "82.72",
    "latitude": 0.6715522,
    "longitude": 127.4467118,
    "timezone": 9
  },
  {
    "name": "Ambon",
    "id": "81.71",
    "latitude": -3.694636,
    "longitude": 128.1812715,
    "timezone": 9
  },
  {
    "name": "Tual",
    "id": "81.72",
    "latitude": -5.6346362,
    "longitude": 132.7517315,
    "timezone": 9
  },
  {
    "name": "Bima",
    "id": "52.72",
    "latitude": -8.4618992,
    "longitude": 118.7485375,
    "timezone": 8
  },
  {
    "name": "Mataram",
    "id": "52.71",
    "latitude": -8.5830153,
    "longitude": 116.1081277,
    "timezone": 8
  },
  {
    "name": "Kupang",
    "id": "53.71",
    "latitude": -10.1540479,
    "longitude": 123.6195501,
    "timezone": 8
  },
  {
    "name": "Sorong",
    "id": "92.71",
    "latitude": -0.8811366,
    "longitude": 131.2876403,
    "timezone": 9
  },
  {
    "name": "Jayapura",
    "id": "91.71",
    "latitude": -2.5628544,
    "longitude": 140.6926452,
    "timezone": 9
  },
  {
    "name": "Dumai",
    "id": "14.72",
    "latitude": 1.6054001,
    "longitude": 101.3917345,
    "timezone": 7
  },
  {
    "name": "Pekanbaru",
    "id": "14.71",
    "latitude": 0.5171001,
    "longitude": 101.5406378,
    "timezone": 7
  },
  {
    "name": "Makassar",
    "id": "73.71",
    "latitude": -5.1335271,
    "longitude": 119.4080136,
    "timezone": 8
  },
  {
    "name": "Palopo",
    "id": "73.73",
    "latitude": -3.0086436,
    "longitude": 120.2015531,
    "timezone": 8
  },
  {
    "name": "Parepare",
    "id": "73.72",
    "latitude": -4.0280283,
    "longitude": 119.6333168,
    "timezone": 8
  },
  {
    "name": "Palu",
    "id": "72.71",
    "latitude": -0.9001248,
    "longitude": 119.8909599,
    "timezone": 8
  },
  {
    "name": "Baubau",
    "id": "74.72",
    "latitude": -5.4854507,
    "longitude": 122.5850448,
    "timezone": 8
  },
  {
    "name": "Kendari",
    "id": "74.71",
    "latitude": -3.9729198,
    "longitude": 122.5117401,
    "timezone": 8
  },
  {
    "name": "Bitung",
    "id": "71.72",
    "latitude": 1.4455765,
    "longitude": 125.1834273,
    "timezone": 8
  },
  {
    "name": "Kotamobagu",
    "id": "71.74",
    "latitude": 0.7429829,
    "longitude": 124.3126466,
    "timezone": 8
  },
  {
    "name": "Manado",
    "id": "71.71",
    "latitude": 1.4843177,
    "longitude": 124.8490822,
    "timezone": 8
  },
  {
    "name": "Tomohon",
    "id": "71.73",
    "latitude": 1.3142381,
    "longitude": 124.8277264,
    "timezone": 8
  },
  {
    "name": "Bukittinggi",
    "id": "13.75",
    "latitude": -0.2855984,
    "longitude": 100.3680793,
    "timezone": 7
  },
  {
    "name": "Padang",
    "id": "13.71",
    "latitude": -0.8758335,
    "longitude": 100.3874282,
    "timezone": 7
  },
  {
    "name": "Padang Panjang",
    "id": "13.74",
    "latitude": -0.4621319,
    "longitude": 100.3903976,
    "timezone": 7
  },
  {
    "name": "Pariaman",
    "id": "13.77",
    "latitude": -0.6289225,
    "longitude": 100.1387554,
    "timezone": 7
  },
  {
    "name": "Payakumbuh",
    "id": "13.76",
    "latitude": -0.2223767,
    "longitude": 100.6318454,
    "timezone": 7
  },
  {
    "name": "Sawahlunto",
    "id": "13.73",
    "latitude": -0.6749318,
    "longitude": 100.7671885,
    "timezone": 7
  },
  {
    "name": "Solok",
    "id": "13.72",
    "latitude": -0.7989527,
    "longitude": 100.6526681,
    "timezone": 7
  },
  {
    "name": "Lubuklinggau",
    "id": "16.73",
    "latitude": -3.3260281,
    "longitude": 102.8252793,
    "timezone": 7
  },
  {
    "name": "Pagar Alam",
    "id": "16.72",
    "latitude": -4.0393336,
    "longitude": 103.1970199,
    "timezone": 7
  },
  {
    "name": "Palembang",
    "id": "16.71",
    "latitude": -2.9910862,
    "longitude": 104.7567509,
    "timezone": 7
  },
  {
    "name": "Prabumulih",
    "id": "16.74",
    "latitude": -3.3688982,
    "longitude": 104.3084936,
    "timezone": 7
  },
  {
    "name": "Binjai",
    "id": "12.75",
    "latitude": 3.60296,
    "longitude": 98.4831859,
    "timezone": 7
  },
  {
    "name": "Gunungsitoli",
    "id": "12.78",
    "latitude": 1.2825866,
    "longitude": 97.6133933,
    "timezone": 7
  },
  {
    "name": "Medan",
    "id": "12.71",
    "latitude": 3.5904796,
    "longitude": 98.6748504,
    "timezone": 7
  },
  {
    "name": "Padangsidimpuan",
    "id": "12.77",
    "latitude": 1.3775075,
    "longitude": 99.2716586,
    "timezone": 7
  },
  {
    "name": "Pematangsiantar",
    "id": "12.72",
    "latitude": 2.9565527,
    "longitude": 99.0617375,
    "timezone": 7
  },
  {
    "name": "Sibolga",
    "id": "12.73",
    "latitude": 1.7460105,
    "longitude": 98.7755879,
    "timezone": 7
  },
  {
    "name": "Tanjungbalai",
    "id": "12.74",
    "latitude": 2.9479469,
    "longitude": 99.7641231,
    "timezone": 7
  },
  {
    "name": "Tebing Tinggi",
    "id": "12.76",
    "latitude": 3.3279492,
    "longitude": 99.1664886,
    "timezone": 7
  }
];
