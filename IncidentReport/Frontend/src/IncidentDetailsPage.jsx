import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import {
    Typography,
    Container,
    Grid,
    TextField,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const IncidentDetailsPage = forwardRef(({ payload }, ref) => {
    const [questions, setQuestions] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(
                    `https://localhost:7259/api/Incident/readIncidentQuestions/${payload.incidentTypeID}`
                );

                setQuestions(response.data);

                // Initialize formData with empty values for each question
                const initialData = response.data.reduce((acc, question) => {
                    acc[question.questionID] = payload[question.questionID] || "";
                    return acc;
                }, {});
                setFormData(initialData);
            } catch (err) {
                console.error("Error fetching questions:", err);
                setError("Failed to fetch incident questions. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (payload.incidentTypeID) {
            fetchQuestions();
        } else {
            setError("Incident Type ID is missing or invalid.");
            setLoading(false);
        }
    }, [payload.incidentTypeID]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Update local formData state
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        questions.forEach((question) => {
            if (question.isRequired && !formData[question.questionID]) {
                newErrors[question.questionID] = `${question.questionText} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useImperativeHandle(ref, () => ({
        validateForm,
        getData: () => {
            // Generate incidentDetails formatted string
            const incidentDetails = questions
                .map((question) => {
                    const response = formData[question.questionID] || "";
                    return `${question.questionText}: ${response}`;
                })
                .join("\n");

            return { incidentDetails }; // Return the formatted string
        },
    }));

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container>
            <Typography variant="h5" gutterBottom>
                Incident Details
            </Typography>
            {questions.length > 0 ? (
                <form>
                    <Grid container spacing={3}>
                        {questions.map((question) => (
                            <Grid item xs={12} key={question.questionID}>
                                <motion.div
                                    initial={{ opacity: 0, y: -50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 50 }}
                                    transition={{ duration: 0.88, ease: "easeInOut" }}
                                >
                                    <TextField
                                        label={question.questionText}
                                        name={question.questionID}
                                        fullWidth
                                        value={formData[question.questionID] || ""}
                                        onChange={handleInputChange}
                                        error={!!errors[question.questionID]}
                                        helperText={errors[question.questionID] || " "}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": { borderColor: "#ced4da" },
                                                "&:hover fieldset": { borderColor: "#1E3A8A" },
                                                "&.Mui-focused fieldset": { borderColor: "#1E3A8A" },
                                            },
                                        }}
                                    />
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </form>
            ) : (
                <Typography>No questions found for this incident type.</Typography>
            )}
        </Container>
    );
});

IncidentDetailsPage.displayName = "IncidentDetailsPage";

IncidentDetailsPage.propTypes = {
    payload: PropTypes.object.isRequired,
};

export default IncidentDetailsPage;
