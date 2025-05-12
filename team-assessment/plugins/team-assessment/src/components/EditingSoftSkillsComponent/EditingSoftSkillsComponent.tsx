import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { AssessmentSoftSkillsSection } from '../AssessmentSoftSkillsSection';

type Props = {
  configData: Record<string, { area: string, description: string, labels: string[] }[]>;
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  header: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(0, 2),
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
  },
  description: {
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
    lineHeight: 1.5,
  },
  content: {
    padding: '0px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
}));

export const EditingSoftSkillsComponent = ({ configData }: Props) => {
  const classes = useStyles();

  // Collect unique areas
  const uniqueAreas = new Set<string>();
  const allSections = Object.values(configData).flat();

  allSections.forEach(section => {
    if (section.area?.trim()) {
      uniqueAreas.add(section.area.trim());
    }
  });

  // Group sections by area
  const groupedSections = Array.from(uniqueAreas).map(area => ({
    area,
    sections: allSections.filter(section => section.area === area)
  }));

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h1" className={classes.title}>
          Soft Skills Assessment
        </Typography>
        <Typography className={classes.description}>
          Evaluate essential interpersonal skills and behavioral competencies.
          Expand each category to assess specific skills using standardized proficiency levels.
          Select the most appropriate rating for each demonstrated capability.
        </Typography>
      </div>

      <div className={classes.content}>
        {groupedSections.map(({ area, sections }) => (
          <AssessmentSoftSkillsSection
            key={area}
            area={area}
            description=""
            labels={sections.flatMap(s => s.labels)}
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