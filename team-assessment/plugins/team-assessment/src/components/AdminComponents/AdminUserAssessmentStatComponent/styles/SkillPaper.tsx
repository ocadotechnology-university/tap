import { styled, Paper } from '@mui/material';

export const SkillPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  borderLeft: '4px solid',
  borderLeftColor: theme.palette.primary.main,

  // 🔹 Щоб не зжимався і займав всю ширину контейнера
  width: '100%',
  boxSizing: 'border-box',
}));