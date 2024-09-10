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
        const newAnswers = [...answers];
        newAnswers[questionIndex] = value;
        setAnswers(newAnswers);

        updateTraits(questionIndex, value);
    };

    const updateTraits = (questionIndex, value) => {
        const updatedTraits = { ...traits };

        // Trait calculation logic, adjust ranges as per the new design
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

    function calculateResults(traits) {
    const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = traits;

    const archetypes = [
        {
            name: "Labyrinth",
            thresholds: {
                openness: "high",
                conscientiousness: "low",
                extraversion: "lowOrHigh",
                agreeableness: "high",
                neuroticism: "high",
            },
        },
        {
            name: "Shield",
            thresholds: {
                openness: "low",
                conscientiousness: "high",
                extraversion: "low",
                agreeableness: "moderateToHigh",
                neuroticism: "low",
            },
        },
        {
            name: "Helm",
            thresholds: {
                openness: "high",
                conscientiousness: "high",
                extraversion: "high",
                agreeableness: "moderate",
                neuroticism: "low",
            },
        },
        {
            name: "Olive Branch",
            thresholds: {
                openness: "moderate",
                conscientiousness: "high",
                extraversion: "high",
                agreeableness: "high",
                neuroticism: "low",
            },
        },
        {
            name: "Papyros",
            thresholds: {
                openness: "high",
                conscientiousness: "low",
                extraversion: "low",
                agreeableness: "lowToModerate",
                neuroticism: "moderateToHigh",
            },
        },
        {
            name: "Lyra",
            thresholds: {
                openness: "moderate",
                conscientiousness: "moderate",
                extraversion: "high",
                agreeableness: "high",
                neuroticism: "low",
            },
        },
        {
            name: "Dory",
            thresholds: {
                openness: "low",
                conscientiousness: "moderateToHigh",
                extraversion: "high",
                agreeableness: "low",
                neuroticism: "lowToModerate",
            },
        },
        {
            name: "Estia",
            thresholds: {
                openness: "low",
                conscientiousness: "low",
                extraversion: "low",
                agreeableness: "moderateToHigh",
                neuroticism: "low",
            },
        },
    ];

    // Helper function to calculate how well a trait matches the archetype
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

    // Array to store the match score for each archetype
    const archetypeScores = archetypes.map(archetype => {
        const thresholds = archetype.thresholds;

        const score =
            getTraitMatchScore(openness, thresholds.openness) +
            getTraitMatchScore(conscientiousness, thresholds.conscientiousness) +
            getTraitMatchScore(extraversion, thresholds.extraversion) +
            getTraitMatchScore(agreeableness, thresholds.agreeableness) +
            getTraitMatchScore(neuroticism, thresholds.neuroticism);

        return { name: archetype.name, score };
    });

    // Find the archetype with the highest score
    const bestMatch = archetypeScores.reduce((best, current) => {
        return current.score > best.score ? current : best;
    }, { name: null, score: 0 });

    return { primary: bestMatch.name }; // Return the best match
}
        // Helper function to determine if the trait is in the correct range for the archetype
        function isTraitMatch(traitScore, traitThreshold) {
            if (traitThreshold === "high") {
                return traitScore >= 5;
            } else if (traitThreshold === "moderate") {
                return traitScore >= 3 && traitScore <= 4;
            } else if (traitThreshold === "low") {
                return traitScore <= 2;
            } else if (traitThreshold === "lowOrHigh") {
                return traitScore <= 2 || traitScore >= 5;
            } else if (traitThreshold === "moderateToHigh") {
                return traitScore >= 3;
            } else if (traitThreshold === "lowToModerate") {
                return traitScore <= 3;
            }
            return false;
        }

        // Loop through archetypes to find the best match
        for (const archetype of archetypes) {
            const thresholds = archetype.thresholds;

            if (
                isTraitMatch(Openness, thresholds.Openness) &&
                isTraitMatch(Conscientiousness, thresholds.Conscientiousness) &&
                isTraitMatch(Extraversion, thresholds.Extraversion) &&
                isTraitMatch(Agreeableness, thresholds.Agreeableness) &&
                isTraitMatch(Neuroticism, thresholds.Neuroticism)
            ) {
                return { primary: archetype.name }; // Return the matched archetype
            }
        }

        return null; // No archetype matched
    }

    return {
        answers,
        handleAnswer,
        calculateResults,
    };
}
