import React from 'react';
import { Progress } from '@backstage/core-components';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getAllAssessmentsAdmin } from '../../hooks/getAllAssessmentsAdmin';
import { formatAssessments } from './formatAssessments';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.background.paper,
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    borderRadius: 10,
    boxShadow: theme.shadows[1],
    border: `1px solid ${theme.palette.divider}`,
    width: '100%',
    maxWidth: '100%',
  },
  title: {
    fontSize: '1.1rem',
    marginBottom: theme.spacing(1),
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  table: {
    minWidth: 650,
    borderCollapse: 'separate',
    borderSpacing: '0 8px',
  },
  cell: {
    backgroundColor: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  errorState: {
    color: theme.palette.error.main,
    padding: theme.spacing(2),
  },
  emptyState: {
    color: theme.palette.text.secondary,
    padding: theme.spacing(2),
  },
}));

export const AdminAssessmentTable: React.FC = () => {
  const classes = useStyles();
  const { loading, error, value } = getAllAssessmentsAdmin();

  if (loading) return <Progress />;
  if (error) return <Box className={classes.errorState}>Error: {error.message}</Box>;
  if (!value || value.assessedUsers.length === 0)
    return <Box className={classes.emptyState}>No assessments found</Box>;

  const formatted = formatAssessments(value.assessedUsers);

  return (
    <Box className={classes.container}>
      <Typography className={classes.title}>All Assessments</Typography>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.cell}>Target User</TableCell>
            <TableCell className={classes.cell}>Created By</TableCell>
            <TableCell className={classes.cell}>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {formatted.map((a, index) => (
            <TableRow key={index}>
              <TableCell className={classes.cell}>{a.targetUser}</TableCell>
              <TableCell className={classes.cell}>{a.createdBy}</TableCell>
              <TableCell className={classes.cell}>{a.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
