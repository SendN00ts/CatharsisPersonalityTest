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

        const previousAnswer = answers[questionIndex]; 
        const newAnswers = [...answers];
        newAnswers[questionIndex] = newValue;
        setAnswers(newAnswers); 
        updateTraits(questionIndex, newValue, previousAnswer);
    };

    const updateTraits = (questionIndex, newValue, previousValue) => {
        const updatedTraits = { ...traits };
        const normalizedPreviousValue = previousValue !== null ? previousValue : 0;

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

        setTraits(updatedTraits);
        console.log(`Updated Traits:`, updatedTraits);
    };

    function calculateResults() {
        const { Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism } = traits;

        const archetypes = [
            { name: "Labyrinthos", thresholds: { Openness: "high", Conscientiousness: "low", Extraversion: "lowOrHigh", Agreeableness: "high", Neuroticism: "high" } },
            { name: "Aspida", thresholds: { Openness: "low", Conscientiousness: "high", Extraversion: "low", Agreeableness: "moderateToHigh", Neuroticism: "low" } },
            { name: "Kyvernitis", thresholds: { Openness: "high", Conscientiousness: "high", Extraversion: "high", Agreeableness: "moderate", Neuroticism: "low" } },
            { name: "Klados Elaias", thresholds: { Openness: "moderate", Conscientiousness: "high", Extraversion: "high", Agreeableness: "high", Neuroticism: "low" } },
            { name: "Papyros", thresholds: { Openness: "high", Conscientiousness: "low", Extraversion: "low", Agreeableness: "lowToModerate", Neuroticism: "moderateToHigh" } },
            { name: "Lyra", thresholds: { Openness: "moderate", Conscientiousness: "moderate", Extraversion: "high", Agreeableness: "high", Neuroticism: "low" } },
            { name: "Dory", thresholds: { Openness: "low", Conscientiousness: "moderateToHigh", Extraversion: "high", Agreeableness: "low", Neuroticism: "lowToModerate" } },
            { name: "Estia", thresholds: { Openness: "low", Conscientiousness: "low", Extraversion: "low", Agreeableness: "moderateToHigh", Neuroticism: "low" } },
        ];

        function getTraitMatchScore(traitScore, traitThreshold) {
            if (traitThreshold === "high") {
                return traitScore >= 7.5 ? 3 : traitScore >= 5 ? 2 : 1;
            } else if (traitThreshold === "low") {
                return traitScore <= 2.5 ? 3 : traitScore <= 5 ? 2 : 1;
            } else if (traitThreshold === "lowOrHigh") {
                return traitScore <= 2.5 || traitScore >= 7.5 ? 3 : 1;
            } else if (traitThreshold === "moderate") {
                return traitScore > 2.5 && traitScore < 7.5 ? 2 : 1;
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

            console.log(`${archetype.name} Score: `, score);

            return { name: archetype.name, score };
        });

        // Scale up percentages
        const maxScore = Math.max(...archetypeScores.map(a => a.score));
        const minScore = Math.min(...archetypeScores.map(a => a.score));

        const archetypePercentages = archetypeScores.map((archetype) => {
            const scaledPercentage = ((archetype.score - minScore) / (maxScore - minScore)) * 50 + 50;
            return { ...archetype, percentage: Math.round(scaledPercentage) };
        });

        const sortedArchetypes = archetypePercentages.sort((a, b) => b.percentage - a.percentage);

        console.log("Final Archetype Percentages: ", sortedArchetypes);

        return sortedArchetypes;
    }

    return {
        answers,
        handleAnswer,
        calculateResults,
    };
}
