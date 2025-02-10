import React from "react";
import PropTypes from "prop-types";
import { Typography, Box, Paper, Grid, Button } from "@mui/material";
import { motion } from "framer-motion";

const ReviewPage = ({ payload, setActiveStep }) => {
    const sections = [
        { title: "Crime Type", step: 0, details: `Type: ${payload.incidentType}` },
        {
            title: "Resident Information",
            step: 1,
            details: `
                Name: ${payload.firstName} ${payload.lastName}\n
                Address: ${payload.homeAddress}\n
                Phone: ${payload.phoneNumber}\n
                Email: ${payload.email}\n
                Race: ${payload.race}\n
                Ethnicity: ${payload.ethnicity}\n
                DOB: ${payload.dob}\n
                Sex: ${payload.sex}\n
                Driver's License: ${payload.driverLicenseNum} (${payload.licenseState})\n
                Age: ${payload.age}
            `,
        },
        { title: "Incident Details", step: 2, details: payload.incidentDetails },
        { title: "Narrative", step: 3, details: payload.narrative },
    ];

    const handleEdit = (step) => {
        setActiveStep(step);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.88, ease: "easeInOut" }}
        >
            <Box sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
                    Review Your Report
                </Typography>
                <Typography
                    variant="body1"
                    align="center"
                    sx={{ marginBottom: 4, color: "text.secondary" }}
                >
                    Please review all the details below. Click "Edit" to make changes to any section.
                </Typography>

                <Grid container spacing={3}>
                    {sections.map((section, index) => (
                        <Grid item xs={12} key={index}>
                            <Paper
                                elevation={3}
                                sx={{
                                    padding: 2,
                                    borderRadius: 2,
                                    transition: "transform 0.2s ease-in-out",
                                    "&:hover": {
                                        transform: "scale(1.02)",
                                    },
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{ fontWeight: "bold", color: "#1E3A8A" }}
                                >
                                    {section.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        whiteSpace: "pre-line",
                                        marginBottom: 2,
                                        color: "text.secondary",
                                    }}
                                >
                                    {section.details}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleEdit(section.step)}
                                >
                                    Edit
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </motion.div>
    );
};

ReviewPage.propTypes = {
    payload: PropTypes.object.isRequired,
    setActiveStep: PropTypes.func.isRequired,
};

export default ReviewPage;
