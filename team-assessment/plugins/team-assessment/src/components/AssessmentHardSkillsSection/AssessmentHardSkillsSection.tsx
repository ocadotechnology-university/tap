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
import { Skill } from '../EditingAssessmentComponent/EditingAssessmentComponent';

const useStyles = makeStyles(theme => ({
    container: {
        background: '#4caf50',
        color: '#fff',
        padding: theme.spacing(2),
        borderRadius: theme.spacing(1),
        width: 'calc(33% - 16px)',
        margin: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'box-shadow 0.2s ease',
        '&:hover': {
            boxShadow: theme.shadows[6],
        },
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontWeight: 500,
    },
    description: {
        marginTop: theme.spacing(1),
        fontSize: '0.9rem',
        lineHeight: 1.4,
    },
    answerContainer: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 1.5),
        borderRadius: 20,
        border: '2px solid rgba(255,255,255,0.3)',
        transition: 'all 0.2s ease',
        '&:hover': {
            borderColor: '#fff',
            backgroundColor: 'rgba(255,255,255,0.1)',
        },
    },
    answerText: {
        fontWeight: 500,
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    menuPaper: {
        marginTop: theme.spacing(1),
        borderRadius: 8,
    },
}));

interface Props {
    skill: Skill;
    selectedAnswer: string;
    onAnswerChange: (answer: string) => void;
}

export const AssessmentHardSkillsSection: React.FC<Props> = ({
    skill,
    selectedAnswer,
    onAnswerChange
}) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpen = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleSelect = (label: string) => {
        onAnswerChange(label);
        handleClose();
    };

    return (
        <>
            <Box className={classes.container}>
                <Box className={classes.header}>
                    <Typography className={classes.title}>{skill.title}</Typography>

                    <Box display="flex" alignItems="center">
                        {!selectedAnswer ? (
                            <IconButton
                                size="small"
                                onClick={handleOpen}
                                style={{ color: '#fff' }}
                            >
                                <AddIcon />
                            </IconButton>
                        ) : (
                            <Box
                                className={classes.answerContainer}
                                onClick={handleOpen}
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

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                classes={{ paper: classes.menuPaper }}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                MenuListProps={{
                    style: {
                        padding: 0,
                    },
                }}
            >
                {skill.labels.map(label => (
                    <MenuItem
                        key={label}
                        selected={label === selectedAnswer}
                        onClick={() => handleSelect(label)}
                        style={{
                            minWidth: 120,
                            fontSize: '0.9rem',
                        }}
                    >
                        {label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};