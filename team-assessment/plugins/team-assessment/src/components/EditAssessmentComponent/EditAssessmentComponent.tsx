import React, { useState, useEffect, useCallback } from 'react';
import { Header, Content } from '@backstage/core-components';
import CheckIcon from '@material-ui/icons/Check';
import ComputerIcon from '@material-ui/icons/Computer';
import PeopleIcon from '@material-ui/icons/People';
import CloseIcon from '@material-ui/icons/Close';
import {
    Button,
    makeStyles,
    Theme,
    useTheme,
} from '@material-ui/core';
import { useApi, fetchApiRef } from '@backstage/core-plugin-api';
import { EditingSoftSkillsComponent } from '../EditingSoftSkillsComponent/EditingSoftSkillsComponent';
import { EditingHardSkillsComponent } from '../EditingHardSkillsComponent/EditingHardSkillsComponent';

export type Skill = {
    id?: number;
    area?: string;
    title: string;
    description: string;
    labels: string[];
};

type Props = {
    assessmentId: number;
    configData: Record<string, Skill[]>;
    onBackToMain: () => void;
};

type Answers = Record<string, string>;

const useStyles = makeStyles((theme: Theme) => ({
    content: {
        flex: 1,
        padding: 0,
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(10),
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
    },
    backButton: {
        position: 'fixed',
        right: theme.spacing(10),
        bottom: theme.spacing(7),
        minWidth: 40,
        minHeight: 40,
        width: 40,
        height: 40,
        borderRadius: '50%',
        padding: 0,
        zIndex: 1000,
        boxShadow: theme.shadows[6],
        color: theme.palette.common.white,
        backgroundColor: theme.palette.error.main,
        '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: theme.palette.error.dark,
            boxShadow: theme.shadows[8],
        },
        '&:active': {
            transform: 'scale(0.95)',
        },
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButton: {
        position: 'fixed',
        right: theme.spacing(3),
        bottom: theme.spacing(3),
        minWidth: 60,
        minHeight: 60,
        width: 60,
        height: 60,
        borderRadius: '50%',
        padding: 0,
        zIndex: 1000,
        boxShadow: theme.shadows[6],
        color: theme.palette.common.white,
        backgroundColor: '#4CAF50',
        '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: '#388E3C',
            boxShadow: theme.shadows[8],
        },
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hardSkillsButton: {
        position: 'fixed',
        left: theme.spacing(30),
        bottom: theme.spacing(3),
        width: 60,
        height: 60,
        minWidth: 60,
        minHeight: 60,
        borderRadius: '50%',
        padding: 0,
        zIndex: 3000,
        boxShadow: theme.shadows[6],
        color: theme.palette.common.white,
        backgroundColor: '#2196F3',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: '#1976D2',
            boxShadow: theme.shadows[8],
        },
        transition: 'all 0.3s ease',
    },
}));

export const EditAssessmentComponent: React.FC<Props> = ({
    assessmentId,
    configData,
    onBackToMain,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const fetchApi = useApi(fetchApiRef);

    const [currentStage, setCurrentStage] =
        useState<'softSkills' | 'hardSkills'>('softSkills');

    const [answers, setAnswers] = useState<Answers>({});
    const [hardMarks, setHardMarks] = useState<
        Array<{ questionId: number; markId: number }>
    >([]);

    useEffect(() => {
        fetchApi
            .fetch(`http://localhost:7007/api/team-assessment/hardSkillMarksByAssessment?assessmentId=${assessmentId}`)
            .then(res => res.json())
            .then(
                (data: Array<{ questionId: number; markId: number }>) =>
                    setHardMarks(data),
            )
            .catch(console.error);
    }, [assessmentId, fetchApi]);

    /* ── STABLE onAnswerChange ── */
    const handleAnswerChange = useCallback(
        (title: string, answer: string) =>
            setAnswers(prev => ({ ...prev, [title]: answer })),
        [],
    );

    return (
        <div>
            <Header title="Assessment Editing" style={{ marginTop: theme.spacing(-2) }} />

            <Content className={classes.content}>
                {currentStage === 'softSkills' ? (
                    <EditingSoftSkillsComponent
                        assessmentId={assessmentId}
                        configData={configData}
                    />
                ) : (
                    <EditingHardSkillsComponent
                        assessmentId={assessmentId}
                        configData={configData}
                        answers={answers}
                        onAnswerChange={handleAnswerChange}
                        initialMarks={hardMarks}
                    />
                )}
            </Content>

            {currentStage === 'softSkills' ? (
                <Button
                    onClick={() => setCurrentStage('hardSkills')}
                    variant="contained"
                    className={classes.hardSkillsButton}
                    style={{ backgroundColor: '#8dc6ff' }}
                >
                    <ComputerIcon fontSize="large" />
                </Button>
            ) : (
                <Button
                    onClick={() => setCurrentStage('softSkills')}
                    variant="contained"
                    className={classes.hardSkillsButton}
                    style={{ backgroundColor: '#8dc6ff' }}
                >
                    <PeopleIcon fontSize="large" />
                </Button>
            )}

            <Button
                onClick={onBackToMain}
                variant="contained"
                className={classes.backButton}
                disableElevation
            >
                <CloseIcon style={{ fontSize: '2rem' }} />
            </Button>

            <Button
                onClick={onBackToMain}
                variant="contained"
                className={classes.submitButton}
                style={{ backgroundColor: '#4caf50' }}
            >
                <CheckIcon fontSize="large" />
            </Button>
        </div>
    );
};
