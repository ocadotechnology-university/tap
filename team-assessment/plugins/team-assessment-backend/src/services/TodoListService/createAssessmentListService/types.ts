// plugins/team-assessment-backend/src/services/TodoListService/createAssessmentListService/types.ts

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

  getAssessments(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
    teamId: string,
  ): Promise<string[]>;

  getSampleText(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
  ): Promise<{ message: string }>;

  getSoftSkillComments(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
    assessmentId: number,
  ): Promise<{
    id: number;
    commentText: string;
    areaId: number;
    competencyId: number;
    markId: number;
  }[]>;

}
