function calculateResults() {
    const { Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism } = traits;

    // Define total questions per trait
    const totalQuestionsPerTrait = 10;
    const maxScorePerTrait = totalQuestionsPerTrait * 3; // Max score for each trait (10 questions, range -3 to +3)
    const minScorePerTrait = totalQuestionsPerTrait * -3; // Min score for each trait

    // Define thresholds for matching
    const getThresholds = (minScore, maxScore) => ({
        low: minScore + (maxScore - minScore) * 0.25,
        high: minScore + (maxScore - minScore) * 0.75,
        moderateLow: minScore + (maxScore - minScore) * 0.25,
        moderateHigh: minScore + (maxScore - minScore) * 0.75,
    });

    const thresholds = getThresholds(minScorePerTrait, maxScorePerTrait);

    // Define all archetypes with their trait thresholds and result URLs
    const archetypes = [
        {
            name: "Labyrinthos",
            thresholds: {
                Openness: "high",
                Conscientiousness: "low",
                Extraversion: "lowOrHigh",
                Agreeableness: "high",
                Neuroticism: "high",
            },
            url: "https://tiny-slides-700893.framer.app/resultlabyrinthos",
        },
        {
            name: "Aspida",
            thresholds: {
                Openness: "low",
                Conscientiousness: "high",
                Extraversion: "low",
                Agreeableness: "moderateToHigh",
                Neuroticism: "low",
            },
            url: "https://tiny-slides-700893.framer.app/resultaspida",
        },
        {
            name: "Kyvernitis",
            thresholds: {
                Openness: "high",
                Conscientiousness: "high",
                Extraversion: "high",
                Agreeableness: "moderate",
                Neuroticism: "low",
            },
            url: "https://tiny-slides-700893.framer.app/resultkyvernitis",
        },
        {
            name: "Klados Elaias",
            thresholds: {
                Openness: "moderate",
                Conscientiousness: "high",
                Extraversion: "high",
                Agreeableness: "high",
                Neuroticism: "low",
            },
            url: "https://tiny-slides-700893.framer.app/resultkladoselaias",
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
            url: "https://tiny-slides-700893.framer.app/resultpapyros",
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
            url: "https://tiny-slides-700893.framer.app/resultlyra",
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
            url: "https://tiny-slides-700893.framer.app/resultdory",
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
            url: "https://tiny-slides-700893.framer.app/resultestia",
        },
    ];

    // Adjusted trait matching logic with additional weighting
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

    // Calculate the match score for each archetype
    const archetypeScores = archetypes.map((archetype) => {
        const thresholds = archetype.thresholds;

        const score =
            getTraitMatchScore(Openness, thresholds.Openness) +
            getTraitMatchScore(Conscientiousness, thresholds.Conscientiousness) +
            getTraitMatchScore(Extraversion, thresholds.Extraversion) +
            getTraitMatchScore(Agreeableness, thresholds.Agreeableness) +
            getTraitMatchScore(Neuroticism, thresholds.Neuroticism);

        return { name: archetype.name, score, url: archetype.url };
    });

    // Find max possible score (if perfect match across all traits)
    const maxPossibleScore = 5 * 3; // 5 traits, each can score up to 3

    // Sort the archetypes by score in descending order
    const sortedArchetypes = archetypeScores.sort((a, b) => b.score - a.score);

    // Normalize the scores into percentages
    const archetypePercentages = sortedArchetypes.map((archetype) => ({
        name: archetype.name,
        percentage: Math.round((archetype.score / maxPossibleScore) * 100),
        url: archetype.url,
    }));

    console.log("Archetype Percentages:", archetypePercentages);

    // Return sorted archetypes with percentages
    return archetypePercentages;
}
