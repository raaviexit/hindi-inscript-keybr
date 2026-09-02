export type Lesson = {
  id: string;
  title: string;
  description: string;
  texts: readonly string[];
};

export const HINDI_LESSONS: readonly Lesson[] = [
  { id: "home-row", title: "होम रो", description: "अभ्यास: ो े ् ि ु और प र क त च", texts: ["पर कर", "तर पर", "कित", "तप कर"] },
  { id: "vowels", title: "स्वर", description: "स्वतंत्र स्वर और मात्रा पहचान", texts: ["आओ", "इधर", "उधर", "ऐसा", "ओस"] },
  { id: "consonants", title: "व्यंजन", description: "बुनियादी व्यंजन संयोजन", texts: ["कम", "मन", "घर", "जल", "वन"] },
  { id: "matras", title: "मात्राएँ", description: "मात्राओं के साथ गति और शुद्धता", texts: ["काम", "कीमत", "किताब", "कुल", "देश"] },
  { id: "clusters", title: "संयुक्त अक्षर", description: "हलंत और प्रचलित conjunct sequences", texts: ["कर्म", "शक्ति", "प्रश्न", "स्वतंत्र", "विश्व"] },
  { id: "words", title: "सामान्य शब्द", description: "आम हिंदी शब्दों से adaptive practice", texts: ["भारत", "परिवार", "समय", "जानकारी", "समस्या", "समाधान"] },
  { id: "sentences", title: "वाक्य", description: "पूरे वाक्यों में प्रवाह", texts: ["भारत एक बड़ा देश है।", "अच्छी टाइपिंग के लिए नियमित अभ्यास ज़रूरी है।", "सही गति से पहले सही अक्षर सीखें।"] },
];

export function lessonById(id: string): Lesson | undefined {
  return HINDI_LESSONS.find((lesson) => lesson.id === id);
}
