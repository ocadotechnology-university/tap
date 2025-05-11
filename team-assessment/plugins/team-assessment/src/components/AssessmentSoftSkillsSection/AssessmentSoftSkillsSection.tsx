import React, { useState } from 'react';
import {
  Box,
  Collapse,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { AddCommentToSoftSkillsSectionMenu } from '../AddCommentToSoftSkillsSectionMenu';

const useStyles = makeStyles(theme => ({
  container: {
    background: theme.palette.background.paper,
    padding: theme.spacing(2),
    borderRadius: '0.5rem',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    paddingLeft: theme.spacing(2),
  },
  sectionDescription: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    fontStyle: 'italic',
    color: theme.palette.text.secondary,
  },
  sectionListWrapper: {
    overflowX: 'auto',
    paddingTop: theme.spacing(1),
  },
  sectionList: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(0),
    minWidth: 'fit-content',
  },
}));

interface AssessmentSoftSkillsSectionProps {
  title: string;
  description: string;  // Додаємо пропс для опису
  labels: string[];
}

export const AssessmentSoftSkillsSection = ({
  title,
  description,  // Приймаємо пропс для опису
  labels,
}: AssessmentSoftSkillsSectionProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen(prev => !prev);

  return (
    <Box className={classes.container}>
      <Box className={classes.header} onClick={toggleOpen}>
        <Typography variant="h6">{title}</Typography>
        <IconButton size="small">
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={open}>
        <Typography className={classes.sectionDescription}>
          {description}  {/* Виводимо опис, якщо секція розгорнута */}
        </Typography>
        <Box className={classes.sectionListWrapper}>
          <Box className={classes.sectionList}>
            {labels.map(label => (
              <AddCommentToSoftSkillsSectionMenu key={label} label={label} />
            ))}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};
