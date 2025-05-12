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

export interface TeamAssessmentListService {
  createAssessment(
    options: {
      credentials: BackstageCredentials<BackstageUserPrincipal>;
    },
    targetUser: string,
    groupId: string
  ): Promise<Assessment>;

  upsertHardSkill(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
    assessmentId: number,
    questionId: number,
    markId: number,
  ): Promise<HardSkill>;

  getAssessments(options: {
    credentials: BackstageCredentials<BackstageUserPrincipal>;
  }, teamId: string): Promise<string[]>;

  getSampleText(options: {
    credentials: BackstageCredentials<BackstageUserPrincipal>;
  }): Promise<{ message: string }>;

  addComment(
    options: {
      credentials: BackstageCredentials<BackstageUserPrincipal>;
    },
    key: number,
    markId: number,
    commentText: string
  ): Promise<{ id: string; commentText: string }>;
}

export interface Comment {
  id: string;
  text: string;
}

export interface SectionSubmission {
  section: string;
  comments: Comment[];
}
