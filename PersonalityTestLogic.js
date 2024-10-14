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
        console.log(`Updated Traits:`, updatedTraits); // Log the updated traits after each answer
    };

    function calculateResults() {
        const { Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism } = traits;

        // Define total questions per trait
        const totalQuestionsPerTrait = 10;
        const maxScorePerTrait = totalQuestionsPerTrait * 3;
        const minScorePerTrait = totalQuestionsPerTrait * -3;

        console.log("Max/Min scores per trait: ", { maxScorePerTrait, minScorePerTrait }); // Log trait score ranges

        // Define thresholds for matching
        const getThresholds = (minScore, maxScore) => ({
            low: minScore + (maxScore - minScore) * 0.25,
            high: minScore + (maxScore - minScore) * 0.75,
            moderateLow: minScore + (maxScore - minScore) * 0.25,
            moderateHigh: minScore + (maxScore - minScore) * 0.75
        });

        const thresholds = getThresholds(minScorePerTrait, maxScorePerTrait);
        console.log("Thresholds: ", thresholds); // Log calculated thresholds

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
                return traitScore >= thresholds.high ? 3 : traitScore >= thresholds.moderateHigh ? 2 : traitScore >= thresholds.moderateLow ? 1 : 0;
            } else if (traitThreshold === "moderate") {
                return traitScore >= thresholds.moderateLow && traitScore <= thresholds.moderateHigh ? 2 : 1;
            } else if (traitThreshold === "low") {
                return traitScore <= thresholds.low ? 3 : traitScore <= thresholds.moderateLow ? 2 : traitScore <= thresholds.moderateHigh ? 1 : 0;
            } else if (traitThreshold === "lowOrHigh") {
                return traitScore <= thresholds.low || traitScore >= thresholds.high ? 3 : 1;
            } else if (traitThreshold === "moderateToHigh") {
                return traitScore >= thresholds.moderateLow ? 2 : 1;
            } else if (traitThreshold === "lowToModerate") {
                return traitScore <= thresholds.moderateHigh ? 2 : 1;
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

            console.log(`${archetype.name} Score: `, score); // Log each archetype score

            return { name: archetype.name, score };
        });

        const totalScores = archetypeScores.reduce((sum, archetype) => sum + archetype.score, 0);

        console.log("Total Scores: ", totalScores); // Log the total score across all archetypes

        const archetypePercentages = archetypeScores.map((archetype) => {
            const percentage = Math.round((archetype.score / totalScores) * 100);
            return { ...archetype, percentage };
        });

        const sortedArchetypes = archetypePercentages.sort((a, b) => b.percentage - a.percentage);

        console.log("Final Archetype Percentages: ", sortedArchetypes); // Log the final archetype percentages

        return sortedArchetypes;
    }

    return {
        answers,
        handleAnswer,
        calculateResults,
    };
}
