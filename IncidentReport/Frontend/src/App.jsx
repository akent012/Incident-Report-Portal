import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ReactDOM from "react-dom/client";
import CrimeTypePage from "./CrimeTypePage";

import ResidentInfoPage from "./ResidentInfoPage"
import { Box, Stepper, Step, StepLabel, Button, Typography, Grid, Paper } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme"; 
import IncidentDetailsPage from "./IncidentDetailsPage";
import NarrativePage from "./NarrativePage";
import ReviewPage from "./ReviewPage";
//import ReportTypePage from "./ReportTypePage";
//import ConfirmationPage from "./ConfirmationPage";


const steps = [
    "Select Crime Type",
    "Resident Information",
    "Incident Details",
    "Narrative",
    "Review",
];

const App = () => {
    const crimeTypePageRef = useRef(null);
    const incidentDetailsPageRef = useRef(null);
    const residentDetailsPageRef = useRef(null);
    const narrativePageRef = useRef(null);
   

    const [activeStep, setActiveStep] = useState(0);
    const [payload, setPayload] = useState({
        incidentTypeID: "", //int
        incidentType: "", //nvarchar(50)
        firstName: "",//nvarchar(50)
        lastName: "",//nvarchar(50)
        homeAddress: "",//nvarchar(200)
        phoneNumber: "",//nvarchar(20)
        email: "",//nvarchar(50)
        race: "",//nvarchar(50)
        ethnicity: "",//nvarchar(50)
        dob: "", //nvarchar(50)
        sex: "",//nvarchar(10)
        driverLicenseNum: "",//nvarchar(30)
        licenseState: "",//nvarchar(20)
        age: "", //int
        incidentDetails: "", //nvarchar(1000)
        narrative: "" //nvarchar(5000)
    });

    useEffect(() => {
        console.log("Payload updated:", payload);
    }, [payload]);

 


  
    const handleNextStep = () => {
        let isValid = true;

        // Validate the current step
        if (activeStep === 0) {
            isValid = crimeTypePageRef.current?.validateForm();
        } else if (activeStep === 1) {
            isValid = residentDetailsPageRef.current?.validateForm();
        } else if (activeStep === 2) {
            isValid = incidentDetailsPageRef.current?.validateForm();
        } else if (activeStep === 3) {
            isValid = narrativePageRef.current?.validateForm();
        }

        if (!isValid) {
            return; // Stop here if validation fails
        }

        // Update mainPayload from the child component's local state after validation
        if (activeStep === 0) {
            setPayload((prevPayload) => ({
                ...prevPayload,
                ...crimeTypePageRef.current.getData(),
            }));
        } else if (activeStep === 1) {
            setPayload((prevPayload) => ({
                ...prevPayload,
                ...residentDetailsPageRef.current.getData(),
            }));
        } else if (activeStep === 2) {
            setPayload((prevPayload) => ({
                ...prevPayload,
                ...incidentDetailsPageRef.current.getData(),
            }));
        } else if (activeStep === 3) {
            setPayload((prevPayload) => ({
                ...prevPayload,
                ...narrativePageRef.current.getData(),
            }));
        }  
           
        

        // Proceed to the next step
        setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    };


    const clearPayload = () => {
        payload.incidentTypeID = "";
        payload.incidentType = "";
        payload.firstName = "";
        payload.lastName = "";
        payload.homeAddress = "";
        payload.phoneNumber = "";
        payload.email = "";
        payload.race = "";
        payload.ethnicity = "";
        payload.dob = "";
        payload.sex = "";
        payload.driverLicenseNum = "";
        payload.licenseState = "";
        payload.age = "";
        payload.incidentDetails = "";
        payload.narrative = "";
    
    };

    const handleSubmit = () => {
        try {
            // Prepare the data to be written to the SQL database


            // Send data to the API endpoint
            axios.post("https://localhost:7259/api/Incident/createIncidentReport", payload);

            // Clear the form after successful submission
            clearPayload();

            console.log("Incident report written successfully!");
        } catch (error) {
            console.error("Failed to write incident report:", error);
        }
        setActiveStep(0);
    };

    const handleBackStep = () => {
        setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: "100%", padding: 3, bgcolor: "#f9f9f9", minHeight: "100vh" }}>
                <Paper
                    elevation={3}
                    sx={{
                        maxWidth: 900,
                        margin: "0 auto",
                        padding: 4,
                        borderRadius: 2,
                        bgcolor: "#ffffff",
                    }}
                >
                    <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
                        Incident Report Form
                    </Typography>
                    <Typography
                        variant="body1"
                        align="center"
                        sx={{ marginBottom: 3, color: "text.secondary" }}
                    >
                        Welcome to the incident reporting system. Use this form to submit reports to
                        your local police department. Please complete all steps accurately.
                    </Typography>

                    <Stepper activeStep={activeStep} alternativeLabel sx={{ marginBottom: 4 }}>
                        {steps.map((step, index) => (
                            <Step key={index}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Box>
                        {activeStep === 0 && (
                            <CrimeTypePage
                                ref={crimeTypePageRef}
                                payload={payload}
                            />
                        )}
                        {activeStep === 1 && (
                            <ResidentInfoPage
                                ref={residentDetailsPageRef}
                                payload={payload}
                                
                            />
                        )}

                        {activeStep === 2 && (
                            <IncidentDetailsPage
                                ref={incidentDetailsPageRef} // Attach the ref here
                                payload={payload}
                            />
                        )}
                        {activeStep === 3 && (
                            <NarrativePage
                                ref={narrativePageRef} // Attach the ref here
                                payload={payload}
                                
                            />
                        )}
                        {activeStep === 4 && (
                            <ReviewPage
                                payload={payload}
                                setActiveStep={setActiveStep}
                            />
                        )}





                        {/* Future steps can be implemented similarly */}
                    </Box>

                    <Grid container spacing={2} sx={{ marginTop: 3 }}>
                        <Grid item xs={6}>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={handleBackStep}
                                disabled={activeStep === 0}
                            >
                                Back
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            {activeStep < steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleNextStep}
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    fullWidth
                                        onClick={handleSubmit}
                                >
                                    Submit
                                </Button>
                            )}
                        </Grid>
                    </Grid>

                </Paper>
            </Box>
        </ThemeProvider>
    );
};

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
