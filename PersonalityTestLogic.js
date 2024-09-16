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

    const handleAnswer = (questionIndex, newValue) => {
        console.log(`Question Index: ${questionIndex + 1} - "New Value:"`, newValue);

        // Ensure the value is within the acceptable range (1 to 7)
        if (newValue < 1 || newValue > 7) {
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

        // Adjust the mapping to follow the correct scaling of values (-3 to +3)
        const normalizeValue = (value) => value - 4; // Centralize value around 0 (1 maps to -3, 7 maps to +3)

        const normalizedNewValue = normalizeValue(newValue);
        const normalizedPreviousValue = previousValue !== null ? normalizeValue(previousValue) : 0; // Normalize previous value if it exists

        // Subtract the effect of the previous answer and add the new answer
        if (questionIndex >= 0 && questionIndex <= 9) {
            // Openness
            updatedTraits.Openness += normalizedNewValue - normalizedPreviousValue;
        } else if (questionIndex >= 10 && questionIndex <= 19) {
            // Conscientiousness
            updatedTraits.Conscientiousness += normalizedNewValue - normalizedPreviousValue;
        } else if (questionIndex >= 20 && questionIndex <= 29) {
            // Extraversion
            updatedTraits.Extraversion += normalizedNewValue - normalizedPreviousValue;
        } else if (questionIndex >= 30 && questionIndex <= 39) {
            // Agreeableness
            updatedTraits.Agreeableness += normalizedNewValue - normalizedPreviousValue;
        } else if (questionIndex >= 40 && questionIndex <= 49) {
            // Neuroticism
            updatedTraits.Neuroticism += normalizedNewValue - normalizedPreviousValue;
        }

        setTraits(updatedTraits); // Save the updated traits
        console.log(`After updating traits for question ${questionIndex + 1}:`, updatedTraits);
    };

    function calculateResults() {
        const { Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism } = traits;

        console.log("Final Trait values after all answers:", { Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism });

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
                return traitScore >= 5 ? 1 : 0;
            } else if (traitThreshold === "moderate") {
                return traitScore >= 3 && traitScore <= 4 ? 1 : 0;
            } else if (traitThreshold === "low") {
                return traitScore <= 2 ? 1 : 0;
            } else if (traitThreshold === "lowOrHigh") {
                return traitScore <= 2 || traitScore >= 5 ? 1 : 0;
            } else if (traitThreshold === "moderateToHigh") {
                return traitScore >= 3 ? 1 : 0;
            } else if (traitThreshold === "lowToModerate") {
                return traitScore <= 3 ? 1 : 0;
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

        console.log("Archetype Scores calculated:", archetypeScores);

        const bestMatch = archetypeScores.reduce((best, current) => {
            return current.score > best.score ? current : best;
        }, { name: null, score: 0 });

        console.log("Best match archetype:", bestMatch);

        return {
            primary: bestMatch.name,
            scores: archetypeScores,
        };
    }

    return {
        answers,
        handleAnswer,
        calculateResults,
    };
}
