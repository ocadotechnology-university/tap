import React from 'react';
import { Box, Typography, LinearProgress, linearProgressClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getProgressColor } from '../../../utils/ratingUtils';

type Props = { percent: number };

const ColoredLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== 'barcolor',
})<{ barcolor: string }>(({ barcolor }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: '#e0e0e0',
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: barcolor,
    transition: 'background 0.3s',
    borderRadius: 5,
  },
}));

export const SoftSkillProgressBar: React.FC<Props> = ({ percent }) => (
  <Box sx={{ mb: 3, width: '100%' }}>
    <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
      Soft Skills Level
    </Typography>
    <ColoredLinearProgress
      variant="determinate"
      value={percent}
      barcolor={getProgressColor(percent)}
      sx={{ mb: 2 }}
    />
    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
      {percent.toFixed(1)}%
    </Typography>
  </Box>
);
