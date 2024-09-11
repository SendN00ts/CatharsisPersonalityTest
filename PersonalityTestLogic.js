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

    // Handle answer input and update traits
    const handleAnswer = (questionIndex, value) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = value;
        setAnswers(newAnswers);

        updateTraits(questionIndex, value); // Update trait scores
    };

    const updateTraits = (questionIndex, value) => {
    console.log("Question Index:", questionIndex, "Value:", value); // Log for debugging
    const updatedTraits = { ...traits };

    // Check if value is valid
    if (value !== null && value >= 1 && value <= 5) {
        // Trait calculation logic, assuming value is from a Likert scale (1-5)
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
    } else {
        console.error("Invalid value passed to updateTraits:", value);
    }

    console.log("Updated Traits:", updatedTraits); // Log updated traits for debugging
    setTraits(updatedTraits);
};


    // Function to calculate percentages for each archetype
    function calculateResults() {
        const { Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism } = traits;

        // Log trait values for debugging
        console.log("Trait values:", { Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism });

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
            // Continue adding other archetypes...
        ];

        // Helper to calculate match score based on threshold logic
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

        // Calculate match scores for each archetype
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

        console.log("Archetype Scores:", archetypeScores); // Log scores for debugging

        // Get the total score sum for percentage calculation
        const totalScore = archetypeScores.reduce((total, archetype) => total + archetype.score, 0);

        // Calculate the percentage for each archetype
        const archetypePercentages = archetypeScores.map((archetype) => ({
            name: archetype.name,
            percentage: ((archetype.score / totalScore) * 100).toFixed(2) + '%'
        }));

        console.log("Archetype Percentages:", archetypePercentages);

        const bestMatch = archetypeScores.reduce((best, current) => {
            return current.score > best.score ? current : best;
        }, { name: null, score: 0 });

        console.log("Best Match:", bestMatch); // Log the best match

        // Error if no archetype found
        if (!bestMatch.name) {
            console.error("No archetype found for the calculated results.");
        }

        return {
            primary: bestMatch.name,
            percentages: archetypePercentages, // Return all archetype percentages
        };
    }

    return {
        answers,
        handleAnswer,
        calculateResults,
    };
}
