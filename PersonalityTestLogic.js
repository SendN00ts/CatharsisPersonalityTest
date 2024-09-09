import { useState, useEffect } from 'react'; // Make sure this is included at the top

export function usePersonalityTest() {
    const [answers, setAnswers] = useState(Array(50).fill(null)); // Example for 50 questions
    const [traits, setTraits] = useState({
        Openness: 0,
        Conscientiousness: 0,
        Extraversion: 0,
        Agreeableness: 0,
        Neuroticism: 0
    });

    const updateTraits = (questionIndex, value) => {
        const updatedTraits = { ...traits };

        if (questionIndex >= 0 && questionIndex <= 9) {
            updatedTraits.Openness += value - 3;
        } else if (questionIndex >= 10 && questionIndex <= 19) {
            updatedTraits.Conscientiousness += value - 3;
        } else if (questionIndex >= 20 && questionIndex <= 29) {
            updatedTraits.Extraversion += value - 3;
        } else if (questionIndex >= 30 && questionIndex <= 39) {
            updatedTraits.Agreeableness += value - 3;
        } else if (questionIndex >= 40 && questionIndex <= 49) {
            updatedTraits.Neuroticism += value - 3;
        }

        setTraits(updatedTraits);
    };

    const handleAnswer = (questionIndex, value) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = value;
        setAnswers(newAnswers);
        updateTraits(questionIndex, value);
    };

    const calculateResults = () => {
        const { Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism } = traits;

        // Logic to calculate results based on trait values
        if (Openness > 10 && Conscientiousness < 0) {
            return { primary: "Labyrinth", secondary: "Papyros" };
        } else if (Conscientiousness > 10 && Openness < 0) {
            return { primary: "Shield", secondary: "Helm" };
        } // Add other conditions based on trait logic
    };

    return {
        answers,
        handleAnswer,
        calculateResults,
    };
}
