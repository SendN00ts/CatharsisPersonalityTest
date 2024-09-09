import { useState, useEffect } from 'react'; // Make sure React hooks are imported

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

        // Add logic to update traits based on the question and value
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

    // Define the trait thresholds for each archetype
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
            isTraitMatch(openness, thresholds.openness) &&
            isTraitMatch(conscientiousness, thresholds.conscientiousness) &&
            isTraitMatch(extraversion, thresholds.extraversion) &&
            isTraitMatch(agreeableness, thresholds.agreeableness) &&
            isTraitMatch(neuroticism, thresholds.neuroticism)
        ) {
            return { primary: archetype.name }; // Return the matched archetype
        }
    }

    return null; // No archetype matched, return null or handle as needed
}


    return {
        answers,
        handleAnswer,
        calculateResults,
    };
}
