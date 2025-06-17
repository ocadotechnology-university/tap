export interface RawAssessment {
  targetUser: string;
  createdBy: string;
  date: string;
}

export interface FormattedAssessment {
  targetUser: string;
  createdBy: string;
  date: string;
}

export const formatAssessments = (assessments: RawAssessment[]): FormattedAssessment[] => {
  return assessments.map(a => {
    const createdBy = a.createdBy.split('/').pop() ?? a.createdBy;
    const dateObj = new Date(a.date);
    const formattedDate = dateObj.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return {
      targetUser: a.targetUser,
      createdBy,
      date: formattedDate,
    };
  });
};
