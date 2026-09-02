import { useMemo, useState } from "react";
import { INSCRIPT_KEYS, resolveInscriptKey } from "./keyboard/inscript";
import { HINDI_LESSONS } from "./lessons/hindi";
import { accuracy, createStats, keyDifficulty, recordKeystroke, wpm } from "./typing/stats";
import { compareUnicode, normalizeTypingText } from "./typing/unicode";

export default function App() {
  const [lessonIndex, setLessonIndex] = useState(0);
  const lesson = HINDI_LESSONS[lessonIndex];
  const [text, setText] = useState(lesson.texts[0]);
  const [typed, setTyped] = useState("");
  const [stats, setStats] = useState(createStats());

  const expected = normalizeTypingText(text);
  const comparison = compareUnicode(expected.slice(0, typed.length), typed);
  const nextKey = Array.from(expected).find((_, i) => i >= Array.from(typed).length) ?? "";

  const heatmap = useMemo(
    () => INSCRIPT_KEYS.map((key) => ({ ...key, difficulty: keyDifficulty(stats, key.code) })),
    [stats],
  );

  function handleInput(value: string) {
    const chars = Array.from(normalizeTypingText(value));
    const previous = Array.from(typed);
    if (chars.length < previous.length) {
      setTyped(value);
      return;
    }
    const incoming = chars.slice(previous.length);
    let updated = stats;
    for (const char of incoming) {
      const expectedChar = Array.from(expected)[previous.length] ?? "";
      updated = recordKeystroke(updated, char, char === expectedChar);
      previous.push(char);
    }
    setTyped(chars.join(""));
    setStats(updated);
  }

  function nextLesson() {
    const index = Math.min(HINDI_LESSONS.length - 1, lessonIndex + 1);
    setLessonIndex(index);
    setText(HINDI_LESSONS[index].texts[0]);
    setTyped("");
    setStats(createStats());
  }

  return (
    <main className="app">
      <header>
        <p className="eyebrow">हिंदी InScript</p>
        <h1>Hindi InScript Typing Trainer</h1>
        <p className="muted">Unicode-safe Devanagari practice with progressive lessons.</p>
      </header>

      <section className="stats">
        <div><strong>{Math.round(wpm(stats))}</strong><span>WPM</span></div>
        <div><strong>{Math.round(accuracy(stats))}%</strong><span>Accuracy</span></div>
        <div><strong>{stats.errors}</strong><span>Errors</span></div>
      </section>

      <section className="lesson-panel">
        <div className="lesson-header">
          <div>
            <p className="eyebrow">Lesson {lessonIndex + 1} / {HINDI_LESSONS.length}</p>
            <h2>{lesson.title}</h2>
            <p className="muted">{lesson.description}</p>
          </div>
          <select value={lesson.id} onChange={(event) => {
            const next = HINDI_LESSONS.findIndex((item) => item.id === event.target.value);
            setLessonIndex(next);
            setText(HINDI_LESSONS[next].texts[0]);
            setTyped("");
            setStats(createStats());
          }}>
            {HINDI_LESSONS.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </div>

        <div className="prompt">{expected}</div>
        <input
          className="typing-input"
          value={typed}
          onChange={(event) => handleInput(event.target.value)}
          aria-label="Hindi typing input"
          autoFocus
        />
        <p className={comparison.correct ? "feedback ok" : "feedback bad"}>
          {typed.length === expected.length ? "Lesson complete. बहुत बढ़िया!" : `अगला अक्षर: ${nextKey || "—"}`}
        </p>
        <button onClick={nextLesson} disabled={lessonIndex === HINDI_LESSONS.length - 1}>अगला स्तर</button>
      </section>

      <section className="keyboard" aria-label="Hindi InScript keyboard">
        {heatmap.map((key) => (
          <div key={key.code} className={`key ${key.home ? "home" : ""} ${resolveInscriptKey(key.code, "base") === nextKey ? "target" : ""}`}>
            <span>{key.base || key.label}</span>
            <small>{key.shift || ""}</small>
          </div>
        ))}
      </section>
    </main>
  );
}
