import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import ApiService from '../../services/api';

export default function AboutForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      await ApiService.updateProfile(data);
      setSubmitMessage('Profile updated successfully!');
      reset();
    } catch (error) {
      setSubmitMessage('Error updating profile. Please try again.');
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
        Update About Information
      </Typography>
      
      {submitMessage && (
        <Alert severity={submitMessage.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>
          {submitMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Name"
          {...register('name', { required: 'Name is required' })}
          error={!!errors.name}
          helperText={errors.name?.message}
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description"
          {...register('description', { required: 'Description is required' })}
          error={!!errors.description}
          helperText={errors.description?.message}
          sx={{ mb: 2 }}
        />
        
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{ mt: 2 }}
        >
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </Button>
      </Box>
    </motion.div>
  );
}
