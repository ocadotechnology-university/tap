import React from 'react';
import { Chip } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

type UserMarkChipProps = {
  mark: string;
  allMarks: string[];
};

const useStyles = makeStyles(theme => ({
  chip: {
    marginLeft: 16,
    fontWeight: 100,
    fontSize: '1rem',
    textTransform: 'uppercase',
    color: '#000',
    minWidth: 100,
    justifyContent: 'center',
    border: '1px solid rgba(0,0,0,0.2)',
    borderRadius: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
}));

export const UserMarkChip: React.FC<UserMarkChipProps> = ({ mark, allMarks }) => {
  const classes = useStyles();

  const getVibrantColorByIndex = (index: number, total: number) => {
    const hue = Math.round(120 * (index / Math.max(total - 1, 1)));
    const saturation = 80;
    const lightness = 75;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const index = allMarks.findIndex(m => m === mark);
  const backgroundColor =
    index !== -1 ? getVibrantColorByIndex(index, allMarks.length) : '#bbb';

  return (
    <Chip
      label={mark}
      size="medium"
      className={classes.chip}
      style={{ backgroundColor }}
    />
  );
};
