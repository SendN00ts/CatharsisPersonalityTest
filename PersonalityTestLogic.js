import { useState, useEffect, useRef } from "react";

export function usePersonalityTest() {
    const [questionsData, setQuestionsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [answers, setAnswers] = useState([]);
    const questionRefs = useRef([]);
    const nextButtonRef = useRef(null);

    useEffect(() => {
        // Fetch the JSON data
        fetch("https://sendn00ts.github.io/CatharsisPersonalityTest/PersonalityTestQuestions.json")
            .then((response) => response.json())
            .then((data) => {
                setQuestionsData(data);
                setAnswers(Array(data.length).fill(null));
            })
            .catch((error) => console.error("Error fetching questions data:", error));
    }, []);

    useEffect(() => {
        // Initialize refs array with React refs
        questionRefs.current = Array(questionsData.length)
            .fill(undefined)
            .map((_, i) => questionRefs.current[i] || React.createRef());
    }, [questionsData.length]);

    const scrollToElement = (element, offset = 0) => {
        if (element) {
            const y =
                element.getBoundingClientRect().top +
                window.pageYOffset +
                offset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    useEffect(() => {
        const firstQuestionIndex = currentPage * questionsPerPage;
        const firstQuestionRef = questionRefs.current[firstQuestionIndex];
        if (firstQuestionRef?.current) {
            scrollToElement(firstQuestionRef.current, -100); // Adjust offset to keep progress bar in view
        }
    }, [currentPage]);

    const handleAnswer = (questionIndex, value) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = value;
        setAnswers(newAnswers);

        // Auto-scroll to the next question if it exists
        const nextQuestionIndex = questionIndex + 1;
        if (nextQuestionIndex < questionsData.length) {
            const nextQuestionRef = questionRefs.current[nextQuestionIndex];
            if (nextQuestionRef?.current) {
                setTimeout(() => {
                    scrollToElement(nextQuestionRef.current, -100); // Adjust offset to keep progress bar in view
                }, 100); // Delay to ensure smooth scrolling
            }
        }
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
        setCurrentPage,
        answers,
        setAnswers,
        questionRefs,
        nextButtonRef,
        handleAnswer,
        handleNext,
        allAnswered,
        progress,
        startIndex,
        endIndex,
        questionsPerPage,
        totalPages
    };
}
