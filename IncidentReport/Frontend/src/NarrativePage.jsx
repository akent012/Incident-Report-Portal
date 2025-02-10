import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
    Typography,
    Container,
    TextField,
    Grid,
    Snackbar,
    Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const NarrativePage = forwardRef(({ payload }, ref) => {
    const [narrative, setNarrative] = useState(payload.narrative || "");
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        setNarrative(e.target.value);
    };

    const validateForm = () => {
        if (!narrative.trim()) {
            setError("Please provide a detailed narrative about the incident.");
            return false;
        }
        setError("");
        return true;
    };

    useImperativeHandle(ref, () => ({
        validateForm,
        getData: () => ({
            narrative,
        }),
    }));

    return (
        <Container>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.88, ease: "easeInOut" }}
            >
                <Typography variant="h5" gutterBottom>
                    Narrative Details
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    gutterBottom
                    sx={{ marginBottom: 2 }}
                >
                    Please provide a detailed description of the incident. Be as specific as
                    possible, including any relevant details, timelines, and observations.
                </Typography>

                {error && (
                    <Snackbar
                        open={!!error}
                        autoHideDuration={4000}
                        onClose={() => setError("")}
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    >
                        <Alert onClose={() => setError("")} severity="error" sx={{ width: "100%" }}>
                            {error}
                        </Alert>
                    </Snackbar>
                )}

                <Grid container>
                    <Grid item xs={12}>
                        <TextField
                            label="Detailed Narrative"
                            multiline
                            rows={10}
                            fullWidth
                            variant="outlined"
                            value={narrative}
                            onChange={handleInputChange}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { borderColor: "#ced4da" },
                                    "&:hover fieldset": { borderColor: "#1E3A8A" },
                                    "&.Mui-focused fieldset": { borderColor: "#1E3A8A" },
                                },
                            }}
                        />
                    </Grid>
                </Grid>
            </motion.div>
        </Container>
    );
});

NarrativePage.displayName = "NarrativePage";

NarrativePage.propTypes = {
    payload: PropTypes.object.isRequired,
};

export default NarrativePage;
