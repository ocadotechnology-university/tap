import React, { useState, MouseEvent } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useApi, fetchApiRef } from '@backstage/core-plugin-api';
import {
    SectionMap,
    MarkMap,
} from '../EditingHardSkillsComponent/EditingHardSkillsComponent';
import { Skill } from '../EditingAssessmentComponent/EditingAssessmentComponent';

const useStyles = makeStyles(theme => ({
    container: {
        background: theme.palette.background.paper,
        padding: theme.spacing(2),
        borderRadius: 8,
        width: 'calc(33% - 16px)',
        margin: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 160,
        boxShadow: theme.shadows[1],
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s ease',
        '&:hover': {
            boxShadow: theme.shadows[4],
            transform: 'translateY(-1px)',
        },
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(1),
    },
    title: {
        fontWeight: 600,
        fontSize: '1.2rem',
        color: theme.palette.text.primary,
    },
    description: {
        fontSize: '0.9rem',
        color: theme.palette.text.secondary,
        lineHeight: 1.5,
        marginBottom: 'auto',
        marginTop: theme.spacing(1),
    },
    answerContainer: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: theme.spacing(1, 3),
        borderRadius: 20,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.common.white,
        transition: 'all 0.3s ease',
        boxShadow: theme.shadows[2],
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.action.selected,
            boxShadow: theme.shadows[4],
            transform: 'scale(1.02)',
        },
    },
    answerText: {
        fontWeight: 500,
        cursor: 'pointer',
        fontSize: '0.875rem',
    },
    addButton: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.common.white,
        width: 40,
        height: 40,
        '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
            transform: 'scale(1.02)',
        },
        transition: 'all 0.3s ease',
    },
    menuItem: {
        minWidth: 160,
        fontSize: '0.875rem',
        '&.Mui-selected': {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.primary.dark,
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}));

interface Props {
    assessmentId: number;
    skill: Skill;
    selectedAnswer: string;
    onAnswerChange: (answer: string) => void;
    sectionMap: SectionMap;
    markMap: MarkMap;
    /** true — read only */
    readOnly?: boolean;
}

export const AssessmentHardSkillsSection: React.FC<Props> = ({
    assessmentId,
    skill,
    selectedAnswer,
    onAnswerChange,
    sectionMap,
    markMap,
    readOnly = false,
}) => {
    const classes = useStyles();
    const fetchApi = useApi(fetchApiRef);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpen = (e: MouseEvent<HTMLElement>) =>
        !readOnly && setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleSelect = async (label: string) => {
        onAnswerChange(label);
        handleClose();

        const questionId = sectionMap[skill.title];
        const markId = markMap[label];

        if (questionId == null || markId == null) {
            console.error('Unknown mapping', skill.title, label);
            return;
        }

        await fetchApi.fetch(
            'http://localhost:7007/api/team-assessment/setHardSkillMark',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assessmentId, questionId, markId }),
            },
        );
    };

    return (
        <>
            <Box className={classes.container}>
                <Box className={classes.header}>
                    <Typography className={classes.title}>{skill.title}</Typography>

                    <Box display="flex" alignItems="center">
                        {!selectedAnswer ? (
                            !readOnly && (
                                <IconButton
                                    size="small"
                                    onClick={handleOpen}
                                    className={classes.addButton}
                                >
                                    <AddIcon fontSize="medium" />
                                </IconButton>
                            )
                        ) : (
                            <Box
                                className={classes.answerContainer}
                                onClick={handleOpen}
                                style={readOnly ? { cursor: 'default' } : undefined}
                            >
                                <Typography className={classes.answerText}>
                                    {selectedAnswer}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>

                <Typography className={classes.description}>
                    {skill.description}
                </Typography>
            </Box>

            {!readOnly && (
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                    getContentAnchorEl={null}
                >
                    {skill.labels.map(label => (
                        <MenuItem
                            key={label}
                            selected={label === selectedAnswer}
                            onClick={() => handleSelect(label)}
                            className={classes.menuItem}
                        >
                            {label}
                        </MenuItem>
                    ))}
                </Menu>
            )}
        </>
    );
};
