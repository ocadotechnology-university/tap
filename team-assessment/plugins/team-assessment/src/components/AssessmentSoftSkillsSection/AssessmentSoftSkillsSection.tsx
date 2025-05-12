import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { AddCommentToSoftSkillsSectionMenu } from '../AddCommentToSoftSkillsSectionMenu';

const useStyles = makeStyles(theme => ({
  container: {
    background: theme.palette.background.paper,
    padding: theme.spacing(2),
    borderRadius: '0.5rem',
    width: '100%',
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
    transition: '0.3s',
    '&:hover': {
      boxShadow: theme.shadows[3],
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dialogContent: {
    padding: theme.spacing(3),
    minWidth: '500px',
  },
  skillItem: {
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '4px',
    marginBottom: theme.spacing(2),
  },
  labelContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    marginTop: theme.spacing(2),
  },
}));

interface AssessmentSoftSkillsSectionProps {
  area: string;
  sections: Array<{
    title: string;
    description: string;
    labels: string[];
  }>;
}

export const AssessmentSoftSkillsSection = ({
  area,
  sections,
}: AssessmentSoftSkillsSectionProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box className={classes.container} onClick={() => setOpen(true)}>
        <Box className={classes.header}>
          <Typography variant="h6">{area}</Typography>
          <IconButton size="small">
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{area} Skills</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {sections.map((section) => (
            <Box key={section.title} className={classes.skillItem}>
              <Typography variant="subtitle1" gutterBottom>
                {section.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {section.description}
              </Typography>
              <Box className={classes.labelContainer}>
                {section.labels.map((label) => (
                  <AddCommentToSoftSkillsSectionMenu
                    key={label}
                    label={label}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
};







// import React, { useState } from 'react';
// import {
//   Box,
//   Collapse,
//   IconButton,
//   Typography,
//   makeStyles,
// } from '@material-ui/core';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import ExpandLessIcon from '@material-ui/icons/ExpandLess';
// import { AddCommentToSoftSkillsSectionMenu } from '../AddCommentToSoftSkillsSectionMenu';

// const useStyles = makeStyles(theme => ({
//   container: {
//     background: theme.palette.background.paper,
//     padding: theme.spacing(2),
//     borderRadius: '0.5rem',
//     width: '100%',
//   },
//   header: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     cursor: 'pointer',
//     paddingLeft: theme.spacing(2),
//   },
//   sectionDescription: {
//     paddingTop: theme.spacing(1),
//     paddingLeft: theme.spacing(2),
//     fontStyle: 'italic',
//     color: theme.palette.text.secondary,
//   },
//   sectionListWrapper: {
//     overflowX: 'auto',
//     paddingTop: theme.spacing(1),
//   },
//   sectionList: {
//     display: 'flex',
//     flexDirection: 'row',
//     gap: theme.spacing(0),
//     minWidth: 'fit-content',
//   },
// }));

// interface AssessmentSoftSkillsSectionProps {
//   title: string;
//   description: string;  // Додаємо пропс для опису
//   labels: string[];
// }

// export const AssessmentSoftSkillsSection = ({
//   title,
//   description,  // Приймаємо пропс для опису
//   labels,
// }: AssessmentSoftSkillsSectionProps) => {
//   const classes = useStyles();
//   const [open, setOpen] = useState(false);

//   const toggleOpen = () => setOpen(prev => !prev);

//   return (
//     <Box className={classes.container}>
//       <Box className={classes.header} onClick={toggleOpen}>
//         <Typography variant="h6">{title}</Typography>
//         <IconButton size="small">
//           {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//         </IconButton>
//       </Box>

//       <Collapse in={open}>
//         <Typography className={classes.sectionDescription}>
//           {description}  {/* Виводимо опис, якщо секція розгорнута */}
//         </Typography>
//         <Box className={classes.sectionListWrapper}>
//           <Box className={classes.sectionList}>
//             {labels.map(label => (
//               <AddCommentToSoftSkillsSectionMenu key={label} label={label} />
//             ))}
//           </Box>
//         </Box>
//       </Collapse>
//     </Box>
//   );
// };