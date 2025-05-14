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

/* ---------- styles (taken from your demo) ---------- */
const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    margin: theme.spacing(1, 2),
    width: '100%',
  },
  content: { padding: 0 },

  /* big green label button */
  button: {
    display: 'flex',
    width: '100%',
    padding: theme.spacing(2),
    backgroundColor: '#4CAF50',
    color: '#fff',
    borderRadius: theme.spacing(1),
    textTransform: 'none',
    fontSize: '1rem',
    justifyContent: 'space-between',
    '&:hover': { backgroundColor: '#45A049' },
  },
  labelText: { fontWeight: 'bold', flex: 1, textAlign: 'left' },

  /* round + bubble */
  addBubble: {
    minWidth: 40,
    minHeight: 40,
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': { backgroundColor: '#45A049' },
  },

  /* comment list block */
  listWrapper: {
    marginTop: theme.spacing(1.5),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
  },
  commentRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1.25, 2),
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
  },
  trashBtn: { padding: 4 },
}));

/* ---------- types ---------- */
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

/* ---------- component ---------- */
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

  /* ---------- helpers ---------- */
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

  /* ---------- key handling for drafts ---------- */
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

  /* ---------- UI ---------- */
  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        {/* green button */}
        <Button
          className={classes.button}
          onClick={() => setExpanded(p => !p)}
        >
          <Typography className={classes.labelText}>{label}</Typography>

          {/* + bubble */}
          <Box
            className={classes.addBubble}
            onClick={e => {
              e.stopPropagation();
              if (!expanded) setExpanded(true);
              addDraft();
            }}
          >
            <AddIcon fontSize="large" style={{ color: '#fff' }} />
          </Box>
        </Button>

        {/* list of drafts + saved comments */}
        {expanded && (
          <Box className={classes.listWrapper}>
            {/* saved comments */}
            {comments.map(c => (
              <Box key={c.id} className={classes.commentRow}>
                <Typography style={{ flex: 1, whiteSpace: 'pre-wrap' }}>
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

            {/* open drafts */}
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
