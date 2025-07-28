import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import AboutForm from '../components/forms/AboutForm';
import ExperienceForm from '../components/forms/ExperienceForm';
import SkillForm from '../components/forms/SkillForm';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Admin() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6 }}
    >
      <Typography variant="h3" gutterBottom align="center">
        Portfolio Admin
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Update About" />
          <Tab label="Add Experience" />
          <Tab label="Add Skill" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <AboutForm />
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <ExperienceForm />
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <SkillForm />
      </TabPanel>
    </motion.section>
  );
}
