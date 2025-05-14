import React, { useState } from 'react';
import { Page, Header, Content } from '@backstage/core-components';
import CheckIcon from '@material-ui/icons/Check';
import ComputerIcon from '@material-ui/icons/Computer';
import PeopleIcon from '@material-ui/icons/People';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import {
  Button,
  Divider,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core';
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
    paddingTop: theme.spacing(1), // Зменшили відступ зверху з 2 до 1
    paddingBottom: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  backButton: {
    position: 'fixed',
    right: theme.spacing(10),  // 8 замість 10 для меншого відступу
    bottom: theme.spacing(7), // 5 замість 7 для меншого відступу
    minWidth: 40,
    minHeight: 40,
    width: 40,
    height: 40,
    borderRadius: '50%',
    padding: 0,
    zIndex: 1000,
    boxShadow: theme.shadows[6],
    color: theme.palette.common.white,
    backgroundColor: theme.palette.error.main, // Червоний колір
    '&:hover': {
      transform: 'scale(1.1)',
      backgroundColor: theme.palette.error.dark, // Темніший червоний
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

export const EditingAssessmentComponent: React.FC<Props> = ({
  assessmentId,
  configData,
  onBackToMain,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [currentStage, setCurrentStage] = useState<'softSkills' | 'hardSkills'>('softSkills');
  const [answers, setAnswers] = useState<Answers>({});

  const handleAnswerChange = (title: string, answer: string) =>
    setAnswers(prev => ({ ...prev, [title]: answer }));

  const handleSubmit = () => {
    console.log('Submitted answers:', answers);
    onBackToMain();
  };

  return (
    <div>
      <Header title="Assessment Editing" style={{ marginTop: theme.spacing(-2) }}/>
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
          <CheckIcon className="check-icon" fontSize="large"/> {}
      </Button>
    </div>
  );
};


 // import React, { useState } from 'react';
// import { Page, Header, Content } from '@backstage/core-components';
// import { makeStyles, Theme } from '@material-ui/core/styles';
// import { Button } from '@material-ui/core';
// import { EditingSoftSkillsComponent } from '../EditingSoftSkillsComponent/EditingSoftSkillsComponent';
// import { EditingHardSkillsComponent } from '../EditingHardSkillsComponent/EditingHardSkillsComponent';

// export type Skill = {
//   area?: string;
//   title: string;
//   description: string;
//   labels: string[];
// };

// type Props = {
//   configData: Record<string, Skill[]>;
//   onBackToMain: () => void;
// };

// type Answers = Record<string, string>;

// const useStyles = makeStyles((theme: Theme) => ({
//   content: {
//     padding: 0,
//     paddingTop: theme.spacing(2),
//     paddingBottom: theme.spacing(10),
//     display: 'flex',
//     flexDirection: 'column',
//     gap: theme.spacing(2),
//   },
//   bottomNav: {
//     position: 'fixed',
//     bottom: theme.spacing(3),
//     right: theme.spacing(84),
//     display: 'flex',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     gap: theme.spacing(1.5),
//     flexWrap: 'wrap',
//     zIndex: 1000,
//   },
//   navButton: {
//     flex: '0 1 auto',
//     minWidth: 96,
//     borderRadius: 20,
//     textTransform: 'none',
//     fontSize: '0.9rem',
//     padding: theme.spacing(1.5, 2.5),
//     transition: 'transform 150ms ease, background-color 150ms ease',
//     '&:hover': {
//       transform: 'scale(1.05)',
//       backgroundColor: theme.palette.action.hover,
//     },
//     '&:active': {
//       transform: 'scale(0.98)',
//     },
//     color: '#fff',
//   },
// }));

// export const EditingAssessmentComponent: React.FC<Props> = ({
//   configData,
//   onBackToMain,
// }) => {
//   const classes = useStyles();
//   const [currentStage, setCurrentStage] = useState<'softSkills' | 'hardSkills'>('softSkills');
//   const [hardSkillsAnswers, setHardSkillsAnswers] = useState<Answers>({});

//   const handleAnswerChange = (skillTitle: string, answer: string) => {
//     setHardSkillsAnswers(prev => ({ ...prev, [skillTitle]: answer }));
//   };

//   return (
//     <Page themeId="tool">
//       <Header title="Assessment Editing" />
//       <Content className={classes.content}>
//         {currentStage === 'softSkills' && (
//           <EditingSoftSkillsComponent configData={configData} />
//         )}
//         {currentStage === 'hardSkills' && (
//           <EditingHardSkillsComponent
//             configData={configData}
//             answers={hardSkillsAnswers}
//             onAnswerChange={handleAnswerChange}
//           />
//         )}
//       </Content>

//       <div className={classes.bottomNav}>
//         {currentStage === 'softSkills' ? (
//           <Button
//             onClick={() => setCurrentStage('hardSkills')}
//             variant="contained"
//             className={classes.navButton}
//             style={{ backgroundColor: '#8dc6ff' }}
//           >
//             Hard Skills
//           </Button>
//         ) : (
//           <Button
//             onClick={() => setCurrentStage('softSkills')}
//             variant="contained"
//             className={classes.navButton}
//             style={{ backgroundColor: '#8dc6ff' }}
//           >
//             Soft Skills
//           </Button>
//         )}

//         <Button
//           onClick={onBackToMain}
//           variant="contained"
//           className={classes.navButton}
//           style={{ backgroundColor: '#ff80bf' }}
//         >
//           Back to Main
//         </Button>

//         <Button
//           onClick={onBackToMain}
//           variant="contained"
//           className={classes.navButton}
//           style={{ backgroundColor: '#4caf50' }}
//         >
//           Submit
//         </Button>
//       </div>
//     </Page>
//   );
// };