import { useState, useEffect, useRef } from "react";

export function usePersonalityTest() {
    const [questionsData, setQuestionsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);  // Start from the first page every time
    const [answers, setAnswers] = useState([]);  // Start with no answers every time
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
                if (answers.length === 0) {
                    setAnswers(Array(data.length).fill(null));
                }
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

    // Removed localStorage effect
    // This ensures that the progress and answers are not saved

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
        { questionIndex: 0, traits: { O: 1 } },
        { questionIndex: 1, traits: { O: 1, C: 0.5 } },
        { questionIndex: 2, traits: { O: 1 } },
        { questionIndex: 3, traits: { O: 1 } },
        { questionIndex: 4, traits: { O: 1 } },
        { questionIndex: 5, traits: { C: 1 } },
        { questionIndex: 6, traits: { O: 1 } },
        { questionIndex: 7, traits: { O: 1, N: -1 } },
        { questionIndex: 8, traits: { O: 1, E: 0.5 } },
        { questionIndex: 9, traits: { O: 1 } },
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
            "O": "Labyrinth",
            "C": "Shield",
            "E": "Helm",
            "A": "Olive Branch",
            "N": "Lyre",
            // Add mappings for remaining archetypes
        };

        return {
            primary: archetypes[primaryTrait],
            secondary: archetypes[secondaryTrait]
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
    };
}
