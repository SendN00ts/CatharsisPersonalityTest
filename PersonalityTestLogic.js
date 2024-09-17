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
        const totalQuestionsPerTrait = 10; // Example for 10 questions per trait
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
                return traitScore >= thresholds.high ? 1 : 0;  // "High" is above 75% of the range
            } else if (traitThreshold === "moderate") {
                return traitScore >= thresholds.moderateLow && traitScore <= thresholds.moderateHigh ? 1 : 0;  // "Moderate" includes neutral range
            } else if (traitThreshold === "low") {
                return traitScore <= thresholds.low ? 1 : 0;  // "Low" is below 25% of the range
            } else if (traitThreshold === "lowOrHigh") {
                return traitScore <= thresholds.low || traitScore >= thresholds.high ? 1 : 0;
            } else if (traitThreshold === "moderateToHigh") {
                return traitScore >= thresholds.moderateLow ? 1 : 0;
            } else if (traitThreshold === "lowToModerate") {
                return traitScore <= thresholds.moderateHigh ? 1 : 0;
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

            return { name: archetype.name, score };
        });

        // Calculate the total score across all archetypes
        const totalScore = archetypeScores.reduce((total, archetype) => total + archetype.score, 0);

        // If total score is 0 (no match), return 0% for all archetypes
        if (totalScore === 0) {
            return archetypes.map((archetype) => ({ name: archetype.name, percentage: 0 }));
        }

        // Find the archetype with the highest score
        const topArchetype = archetypeScores.reduce((best, current) => {
            return current.score > best.score ? current : best;
        });

        // Scale the top archetype to have 50-60% correlation
        const topPercentage = 55; // Adjust this value as needed
        const remainingPercentage = 100 - topPercentage;

        // Calculate percentages for the remaining archetypes
        const remainingArchetypes = archetypeScores
            .filter((archetype) => archetype.name !== topArchetype.name)
            .map((archetype) => ({
                ...archetype,
                percentage: (archetype.score / (totalScore - topArchetype.score)) * remainingPercentage,
            }));

        // Ensure the sum of percentages is exactly 100%
        const finalPercentages = [
            { name: topArchetype.name, percentage: topPercentage },
            ...remainingArchetypes,
        ];

        // Round percentages and ensure they sum to exactly 100%
        let roundedPercentages = finalPercentages.map((a) => ({
            ...a,
            percentage: Math.round(a.percentage),
        }));

        // Adjust the top archetype's percentage if the sum is off by 1 due to rounding
        const totalRoundedPercentage = roundedPercentages.reduce(
            (sum, a) => sum + a.percentage,
            0
        );

        if (totalRoundedPercentage !== 100) {
            roundedPercentages = roundedPercentages.map((a) =>
                a.name === topArchetype.name
                    ? { ...a, percentage: a.percentage + (100 - totalRoundedPercentage) }
                    : a
            );
        }

        // Log the percentage correlation for each archetype
        console.log("Archetype Correlations:", roundedPercentages);

        return roundedPercentages;
    }

    return {
        answers,
        handleAnswer,
        calculateResults,
    };
}
