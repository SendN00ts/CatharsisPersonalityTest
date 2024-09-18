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
        // Ensure the value is within the acceptable range (-3 to 3)
        if (newValue < -3 || newValue > 3) {
            console.error(`Invalid value received for question ${questionIndex + 1}:`, newValue);
            return;
        }

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
            {
                name: "Labyrinth",
                thresholds: {
                    Openness: "high",
                    Conscientiousness: "low",
                    Extraversion: "lowOrHigh",
                    Agreeableness: "high",
                    Neuroticism: "high",
                },
            },
            {
                name: "Shield",
                thresholds: {
                    Openness: "low",
                    Conscientiousness: "high",
                    Extraversion: "low",
                    Agreeableness: "moderateToHigh",
                    Neuroticism: "low",
                },
            },
            {
                name: "Helm",
                thresholds: {
                    Openness: "high",
                    Conscientiousness: "high",
                    Extraversion: "high",
                    Agreeableness: "moderate",
                    Neuroticism: "low",
                },
            },
            {
                name: "Olive Branch",
                thresholds: {
                    Openness: "moderate",
                    Conscientiousness: "high",
                    Extraversion: "high",
                    Agreeableness: "high",
                    Neuroticism: "low",
                },
            },
            {
                name: "Papyros",
                thresholds: {
                    Openness: "high",
                    Conscientiousness: "low",
                    Extraversion: "low",
                    Agreeableness: "lowToModerate",
                    Neuroticism: "moderateToHigh",
                },
            },
            {
                name: "Lyra",
                thresholds: {
                    Openness: "moderate",
                    Conscientiousness: "moderate",
                    Extraversion: "high",
                    Agreeableness: "high",
                    Neuroticism: "low",
                },
            },
            {
                name: "Dory",
                thresholds: {
                    Openness: "low",
                    Conscientiousness: "moderateToHigh",
                    Extraversion: "high",
                    Agreeableness: "low",
                    Neuroticism: "lowToModerate",
                },
            },
            {
                name: "Estia",
                thresholds: {
                    Openness: "low",
                    Conscientiousness: "low",
                    Extraversion: "low",
                    Agreeableness: "moderateToHigh",
                    Neuroticism: "low",
                },
            },
        ];

        // Calculate a match score for each archetype
        const archetypeScores = archetypes.map((archetype) => {
            const thresholds = archetype.thresholds;

            const score =
                (Openness >= 4 && thresholds.Openness === "high" ? 2 : Openness <= 2 && thresholds.Openness === "low" ? 2 : Openness === 3 && thresholds.Openness === "moderate" ? 1 : 0) +
                (Conscientiousness >= 4 && thresholds.Conscientiousness === "high" ? 2 : Conscientiousness <= 2 && thresholds.Conscientiousness === "low" ? 2 : Conscientiousness === 3 && thresholds.Conscientiousness === "moderate" ? 1 : 0) +
                (Extraversion >= 4 && thresholds.Extraversion === "high" ? 2 : Extraversion <= 2 && thresholds.Extraversion === "low" ? 2 : Extraversion === 3 && thresholds.Extraversion === "moderate" ? 1 : 0) +
                (Agreeableness >= 4 && thresholds.Agreeableness === "high" ? 2 : Agreeableness <= 2 && thresholds.Agreeableness === "low" ? 2 : Agreeableness === 3 && thresholds.Agreeableness === "moderate" ? 1 : 0) +
                (Neuroticism >= 4 && thresholds.Neuroticism === "high" ? 2 : Neuroticism <= 2 && thresholds.Neuroticism === "low" ? 2 : Neuroticism === 3 && thresholds.Neuroticism === "moderate" ? 1 : 0);

            return { name: archetype.name, score };
        });

        // Sort archetypes by score in descending order
        const sortedArchetypes = archetypeScores.sort((a, b) => b.score - a.score);

        // Normalize the scores by adjusting the scaling
        const totalScore = sortedArchetypes.reduce((sum, archetype) => sum + archetype.score, 0);

        // If the total score is 0 (no correlation), return 0% for all archetypes
        if (totalScore === 0) {
            return archetypes.map((archetype) => ({ name: archetype.name, percentage: 0 }));
        }

        // Weighted scaling: top archetype will dominate but others still get their share
        const weightedPercentages = sortedArchetypes.map(archetype => {
            return {
                name: archetype.name,
                percentage: Math.round((archetype.score / totalScore) * 100) // Scale the scores to percentages
            };
        });

        console.log("Final archetype percentages:", weightedPercentages);

        return weightedPercentages;
    }

    return {
        answers,
        handleAnswer,
        calculateResults,
    };
}
