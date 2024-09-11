import { useState } from 'react';

export function usePersonalityTest() {
    const [answers, setAnswers] = useState(Array(50).fill(null)); // Example for 50 questions
    const [traits, setTraits] = useState({
        Openness: 0,
        Conscientiousness: 0,
        Extraversion: 0,
        Agreeableness: 0,
        Neuroticism: 0,
    });

    const handleAnswer = (questionIndex, value) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = value;
        setAnswers(newAnswers);

        updateTraits(questionIndex, value);
    };

    const updateTraits = (questionIndex, value) => {
        // ... (keep the existing updateTraits logic)
    };

    function calculateResults() {
        // ... (keep the existing calculateResults logic)

        // Ensure we're returning both the best match and all archetype scores
        return { 
            primary: bestMatch.name, 
            archetypeScores: archetypeScores.map(archetype => ({
                name: archetype.name,
                score: archetype.score
            }))
        };
    }

    return {
        answers,
        handleAnswer,
        calculateResults,
    };
}
