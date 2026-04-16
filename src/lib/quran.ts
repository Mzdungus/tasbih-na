import quranData from '../data/quran_fr.json';

export interface Verse {
  number: number;
  text: string;
  transliteration?: string;
  translation?: string;
}

export interface Surah {
  number: number;
  name: string;
  nameAr: string;
  englishName: string;
  versesCount: number;
  revelationType: 'Meccan' | 'Medinan';
  verses?: Verse[];
}

// Types for raw JSON data
interface RawVerse {
  id: number;
  text: string;
  translation?: string;
}

interface RawSurah {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: 'meccan' | 'medinan';
  total_verses: number;
  verses?: RawVerse[];
}

/**
 * Transforms raw JSON data to Surah interface
 * Handles missing data gracefully with strict TypeScript validation
 */
function transformSurahData(rawSurah: RawSurah): Surah {
  const revelationType = rawSurah.type === 'meccan' ? 'Meccan' : 'Medinan';
  
  const verses: Verse[] = (rawSurah.verses || []).map((verse: RawVerse) => ({
    number: verse.id,
    text: verse.text || '',
    translation: verse.translation || '',
  }));

  return {
    number: rawSurah.id,
    name: rawSurah.transliteration || 'Unknown',
    nameAr: rawSurah.name || 'Unknown',
    englishName: rawSurah.translation || 'Unknown',
    versesCount: rawSurah.total_verses,
    revelationType,
    verses,
  };
}

/**
 * Loads and transforms Quran data from JSON
 * Returns properly typed Surah array
 */
function loadQuranData(): Surah[] {
  try {
    if (!Array.isArray(quranData)) {
      console.error('Invalid Quran data format: expected array', quranData);
      return [];
    }

    return quranData
      .map((item: unknown) => transformSurahData(item as RawSurah))
      .sort((a, b) => a.number - b.number);
  } catch (error) {
    console.error('Error loading Quran data:', error);
    return [];
  }
}

export const surahs: Surah[] = loadQuranData();

// Utility function to find a Surah by number with error handling
export function findSurahByNumber(number: number): Surah | null {
  const surah = surahs.find(s => s.number === number);
  
  if (!surah) {
    console.warn(`Surah ${number} not found in loaded data`);
    return null;
  }
  
  return surah;
}

// Utility function to ensure surahs have verses, fallback if empty
export function getSurahWithVerses(surahNumber: number): Surah | null {
  const surah = findSurahByNumber(surahNumber);
  
  if (!surah) {
    return null;
  }
  
  // If no verses found in loaded data, return surah metadata only
  if (!surah.verses || surah.verses.length === 0) {
    console.warn(`No verses found for Surah ${surahNumber}`);
  }
  
  return surah;
}

export interface Dhikr {
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  benefit: string;
}

export const adhkar: Dhikr[] = [
  {
    arabic: 'سُبْحَانَ اللهِ',
    transliteration: 'SubhanAllah',
    translation: 'Glory be to Allah',
    count: 33,
    benefit: 'Praising Allah and declaring His perfection'
  },
  {
    arabic: 'الحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    translation: 'All praise is due to Allah',
    count: 33,
    benefit: 'Expressing gratitude to Allah'
  },
  {
    arabic: 'اللهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: 'Allah is the Greatest',
    count: 34,
    benefit: 'Declaring the greatness of Allah'
  },
  {
    arabic: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'La ilaha illallahu wahdahu la sharika lahu, lahul-mulku wa lahul-hamdu wa huwa ala kulli shayin qadir',
    translation: 'None has the right to be worshipped but Allah alone, Who has no partner. His is the dominion and His is the praise, and He is Able to do all things',
    count: 10,
    benefit: 'Declaration of Tawheed (Oneness of Allah)'
  },
  {
    arabic: 'أَسْتَغْفِرُ اللهَ',
    transliteration: 'Astaghfirullah',
    translation: 'I seek forgiveness from Allah',
    count: 100,
    benefit: 'Seeking forgiveness for sins'
  },
  {
    arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ',
    transliteration: 'SubhanAllahi wa bihamdihi',
    translation: 'Glory be to Allah and praise Him',
    count: 100,
    benefit: 'A tree is planted in Paradise for each recitation'
  },
  {
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ',
    transliteration: 'La hawla wa la quwwata illa billah',
    translation: 'There is no might nor power except with Allah',
    count: 10,
    benefit: 'A treasure from the treasures of Paradise'
  },
  {
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    transliteration: 'Allahumma salli ala Muhammad wa ala ali Muhammad',
    translation: 'O Allah, send prayers upon Muhammad and upon the family of Muhammad',
    count: 10,
    benefit: 'Sending blessings upon the Prophet (PBUH)'
  }
];

export const dailyDuas = [
  {
    title: 'Dua for Waking Up',
    titleAr: 'دعاء الاستيقاظ',
    arabic: 'الحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdu lillahil-lathee ahyana ba\'da ma amatana wa ilayhin-nushoor',
    translation: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.'
  },
  {
    title: 'Dua Before Eating',
    titleAr: 'دعاء قبل الطعام',
    arabic: 'بِسْمِ اللهِ',
    transliteration: 'Bismillah',
    translation: 'In the name of Allah.'
  },
  {
    title: 'Dua After Eating',
    titleAr: 'دعاء بعد الطعام',
    arabic: 'الحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration: 'Alhamdu lillahil-lathee at\'amanee hatha wa razaqaneehi min ghayri hawlin minnee wa la quwwah',
    translation: 'All praise is for Allah who fed me this and provided it for me without any might or power from myself.'
  },
  {
    title: 'Dua Before Sleeping',
    titleAr: 'دعاء قبل النوم',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amootu wa ahya',
    translation: 'In Your name O Allah, I live and die.'
  },
  {
    title: 'Dua for Entering Mosque',
    titleAr: 'دعاء دخول المسجد',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: 'Allahumma-ftah lee abwaba rahmatik',
    translation: 'O Allah, open the gates of Your mercy for me.'
  },
  {
    title: 'Dua for Leaving Mosque',
    titleAr: 'دعاء الخروج من المسجد',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    transliteration: 'Allahumma innee as-aluka min fadlik',
    translation: 'O Allah, I ask You from Your favour.'
  },
  {
    title: 'Dua for Travel',
    titleAr: 'دعاء السفر',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration: 'Subhanal-lathee sakh-khara lana hatha wa ma kunna lahu muqrineen. Wa inna ila Rabbina lamunqaliboon',
    translation: 'How perfect He is, the One Who has placed this (transport) at our service and we ourselves would not have been capable of that, and to our Lord is our final destiny.'
  }
];
