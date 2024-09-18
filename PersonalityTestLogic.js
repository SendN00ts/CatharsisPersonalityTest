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

        // Get the number of questions per trait
        const totalQuestionsPerTrait = 10;
        const maxScorePerTrait = totalQuestionsPerTrait * 3; // Maximum score is N * 3
        const minScorePerTrait = totalQuestionsPerTrait * -3; // Minimum score is N * -3

        // Define thresholds based on the range of possible values centered around 0
        const getThresholds = (minScore, maxScore) => ({
            low: minScore + (maxScore - minScore) * 0.25,   // 25% below the midpoint
            high: minScore + (maxScore - minScore) * 0.75,  // 75% above the midpoint
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
                return traitScore >= thresholds.high ? 1 : 0;
            } else if (traitThreshold === "moderate") {
                return traitScore >= thresholds.moderateLow && traitScore <= thresholds.moderateHigh ? 1 : 0;
            } else if (traitThreshold === "low") {
                return traitScore <= thresholds.low ? 1 : 0;
            } else if (traitThreshold === "lowOrHigh") {
                return traitScore <= thresholds.low || traitScore >= thresholds.high ? 1 : 0;
            } else if (traitThreshold === "moderateToHigh") {
                return traitScore >= thresholds.moderateLow ? 1 : 0;
            } else if (traitThreshold === "lowToModerate") {
                return traitScore <= thresholds.moderateHigh ? 1 : 0;
            }
            return 0;
        }

        // Calculate match score for each archetype
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

        // Sort archetypes by score
        const sortedArchetypes = archetypeScores.sort((a, b) => b.score - a.score);

        // Calculate total score to normalize percentages
        const totalScore = sortedArchetypes.reduce((sum, archetype) => sum + archetype.score, 0);

        // If total score is 0, return 0% for all archetypes
        if (totalScore === 0) {
            return archetypes.map((archetype) => ({ name: archetype.name, percentage: 0 }));
        }

        // Scale percentages based on score
        const finalPercentages = sortedArchetypes.map((archetype) => ({
            name: archetype.name,
            percentage: Math.round((archetype.score / totalScore) * 100),
        }));

        // Ensure the percentages sum to exactly 100%
        const totalPercentage = finalPercentages.reduce((sum, archetype) => sum + archetype.percentage, 0);
        const difference = 100 - totalPercentage;

        if (difference !== 0) {
            finalPercentages[0].percentage += difference; // Adjust for rounding differences
        }

        // Log the percentage correlation for each archetype
        console.log("Archetype Correlations:", finalPercentages);

        return finalPercentages;
    }

    return {
        answers,
        handleAnswer,
        calculateResults,
    };
}
