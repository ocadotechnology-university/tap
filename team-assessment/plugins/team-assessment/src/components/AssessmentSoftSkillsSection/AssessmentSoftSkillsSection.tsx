import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { AddCommentToSoftSkillsSectionMenu } from '../AddCommentToSoftSkillsSectionMenu';

const useStyles = makeStyles(theme => ({
  container: {
    background: theme.palette.background.paper,
    padding: theme.spacing(2),
    borderRadius: 8,
    width: '100%',
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    cursor: 'pointer',
    '&:hover': { boxShadow: theme.shadows[3] },
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  dialogContent: { padding: theme.spacing(3), minWidth: 500 },
  skillItem: {
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.grey[700]}`,
    borderRadius: 4,
    marginBottom: theme.spacing(3),
  },
  labelContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
}));

export interface SoftSkillSection {
  title: string;
  description: string;
  labels: string[];
  areaId: number;
  competencyId: number;
}

interface CommentDTO {
  id: number;
  commentText: string;
  areaId: number;
  competencyId: number;
  markId: number;
}

interface Props {
  area: string;
  sections: SoftSkillSection[];
  assessmentId: number;
  marksMap: Record<string, number>;
  comments: CommentDTO[];
  readOnly?: boolean;
  onCommentChange: (action: 'add' | 'update' | 'delete', c: CommentDTO) => void;
}

export const AssessmentSoftSkillsSection: React.FC<Props> = ({
  area,
  sections,
  assessmentId,
  marksMap,
  comments,
  readOnly = false,
  onCommentChange,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const filterComments = (a: number, c: number, m: number) =>
    comments.filter(x => x.areaId === a && x.competencyId === c && x.markId === m);

  return (
    <>
      <Box className={classes.container} onClick={() => setOpen(true)}>
        <Box className={classes.header}>
          <Typography variant="h6">{area}</Typography>
        </Box>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{area} Skills</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {sections.map(sec => (
            <Box key={sec.title} className={classes.skillItem}>
              <Typography variant="subtitle1" gutterBottom>
                {sec.title}
              </Typography>
              {sec.description && (
                <Typography variant="body2" color="textSecondary">
                  {sec.description}
                </Typography>
              )}

              <Box className={classes.labelContainer}>
                {sec.labels.map(label => {
                  const markId = marksMap[label];
                  const list = markId
                    ? filterComments(sec.areaId, sec.competencyId, markId)
                    : [];
                  return (
                    <AddCommentToSoftSkillsSectionMenu
                      key={`${sec.title}-${label}`}
                      label={label}
                      assessmentId={assessmentId}
                      areaId={sec.areaId}
                      competencyId={sec.competencyId}
                      marksMap={marksMap}
                      initialComments={list.map(c => ({
                        id: c.id.toString(),
                        commentText: c.commentText,
                      }))}
                      readOnly={readOnly}
                      onCommentChange={onCommentChange}
                    />
                  );
                })}
              </Box>
            </Box>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
};
