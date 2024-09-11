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
        // Log the value being passed for debugging
        console.log(`Question Index: ${questionIndex + 1} - "Value:"`, value);

        // Ensure the value is within the acceptable range (e.g., 1 to 7)
        if (value < 1 || value > 7) {
            console.error(`Invalid value received for question ${questionIndex + 1}:`, value);
            return;
        }

        const newAnswers = [...answers];
        newAnswers[questionIndex] = value;
        setAnswers(newAnswers);

        updateTraits(questionIndex, value);
        console.log(`Updated answers after question ${questionIndex + 1}:`, newAnswers);
    };

    const updateTraits = (questionIndex, value) => {
        console.log(`Before updating traits for question ${questionIndex + 1}:`, traits);

        const updatedTraits = { ...traits };

        // Since the scale is 1-7, we will normalize the values around 4.
        if (value !== null && value >= 1 && value <= 7) {
            const normalizedValue = value - 4; // Centralize the scale around 0 (e.g., 1 becomes -3, 7 becomes +3)
            
            if (questionIndex >= 0 && questionIndex <= 9) {
                updatedTraits.Openness += normalizedValue;
            } else if (questionIndex >= 10 && questionIndex <= 19) {
                updatedTraits.Conscientiousness += normalizedValue;
            } else if (questionIndex >= 20 && questionIndex <= 29) {
                updatedTraits.Extraversion += normalizedValue;
            } else if (questionIndex >= 30 && questionIndex <= 39) {
                updatedTraits.Agreeableness += normalizedValue;
            } else if (questionIndex >= 40 && questionIndex <= 49) {
                updatedTraits.Neuroticism += normalizedValue;
            }
        } else {
            console.error(`Invalid value passed to updateTraits for question ${questionIndex + 1}:`, value);
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
