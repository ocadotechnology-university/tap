import React from 'react';
import { Typography, Divider, Box } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { SkillPaper } from './styles/SkillPaper';
import { CommentBox } from './styles/CommentBox';
import { UserMarkChip } from './UserMarkChip';
import { AverageMarkChip } from './AverageMarkChip';
import PeopleIcon from '@material-ui/icons/People';

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
  paperTitle: {
    fontWeight: 600,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  competencyTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  commentList: {
    paddingLeft: theme.spacing(2),
  },
  commentBox: {
    position: 'relative',
    paddingRight: theme.spacing(20),
    marginBottom: theme.spacing(1.5),
    display: 'flex',
    alignItems: 'center',
    border: '0.5px solid rgba(0,0,0,0.25)',
    borderRadius: 16,
    backgroundColor: theme.palette.action.hover,
    padding: theme.spacing(1.5),
  },
  userCommentWrapper: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: theme.spacing(1),
  },
  username: {
    fontSize: '1rem',
    fontWeight: 700,
    color: theme.palette.text.primary,
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
  },
  commentText: {
    fontSize: '1rem',
    fontWeight: 500,
    color: theme.palette.text.secondary,
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
  },
  chipWrapper: {
    position: 'absolute',
    top: '50%',
    right: theme.spacing(3),
    transform: 'translateY(-50%)',
  },
  emptyState: {
    color: theme.palette.text.disabled,
    fontStyle: 'italic',
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
    fontSize: '1.05rem',
  },
}));

type SoftSkillCommentEntry = {
  user: string;
  comment: string;
  mark: string;
};

type SoftSkillBlock = {
  _areaName: string;
  [competencyId: string]:
    | {
        _competencyName: string;
        entries: SoftSkillCommentEntry[];
      }
    | string;
};

type AssessmentConfig = {
  ['Soft Skills']: {
    area: string;
    title: string;
    description: string;
    labels: string[];
  }[];
  ['Hard Skills']: {
    title: string;
    description: string;
    labels: string[];
  }[];
};

type Props = {
  softSkills: Record<string, SoftSkillBlock>;
  config: AssessmentConfig;
};

export const SoftSkillSection: React.FC<Props> = ({ softSkills, config }) => {
  const classes = useStyles();

  const getSoftSkillLabels = (title: string): string[] => {
    return config['Soft Skills'].find(skill => skill.title === title)?.labels || [];
  };

  return (
    <Box className={classes.container}>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h5" className={classes.sectionTitle}>
        <PeopleIcon style={{ marginRight: 8, verticalAlign: 'middle', fontSize: '2rem' }} />
        Soft Skill Comments
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {Object.entries(softSkills).map(([areaId, competencies]) => {
        const areaName = (competencies as any)._areaName || areaId;

        return (
          <SkillPaper key={areaId} elevation={0}>
            <Typography variant="h6" className={classes.paperTitle}>
              {areaName}
            </Typography>

            {Object.entries(competencies)
              .filter(([key]) => key !== '_areaName')
              .map(([competencyId, block]) => {
                const comp = block as {
                  _competencyName: string;
                  entries: SoftSkillCommentEntry[];
                };

                const hasEntries = comp.entries && comp.entries.length > 0;

                return (
                  <Box key={competencyId} sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle1"
                      className={classes.competencyTitle}
                    >
                      {comp._competencyName}
                    </Typography>

                    {!hasEntries ? (
                      <Typography className={classes.emptyState}>
                        No Data
                      </Typography>
                    ) : (
                      <>
                        <AverageMarkChip
                          marks={comp.entries.map(e => e.mark)}
                          allLabels={getSoftSkillLabels(comp._competencyName)}
                          label="Average grade"
                        />
                        <Box className={classes.commentList}>
                          {comp.entries.map((entry, idx) => (
                            <CommentBox key={idx} className={classes.commentBox}>
                              <Box className={classes.userCommentWrapper}>
                                <Typography className={classes.username}>
                                  {entry.user}:
                                </Typography>
                                <Typography className={classes.commentText}>
                                  "{entry.comment}"
                                </Typography>
                              </Box>
                              <div className={classes.chipWrapper}>
                                <UserMarkChip
                                  mark={entry.mark}
                                  allMarks={getSoftSkillLabels(comp._competencyName)}
                                />
                              </div>
                            </CommentBox>
                          ))}
                        </Box>
                      </>
                    )}
                  </Box>
                );
              })}
          </SkillPaper>
        );
      })}
    </Box>
  );
};
