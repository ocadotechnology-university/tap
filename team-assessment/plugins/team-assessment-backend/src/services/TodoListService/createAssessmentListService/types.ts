import {
  BackstageCredentials,
  BackstageUserPrincipal,
} from '@backstage/backend-plugin-api';
export interface Assessment {
  id: number;
  date: Date;
  createdBy: string;
  targetUser: string;
  groupId: string;
}
export interface SoftSkillCommentStat {
  user: string;
  comment: string;
  mark: string;
}

export interface HardSkillMarkStat {
  user: string;
  mark: string;
}

export interface AssessmentStat {
  softSkills: Record<string, Record<string, SoftSkillCommentStat[]>>;
  hardSkills: Record<string, HardSkillMarkStat[]>;
}

export interface HardSkill {
  assessmentId: number;
  questionId: number;
  markId: number;
}

export interface AssessmentData {
  id: number;
  createdBy: string;
  targetUser: string;
  date: Date;
  groupId: string;
  softSkills: SoftSkillCommentStat[];
  hardSkills: HardSkillStat[];
}

export interface SoftSkillCommentStat {
  areaId: number;
  competencyId: number;
  markId: number;
  commentText: string;
}

export interface HardSkillStat {
  sectionId: number;
  questionId: number;
  markId: number;
}

export interface TeamAssessmentListService {
  getUserAssessmentStat(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
    userId: string
  ): Promise<{
    softSkills: Record<string, Record<string, {
      user: string;
      comment: string;
      mark: string;
    }[]>>;
    hardSkills: Record<string, {
      user: string;
      mark: string;
    }[]>;
  }>;
}

export interface HardSkill {
  assessmentId: number;
  questionId: number;
  markId: number;
}

export interface SectionRow {
  id: number;
  text: string;
}

export interface MarkRow {
  id: number;
  text: string;
}

export interface Competency {
  areaId: number;
  competencyId: number;
  text: string;
}

export interface TeamAssessmentListService {
  createAssessment(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
    targetUser: string,
    groupId: string,
  ): Promise<Assessment>;

  upsertHardSkill(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
    assessmentId: number,
    questionId: number,
    markId: number,
  ): Promise<HardSkill>;

  getHardSkillSections(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
  ): Promise<SectionRow[]>;

  getHardSkillMarks(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
  ): Promise<MarkRow[]>;

  getHardSkillMarksByAssessment(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
    assessmentId: number,
  ): Promise<Array<{ questionId: number; markId: number }>>;

  getSoftSkillAreas(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
  ): Promise<SectionRow[]>;

  getSoftSkillMarks(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
  ): Promise<MarkRow[]>;

  getSoftSkillCompetencies(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
  ): Promise<Competency[]>;

  upsertSoftSkillComment(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
    assessmentId: number,
    areaId: number,
    competencyId: number,
    markId: number,
    commentId: number | null,
    commentText: string,
  ): Promise<{ id: string; commentText: string; key: number }>;

  getSoftSkillComment(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
    assessmentId: number,
    areaId: number,
    competencyId: number,
    markId: number,
  ): Promise<{ id: string; commentText: string } | null>;

  getSoftSkillComments(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
    assessmentId: number,
  ): Promise<
    {
      id: number;
      commentText: string;
      areaId: number;
      competencyId: number;
      markId: number;
    }[]
  >;

  getUserAssessmentStat(
  options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
  userId: string
): Promise<{
  softSkills: Record<string, Record<string, {
    user: string;
    comment: string;
    mark: string;
  }[]>>;
  hardSkills: Record<string, {
    user: string;
    mark: string;
  }[]>;
}>;

  getAssessments(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
    teamId: string,
  ): Promise<{ targetUser: string; id: number }[]>;

  getSampleText(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
  ): Promise<{ message: string }>;
}
