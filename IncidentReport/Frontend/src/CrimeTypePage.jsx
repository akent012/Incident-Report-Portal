import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Typography, CircularProgress, Box, TextField, Autocomplete } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";

const CrimeTypePage = forwardRef(({ payload }, ref) => {
    const [isLoading, setIsLoading] = useState(false);
    const [incidentTypes, setIncidentTypes] = useState([]);
    const [error, setError] = useState(null);
    const [selectedIncident, setSelectedIncident] = useState({
        incidentType: payload.incidentType || "",
        incidentTypeID: payload.incidentTypeID || "",
    });

    useEffect(() => {
        let isMounted = true; // Prevent state updates after unmounting
        const fetchIncidentTypes = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await axios.get("https://localhost:7259/api/Incident/readIncidentTypes");

                if (Array.isArray(response.data) && isMounted) {
                    setIncidentTypes(response.data);

                    // Synchronize the selected incident from the payload if it matches an option
                    const preselected = response.data.find((item) => item.id === payload.incidentTypeID);
                    if (preselected) {
                        setSelectedIncident({
                            incidentType: preselected.incidentType,
                            incidentTypeID: preselected.id,
                        });
                    }
                } else if (isMounted) {
                    throw new Error("Unexpected response format.");
                }
            } catch (err) {
                if (isMounted) {
                    console.error(err);
                    setError("Failed to load incident types. Please try again.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchIncidentTypes();

        return () => {
            isMounted = false; // Cleanup to avoid state updates on unmount
        };
    }, [payload.incidentTypeID]);

    const handleSelectCrime = (event, incident) => {
        setSelectedIncident(
            incident
                ? { incidentType: incident.incidentType, incidentTypeID: incident.id }
                : { incidentType: "", incidentTypeID: "" }
        );
    };

    useImperativeHandle(ref, () => ({
        validateForm: () => {
            if (!selectedIncident.incidentType || !selectedIncident.incidentTypeID) {
                setError("Please select a valid crime type before proceeding.");
                return false;
            }
            setError(null);
            return true;
        },
        getData: () => selectedIncident,
    }));

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Please select a crime type to proceed.
            </Typography>

            {isLoading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 200,
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {error && (
                        <Typography color="error" gutterBottom sx={{ textAlign: "center" }}>
                            {error}
                        </Typography>
                    )}
                    <Autocomplete
                        options={incidentTypes}
                        getOptionLabel={(option) => option.incidentType || ""}
                        value={
                            selectedIncident.incidentTypeID
                                ? incidentTypes.find((item) => item.id === selectedIncident.incidentTypeID) || null
                                : null
                        }
                        onChange={handleSelectCrime}
                        filterOptions={(options, { inputValue }) => {
                            const lowercaseInput = inputValue.toLowerCase();
                            return options
                                .filter((option) =>
                                    option.incidentType.toLowerCase().includes(lowercaseInput)
                                )
                                .sort((a, b) => {
                                    const startsWithA = a.incidentType.toLowerCase().startsWith(lowercaseInput);
                                    const startsWithB = b.incidentType.toLowerCase().startsWith(lowercaseInput);
                                    if (startsWithA && !startsWithB) return -1;
                                    if (!startsWithA && startsWithB) return 1;
                                    return 0;
                                });
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search or select a crime type"
                                variant="outlined"
                            />
                        )}
                        sx={{ width: "100%", maxWidth: 600, margin: "0 auto", marginTop: 3 }}
                    />
                </>
            )}
        </Box>
    );
});

CrimeTypePage.displayName = "CrimeTypePage";

CrimeTypePage.propTypes = {
    payload: PropTypes.object.isRequired,
};

export default CrimeTypePage;
