import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  InputBase,
  Typography,
  makeStyles,
  CircularProgress,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { useApi, fetchApiRef } from '@backstage/core-plugin-api';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: theme.shadows[1],
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
    margin: theme.spacing(1, 0),
    width: '100%',
    border: `1px solid ${theme.palette.divider}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: theme.shadows[4],
      transform: 'translateY(-1px)',
    },
  },
  content: { 
    padding: 0,
    '&:last-child': {
      paddingBottom: 0,
    },
  },

  /* main button */
  button: {
    display: 'flex',
    width: '100%',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    borderRadius: 8,
    textTransform: 'none',
    fontSize: '1rem',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    '&:hover': { 
      backgroundColor: theme.palette.action.hover,
    },
  },
  labelText: { 
    fontWeight: 600, 
    flex: 1, 
    textAlign: 'left',
    fontSize: '1rem',
  },

  /* round add button */
  addBubble: {
    minWidth: 40,
    minHeight: 40,
    borderRadius: '50%',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    boxShadow: theme.shadows[2],
    '&:hover': { 
      backgroundColor: theme.palette.secondary.dark,
      transform: 'scale(1.05)',
      boxShadow: theme.shadows[4],
    },
  },

  /* comment list block */
  listWrapper: {
    marginTop: theme.spacing(1),
    borderTop: `1px solid ${theme.palette.background.default}`,
  },
  commentRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5, 2),
    '&:not(:last-child)': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },
  inputRoot: {
    flex: 1,
    background: theme.palette.background.paper,
    borderRadius: 4,
    padding: theme.spacing(1),
    fontSize: '0.875rem',
    border: `1px solid ${theme.palette.divider}`,
    '&:focus-within': {
      borderColor: theme.palette.primary.main,
    },
  },
  trashBtn: { 
    padding: 4,
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.error.main,
      backgroundColor: 'transparent',
    },
  },
}));

export interface CommentDTO {
  id: number;
  commentText: string;
}
interface Draft { tmp: string; text: string }

interface Props {
  label: string;
  assessmentId: number;
  areaId: number;
  competencyId: number;
  marksMap: Record<string, number>;
  initialComments: CommentDTO[];
}

const AddCommentToSoftSkillsSectionMenu: React.FC<Props> = ({
  label,
  assessmentId,
  areaId,
  competencyId,
  marksMap,
  initialComments,
}) => {
  const classes = useStyles();
  const fetchApi = useApi(fetchApiRef);

  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<CommentDTO[]>(initialComments);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(false);

  const markId = marksMap[label];

  const addDraft = () =>
    setDrafts(prev => [...prev, { tmp: crypto.randomUUID(), text: '' }]);

  const saveComment = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const resp = await fetchApi.fetch(
        'http://localhost:7007/api/team-assessment/upsertSoftSkillComment',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assessmentId,
            areaId,
            competencyId,
            markId,
            commentText: text.trim(),
          }),
        },
      );
      const data = (await resp.json()) as { id: string; commentText: string };
      setComments(prev => [...prev, { id: Number(data.id), commentText: data.commentText }]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (id: number) => {
    setLoading(true);
    try {
      await fetchApi.fetch(
        `http://localhost:7007/api/team-assessment/comment/${id}`,
        { method: 'DELETE' },
      );
      setComments(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    d: Draft,
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveComment(d.text);
      setDrafts(prev => prev.filter(x => x.tmp !== d.tmp));
    }
  };

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Button
          className={classes.button}
          onClick={() => setExpanded(p => !p)}
        >
          <Typography className={classes.labelText}>{label}</Typography>

          <Box
            className={classes.addBubble}
            onClick={e => {
              e.stopPropagation();
              if (!expanded) setExpanded(true);
              addDraft();
            }}
          >
            <AddIcon fontSize="medium" />
          </Box>
        </Button>

        {expanded && (
          <Box className={classes.listWrapper}>
            {comments.map(c => (
              <Box key={c.id} className={classes.commentRow}>
                <Typography style={{ flex: 1, whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                  {c.commentText}
                </Typography>
                <IconButton
                  size="small"
                  className={classes.trashBtn}
                  onClick={() => deleteComment(c.id)}
                >
                  {loading ? (
                    <CircularProgress size={16} />
                  ) : (
                    <DeleteIcon fontSize="small" />
                  )}
                </IconButton>
              </Box>
            ))}

            {drafts.map(d => (
              <Box key={d.tmp} className={classes.commentRow}>
                <InputBase
                  autoFocus
                  multiline
                  fullWidth
                  classes={{ root: classes.inputRoot }}
                  placeholder="Enter comment and press Enter"
                  value={d.text}
                  onChange={e =>
                    setDrafts(prev =>
                      prev.map(x => (x.tmp === d.tmp ? { ...x, text: e.target.value } : x)),
                    )
                  }
                  onKeyDown={e => handleKey(e, d)}
                  disabled={loading}
                />
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AddCommentToSoftSkillsSectionMenu;