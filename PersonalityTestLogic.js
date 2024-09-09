import { useState, useEffect, useRef } from "react";

export const usePersonalityTest = () => {
    const [questionsData, setQuestionsData] = useState([]);
    const [answers, setAnswers] = useState(Array(questionsData.length).fill(null));
    const [currentPage, setCurrentPage] = useState(0);
    const [error, setError] = useState(null);
    
    const traits = {
        Openness: 0,
        Conscientiousness: 0,
        Extraversion: 0,
        Agreeableness: 0,
        Neuroticism: 0,
    };

    useEffect(() => {
        fetch("https://sendn00ts.github.io/CatharsisPersonalityTest/PersonalityTestQuestions.json")
            .then(response => response.json())
            .then(data => setQuestionsData(data))
            .catch(error => setError(error));
    }, []);

    const handleAnswer = (questionIndex, value) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = value;
        setAnswers(newAnswers);
    };

    const calculateResults = () => {
        answers.forEach((answer, index) => {
            if (answer !== null) {
                const question = questionsData[index];
                const trait = question.trait; // Assume each question has a `trait` key
                const weight = question.weight; // Assume each question has a `weight` key
                
                // Adjust the trait values based on the user's answer
                switch (trait) {
                    case "Openness":
                        traits.Openness += answer * weight;
                        break;
                    case "Conscientiousness":
                        traits.Conscientiousness += answer * weight;
                        break;
                    case "Extraversion":
                        traits.Extraversion += answer * weight;
                        break;
                    case "Agreeableness":
                        traits.Agreeableness += answer * weight;
                        break;
                    case "Neuroticism":
                        traits.Neuroticism += answer * weight;
                        break;
                    default:
                        break;
                }
            }
        });

        // Determine the archetype based on the calculated traits
        const archetype = determineArchetype(traits);
        return archetype;
    };

    const determineArchetype = (traits) => {
        const { Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism } = traits;

        if (Openness < 20 && Conscientiousness > 30 && Extraversion < 20 && Agreeableness > 30 && Neuroticism < 20) {
            return { primary: "Shield", secondary: null };
        } else if (Openness > 30 && Conscientiousness < 20 && Agreeableness > 30 && Neuroticism > 30) {
            return { primary: "Labyrinth", secondary: null };
        } else if (Openness >= 20 && Openness <= 30 && Conscientiousness > 30 && Extraversion > 30 && Agreeableness > 30 && Neuroticism < 20) {
            return { primary: "Olive Branch", secondary: null };
        } else if (Openness > 30 && Conscientiousness < 20 && Extraversion < 20 && Agreeableness <= 20 && Neuroticism > 20) {
            return { primary: "Scroll", secondary: null };
        } else if (Openness >= 20 && Openness <= 30 && Conscientiousness >= 20 && Conscientiousness <= 30 && Extraversion > 30 && Agreeableness > 30 && Neuroticism < 20) {
            return { primary: "Lyre", secondary: null };
        } else if (Openness < 20 && Conscientiousness >= 20 && Extraversion > 30 && Agreeableness < 20 && Neuroticism <= 20) {
            return { primary: "Spear", secondary: null };
        } else {
            return { primary: "Unknown", secondary: null };
        }
    };

    return {
        questionsData,
        answers,
        currentPage,
        handleAnswer,
        calculateResults,
        error,
    };
};
