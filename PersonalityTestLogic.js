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

        // Define total questions per trait
        const totalQuestionsPerTrait = 10;
        const maxScorePerTrait = totalQuestionsPerTrait * 3; // The highest possible score for each trait
        const minScorePerTrait = totalQuestionsPerTrait * -3; // The lowest possible score for each trait

        console.log("Max/Min scores per trait: ", { maxScorePerTrait, minScorePerTrait });

        const getThresholds = (minScore, maxScore) => ({
            low: minScore + (maxScore - minScore) * 0.25,
            high: minScore + (maxScore - minScore) * 0.75,
        });

        const thresholds = getThresholds(minScorePerTrait, maxScorePerTrait);
        console.log("Thresholds: ", thresholds);

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
                return traitScore >= thresholds.high ? 3 : traitScore >= thresholds.low ? 1 : 0;
            } else if (traitThreshold === "low") {
                return traitScore <= thresholds.low ? 3 : traitScore <= thresholds.high ? 1 : 0;
            } else if (traitThreshold === "lowOrHigh") {
                return traitScore <= thresholds.low || traitScore >= thresholds.high ? 3 : 1;
            } else if (traitThreshold === "moderate") {
                return traitScore > thresholds.low && traitScore < thresholds.high ? 2 : 0;
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

        // Define the maximum possible score for any single archetype
        const maxPossibleScore = 5 * 3; // 5 traits, each maxing at 3 points

        console.log("Max Possible Score:", maxPossibleScore);

        const archetypePercentages = archetypeScores.map((archetype) => {
            const percentage = Math.round((archetype.score / maxPossibleScore) * 100);
            return { ...archetype, percentage };
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
