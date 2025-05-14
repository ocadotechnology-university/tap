import React, { useState, MouseEvent } from 'react';
import {
  Card,
  CardContent,
  Button,
  Box,
  Typography,
  makeStyles,
  CircularProgress,
  IconButton,
  InputBase,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { v4 as uuidv4 } from 'uuid';
import { useApi, fetchApiRef } from '@backstage/core-plugin-api';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: theme.shadows[1],
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
    margin: theme.spacing(1, 0),
    width: '100%',
    border: `1px solid ${theme.palette.divider}`,
  },
  content: { padding: 0, '&:last-child': { paddingBottom: 0 } },
  button: {
    display: 'flex',
    width: '100%',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    borderRadius: 8,
    textTransform: 'none',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelText: { fontWeight: 600, flex: 1, textAlign: 'left' },
  addBubble: {
    minWidth: 40,
    minHeight: 40,
    borderRadius: '50%',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listWrapper: {
    marginTop: theme.spacing(1),
    borderTop: `1px solid ${theme.palette.background.default}`,
  },
  commentRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5, 2),
    '&:not(:last-child)': { borderBottom: `1px solid ${theme.palette.divider}` },
  },
  inputRoot: {
    flex: 1,
    background: theme.palette.background.paper,
    borderRadius: 4,
    padding: theme.spacing(1),
    fontSize: '0.875rem',
    border: `1px solid ${theme.palette.divider}`,
  },
  iconBtn: { padding: 4 },
}));

interface SavedComment {
  id: string;
  commentText: string;
}
interface Draft {
  tmp: string;
  text: string;
}
interface Props {
  label: string;
  assessmentId: number;
  areaId: number;
  competencyId: number;
  marksMap: Record<string, number>;
  initialComments: SavedComment[];
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
  const [saved, setSaved] = useState<SavedComment[]>(initialComments);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [editing, setEditing] = useState<{ id: string; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const markId = marksMap[label];

  const addDraft = () => setDrafts(prev => [...prev, { tmp: uuidv4(), text: '' }]);

  const saveNew = async (d: Draft) => {
    if (!d.text.trim()) return;
    setLoading(true);
    try {
      const r = await fetchApi.fetch('http://localhost:7007/api/team-assessment/upsertSoftSkillComment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId,
          areaId,
          competencyId,
          markId,
          commentText: d.text.trim(),
        }),
      });
      const j = (await r.json()) as { id: string; commentText: string };
      setSaved(prev => [...prev, { id: j.id, commentText: j.commentText }]);
    } finally {
      setDrafts(prev => prev.filter(x => x.tmp !== d.tmp));
      setLoading(false);
    }
  };

  const updateComment = async () => {
    if (!editing || !editing.text.trim()) {
      setEditing(null);
      return;
    }
    setLoading(true);
    try {
      await fetchApi.fetch(`http://localhost:7007/api/team-assessment/comment/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentText: editing.text.trim() }),
      });
      setSaved(prev => prev.map(c => (c.id === editing.id ? { ...c, commentText: editing.text.trim() } : c)));
    } finally {
      setEditing(null);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('tmp-')) {
      setDrafts(prev => prev.filter(d => d.tmp !== id));
      return;
    }
    setLoading(true);
    try {
      await fetchApi.fetch(`http://localhost:7007/api/team-assessment/comment/${id}`, { method: 'DELETE' });
      setSaved(prev => prev.filter(c => c.id !== id));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDraft = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    d: Draft,
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveNew(d);
    }
  };

  const handleKeyEdit = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      updateComment();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setEditing(null);
    }
  };

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Button className={classes.button} onClick={() => setExpanded(p => !p)}>
          <Typography className={classes.labelText}>{label}</Typography>
          <Box className={classes.addBubble} onClick={(e: MouseEvent) => { e.stopPropagation(); if (!expanded) setExpanded(true); addDraft(); }}>
            <AddIcon fontSize="small" />
          </Box>
        </Button>

        {expanded && (
          <Box className={classes.listWrapper}>
            {saved.map(c => (
              <Box key={c.id} className={classes.commentRow}>
                {editing?.id === c.id ? (
                  <InputBase
                    autoFocus
                    multiline
                    fullWidth
                    classes={{ root: classes.inputRoot }}
                    value={editing.text}
                    onChange={e => setEditing({ id: c.id, text: e.target.value })}
                    onKeyDown={handleKeyEdit}
                    disabled={loading}
                  />
                ) : (
                  <>
                    <Typography
                      style={{ flex: 1, whiteSpace: 'pre-wrap' }}
                      onDoubleClick={() => setEditing({ id: c.id, text: c.commentText })}
                    >
                      {c.commentText}
                    </Typography>
                    <IconButton className={classes.iconBtn} onClick={() => setEditing({ id: c.id, text: c.commentText })}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton className={classes.iconBtn} onClick={() => handleDelete(c.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
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
                  onChange={e => setDrafts(prev => prev.map(x => (x.tmp === d.tmp ? { ...x, text: e.target.value } : x)))}
                  onKeyDown={e => handleKeyDraft(e, d)}
                  disabled={loading}
                />
                <IconButton className={classes.iconBtn} onClick={() => handleDelete(d.tmp)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

            {loading && (
              <Box display="flex" justifyContent="center" p={1}>
                <CircularProgress size={18} />
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AddCommentToSoftSkillsSectionMenu;
