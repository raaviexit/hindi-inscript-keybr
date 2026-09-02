import { keyForCharacter } from "./layout";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  target: string;
  focus: readonly string[];
}

export const LESSONS: readonly Lesson[] = [
  {
    id: "home-row",
    title: "होम रो",
    description: "होम रो के अक्षर और मात्रा पहचानें।",
    target: "क र त प फ अ इ उ ए ओ",
    focus: ["क", "र", "त", "प", "फ", "अ", "इ", "उ", "ए", "ओ"],
  },
  {
    id: "vowels",
    title: "स्वर और मात्राएँ",
    description: "स्वतंत्र स्वर और उनकी मात्राओं का अभ्यास करें।",
    target: "अ आ इ ई उ ऊ ए ऐ ओ औ ऋ ा ि ी ु ू े ै ो ौ ृ",
    focus: ["अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ", "ा", "ि", "ी", "ु", "ू"],
  },
  {
    id: "consonants",
    title: "मूल व्यंजन",
    description: "आम देवनागरी व्यंजन टाइप करें।",
    target: "क ख ग घ च छ ज झ ट ठ ड ढ त थ द ध न प फ ब भ म य र ल व स श ष ह",
    focus: ["क", "ग", "च", "त", "द", "न", "प", "ब", "म", "य", "र", "ल", "व", "स", "ह"],
  },
  {
    id: "matras",
    title: "मात्रा वाले शब्द",
    description: "व्यंजन और मात्राओं को सही क्रम में जोड़ें।",
    target: "कमल किताब पानी खाना भारत समय जीवन भाषा परिवार दुनिया",
    focus: ["ा", "ि", "ी", "ु", "े", "ो"],
  },
  {
    id: "conjuncts",
    title: "हलंत और संयुक्ताक्षर",
    description: "हलंत, अनुस्वार और संयुक्ताक्षर एक ही लिखने योग्य इकाई की तरह पढ़ें।",
    target: "शब्द शक्ति प्रश्न मित्र राष्ट्र हिंदी संस्कृत लक्ष्य अक्षर",
    focus: ["्", "ं", "श", "ष", "र", "त", "क"],
  },
  {
    id: "words",
    title: "आम हिंदी शब्द",
    description: "दैनिक उपयोग के शब्दों से गति बढ़ाएँ।",
    target: "आज आपका अभ्यास बहुत अच्छा है हम हिंदी में तेजी और शुद्धता से लिखते हैं",
    focus: ["ह", "ि", "ं", "द", "ी", "त", "े", "ज"],
  },
  {
    id: "sentences",
    title: "वाक्य अभ्यास",
    description: "एक सहज हिंदी वाक्य को बिना जल्दबाज़ी के टाइप करें।",
    target: "नियमित अभ्यास से हिंदी टाइपिंग की गति और शुद्धता दोनों बढ़ती हैं।",
    focus: ["न", "ि", "य", "म", "त", "अ", "भ", "्", "।"],
  },
];

const FREQUENT_WORDS = [
  "और", "का", "के", "की", "में", "है", "हैं", "को", "से", "पर", "यह", "एक", "हम", "आप", "नहीं",
  "कर", "लिए", "अपने", "भारत", "हिंदी", "भाषा", "समय", "काम", "लोग", "घर", "दिन", "जीवन", "नया",
  "अच्छा", "बड़ा", "बहुत", "साथ", "बात", "पानी", "किताब", "विद्यालय", "परिवार", "देश", "दुनिया",
] as const;

/** Builds a short follow-up drill around characters missed in the previous attempt. */
export function createAdaptiveLesson(mistakes: readonly string[]): Lesson {
  const focus = [...new Set(mistakes.filter((character) => keyForCharacter(character)))].slice(0, 4);
  const relevant = FREQUENT_WORDS.filter((word) => focus.some((character) => word.includes(character)));
  const words = (relevant.length >= 4 ? relevant : FREQUENT_WORDS).slice(0, 8);
  return {
    id: `adaptive-${focus.join("") || "review"}`,
    title: focus.length ? "सुधार अभ्यास" : "दोहराव अभ्यास",
    description: focus.length
      ? `इन अक्षरों पर ध्यान दें: ${focus.join(" ")}`
      : "आम हिंदी शब्दों का एक और छोटा अभ्यास।",
    target: words.join(" "),
    focus,
  };
}
