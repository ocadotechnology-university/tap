import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import QuestionItem from './QuestionItem';

const useStyles = makeStyles(theme => ({
    tabContainer: {
        backgroundColor: '#333',
        padding: theme.spacing(2),
        borderRadius: theme.spacing(0.5),
    },
}));

// 8 вопросов → на md и выше по 4 в ряд → получится 2 ряда
const questionsData = [
    'JavaScript',
    'Algorithms',
    'System Design',
    'Code Quality',
    'Debugging',
    'Testing',
    'Architecture',
    'Security',
];

const HardSkillsTab = () => {
    const classes = useStyles();

    return (
        <div className={classes.tabContainer}>
            <Grid container spacing={2}>
                {questionsData.map((q, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <QuestionItem question={q} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default HardSkillsTab;
