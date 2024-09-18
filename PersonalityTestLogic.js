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

        function getTraitMatchScore(traitScore, traitThreshold) {
            if (traitThreshold === "high") {
                return traitScore >= 5 ? 2 : 0;  // Boost score for strong matches
            } else if (traitThreshold === "moderate") {
                return traitScore >= 3 && traitScore <= 4 ? 1 : 0;  
            } else if (traitThreshold === "low") {
                return traitScore <= 2 ? 2 : 0;  // Boost low correlation as well
            } else if (traitThreshold === "lowOrHigh") {
                return traitScore <= 2 || traitScore >= 5 ? 1.5 : 0;  // Give more flexibility for low or high
            } else if (traitThreshold === "moderateToHigh") {
                return traitScore >= 3 ? 1.5 : 0;  
            } else if (traitThreshold === "lowToModerate") {
                return traitScore <= 3 ? 1.5 : 0; 
            }
            return 0;
        }

        // Calculate a match score for each archetype
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

        // Sort archetypes by score in descending order
        const sortedArchetypes = archetypeScores.sort((a, b) => b.score - a.score);

        // Total score to normalize percentages
        const totalScore = sortedArchetypes.reduce((sum, archetype) => sum + archetype.score, 0);

        // Return 0% for all if no correlation
        if (totalScore === 0) {
            return archetypes.map((archetype) => ({ name: archetype.name, percentage: 0 }));
        }

        // Distribute scores based on weight
        const weightedPercentages = sortedArchetypes.map((archetype) => ({
            name: archetype.name,
            percentage: Math.round((archetype.score / totalScore) * 100),  // Scale the scores
        }));

        console.log("Final archetype percentages:", weightedPercentages);

        return weightedPercentages;
    }

    return {
        answers,
        handleAnswer,
        calculateResults,
    };
}
