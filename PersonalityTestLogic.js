import { useState } from 'react';

// Hook: Personality Test Logic
export function usePersonalityTest() {
    const [answers, setAnswers] = useState(Array(50).fill(null)); // 50 questions
    const [traits, setTraits] = useState({
        Openness: 0,
        Conscientiousness: 0,
        Extraversion: 0,
        Agreeableness: 0,
        Neuroticism: 0,
    });

    const handleAnswer = (questionIndex, newValue) => {
        const previousAnswer = answers[questionIndex];
        const newAnswers = [...answers];
        newAnswers[questionIndex] = newValue;
        setAnswers(newAnswers);
        updateTraits(questionIndex, newValue, previousAnswer);
    };

    const updateTraits = (questionIndex, newValue, previousValue) => {
        const updatedTraits = { ...traits };
        const normalizedPreviousValue = previousValue !== null ? previousValue : 0;

        if (questionIndex >= 0 && questionIndex <= 9) {
            updatedTraits.Openness += newValue - normalizedPreviousValue;
        } else if (questionIndex >= 10 && questionIndex <= 19) {
            updatedTraits.Conscientiousness += newValue - normalizedPreviousValue;
        } else if (questionIndex >= 20 && questionIndex <= 29) {
            updatedTraits.Extraversion += newValue - normalizedPreviousValue;
        } else if (questionIndex >= 30 && questionIndex <= 39) {
            updatedTraits.Agreeableness += newValue - normalizedPreviousValue;
        } else if (questionIndex >= 40 && questionIndex <= 49) {
            updatedTraits.Neuroticism += newValue - normalizedPreviousValue;
        }

        setTraits(updatedTraits);
    };

    function calculateResults() {
        const { Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism } = traits;

        const archetypes = [
            { name: "Labyrinthos", thresholds: { Openness: "high", Conscientiousness: "low", Extraversion: "lowOrHigh", Agreeableness: "high", Neuroticism: "high" } },
            { name: "Aspida", thresholds: { Openness: "low", Conscientiousness: "high", Extraversion: "low", Agreeableness: "moderateToHigh", Neuroticism: "low" } },
            // Add other archetypes here
        ];

        function getTraitMatchScore(traitScore, traitThreshold) {
            if (traitThreshold === "high") {
                return traitScore >= 7.5 ? 3 : traitScore >= 5 ? 2 : 1;
            } else if (traitThreshold === "low") {
                return traitScore <= 2.5 ? 3 : traitScore <= 5 ? 2 : 1;
            } else if (traitThreshold === "lowOrHigh") {
                return traitScore <= 2.5 || traitScore >= 7.5 ? 3 : 1;
            } else if (traitThreshold === "moderate") {
                return traitScore > 2.5 && traitScore < 7.5 ? 2 : 1;
            }
            return 0;
        }

        const archetypeScores = archetypes.map((archetype) => {
            const thresholds = archetype.thresholds;

            const score =
                getTraitMatchScore(Openness, thresholds.Openness) +
                getTraitMatchScore(Conscientiousness, thresholds.Conscientiousness) +
                getTraitMatchScore(Extraversion, thresholds.Extraversion) +
                getTraitMatchScore(Agreeableness, thresholds.Agreeableness) +
                getTraitMatchScore(Neuroticism, thresholds.Neuroticism);

            return { name: archetype.name, score };
        });

        const totalScore = archetypeScores.reduce((sum, archetype) => sum + archetype.score, 0);

        const percentages = archetypeScores.map((archetype) => {
            const percentage = (archetype.score / totalScore) * 100;
            return {
                name: archetype.name,
                percentage: Math.round(percentage),
            };
        });

        return percentages.sort((a, b) => b.percentage - a.percentage);
    }

    return {
        answers,
        handleAnswer,
        calculateResults,
    };
}
