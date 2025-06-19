import React from 'react';
import { Box, Typography } from '@mui/material';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

type Props = {
  text?: string;
};

export const NoDataBox: React.FC<Props> = ({ text = 'No data for this user' }) => (
  <Box
    sx={theme => ({
      border: '2px dashed #BDBDBD',
      borderRadius: 3,
      padding: 4,
      margin: '24px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.palette.background.default,
      minHeight: 120,
      color: '#757575',
    })}
  >
    <ErrorOutlineOutlinedIcon sx={{ fontSize: 48, mb: 1, color: '#90caf9' }} />
    <Typography
      variant="h6"
      sx={theme => ({
        fontWeight: 500,
        fontSize: '1.3rem',
        color: theme.palette.text.primary,
      })}
    >
      {text}
    </Typography>
  </Box>
);
