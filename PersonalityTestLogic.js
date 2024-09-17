function calculateResults() {
    const { Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism } = traits;

    // Get the number of questions per trait
    const totalQuestionsPerTrait = 10; // Example for 10 questions per trait
    const maxScorePerTrait = totalQuestionsPerTrait * 3; // Maximum score is N * 3
    const minScorePerTrait = totalQuestionsPerTrait * -3; // Minimum score is N * -3

    // Midpoint (neutral) is the center of the range
    const neutralScore = 0;

    // Define thresholds based on the range of possible values centered around 0
    const getThresholds = (minScore, maxScore) => ({
        low: minScore + (maxScore - minScore) * 0.25,   // 25% below the midpoint
        high: minScore + (maxScore - minScore) * 0.75,  // 75% above the midpoint
        moderateLow: minScore + (maxScore - minScore) * 0.25,
        moderateHigh: minScore + (maxScore - minScore) * 0.75
    });

    const thresholds = getThresholds(minScorePerTrait, maxScorePerTrait);

    console.log("Thresholds: ", thresholds);

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
            return traitScore >= thresholds.high ? 1 : 0;  // "High" is above 75% of the range
        } else if (traitThreshold === "moderate") {
            return traitScore >= thresholds.moderateLow && traitScore <= thresholds.moderateHigh ? 1 : 0;  // "Moderate" includes neutral range
        } else if (traitThreshold === "low") {
            return traitScore <= thresholds.low ? 1 : 0;  // "Low" is below 25% of the range
        } else if (traitThreshold === "lowOrHigh") {
            return traitScore <= thresholds.low || traitScore >= thresholds.high ? 1 : 0;
        } else if (traitThreshold === "moderateToHigh") {
            return traitScore >= thresholds.moderateLow ? 1 : 0;
        } else if (traitThreshold === "lowToModerate") {
            return traitScore <= thresholds.moderateHigh ? 1 : 0;
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

    // Debugging: log each archetype's score for better understanding
    archetypes.forEach((archetype, index) => {
        console.log(`Archetype: ${archetype.name}, Score: ${archetypeScores[index].score}`);
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
