import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import axios from 'axios';

const interestsList = [
  'technology',
  'creativity',
  'business',
  'healthcare',
  'coding',
  'design',
];

const strengthsList = [
  'problem solving',
  'communication',
  'logic',
  'visual thinking',
  'empathy',
  'strategic thinking',
];

const steps = ['Your Name', 'Select Interests', 'Select Strengths', 'Recommendations'];

export default function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState('');
  const [interests, setInterests] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNext = () => {
    if (activeStep === steps.length - 2) {
      fetchRecommendations();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/recommend', {
        name,
        interests,
        strengths,
      });
      setRecommendations(response.data.recommendations || []);
      setActiveStep((prev) => prev + 1);
    } catch (error) {
      alert('Failed to fetch recommendations. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const stepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <TextField
            label="Enter your name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        );
      case 1:
        return (
          <FormGroup>
            {interestsList.map((interest) => (
              <FormControlLabel
                key={interest}
                control={
                  <Checkbox
                    checked={interests.includes(interest)}
                    onChange={() => toggleSelection(interest, interests, setInterests)}
                    color="primary"
                  />
                }
                label={interest.charAt(0).toUpperCase() + interest.slice(1)}
              />
            ))}
          </FormGroup>
        );
      case 2:
        return (
          <FormGroup>
            {strengthsList.map((strength) => (
              <FormControlLabel
                key={strength}
                control={
                  <Checkbox
                    checked={strengths.includes(strength)}
                    onChange={() => toggleSelection(strength, strengths, setStrengths)}
                    color="primary"
                  />
                }
                label={strength.charAt(0).toUpperCase() + strength.slice(1)}
              />
            ))}
          </FormGroup>
        );
      case 3:
        if (loading) {
          return (
            <Box textAlign="center" my={4}>
              <CircularProgress />
              <Typography mt={2}>Loading recommendations...</Typography>
            </Box>
          );
        }

        if (recommendations.length === 0) {
          return <Typography>No recommendations found. Try different inputs.</Typography>;
        }

        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Hi {name}, here are your recommendations:
            </Typography>
            {recommendations.map((rec, idx) => (
              <Card
                key={idx}
                variant="outlined"
                sx={{
                  mb: 3,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  borderRadius: 2,
                  padding: 2,
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {rec.career}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {rec.description}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Roadmap:
                  </Typography>
                  <ul style={{ marginTop: 0, paddingLeft: '1.2rem' }}>
                    {rec.roadmap.map((step, i) => (
                      <li key={i}>
                        <Typography variant="body2">{step}</Typography>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
            <Box textAlign="center" mt={3}>
              <Button
                variant="contained"
                onClick={() => {
                  setName('');
                  setInterests([]);
                  setStrengths([]);
                  setRecommendations([]);
                  setActiveStep(0);
                }}
                disabled={loading}
              >
                Start Over
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        align="center"
        gutterBottom
        sx={{ fontWeight: 700, mb: 4 }}
      >
        nextstep.ai - Career Path Recommender
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel sx={{ typography: { fontWeight: 600 } }}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {stepContent()}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        {activeStep > 0 && activeStep < steps.length - 1 && (
          <Button variant="outlined" onClick={handleBack}>
            Back
          </Button>
        )}

        {activeStep < steps.length - 1 && (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              (activeStep === 0 && !name.trim()) ||
              (activeStep === 1 && interests.length === 0) ||
              (activeStep === 2 && strengths.length === 0)
            }
          >
            {activeStep === steps.length - 2 ? 'Get Recommendations' : 'Next'}
          </Button>
        )}
      </Box>
    </Container>
  );
}
