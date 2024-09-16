import { useState } from 'react';

export function usePersonalityTest() {
    const [answers, setAnswers] = useState(Array(50).fill(null));
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

        const previousAnswer = answers[questionIndex];
        const newAnswers = [...answers];
        newAnswers[questionIndex] = newValue;
        setAnswers(newAnswers);

        updateTraits(questionIndex, newValue, previousAnswer);
    };

    const updateTraits = (questionIndex, newValue, previousValue) => {
        console.log(`Before updating traits for question ${questionIndex + 1}:`, traits);

        const updatedTraits = { ...traits };

        // Updated normalization function
        const normalizeValue = (value) => value - 4; // Centralize value around 0 (1 maps to -3, 7 maps to +3)

        const normalizedNewValue = normalizeValue(newValue);
        const normalizedPreviousValue = previousValue !== null ? normalizeValue(previousValue) : 0;

        if (questionIndex >= 0 && questionIndex <= 9) {
            updatedTraits.Openness += normalizedNewValue - normalizedPreviousValue;
        } else if (questionIndex >= 10 && questionIndex <= 19) {
            updatedTraits.Conscientiousness += normalizedNewValue - normalizedPreviousValue;
        } else if (questionIndex >= 20 && questionIndex <= 29) {
            updatedTraits.Extraversion += normalizedNewValue - normalizedPreviousValue;
        } else if (questionIndex >= 30 && questionIndex <= 39) {
            updatedTraits.Agreeableness += normalizedNewValue - normalizedPreviousValue;
        } else if (questionIndex >= 40 && questionIndex <= 49) {
            updatedTraits.Neuroticism += normalizedNewValue - normalizedPreviousValue;
        }

        setTraits(updatedTraits);
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
            // ... (other archetypes remain the same)
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
