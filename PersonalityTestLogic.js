import * as React from "react"
import { useState, useEffect } from "react"
import EasingGradientCircles from "https://framer.com/m/EasingGradientCircles-rqyF.js@6bGYoqrq00jwzBjM4EcD"
import EasingGradientCirclesLeft from "https://framer.com/m/EasingGradientCirclesLeft-NmKB.js@3EgolAvNsmPqYvjteIGS"

export function PersonalityTestAnswerScale({
    question,
    questionIndex,
    onAnswer,
    nextRef,
}) {
    const [selected, setSelected] = useState(null)
    const [hovered, setHovered] = useState(null)

    // Correct value mapping (1 = fully disagree, 7 = fully agree, and so on)
    const scaleValues = [-3, -2, -1, 0, 1, 2, 3] // Normalized to range from -3 to +3

    const handleSelect = (index) => {
        const value = scaleValues[index] // Map index to the appropriate scale value
        console.log("Scale Values: ", scaleValues)
        console.log(Selected value for question ${questionIndex + 1}:, value)
    
        setSelected(index)
        onAnswer(questionIndex, value) // Pass mapped value to onAnswer
    }

    useEffect(() => {
        if (selected !== null && nextRef.current) {
            setTimeout(() => {
                const rect = nextRef.current.getBoundingClientRect()
                const offset = window.innerHeight / 2 - rect.height / 2
                window.scrollTo({
                    top: rect.top + window.scrollY - offset,
                    behavior: "smooth",
                })
            }, 100) // Delay to ensure smooth scrolling
        }
    }, [selected, nextRef])

    const circleSizes = [90, 80, 70, 60, 70, 80, 90] // Sizes for the circles

    const getCircleStyle = (index) => {
        let borderColor

        if (selected === index || hovered === index) {
            if (index === 3) {
                return {
                    width: ${circleSizes[index]}px,
                    height: ${circleSizes[index]}px,
                    border: "3px solid gray",
                    borderRadius: "50%",
                    backgroundColor: "gray",
                    cursor: "pointer",
                    margin: "0 10px", // Increase space between circles
                    transition: "background 0.3s ease", // Smooth transition
                }
            } else {
                return {
                    width: ${circleSizes[index]}px,
                    height: ${circleSizes[index]}px,
                    border: "3px solid transparent", // Remove border when selected
                    borderRadius: "50%",
                    cursor: "pointer",
                    margin: "0 10px", // Increase space between circles
                    transition: "background 0.3s ease", // Smooth transition
                    position: "relative", // For gradient filling
                    overflow: "hidden", // For gradient filling
                }
            }
        } else {
            if (index < 3) {
                borderColor = "white"
            } else if (index > 3) {
                borderColor = "black"
            } else {
                borderColor = "gray" // Gray border for middle circle
            }

            return {
                width: ${circleSizes[index]}px,
                height: ${circleSizes[index]}px,
                border: 3px solid ${borderColor},
                borderRadius: "50%",
                cursor: "pointer",
                margin: "0 10px", // Increase space between circles
                transition: "background 0.3s ease", // Smooth transition
                backgroundColor: "transparent",
                position: "relative", // For gradient filling
                overflow: "hidden", // For gradient filling
            }
        }
    }

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
                backgroundColor: "transparent", // Ensure no background color
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
                        key={circle-${index}} // Unique key for each circle
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
    )
}
