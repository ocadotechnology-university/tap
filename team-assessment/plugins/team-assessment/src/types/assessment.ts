export interface SkillAssessment {
  name: string;
  rating: number;
  comments?: string[];
}

export interface FullAssessment {
  id: number;
  assessedUserId: string;
  assessorUserId: string;
  date: string;
  softSkills: SkillAssessment[];
  hardSkills: SkillAssessment[];
  createdBy: string;
  targetUser: string;
  groupId: string;
}
