import React from 'react';
import { Typography, Divider, Box } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { SkillPaper } from './styles/SkillPaper';
import { HardSkillItem } from './styles/HardSkillItem';
import { UserMarkChip } from './UserMarkChip';
import { AverageMarkChip } from './AverageMarkChip';
import ComputerIcon from '@material-ui/icons/Computer';

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: theme.spacing(4),
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(5),
    marginTop: theme.spacing(5),
  },
  questionTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: theme.spacing(1.5),
  },
  username: {
    fontSize: '1rem',
    fontWeight: 700,
    color: theme.palette.text.primary,
    marginLeft: theme.spacing(1),
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',           // Вирівнювання по вертикалі
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',                 // 💡 Це ключовий момент
  },
  alternatingBackground: {
    backgroundColor: theme.palette.action.hover,
    border: '0.5px solid rgba(0,0,0,0.25)',
    borderRadius: 16,
  },
}));

type HardSkillEntry = {
  user: string;
  mark: string;
  _questionText?: string;
};

type AssessmentConfig = {
  ['Soft Skills']: any[];
  ['Hard Skills']: {
    title: string;
    description: string;
    labels: string[];
  }[];
};

type Props = {
  hardSkills: Record<string, HardSkillEntry[]>;
  config: AssessmentConfig;
};

export const HardSkillSection: React.FC<Props> = ({ hardSkills, config }) => {
  const classes = useStyles();

  const getHardSkillLabels = (title: string): string[] => {
    return config['Hard Skills'].find(skill => skill.title === title)?.labels || [];
  };

  return (
    <Box className={classes.container}>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h5" className={classes.sectionTitle}>
        <ComputerIcon style={{ marginRight: 8, verticalAlign: 'middle', fontSize: '2rem'}} />
        Hard Skill Marks
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {Object.entries(hardSkills).map(([questionId, marks]) => {
        const questionText = marks[0]?._questionText || questionId;

        return (
          <SkillPaper key={questionId} elevation={0}>
            <Typography variant="subtitle1" className={classes.questionTitle}>
              {questionText}
            </Typography>

            <AverageMarkChip
              marks={marks.map(m => m.mark)}
              allLabels={getHardSkillLabels(questionText)}
              label="Average grade"
            />
            {marks.map((mark, idx) => (
              <HardSkillItem
                key={idx}
                className={idx % 2 === 0 ? classes.alternatingBackground : ''}
              >
                <div className={classes.itemRow}>
                  <Typography variant="body2" className={classes.username}>
                    {mark.user}
                  </Typography>
                  <UserMarkChip
                    mark={mark.mark}
                    allMarks={getHardSkillLabels(questionText)}
                  />
                </div>
              </HardSkillItem>
            ))}
          </SkillPaper>
        );
      })}
    </Box>
  );
};
