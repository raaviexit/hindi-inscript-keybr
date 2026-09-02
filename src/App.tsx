import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  characterForKey,
  FINGER_LABELS,
  INSCRIPT_ROWS,
  keyForCharacter,
  type InscriptKey,
} from "./domain/layout";
import { createAdaptiveLesson, LESSONS, type Lesson } from "./domain/lessons";
import { deriveSessionStats } from "./domain/stats";
import { evaluateAttempt, removeLastGrapheme, wordsPerMinute } from "./domain/typing";

const STORAGE_KEY = "hindi-inscript-best";

function loadBest(): { wpm: number; accuracy: number } {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as { wpm: number; accuracy: number }) : { wpm: 0, accuracy: 0 };
  } catch {
    return { wpm: 0, accuracy: 0 };
  }
}

function Keycap({ keyData, active, next, errors, onClick }: {
  keyData: InscriptKey;
  active: boolean;
  next: boolean;
  errors: number;
  onClick: () => void;
}) {
  const classNames = [
    "keycap",
    keyData.width ? `keycap--${keyData.width}` : "",
    keyData.home ? "keycap--home" : "",
    active ? "keycap--active" : "",
    next ? "keycap--next" : "",
    errors ? "keycap--error" : "",
  ].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={classNames}
      onClick={onClick}
      title={`${keyData.label ?? keyData.normal} — ${FINGER_LABELS[keyData.finger]}`}
      aria-label={keyData.label ?? keyData.normal}
    >
      {keyData.label ? <span className="keycap__label">{keyData.label}</span> : <>
        <span className="keycap__shift">{keyData.shift}</span>
        <span className="keycap__normal">{keyData.normal}</span>
      </>}
      {errors > 0 && <span className="keycap__error-count">{errors}</span>}
    </button>
  );
}

export function App() {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [lesson, setLesson] = useState<Lesson>(LESSONS[0]);
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [best, setBest] = useState(loadBest);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!startedAt) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [startedAt]);

  const evaluation = useMemo(() => evaluateAttempt(lesson.target, typed), [lesson.target, typed]);
  const elapsedSeconds = startedAt ? Math.max(1, Math.floor((now - startedAt) / 1000)) : 0;
  const wpm = wordsPerMinute(typed, elapsedSeconds);
  const stats = useMemo(
    () => deriveSessionStats(lesson.target, typed, elapsedSeconds, evaluation),
    [lesson.target, typed, elapsedSeconds, evaluation],
  );
  const nextExpected = evaluation.expected[evaluation.actual.length];
  const nextKey = nextExpected ? keyForCharacter(nextExpected.at(-1) ?? nextExpected) : undefined;
  const mistakes = evaluation.expected.filter((unit, index) => evaluation.actual[index] && evaluation.actual[index] !== unit);

  useEffect(() => {
    if (!evaluation.complete || !typed) return;
    const nextBest = {
      wpm: Math.max(best.wpm, wpm),
      accuracy: Math.max(best.accuracy, evaluation.accuracy),
    };
    setBest(nextBest);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBest));
  }, [evaluation.accuracy, evaluation.complete, typed, wpm]); // Deliberately records a completed run only.

  function reset(currentLesson = lesson) {
    setLesson(currentLesson);
    setTyped("");
    setStartedAt(null);
    setNow(Date.now());
    setActiveCode(null);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function insert(character: string, code?: string) {
    if (evaluation.complete) return;
    if (!startedAt) setStartedAt(Date.now());
    if (code) {
      setActiveCode(code);
      window.setTimeout(() => setActiveCode((current) => (current === code ? null : current)), 150);
    }
    setTyped((current) => current + character);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.nativeEvent.isComposing || event.ctrlKey || event.metaKey) return;
    if (event.code === "Backspace") {
      event.preventDefault();
      setTyped(removeLastGrapheme);
      return;
    }
    if (event.code === "Enter") {
      event.preventDefault();
      if (evaluation.complete) goToNextLesson();
      return;
    }
    const character = characterForKey(event.code, event.shiftKey, event.altKey && event.ctrlKey);
    if (!character) return;
    event.preventDefault();
    insert(character, event.code);
  }

  function chooseLesson(index: number) {
    setLessonIndex(index);
    reset(LESSONS[index]);
  }

  function goToNextLesson() {
    const index = Math.min(lessonIndex + 1, LESSONS.length - 1);
    chooseLesson(index);
  }

  function startAdaptive() {
    setLessonIndex(LESSONS.length - 1);
    reset(createAdaptiveLesson(mistakes));
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">BIS InScript · देवनागरी</p>
          <h1>हिंदी टाइपिंग ट्रेनर</h1>
          <p className="hero__copy">InScript लेआउट पर सही उंगलियों, मात्रा और संयुक्ताक्षर के साथ टाइप करना सीखें।</p>
        </div>
        <div className="best-card" aria-label="Personal best">
          <span>आपका सर्वश्रेष्ठ</span>
          <strong>{best.wpm} WPM</strong>
          <small>{best.accuracy}% शुद्धता</small>
        </div>
      </header>

      <section className="lesson-picker" aria-label="Lesson selection">
        {LESSONS.map((item, index) => (
          <button
            className={lesson.id === item.id ? "lesson-chip lesson-chip--active" : "lesson-chip"}
            type="button"
            key={item.id}
            onClick={() => chooseLesson(index)}
          >
            <span>{index + 1}</span>{item.title}
          </button>
        ))}
      </section>

      <section className="trainer-grid">
        <section className="practice-card" aria-labelledby="lesson-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">अभ्यास {Math.min(lessonIndex + 1, LESSONS.length)} / {LESSONS.length}</p>
              <h2 id="lesson-title">{lesson.title}</h2>
              <p>{lesson.description}</p>
            </div>
            <button className="quiet-button" type="button" onClick={() => reset()}>फिर से शुरू करें</button>
          </div>

          <div className="target-text" aria-label="Text to type">
            {evaluation.expected.map((unit, index) => {
              const actual = evaluation.actual[index];
              const state = actual === undefined ? "pending" : actual === unit ? "correct" : "incorrect";
              return <span className={`target-text__unit target-text__unit--${state}`} key={`${unit}-${index}`}>{unit}</span>;
            })}
          </div>

          <label className="typing-label" htmlFor="typing-input">यहाँ टाइप करें</label>
          <textarea
            id="typing-input"
            ref={inputRef}
            className="typing-input"
            value={typed}
            readOnly
            rows={3}
            autoFocus
            spellCheck={false}
            onKeyDown={handleKeyDown}
            onPaste={(event) => event.preventDefault()}
            aria-describedby="typing-help"
          />
          <p id="typing-help" className="typing-help">कुंजी दबाएँ या नीचे के कीबोर्ड पर क्लिक करें। वेबसाइट स्वयं InScript अक्षर लिखती है।</p>

          <div className="metrics" aria-live="polite">
            <div><span>गति</span><strong>{wpm} <small>WPM</small></strong></div>
            <div><span>शुद्धता</span><strong>{evaluation.accuracy}<small>%</small></strong></div>
            <div><span>समय</span><strong>{elapsedSeconds}<small> sec</small></strong></div>
          </div>

          {evaluation.complete && (
            <div className="completion" role="status">
              <div><strong>बहुत बढ़िया! अभ्यास पूरा हुआ।</strong><span>{wpm} WPM और {evaluation.accuracy}% शुद्धता</span></div>
              <div className="completion__actions">
                <button className="secondary-button" type="button" onClick={startAdaptive}>सुधार अभ्यास</button>
                <button className="primary-button" type="button" onClick={goToNextLesson}>अगला अभ्यास</button>
              </div>
            </div>
          )}
        </section>

        <aside className="insight-card">
          <p className="eyebrow">लाइव आँकड़े</p>
          <h2>कहाँ ध्यान दें</h2>
          {Object.keys(stats.keyErrors).length ? <>
            <p>लाल कुंजियाँ उन स्थानों को दिखाती हैं जहाँ इस प्रयास में त्रुटि हुई।</p>
            <dl className="finger-list">
              {Object.entries(stats.fingerErrors).map(([finger, count]) => <div key={finger}>
                <dt>{FINGER_LABELS[finger as keyof typeof FINGER_LABELS]}</dt><dd>{count}</dd>
              </div>)}
            </dl>
          </> : <p>लक्ष्य अक्षर हरे रंग में दिखेगा। सही उंगली से धीरे-धीरे शुरुआत करें।</p>}
          <div className="legend"><span className="legend__next" /> अगली कुंजी <span className="legend__error" /> त्रुटि</div>
        </aside>
      </section>

      <section className="keyboard-card" aria-labelledby="keyboard-title">
        <div className="section-heading keyboard-heading">
          <div><p className="eyebrow">पूर्ण लेआउट</p><h2 id="keyboard-title">Hindi InScript कीबोर्ड</h2></div>
          <p>ऊपर: Shift · नीचे: सामान्य</p>
        </div>
        <div className="keyboard" aria-label="Hindi InScript keyboard">
          {INSCRIPT_ROWS.map((row, rowIndex) => <div className="keyboard__row" key={rowIndex}>
            {row.map((keyData) => <Keycap
              key={keyData.code}
              keyData={keyData}
              active={activeCode === keyData.code}
              next={nextKey?.code === keyData.code}
              errors={stats.keyErrors[keyData.code] ?? 0}
              onClick={() => {
                if (keyData.code === "Backspace") setTyped(removeLastGrapheme);
                else {
                  const character = characterForKey(keyData.code);
                  if (character) insert(character, keyData.code);
                }
                inputRef.current?.focus();
              }}
            />)}
          </div>)}
        </div>
      </section>

      <footer>Hindi InScript Trainer · Unicode-aware practice for matras, halant, nukta, and conjuncts.</footer>
    </main>
  );
}
