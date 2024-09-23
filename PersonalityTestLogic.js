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
        console.log(`Question Index: ${questionIndex + 1} - "New Value:"`, newValue);

        // Ensure the value is within the acceptable range (-3 to 3)
        if (newValue < -3 || newValue > 3) {
            console.error(`Invalid value received for question ${questionIndex + 1}:`, newValue);
            return;
        }

        const previousAnswer = answers[questionIndex]; // Get the previous answer for the question
        const newAnswers = [...answers];
        newAnswers[questionIndex] = newValue; // Update the new answer
        setAnswers(newAnswers); // Save the updated answers

        updateTraits(questionIndex, newValue, previousAnswer); // Pass both new and previous answer to update traits
    };

    const updateTraits = (questionIndex, newValue, previousValue) => {
        console.log(`Before updating traits for question ${questionIndex + 1}:`, traits);

        const updatedTraits = { ...traits };

        // Use previous value if it exists
        const normalizedPreviousValue = previousValue !== null ? previousValue : 0;

        // Update traits based on the question range (0-9 Openness, 10-19 Conscientiousness, etc.)
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

        setTraits(updatedTraits); // Save the updated traits
        console.log(`After updating traits for question ${questionIndex + 1}:`, updatedTraits);
    };

    function calculateResults() {
        const { Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism } = traits;

        // Define total questions per trait
        const totalQuestionsPerTrait = 10;
        const maxScorePerTrait = totalQuestionsPerTrait * 3;
        const minScorePerTrait = totalQuestionsPerTrait * -3;

        // Define thresholds for matching
        const getThresholds = (minScore, maxScore) => ({
            low: minScore + (maxScore - minScore) * 0.25,
            high: minScore + (maxScore - minScore) * 0.75,
            moderateLow: minScore + (maxScore - minScore) * 0.25,
            moderateHigh: minScore + (maxScore - minScore) * 0.75
        });

        const thresholds = getThresholds(minScorePerTrait, maxScorePerTrait);

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
                url: "https://tiny-slides-700893.framer.app/resultlabyrinthos",
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
                url: "https://tiny-slides-700893.framer.app/resultaspida",
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
                url: "https://tiny-slides-700893.framer.app/resultkyvernitis",
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
                url: "https://tiny-slides-700893.framer.app/resultkladoselaias",
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
                url: "https://tiny-slides-700893.framer.app/resultpapyros",
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
                url: "https://tiny-slides-700893.framer.app/resultlyra",
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
                url: "https://tiny-slides-700893.framer.app/resultdory",
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
                url: "https://tiny-slides-700893.framer.app/resultestia",
            },
        ];

        // Adjusted trait matching logic with additional weighting
        function getTraitMatchScore(traitScore, traitThreshold) {
            if (traitThreshold === "high") {
                return traitScore >= thresholds.high ? 3 : traitScore >= thresholds.moderateHigh ? 2 : traitScore >= thresholds.moderateLow ? 1 : 0;
            } else if (traitThreshold === "moderate") {
                return traitScore >= thresholds.moderateLow && traitScore <= thresholds.moderateHigh ? 2 : 1;
            } else if (traitThreshold === "low") {
                return traitScore <= thresholds.low ? 3 : traitScore <= thresholds.moderateLow ? 2 : traitScore <= thresholds.moderateHigh ? 1 : 0;
            } else if (traitThreshold === "lowOrHigh") {
                return traitScore <= thresholds.low || traitScore >= thresholds.high ? 3 : 1;
            } else if (traitThreshold === "moderateToHigh") {
                return traitScore >= thresholds.moderateLow ? 2 : 1;
            } else if (traitThreshold === "lowToModerate") {
                return traitScore <= thresholds.moderateHigh ? 2 : 1;
            }
            return 0;
        }

        // Calculate the match score for each archetype
        const archetypeScores = archetypes.map((archetype) => {
            const thresholds = archetype.thresholds;

            const score =
                getTraitMatchScore(Openness, thresholds.Openness) +
                getTraitMatchScore(Conscientiousness, thresholds.Conscientiousness) +
                getTraitMatchScore(Extraversion, thresholds.Extraversion) +
                getTraitMatchScore(Agreeableness, thresholds.Agreeableness) +
                getTraitMatchScore(Neuroticism, thresholds.Neuroticism);

            return { name: archetype.name, score, url: archetype.url };
        });

        // Sort the archetypes by score in descending order
        const sortedArchetypes = archetypeScores.sort((a, b) => b.score - a.score);

        // Find the top archetype
        const topArchetype = sortedArchetypes[0];

        // Redirect to the corresponding URL for the top archetype
        if (topArchetype && topArchetype.url) {
            window.location.href = topArchetype.url;
        }

        return sortedArchetypes;
    }

    return {
        answers,
        handleAnswer,
        calculateResults,
    };
}
