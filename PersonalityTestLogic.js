import { useState } from "react";

export function usePersonalityTest() {
    const [answers, setAnswers] = useState(Array(50).fill(null));
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

        // Mapping question ranges to traits
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

    const calculateResults = () => {
        const { Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism } = traits;

        // Define archetypes and their trait thresholds
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

        // Matching logic for archetypes
        const isTraitMatch = (traitScore, threshold) => {
            if (threshold === "high") return traitScore >= 5;
            if (threshold === "low") return traitScore <= 2;
            if (threshold === "moderate") return traitScore >= 3 && traitScore <= 4;
            if (threshold === "lowOrHigh") return traitScore <= 2 || traitScore >= 5;
            if (threshold === "moderateToHigh") return traitScore >= 3;
            if (threshold === "lowToModerate") return traitScore <= 3;
            return false;
        };

        for (const archetype of archetypes) {
            const thresholds = archetype.thresholds;
            if (
                isTraitMatch(Openness, thresholds.Openness) &&
                isTraitMatch(Conscientiousness, thresholds.Conscientiousness) &&
                isTraitMatch(Extraversion, thresholds.Extraversion) &&
                isTraitMatch(Agreeableness, thresholds.Agreeableness) &&
                isTraitMatch(Neuroticism, thresholds.Neuroticism)
            ) {
                return { primary: archetype.name };
            }
        }

        return null;
    };

    return {
        answers,
        handleAnswer,
        calculateResults,
    };
}
