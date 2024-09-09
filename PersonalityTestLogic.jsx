import React, { useEffect, useState } from "react"
import { PersonalityTestAnswerScale } from "https://framer.com/m/PersonalityTestAnswerScale-fuRt.js@4Ep4xIjzN1bhp9ZzseIF"
import { usePersonalityTest } from "https://sendn00ts.github.io/CatharsisPersonalityTest/PersonalityTestLogic.js"

export function PersonalityTest() {
    const [questionsData, setQuestionsData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(0)
    const questionsPerPage = 6

    const {
        handleAnswer,
        questionRefs = { current: [] },
        nextButtonRef,
        calculateResults,
        answers = [],
    } = usePersonalityTest() || {}

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const response = await fetch(
                    "https://sendn00ts.github.io/CatharsisPersonalityTest/PersonalityTestQuestions.json"
                )
                if (!response.ok) {
                    throw new Error("Failed to fetch questions data")
                }
                const data = await response.json()
                setQuestionsData(data)
                setIsLoading(false)
            } catch (error) {
                console.error(error)
                setError("Failed to load questions. Please try again later.")
                setIsLoading(false)
            }
        }
        fetchQuestions()
    }, [])

    useEffect(() => {
        const link = document.createElement("link")
        link.href =
            "https://fonts.googleapis.com/css2?family=Raleway:wght@400&display=swap"
        link.rel = "stylesheet"
        document.head.appendChild(link)
    }, [])

    const startIndex = currentPage * questionsPerPage
    const endIndex = Math.min(
        startIndex + questionsPerPage,
        questionsData.length
    )

    // Determine if all questions on the current page are answered
    const allAnsweredOnPage = answers
        .slice(startIndex, endIndex)
        .every((answer) => answer !== null)

    // Scroll to the top of the next page when changing pages
    const handleNextWithScroll = () => {
        if (
            currentPage <
            Math.ceil(questionsData.length / questionsPerPage) - 1
        ) {
            setCurrentPage(currentPage + 1)
            window.scrollTo({ top: 0, behavior: "smooth" }) // Scroll to top of page
        }
    }

    const handleShowResults = () => {
        if (typeof calculateResults === "function") {
            const result = calculateResults() || {}  // Defensive programming, handle null/undefined result
            const { primary } = result || {}; // Safely destructure 'primary' from result

            if (!primary) {
                console.error("No archetype found or calculation failed.")
                return;
            }

            const archetypeUrls = {
                Labyrinth:
                    "https://tiny-slides-700893.framer.app/resultlabyrinthos",
                Shield: "https://tiny-slides-700893.framer.app/resultaspida",
                Helm: "https://tiny-slides-700893.framer.app/resultkyvernitis",
                "Olive Branch":
                    "https://tiny-slides-700893.framer.app/resultkladoselaias",
                Lyre: "https://tiny-slides-700893.framer.app/resultlyra",
                Papyros: "https://tiny-slides-700893.framer.app/resultpapyros",
                Dory: "https://tiny-slides-700893.framer.app/resultdory",
                Estia: "https://tiny-slides-700893.framer.app/resultestia",
            }

            const redirectTo = archetypeUrls[primary]

            if (redirectTo) {
                window.location.href = redirectTo // Redirect to the result page
            } else {
                console.error("No URL found for the calculated archetype.")
            }
        } else {
            console.error("calculateResults is not a function or is undefined")
        }
    }

    if (error) {
        return (
            <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
                <p>{error}</p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <p>Loading the personality test...</p>
            </div>
        )
    }

    const totalAnsweredQuestions = answers.filter(
        (answer) => answer !== null
    ).length
    const totalQuestions = questionsData.length
    const progressPercentage = totalQuestions
        ? Math.round((totalAnsweredQuestions / totalQuestions) * 100)
        : 0

    return (
        <div
            style={{
                padding: "20px",
                textAlign: "center",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: "400",
            }}
        >
            {/* Progress bar */}
            <div style={{ marginBottom: "20px", width: "100%" }}>
                <div
                    style={{
                        height: "20px",
                        backgroundColor: "#e0e0e0",
                        borderRadius: "10px",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            height: "100%",
                            width: `${progressPercentage}%`,
                            backgroundColor: "#76c7c0",
                            transition: "width 0.5s ease",
                        }}
                    ></div>
                </div>
                <p
                    style={{
                        marginTop: "10px",
                        fontWeight: "bold",
                        color: "#343a40",
                    }}
                >
                    {progressPercentage}% completed
                </p>
            </div>

            {/* Render the questions */}
            {questionsData
                .slice(startIndex, endIndex)
                .map((questionItem, index) => (
                    <div
                        key={startIndex + index}
                        ref={questionRefs.current[startIndex + index]}
                        style={{ marginBottom: "60px" }}
                    >
                        <PersonalityTestAnswerScale
                            question={questionItem.Question}
                            questionIndex={startIndex + index}
                            answers={questionItem.Answers}
                            onAnswer={handleAnswer}
                            nextRef={
                                index === 5
                                    ? nextButtonRef
                                    : questionRefs.current[
                                          startIndex + index + 1
                                      ]
                            }
                        />
                    </div>
                ))}

            {currentPage < Math.ceil(totalQuestions / questionsPerPage) - 1 ? (
                <button
                    ref={nextButtonRef}
                    onClick={handleNextWithScroll}
                    disabled={!allAnsweredOnPage} // Disable Next button if not all answered
                    style={{
                        padding: "15px 30px",
                        marginTop: "20px",
                        fontSize: "18px",
                        background: allAnsweredOnPage ? "#007bff" : "#d3d3d3",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "30px",
                        cursor: allAnsweredOnPage ? "pointer" : "not-allowed",
                        transition: "background 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                    }}
                >
                    Next
                    <span
                        style={{
                            marginLeft: "10px",
                            display: "inline-block",
                            transition: "transform 0.3s ease",
                        }}
                    >
                        ➔
                    </span>
                </button>
            ) : (
                <button
                    onClick={handleShowResults}
                    style={{
                        padding: "15px 30px",
                        marginTop: "20px",
                        fontSize: "18px",
                        background: "#007bff",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "30px",
                        cursor: "pointer",
                        transition: "background 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                    }}
                >
                    Show Results
                </button>
            )}
        </div>
    )
}
