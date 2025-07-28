import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import ApiService from '../../services/api';

export default function ExperienceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      await ApiService.createExperience(data);
      setSubmitMessage('Experience added successfully!');
      reset();
    } catch (error) {
      setSubmitMessage('Error adding experience. Please try again.');
      console.error('Error:', error);
    }
    
    setIsSubmitting(false);
  };

  return (
    <motion.div
      className="section"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Typography variant="h4" gutterBottom>
        Add New Experience
      </Typography>
      
      {submitMessage && (
        <Alert severity={submitMessage.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>
          {submitMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Company"
          {...register('company', { required: 'Company is required' })}
          error={!!errors.company}
          helperText={errors.company?.message}
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="Role/Position"
          {...register('role', { required: 'Role is required' })}
          error={!!errors.role}
          helperText={errors.role?.message}
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description"
          {...register('description', { required: 'Description is required' })}
          error={!!errors.description}
          helperText={errors.description?.message}
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="Start Date"
          placeholder="e.g., Jan 2022"
          {...register('start_date', { required: 'Start date is required' })}
          error={!!errors.start_date}
          helperText={errors.start_date?.message}
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="End Date"
          placeholder="e.g., Present or Dec 2023"
          {...register('end_date', { required: 'End date is required' })}
          error={!!errors.end_date}
          helperText={errors.end_date?.message}
          sx={{ mb: 2 }}
        />
        
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{ mt: 2 }}
        >
          {isSubmitting ? 'Adding...' : 'Add Experience'}
        </Button>
      </Box>
    </motion.div>
  );
}
