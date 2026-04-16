// Prayer Times Calculation Library
// Based on the algorithm from praytimes.org

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface City {
  name: string;
  nameAr: string;
  lat: number;
  lng: number;
  region: string;
}

export const chadCities: City[] = [
  { name: "N'Djamena", nameAr: "نجامينا", lat: 12.1348, lng: 15.0557, region: "Capitale" },
  { name: "Moundou", nameAr: "موندو", lat: 8.5667, lng: 16.0833, region: "Logone Occidental" },
  { name: "Sarh", nameAr: "سارح", lat: 9.1429, lng: 18.3923, region: "Moyen-Chari" },
  { name: "Abéché", nameAr: "أبشي", lat: 13.8292, lng: 20.8324, region: "Ouaddaï" },
  { name: "Kélo", nameAr: "كيلو", lat: 9.3167, lng: 15.8, region: "Tandjilé" },
  { name: "Koumra", nameAr: "كومرا", lat: 8.9167, lng: 17.55, region: "Mandoul" },
  { name: "Pala", nameAr: "بالا", lat: 9.3667, lng: 14.9333, region: "Mayo-Kebbi Ouest" },
  { name: "Am Timan", nameAr: "أم تيمان", lat: 11.0333, lng: 20.2833, region: "Salamat" },
  { name: "Bongor", nameAr: "بونغور", lat: 10.2833, lng: 15.3667, region: "Mayo-Kebbi Est" },
  { name: "Mongo", nameAr: "مونقو", lat: 12.1833, lng: 18.7, region: "Guéra" },
  { name: "Doba", nameAr: "دوبا", lat: 8.65, lng: 16.85, region: "Logone Oriental" },
  { name: "Ati", nameAr: "أتي", lat: 13.2167, lng: 18.3333, region: "Batha" },
  { name: "Faya-Largeau", nameAr: "فايا لارجو", lat: 17.9167, lng: 19.1167, region: "Borkou" },
  { name: "Massakory", nameAr: "مسقري", lat: 12.9833, lng: 15.7333, region: "Hadjer-Lamis" },
  { name: "Moussoro", nameAr: "موسورو", lat: 13.65, lng: 16.4833, region: "Barh-El-Gazel" },
  { name: "Laï", nameAr: "لاي", lat: 9.4, lng: 16.3, region: "Tandjilé" },
  { name: "Biltine", nameAr: "بلتين", lat: 14.5333, lng: 20.9167, region: "Wadi Fira" },
  { name: "Oum Hadjer", nameAr: "أم هجر", lat: 13.3, lng: 19.7, region: "Batha" },
  { name: "Bokoro", nameAr: "بوكورو", lat: 12.3667, lng: 17.05, region: "Hadjer-Lamis" },
  { name: "Mao", nameAr: "ماو", lat: 14.1167, lng: 15.3167, region: "Kanem" },
  { name: "Bol", nameAr: "بول", lat: 13.4667, lng: 14.7167, region: "Lac" },
  { name: "Bardaï", nameAr: "برداي", lat: 21.35, lng: 17.0, region: "Tibesti" },
  { name: "Goz Beïda", nameAr: "قوز بيضا", lat: 12.2167, lng: 21.4167, region: "Sila" },
  { name: "Bitkine", nameAr: "بتكين", lat: 11.9833, lng: 18.2167, region: "Guéra" },
  { name: "Massaguet", nameAr: "مساقيط", lat: 12.4667, lng: 15.4333, region: "Hadjer-Lamis" },

 
];

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

function sin(d: number): number { return Math.sin(d * DEG_TO_RAD); }
function cos(d: number): number { return Math.cos(d * DEG_TO_RAD); }
function tan(d: number): number { return Math.tan(d * DEG_TO_RAD); }
function arcsin(x: number): number { return RAD_TO_DEG * Math.asin(x); }
function arccos(x: number): number { return RAD_TO_DEG * Math.acos(x); }
function arctan2(y: number, x: number): number { return RAD_TO_DEG * Math.atan2(y, x); }
function arccot(x: number): number { return RAD_TO_DEG * Math.atan(1 / x); }

function fixAngle(a: number): number {
  a = a - 360 * Math.floor(a / 360);
  return a < 0 ? a + 360 : a;
}

function fixHour(a: number): number {
  a = a - 24 * Math.floor(a / 24);
  return a < 0 ? a + 24 : a;
}

function julianDate(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function sunPosition(jd: number): { declination: number; equation: number } {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * sin(g) + 0.020 * sin(2 * g));
  const e = 23.439 - 0.00000036 * D;
  const RA = arctan2(cos(e) * sin(L), cos(L)) / 15;
  const declination = arcsin(sin(e) * sin(L));
  const equation = q / 15 - fixHour(RA);
  return { declination, equation };
}

function computePrayerTime(
  angle: number,
  jd: number,
  lat: number,
  direction: 'ccw' | 'cw'
): number {
  const { declination, equation } = sunPosition(jd);
  const noon = fixHour(12 - equation);
  const t = (1 / 15) * arccos((-sin(angle) - sin(declination) * sin(lat)) / (cos(declination) * cos(lat)));
  return direction === 'ccw' ? noon - t : noon + t;
}

function computeAsr(jd: number, lat: number, factor: number): number {
  const { declination, equation } = sunPosition(jd);
  const noon = fixHour(12 - equation);
  const angle = -arccot(factor + tan(Math.abs(lat - declination)));
  const t = (1 / 15) * arccos((-sin(angle) - sin(declination) * sin(lat)) / (cos(declination) * cos(lat)));
  return noon + t;
}

function formatTime(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  const hStr = h.toString().padStart(2, '0');
  const mStr = m.toString().padStart(2, '0');
  return `${hStr}:${mStr}`;
}

export interface CalculationMethod {
  name: string;
  fajrAngle: number;
  ishaAngle: number;
  maghribMinutes?: number;
  ishaMinutes?: number;
}



export const calculationMethods: Record<string, CalculationMethod> = {
  Ndjamena: { name: "Ndjamena - Chad(standard)", fajrAngle: 18, ishaAngle: 17 }, 
  MWL: { name: "Muslim World League", fajrAngle: 18, ishaAngle: 17 },
  Makkah: { name: "Umm Al-Qura, Makkah", fajrAngle: 18.5, ishaAngle: 0, ishaMinutes: 90 },
 
};

export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  timezone: number,
  method: CalculationMethod = calculationMethods.MWL,
  asrFactor: number = 1 // 1 for Shafi'i, 2 for Hanafi
): PrayerTimes {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const jd = julianDate(year, month, day) - lng / (15 * 24);

  // Calculate prayer times
  let fajr = computePrayerTime(method.fajrAngle, jd, lat, 'ccw');
  let sunrise = computePrayerTime(0.833, jd, lat, 'ccw');
  const { equation } = sunPosition(jd);
  let dhuhr = fixHour(12 - equation);
  let asr = computeAsr(jd, lat, asrFactor);
  let maghrib = computePrayerTime(0.833, jd, lat, 'cw');
  let isha: number;

  if (method.ishaMinutes) {
    isha = maghrib + method.ishaMinutes / 60;
  } else {
    isha = computePrayerTime(method.ishaAngle, jd, lat, 'cw');
  }

  if (method.maghribMinutes) {
    maghrib += method.maghribMinutes / 60;
  }

  // Adjust for timezone
  const adjustment = timezone - lng / 15;
  fajr += adjustment;
  sunrise += adjustment;
  dhuhr += adjustment + 1/60; // Add 1 minute to Dhuhr
  asr += adjustment;
  maghrib += adjustment;
  isha += adjustment;

  return {
    fajr: formatTime(fajr),
    sunrise: formatTime(sunrise),
    dhuhr: formatTime(dhuhr),
    asr: formatTime(asr),
    maghrib: formatTime(maghrib),
    isha: formatTime(isha),
  };
}

export function getNextPrayer(
  prayerTimes: PrayerTimes,
  currentTime: Date
): { name: string; nameAr: string; time: string; isNext: boolean }[] {
  const prayers = [
    { name: 'Fajr', nameAr: 'الفجر', time: prayerTimes.fajr },
    { name: 'Sunrise', nameAr: 'الشروق', time: prayerTimes.sunrise },
    { name: 'Dhuhr', nameAr: 'الظهر', time: prayerTimes.dhuhr },
    { name: 'Asr', nameAr: 'العصر', time: prayerTimes.asr },
    { name: 'Maghrib', nameAr: 'المغرب', time: prayerTimes.maghrib },
    { name: 'Isha', nameAr: 'العشاء', time: prayerTimes.isha },
  ];

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  let nextIndex = -1;

  for (let i = 0; i < prayers.length; i++) {
    const [h, m] = prayers[i].time.split(':').map(Number);
    const prayerMinutes = h * 60 + m;
    if (prayerMinutes > currentMinutes) {
      nextIndex = i;
      break;
    }
  }

  return prayers.map((p, i) => ({
    ...p,
    isNext: i === nextIndex || (nextIndex === -1 && i === 0),
  }));
}

export function calculateQiblaDirection(lat: number, lng: number): number {
  const meccaLat = 21.4225;
  const meccaLng = 39.8262;

  const latRad = lat * DEG_TO_RAD;
  const lngRad = lng * DEG_TO_RAD;
  const meccaLatRad = meccaLat * DEG_TO_RAD;
  const meccaLngRad = meccaLng * DEG_TO_RAD;

  const y = Math.sin(meccaLngRad - lngRad);
  const x = Math.cos(latRad) * Math.tan(meccaLatRad) - Math.sin(latRad) * Math.cos(meccaLngRad - lngRad);

  let qibla = Math.atan2(y, x) * RAD_TO_DEG;
  qibla = (qibla + 360) % 360;

  return qibla;
}

export function getHijriDate(date: Date): { day: number; month: string; monthAr: string; year: number } {
  const hijriMonths = [
    { en: 'Muharram', ar: 'محرم' },
    { en: 'Safar', ar: 'صفر' },
    { en: "Rabi' al-Awwal", ar: 'ربيع الأول' },
    { en: "Rabi' al-Thani", ar: 'ربيع الثاني' },
    { en: 'Jumada al-Awwal', ar: 'جمادى الأولى' },
    { en: 'Jumada al-Thani', ar: 'جمادى الآخرة' },
    { en: 'Rajab', ar: 'رجب' },
    { en: "Sha'ban", ar: 'شعبان' },
    { en: 'Ramadan', ar: 'رمضان' },
    { en: 'Shawwal', ar: 'شوال' },
    { en: "Dhu al-Qi'dah", ar: 'ذو القعدة' },
    { en: 'Dhu al-Hijjah', ar: 'ذو الحجة' },
  ];

  // Approximate Hijri date calculation
  const jd = julianDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const l = Math.floor(jd - 1948439.5) + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  return {
    day,
    month: hijriMonths[month - 1]?.en || 'Unknown',
    monthAr: hijriMonths[month - 1]?.ar || 'غير معروف',
    year,
  };
}
