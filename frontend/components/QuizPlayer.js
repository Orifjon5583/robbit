import React, { useState } from 'react';

export default function QuizPlayer({ content, onComplete }) {
    // Content structure: [{ id, text, options: [], correct: 'A' }]
    // Parse content if string
    const questions = typeof content === 'string' ? JSON.parse(content) : content;

    // Check if questions array exists (structure might differ based on seed)
    // Seed structure: object array directly (from seed.js JSON.stringify(quizContent))
    // Wait, seed.js quizContent is ARRAY. So JSON.parse should return array.

    const [answers, setAnswers] = useState({});

    const handleSelect = (qId, option) => {
        setAnswers(prev => ({ ...prev, [qId]: option }));
    };

    const handleSubmit = () => {
        let score = 0;
        let correctCount = 0;

        questions.forEach(q => {
            // Option format "A) Text". We need to check if answer matches correct letter.
            // Assumption: correct is 'A', 'B', etc. 
            // Submission is the full option string or just letter?
            // Let's assume user clicks option string.
            // We extract letter from option string to compare? Or simple comparison.

            const selected = answers[q.id];
            if (selected && selected.startsWith(q.correct)) {
                correctCount++;
            }
        });

        const total = questions.length;
        const percentage = Math.round((correctCount / total) * 100);

        onComplete(percentage, { answers });
    };

    return (
        <div className="quiz-player">
            {questions.map((q, idx) => (
                <div key={q.id || idx} className="question-card">
                    <h3>{idx + 1}. {q.text}</h3>
                    <div className="options">
                        {q.options.map(opt => (
                            <label key={opt} className="option-label">
                                <input
                                    type="radio"
                                    name={`q-${q.id}`}
                                    value={opt}
                                    onChange={() => handleSelect(q.id, opt)}
                                    checked={answers[q.id] === opt}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>
            ))}
            <button className="submit-btn" onClick={handleSubmit}>Testni Yakunlash</button>
        </div>
    );
}
