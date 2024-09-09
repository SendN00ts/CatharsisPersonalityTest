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

const calculateResults = () => {
    const { Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism } = traits;

    console.log("Traits:", traits); // Log traits for debugging

    // 1. Labyrinth: High Openness, Low Conscientiousness, Either Extraversion, High Agreeableness, High Neuroticism
    if (Openness > 10 && Conscientiousness < 0 && Agreeableness > 10 && Neuroticism > 10) {
        return { primary: "Labyrinth", secondary: "Papyros" };
    }

    // 2. Shield: Low Openness, High Conscientiousness, Low Extraversion, Moderate to High Agreeableness, Low Neuroticism
    if (Openness < 0 && Conscientiousness > 10 && Extraversion < 0 && Agreeableness > 5 && Neuroticism < 0) {
        return { primary: "Shield", secondary: "Helm" };
    }

    // 3. Kyvernitis: High Extraversion, High Conscientiousness, Moderate Openness, Moderate Agreeableness, Moderate Neuroticism
    if (Extraversion > 10 && Conscientiousness > 10 && Openness > 5 && Agreeableness > 5 && Neuroticism >= 0) {
        return { primary: "Kyvernitis", secondary: "Lyre" };
    }

    // 4. Olive Branch: Moderate Openness, High Conscientiousness, High Extraversion, High Agreeableness, Low Neuroticism
    if (Openness > 5 && Conscientiousness > 10 && Extraversion > 10 && Agreeableness > 10 && Neuroticism < 0) {
        return { primary: "Olive Branch", secondary: "Helm" };
    }

    // 5. Papyros: High Openness, Low Conscientiousness, Low Extraversion, Low to Moderate Agreeableness, Moderate to High Neuroticism
    if (Openness > 10 && Conscientiousness < 0 && Extraversion < 0 && Agreeableness < 5 && Neuroticism > 5) {
        return { primary: "Papyros", secondary: "Labyrinth" };
    }

    // 6. Lyre: Moderate Openness, Moderate Conscientiousness, High Extraversion, High Agreeableness, Low Neuroticism
    if (Openness > 5 && Conscientiousness > 5 && Extraversion > 10 && Agreeableness > 10 && Neuroticism < 0) {
        return { primary: "Lyre", secondary: "Kyvernitis" };
    }

    // 7. Estia: Low Openness, Moderate Conscientiousness, Low Extraversion, High Agreeableness, Low Neuroticism
    if (Openness < 0 && Conscientiousness > 5 && Extraversion < 0 && Agreeableness > 10 && Neuroticism < 0) {
        return { primary: "Estia", secondary: "Papyros" };
    }

    // 8. Dory: Low Openness, Moderate to High Conscientiousness, High Extraversion, Low Agreeableness, Low to Moderate Neuroticism
    if (Openness < 0 && Conscientiousness > 5 && Extraversion > 10 && Agreeableness < 0 && Neuroticism < 5) {
        return { primary: "Dory", secondary: "Helm" };
    }

    // If no result is matched (should not happen based on trait combinations)
    throw new Error("No valid archetype match found based on the traits.");
};

    return {
        answers,
        handleAnswer,
        calculateResults,
    };
}
