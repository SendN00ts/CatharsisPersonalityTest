export function usePersonalityTest() {
    const [answers, setAnswers] = useState(Array(50).fill(null)); // Assume 50 questions
    const [error, setError] = useState(null);
    
    // Traits state
    const [traits, setTraits] = useState({
        Openness: 0,
        Conscientiousness: 0,
        Extraversion: 0,
        Agreeableness: 0,
        Neuroticism: 0
    });

    const handleAnswer = (questionIndex, value) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = value;
        setAnswers(newAnswers);

        // Update the traits based on the questionIndex and the value (e.g. 0-6 for Likert scale)
        updateTraits(questionIndex, value);
    };

    const updateTraits = (questionIndex, value) => {
        let updatedTraits = { ...traits };

        // Define how each question affects which trait
        // For example, assume questions 0-9 influence Openness, 10-19 Conscientiousness, etc.
        if (questionIndex >= 0 && questionIndex <= 9) {
            updatedTraits.Openness += value - 3; // Neutral is 3
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

        // Determine primary archetype based on trait scores
        if (Openness > 10 && Conscientiousness < 0) {
            return { primary: "Labyrinth", secondary: "Papyros" };
        } else if (Conscientiousness > 10 && Openness < 0) {
            return { primary: "Shield", secondary: "Helm" };
        } else if (Extraversion > 10 && Conscientiousness > 10) {
            return { primary: "Helm", secondary: "Lyre" };
        } else if (Agreeableness > 10 && Conscientiousness > 10) {
            return { primary: "Olive Branch", secondary: "Lyre" };
        } else if (Openness > 10 && Extraversion < 0) {
            return { primary: "Papyros", secondary: "Labyrinth" };
        } else if (Extraversion > 10 && Neuroticism < 0) {
            return { primary: "Lyre", secondary: "Helm" };
        } else if (Neuroticism < 0 && Extraversion < 0) {
            return { primary: "Hearth", secondary: "Olive Branch" };
        } else if (Extraversion > 10 && Agreeableness < 0) {
            return { primary: "Spear", secondary: "Helm" };
        } else {
            setError("No clear result. Please try again.");
            return { primary: null, secondary: null };
        }
    };

    return {
        answers,
        handleAnswer,
        calculateResults,
        error,
    };
}
