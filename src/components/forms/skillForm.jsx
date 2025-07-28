import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, TextField, Button, Typography, Alert, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import ApiService from '../../services/api';

const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function SkillForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      await ApiService.createSkill(data);
      setSubmitMessage('Skill added successfully!');
      reset();
    } catch (error) {
      setSubmitMessage('Error adding skill. Please try again.');
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
        Add New Skill
      </Typography>
      
      {submitMessage && (
        <Alert severity={submitMessage.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>
          {submitMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Skill Name"
          {...register('name', { required: 'Skill name is required' })}
          error={!!errors.name}
          helperText={errors.name?.message}
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          select
          label="Skill Level"
          {...register('level', { required: 'Skill level is required' })}
          error={!!errors.level}
          helperText={errors.level?.message}
          sx={{ mb: 2 }}
        >
          {skillLevels.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </TextField>
        
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{ mt: 2 }}
        >
          {isSubmitting ? 'Adding...' : 'Add Skill'}
        </Button>
      </Box>
    </motion.div>
  );
}
