import React from 'react';
import { Chip } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { calculateAverageMark } from '../../../utils/ratingUtils';

type AverageMarkChipProps = {
  marks: string[];
  allLabels: string[];
  label?: string; // Наприклад: "Середня оцінка"
};

const useStyles = makeStyles(theme => ({
  chip: {
    marginLeft: 16,
    fontWeight: 500,
    fontSize: '1rem',
    textTransform: 'uppercase',
    color: '#000',
    minWidth: 120,
    justifyContent: 'center',
    border: '1px solid rgba(0,0,0,0.2)',
    borderRadius: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  label: {
    fontWeight: 600,
    fontSize: '1rem',
    marginRight: theme.spacing(1),
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
}));

export const AverageMarkChip: React.FC<AverageMarkChipProps> = ({ marks, allLabels, label }) => {
  const classes = useStyles();

  const averageMark = calculateAverageMark(marks, allLabels);

  // Генерація кольору за індексом оцінки
  const getBackgroundColor = () => {
    const index = allLabels.findIndex(l => l === averageMark);
    if (index === -1) return '#ccc';

    const hue = Math.round(120 * (index / Math.max(allLabels.length - 1, 1)));
    return `hsl(${hue}, 80%, 75%)`;
  };

  return (
    <div className={classes.container}>
      {label && <span className={classes.label}>{label}:</span>}
      <Chip
        label={averageMark}
        className={classes.chip}
        style={{ backgroundColor: getBackgroundColor() }}
      />
    </div>
  );
};
