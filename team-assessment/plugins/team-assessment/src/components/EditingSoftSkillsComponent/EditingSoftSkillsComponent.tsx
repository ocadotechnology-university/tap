import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { AssessmentSoftSkillsSection } from '../AssessmentSoftSkillsSection';

type SoftSkill = {
  area: string;
  title: string;
  description: string;
  labels: string[];
};

type Props = {
  configData: Record<string, SoftSkill[]>;
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  header: {
    marginBottom: theme.spacing(3),
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  description: {
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
    lineHeight: 1.5,
  },
  content: {
    paddingTop: '1rem',
  },
}));

export const EditingSoftSkillsComponent: React.FC<Props> = ({ configData }) => {
  const classes = useStyles();

  const groupedSections = Object.values(configData).reduce(
    (acc, sections) => {
      sections.forEach(section => {
        if (!section.area) {
          return;
        }
        if (!acc[section.area]) {
          acc[section.area] = [];
        }
        acc[section.area].push(section);
      });
      return acc;
    },
    {} as Record<string, SoftSkill[]>,
  );

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h1" className={classes.title}>
          Soft Skills Assessment
        </Typography>
        <Typography className={classes.description}>
          Click on any category to view and assess detailed skills
        </Typography>
      </div>

      <div className={classes.content}>
        {Object.entries(groupedSections).map(([area, sections]) => (
          <AssessmentSoftSkillsSection
            key={area}
            area={area}
            sections={sections}
          />
        ))}
      </div>
    </div>
  );
};


// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import { AssessmentSoftSkillsSection } from '../AssessmentSoftSkillsSection';

// type Props = {
//   configData: Record<string, { title: string, description: string, labels: string[] }[]>;
// };

// const useStyles = makeStyles({
//   content: {
//     padding: '0px',
//     paddingTop: '1rem',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '1rem',
//   },
//   fullWidthButton: {
//     width: '100%',
//     marginTop: '1rem',
//   },
// });

// export const EditingSoftSkillsComponent = ({ configData }: Props) => {
//   const classes = useStyles();

//   return (
//     <div className={classes.content}>
//       {Object.entries(configData).map(([category, sections]) =>
//         sections.map(section => (
//           <AssessmentSoftSkillsSection
//             key={section.title}
//             title={section.title}
//             description={section.description}
//             labels={section.labels}
//           />
//         ))
//       )}
//     </div>
//   );
// };