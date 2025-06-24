import React, { useState, KeyboardEvent } from 'react';
import { Box, Typography, TextField, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GavelIcon from '@material-ui/icons/Gavel';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.action.hover,
    padding: theme.spacing(2),
    borderRadius: 12,
    marginBottom: theme.spacing(2),
    borderLeft: '4px solid',
    borderLeftColor: '#66bb6a',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: theme.spacing(1.5),
  },
  icon: {
    marginRight: theme.spacing(1),
    color: '#66bb6a',
    fontSize: '1.6rem',
  },
  textField: {
    width: '100%',
    marginTop: theme.spacing(1),
    backgroundColor: theme.palette.action.hover,
    '& .MuiInputBase-root': {
      backgroundColor: '#3a3a3a',
      color: '#ffffff',
      borderRadius: theme.shape.borderRadius,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255,255,255,0.2)',
      borderRadius: theme.shape.borderRadius,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255,255,255,0.4)',
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onSave: () => Promise<any>;
  disabled?: boolean;
  placeholder?: string;
  minRows?: number;
};

export const FinalDecisionBox: React.FC<Props> = ({
  label,
  value,
  onChange,
  onSave,
  disabled,
  placeholder = 'Type your decision…',
  minRows = 3,
}) => {
  const classes = useStyles();
  const [snack, setSnack] = useState<{ open: boolean; msg: string; ok: boolean }>({
    open: false,
    msg: '',
    ok: true,
  });

  const handleSave = async () => {
    try {
      await onSave();
      setSnack({ open: true, msg: 'Saved ✔︎', ok: true });
    } catch (e: any) {
      setSnack({ open: true, msg: e?.message || 'Error', ok: false });
    }
  };

  const keyHandler = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Box className={classes.root}>
      <Typography variant="subtitle1" className={classes.label}>
        <GavelIcon className={classes.icon} />
        {label}
      </Typography>
      <TextField
        multiline
        minRows={minRows}
        variant="outlined"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        fullWidth
        className={classes.textField}
        InputProps={{
          onKeyDown: keyHandler,
        }}
      />
      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack({ ...snack, open: false })}
        message={snack.msg}
        ContentProps={{ style: { background: snack.ok ? '#2e7d32' : '#c62828' } }}
      />
    </Box>
  );
};
