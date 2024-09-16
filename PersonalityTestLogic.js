import { useState } from 'react';

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

        // Ensure the value is within the acceptable range (-3 to 3)
        if (newValue < -3 || newValue > 3) {
            console.error(`Invalid value received for question ${questionIndex + 1}:`, newValue);
            return;
        }

        const previousAnswer = answers[questionIndex]; // Get the previous answer for the question
        const newAnswers = [...answers];
        newAnswers[questionIndex] = newValue; // Update the new answer
        setAnswers(newAnswers); // Save the updated answers

        updateTraits(questionIndex, newValue, previousAnswer); // Pass both new and previous answer to update traits
    };

    const updateTraits = (questionIndex, newValue, previousValue) => {
        console.log(`Before updating traits for question ${questionIndex + 1}:`, traits);

        const updatedTraits = { ...traits };

        // Adjust the mapping (no normalization required if using -3 to 3 scale directly)
        const normalizedNewValue = newValue;
        const normalizedPreviousValue = previousValue !== null ? previousValue : 0; // Use previous value if it exists

        // Subtract the effect of the previous answer and add the new answer
        if (questionIndex >= 0 && questionIndex <= 9) {
            // Openness
            updatedTraits.Openness += normalizedNewValue - normalizedPreviousValue;
        } else if (questionIndex >= 10 && questionIndex <= 19) {
            // Conscientiousness
            updatedTraits.Conscientiousness += normalizedNewValue - normalizedPreviousValue;
        } else if (questionIndex >= 20 && questionIndex <= 29) {
            // Extraversion
            updatedTraits.Extraversion += normalizedNewValue - normalizedPreviousValue;
        } else if (questionIndex >= 30 && questionIndex <= 39) {
            // Agreeableness
            updatedTraits.Agreeableness += normalizedNewValue - normalizedPreviousValue;
        } else if (questionIndex >= 40 && questionIndex <= 49) {
            // Neuroticism
            updatedTraits.Neuroticism += normalizedNewValue - normalizedPreviousValue;
        }

        setTraits(updatedTraits); // Save the updated traits
        console.log(`After updating traits for question ${questionIndex + 1}:`, updatedTraits);
    };

    function calculateResults() {
        const { Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism } = traits;

        console.log("Final Trait values after all answers:", { Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism });

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
            // Other archetypes...
        ];

        function getTraitMatchScore(traitScore, traitThreshold) {
            if (traitThreshold === "high") {
                return traitScore >= 5 ? 1 : 0;
            } else if (traitThreshold === "moderate") {
                return traitScore >= 3 && traitScore <= 4 ? 1 : 0;
            } else if (traitThreshold === "low") {
                return traitScore <= 2 ? 1 : 0;
            } else if (traitThreshold === "lowOrHigh") {
                return traitScore <= 2 || traitScore >= 5 ? 1 : 0;
            } else if (traitThreshold === "moderateToHigh") {
                return traitScore >= 3 ? 1 : 0;
            } else if (traitThreshold === "lowToModerate") {
                return traitScore <= 3 ? 1 : 0;
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

    return {
        answers,
        handleAnswer,
        calculateResults,
    };
}

import * as React from "react";
import { useState, useEffect } from "react";
import EasingGradientCircles from "https://framer.com/m/EasingGradientCircles-rqyF.js@6bGYoqrq00jwzBjM4EcD";
import EasingGradientCirclesLeft from "https://framer.com/m/EasingGradientCirclesLeft-NmKB.js@3EgolAvNsmPqYvjteIGS";

export function PersonalityTestAnswerScale({
    question,
    questionIndex,
    onAnswer,
    nextRef,
}) {
    const [selected, setSelected] = useState(null);
    const [hovered, setHovered] = useState(null);

    // Correct value mapping (1 = fully disagree, 7 = fully agree, and so on)
    const scaleValues = [-3, -2, -1, 0, 1, 2, 3]; // Normalized to range from -3 to +3

    const handleSelect = (index) => {
        const value = scaleValues[index]; // Map index to the appropriate scale value
        console.log("Scale Values: ", scaleValues);
        console.log(`Selected value for question ${questionIndex + 1}:`, value);

        setSelected(index);
        onAnswer(questionIndex, value); // Pass mapped value to onAnswer
    };

    useEffect(() => {
        let scrollTimeout;
        if (selected !== null && nextRef.current) {
            scrollTimeout = setTimeout(() => {
                const rect = nextRef.current.getBoundingClientRect();
                const offset = window.innerHeight / 2 - rect.height / 2;
                window.scrollTo({
                    top: rect.top + window.scrollY - offset,
                    behavior: "smooth",
                });
            }, 100);
        }

        return () => clearTimeout(scrollTimeout); // Clean up to prevent memory leaks
    }, [selected, nextRef]);

    const circleSizes = [90, 80, 70, 60, 70, 80, 90]; // Sizes for the circles

    const getCircleStyle = (index) => {
        let borderColor;

        if (selected === index || hovered === index) {
            if (index === 3) {
                return {
                    width: `${circleSizes[index]}px`,
                    height: `${circleSizes[index]}px`,
                    border: "3px solid gray",
                    borderRadius: "50%",
                    backgroundColor: "gray",
                    cursor: "pointer",
                    margin: "0 10px", // Increase space between circles
                    transition: "background 0.3s ease", // Smooth transition
                };
            } else {
                return {
                    width: `${circleSizes[index]}px`,
                    height: `${circleSizes[index]}px`,
                    border: "3px solid transparent", // Remove border when selected
                    borderRadius: "50%",
                    cursor: "pointer",
                    margin: "0 10px", // Increase space between circles
                    transition: "background 0.3s ease", // Smooth transition
                    position: "relative", // For gradient filling
                    overflow: "hidden", // For gradient filling
                };
            }
        } else {
            if (index < 3) {
                borderColor = "white";
            } else if (index > 3) {
                borderColor = "black";
            } else {
                borderColor = "gray"; // Gray border for middle circle
            }

            return {
                width: `${circleSizes[index]}px`,
                height: `${circleSizes[index]}px`,
                border: `3px solid ${borderColor}`,
                borderRadius: "50%",
                cursor: "pointer",
                margin: "0 10px", // Increase space between circles
                transition: "background 0.3s ease", // Smooth transition
                backgroundColor: "transparent",
                position: "relative", // For gradient filling
                overflow: "hidden", // For gradient filling
            };
        }
    };

    return (
        <div
            style={{
                marginBottom: "60px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "300px",
                width: "100%",
                backgroundColor: "transparent",
            }}
        >
            <p
                style={{
                    fontSize: "30px",
                    marginBottom: "40px", // Increase space between question and scale
                    fontWeight: "bold",
                    textAlign: "center",
                    width: "100%",
                }}
            >
                {question}
            </p>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                }}
            >
                <span
                    style={{
                        marginRight: "20px", // Increase space between text and circles
                        fontSize: "20px",
                        fontWeight: "bold",
                    }}
                >
                    Disagree
                </span>
                {circleSizes.map((size, index) => (
                    <div
                        key={`circle-${index}`} // Unique key for each circle
                        onClick={() => handleSelect(index)} // Use index to map to value
                        onMouseEnter={() => setHovered(index)}
                        onMouseLeave={() => setHovered(null)}
                        style={getCircleStyle(index)}
                    >
                        {(selected === index || hovered === index) &&
                            index !== 3 &&
                            (index < 3 ? (
                                <EasingGradientCirclesLeft
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: "50%",
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                    }}
                                />
                            ) : (
                                <EasingGradientCircles
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: "50%",
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                    }}
                                />
                            ))}
                    </div>
                ))}
                <span
                    style={{
                        marginLeft: "20px", // Increase space between text and circles
                        fontSize: "20px",
                        fontWeight: "bold",
                    }}
                >
                    Agree
                </span>
            </div>
        </div>
    );
}
