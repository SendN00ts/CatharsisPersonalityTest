import { useState, useEffect, useRef } from "react";

export function usePersonalityTest() {
    const [questionsData, setQuestionsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [error, setError] = useState(null);
    const questionRefs = useRef([]);
    const nextButtonRef = useRef(null);

    useEffect(() => {
        fetch("https://sendn00ts.github.io/CatharsisPersonalityTest/PersonalityTestQuestions.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setQuestionsData(data);
                setAnswers(Array(data.length).fill(null)); // Initialize answers array
            })
            .catch((error) => {
                console.error("Error fetching questions data:", error);
                setError("Failed to load questions. Please try again later.");
            });
    }, []);

    useEffect(() => {
        questionRefs.current = Array(questionsData.length)
            .fill(undefined)
            .map((_, i) => questionRefs.current[i] || React.createRef());
    }, [questionsData.length]);

    const handleAnswer = (questionIndex, value) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = value;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const questionsPerPage = 6;
    const totalPages = Math.ceil(questionsData.length / questionsPerPage);

    const allAnswered = answers
        .slice(
            currentPage * questionsPerPage,
            (currentPage + 1) * questionsPerPage
        )
        .every((answer) => answer !== null);

    const startIndex = currentPage * questionsPerPage;
    const endIndex = Math.min(
        startIndex + questionsPerPage,
        questionsData.length
    );

    const traitWeights = [
        { questionIndex: 0, traits: { O: 1 } },  // Q1: Openness
        { questionIndex: 1, traits: { O: 1 } },  // Q2: Openness
        { questionIndex: 2, traits: { O: 1 } },  // Q3: Openness
        { questionIndex: 3, traits: { O: 1 } },  // Q4: Openness
        { questionIndex: 4, traits: { O: 1 } },  // Q5: Openness
        { questionIndex: 5, traits: { O: 0.5, C: -0.5 } },  // Q6: Openness, Conscientiousness (negative)
        { questionIndex: 6, traits: { O: 1 } },  // Q7: Openness
        { questionIndex: 7, traits: { O: 1 } },  // Q8: Openness
        { questionIndex: 8, traits: { O: 1, E: 0.5 } },  // Q9: Openness, Extraversion
        { questionIndex: 9, traits: { O: 1 } },  // Q10: Openness
        { questionIndex: 10, traits: { C: 1 } },  // Q11: Conscientiousness
        { questionIndex: 11, traits: { C: 1 } },  // Q12: Conscientiousness
        { questionIndex: 12, traits: { C: 1 } },  // Q13: Conscientiousness
        { questionIndex: 13, traits: { C: 1 } },  // Q14: Conscientiousness
        { questionIndex: 14, traits: { C: 1 } },  // Q15: Conscientiousness
        { questionIndex: 15, traits: { C: 1 } },  // Q16: Conscientiousness
        { questionIndex: 16, traits: { C: 1 } },  // Q17: Conscientiousness
        { questionIndex: 17, traits: { C: 1 } },  // Q18: Conscientiousness
        { questionIndex: 18, traits: { C: 1 } },  // Q19: Conscientiousness
        { questionIndex: 19, traits: { C: 1 } },  // Q20: Conscientiousness
        { questionIndex: 20, traits: { E: 1 } },  // Q21: Extraversion
        { questionIndex: 21, traits: { E: 1 } },  // Q22: Extraversion
        { questionIndex: 22, traits: { E: 1 } },  // Q23: Extraversion
        { questionIndex: 23, traits: { E: 1 } },  // Q24: Extraversion
        { questionIndex: 24, traits: { E: 1 } },  // Q25: Extraversion
        { questionIndex: 25, traits: { E: 1 } },  // Q26: Extraversion
        { questionIndex: 26, traits: { E: 1 } },  // Q27: Extraversion
        { questionIndex: 27, traits: { E: 1 } },  // Q28: Extraversion
        { questionIndex: 28, traits: { E: 1 } },  // Q29: Extraversion
        { questionIndex: 29, traits: { E: 1 } },  // Q30: Extraversion
        { questionIndex: 30, traits: { A: 1 } },  // Q31: Agreeableness
        { questionIndex: 31, traits: { A: 1 } },  // Q32: Agreeableness
        { questionIndex: 32, traits: { A: 1 } },  // Q33: Agreeableness
        { questionIndex: 33, traits: { A: 1 } },  // Q34: Agreeableness
        { questionIndex: 34, traits: { A: 1 } },  // Q35: Agreeableness
        { questionIndex: 35, traits: { A: 1 } },  // Q36: Agreeableness
        { questionIndex: 36, traits: { A: 1 } },  // Q37: Agreeableness
        { questionIndex: 37, traits: { A: 1 } },  // Q38: Agreeableness
        { questionIndex: 38, traits: { A: 1 } },  // Q39: Agreeableness
        { questionIndex: 39, traits: { A: 1 } },  // Q40: Agreeableness
        { questionIndex: 40, traits: { N: 1 } },  // Q41: Neuroticism
        { questionIndex: 41, traits: { N: 1 } },  // Q42: Neuroticism
        { questionIndex: 42, traits: { N: 1 } },  // Q43: Neuroticism
        { questionIndex: 43, traits: { N: 1 } },  // Q44: Neuroticism
        { questionIndex: 44, traits: { N: 1 } },  // Q45: Neuroticism
        { questionIndex: 45, traits: { N: 1 } },  // Q46: Neuroticism
        { questionIndex: 46, traits: { N: 1 } },  // Q47: Neuroticism
        { questionIndex: 47, traits: { N: 1 } },  // Q48: Neuroticism
        { questionIndex: 48, traits: { N: 1 } },  // Q49: Neuroticism
        { questionIndex: 49, traits: { N: 1 } },  // Q50: Neuroticism
    ];

    const calculateScores = () => {
        const scores = { O: 0, C: 0, E: 0, A: 0, N: 0 };

        answers.forEach((answer, index) => {
            if (answer !== null) {
                const weight = traitWeights.find(w => w.questionIndex === index);
                if (weight) {
                    for (const trait in weight.traits) {
                        scores[trait] += answer * weight.traits[trait];
                    }
                }
            }
        });

        return scores;
    };

    const determineArchetypes = (scores) => {
        const traitsOrder = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);

        const primaryTrait = traitsOrder[0];
        const secondaryTrait = traitsOrder[1];

        const archetypes = {
            O: "Labyrinth",
            C: "Shield",
            E: "Helm",
            A: "Olive Branch",
            N: "Lyre",
        };

        return {
            primary: archetypes[primaryTrait],
            secondary: archetypes[secondaryTrait],
        };
    };

    const calculateResults = () => {
        const scores = calculateScores();
        return determineArchetypes(scores);
    };

    return {
        questionsData,
        currentPage,
        handleAnswer,
        handleNext,
        allAnswered,
        startIndex,
        endIndex,
        questionRefs,
        nextButtonRef,
        totalPages,
        error,
        calculateResults,
        answers, // Ensure answers is returned here
    };
}
