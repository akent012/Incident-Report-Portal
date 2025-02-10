import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
    Typography,
    Container,
    CssBaseline,
    Snackbar,
    Alert,
    Grid,
    TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import InputMask from "react-input-mask";
import PropTypes from "prop-types";

const ResidentInfoPage = forwardRef(({ payload }, ref) => {
    const [formData, setFormData] = useState({
        firstName: payload.firstName || "",
        lastName: payload.lastName || "",
        homeAddress: payload.homeAddress || "",
        phoneNumber: payload.phoneNumber || "",
        email: payload.email || "",
        race: payload.race || "",
        ethnicity: payload.ethnicity || "",
        dob: payload.dob || "",
        sex: payload.sex || "",
        driverLicenseNum: payload.driverLicenseNum || "",
        licenseState: payload.licenseState || "",
        age: payload.age || "",
    });

    const [errors, setErrors] = useState({});
    const [errorPopup, setErrorPopup] = useState("");

    const handleClosePopup = () => setErrorPopup("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...formData, [name]: value };
        setFormData(updatedData); // Update local state
     
    };


    const validateForm = () => {
        const newErrors = {};
        const requiredFields = [
            "firstName",
            "lastName",
            "homeAddress",
            "phoneNumber",
            "email",
            "race",
            "ethnicity",
            "dob",
            "sex",
            "driverLicenseNum",
            "licenseState",
            "age",
        ];

        requiredFields.forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required.`;
            }
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setErrorPopup("Please fill out all required fields.");
        }

        return Object.keys(newErrors).length === 0;
    };

    useImperativeHandle(ref, () => ({
        validateForm,
        getData: () => formData, // Expose local state
    }));

    const shakeAnimation = {
        animate: { x: [0, -10, 10, -10, 0], transition: { duration: 0.4 } },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.88, ease: "easeInOut" }}
        >
            <CssBaseline />
            <Container maxWidth="md">
                <Snackbar
                    open={!!errorPopup}
                    autoHideDuration={4000}
                    onClose={handleClosePopup}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert onClose={handleClosePopup} severity="error" sx={{ width: "100%" }}>
                        {errorPopup}
                    </Alert>
                </Snackbar>

                <Typography
                    sx={{
                        mb: 2,
                        fontSize: "1em",
                        color: "#1E3A8A",
                        fontWeight: "bold",
                        letterSpacing: "0px",
                        marginTop: "15px",
                    }}
                >
                    RESIDENT INFO
                </Typography>

                <Grid container spacing={3}>
                    {[
                        { label: "First Name", name: "firstName" },
                        { label: "Last Name", name: "lastName" },
                        { label: "Home Address", name: "homeAddress" },
                        { label: "Email", name: "email" },
                        { label: "Race", name: "race" },
                        { label: "Ethnicity", name: "ethnicity" },
                        { label: "Date of Birth (YYYY-MM-DD)", name: "dob" },
                        { label: "Sex", name: "sex" },
                        { label: "Driver License Number", name: "driverLicenseNum" },
                        { label: "License State", name: "licenseState" },
                        { label: "Age", name: "age" },
                    ].map((field, index) => (
                        <Grid item xs={12} key={index}>
                            <motion.div {...(errors[field.name] ? shakeAnimation : {})}>
                                <TextField
                                    label={field.label}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors[field.name]}
                                    helperText={errors[field.name]}
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

                    {/* Phone Number Field */}
                    <Grid item xs={12}>
                        <motion.div {...(errors.phoneNumber ? shakeAnimation : {})}>
                            <InputMask
                                mask="(999) 999-9999"
                                value={formData.phoneNumber}
                                onChange={(e) =>
                                    handleChange({
                                        target: { name: "phoneNumber", value: e.target.value },
                                    })
                                }
                            >
                                {(inputProps) => (
                                    <TextField
                                        {...inputProps}
                                        label="Phone Number"
                                        name="phoneNumber"
                                        fullWidth
                                        error={!!errors.phoneNumber}
                                        helperText={errors.phoneNumber || "Format: (123) 456-7890"}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": { borderColor: "#ced4da" },
                                                "&:hover fieldset": { borderColor: "#1E3A8A" },
                                                "&.Mui-focused fieldset": { borderColor: "#1E3A8A" },
                                            },
                                        }}
                                    />
                                )}
                            </InputMask>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </motion.div>
    );
});

ResidentInfoPage.displayName = "ResidentInfoPage";

ResidentInfoPage.propTypes = {
    payload: PropTypes.object.isRequired,
};

export default ResidentInfoPage;
