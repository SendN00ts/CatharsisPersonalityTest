import { useState, useEffect, useRef } from "react";

export function usePersonalityTest() {
    const [questionsData, setQuestionsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(() => {
        // Load current page from localStorage, default to 0
        const savedPage = localStorage.getItem("currentPage");
        return savedPage !== null ? JSON.parse(savedPage) : 0;
    });
    const [answers, setAnswers] = useState(() => {
        // Load answers from localStorage, default to an empty array
        const savedAnswers = localStorage.getItem("answers");
        return savedAnswers !== null ? JSON.parse(savedAnswers) : [];
    });
    const [error, setError] = useState(null); // Error state
    const questionRefs = useRef([]);
    const nextButtonRef = useRef(null);

    useEffect(() => {
        // Fetch the JSON data
        fetch("https://sendn00ts.github.io/CatharsisPersonalityTest/PersonalityTestQuestions.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setQuestionsData(data);
                // Initialize answers array if it's empty
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
        // Initialize refs array with React refs
        questionRefs.current = Array(questionsData.length)
            .fill(undefined)
            .map((_, i) => questionRefs.current[i] || React.createRef());
    }, [questionsData.length]);

    useEffect(() => {
        // Persist current page and answers to localStorage
        localStorage.setItem("currentPage", JSON.stringify(currentPage));
        localStorage.setItem("answers", JSON.stringify(answers));
    }, [currentPage, answers]);

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

    const questionsPerPage = 6; // Number of questions per page
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

    // Calculate progress dynamically based on answered questions
    const answeredCount = answers.filter((answer) => answer !== null).length;
    const progress = Math.round((answeredCount / questionsData.length) * 100);

    return {
        questionsData,
        currentPage,
        handleAnswer,
        handleNext,
        allAnswered,
        progress,
        startIndex,
        endIndex,
        questionRefs,
        nextButtonRef,
        totalPages,
        error // Include error state in return value
    };
}
