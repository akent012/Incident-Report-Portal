import React, { useState } from "react";
import { Box, Typography, Card, CardContent, TextField } from "@mui/material";
import PropTypes from "prop-types";

const ReportTypePage = ({ formData, onFormSubmit }) => {
    const [reportType, setReportType] = useState(formData?.reportType || "");
    const [originalReportNumber, setOriginalReportNumber] = useState(formData?.originalReportNumber || "");
    const [isSupplemental, setIsSupplemental] = useState(reportType === "Supplemental");

    // Handle card selection for report type
    const handleCardSelect = (type) => {
        setReportType(type);
        setIsSupplemental(type === "Supplemental");
        setOriginalReportNumber(""); // Clear original report number when selecting Original

        // Immediately notify parent of the selected report type
        onFormSubmit({ reportType: type, originalReportNumber: "" });
    };

    // Handle changes in the original report number field
    const handleOriginalReportNumberChange = (e) => {
        const value = e.target.value;
        setOriginalReportNumber(value);

        // Match against the structure "XX-XXXX"
        const isValidFormat = /^[A-Za-z]{2}-\d{4}$/.test(value);

        // Notify parent with valid or empty original report number
        if (isValidFormat) {
            onFormSubmit({ reportType, originalReportNumber: value });
        } else {
            onFormSubmit({ reportType, originalReportNumber: "" });
        }
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto", padding: 2 }}>
            <Typography variant="h6" align="center" gutterBottom>
                Select the Report Type
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
                Please choose whether this is the first report or an update to a previous report.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", marginBottom: 3 }}>
                <Card
                    sx={{
                        width: "100%",
                        maxWidth: 250,
                        cursor: "pointer",
                        border: reportType === "Original" ? "2px solid #1976d2" : "1px solid #ccc",
                    }}
                    onClick={() => handleCardSelect("Original")}
                >
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Original
                        </Typography>
                        <Typography variant="body2">
                            This is the first report that is being filed for this incident.
                        </Typography>
                    </CardContent>
                </Card>

                <Card
                    sx={{
                        width: "100%",
                        maxWidth: 250,
                        cursor: "pointer",
                        border: reportType === "Supplemental" ? "2px solid #1976d2" : "1px solid #ccc",
                    }}
                    onClick={() => handleCardSelect("Supplemental")}
                >
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Supplemental
                        </Typography>
                        <Typography variant="body2">
                            You are adding information to a previous report which was submitted online.
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            {isSupplemental && (
                <Box sx={{ marginBottom: 3 }}>
                    <TextField
                        label="Original Report Number (e.g., XX-XXXX)"
                        fullWidth
                        value={originalReportNumber}
                        onChange={handleOriginalReportNumberChange}
                        error={!/^[A-Za-z]{2}-\d{4}$/.test(originalReportNumber) && originalReportNumber !== ""}
                        helperText={
                            !/^[A-Za-z]{2}-\d{4}$/.test(originalReportNumber) && originalReportNumber !== ""
                                ? "Please enter a valid report number (e.g., XX-XXXX)"
                                : ""
                        }
                    />
                </Box>
            )}
        </Box>
    );
};

ReportTypePage.propTypes = {
    formData: PropTypes.shape({
        reportType: PropTypes.string,
        originalReportNumber: PropTypes.string,
    }),
    onFormSubmit: PropTypes.func.isRequired, // Ensure onFormSubmit is required
};

ReportTypePage.defaultProps = {
    formData: {}, // Default to an empty object if not provided
};

export default ReportTypePage;
