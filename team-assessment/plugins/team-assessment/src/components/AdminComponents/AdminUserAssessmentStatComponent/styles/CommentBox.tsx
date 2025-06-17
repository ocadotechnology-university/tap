import { styled, Box } from '@mui/material';

export const CommentBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
}));
