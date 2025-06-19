import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

type Props = {
  percentage: number;
};

export const OverallProgressBar: React.FC<Props> = ({ percentage }) => {
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Overall Skill Level
      </Typography>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#3f51b5', // або інший колір
          },
        }}
      />
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        {percentage.toFixed(1)}%
      </Typography>
    </Box>
  );
};
