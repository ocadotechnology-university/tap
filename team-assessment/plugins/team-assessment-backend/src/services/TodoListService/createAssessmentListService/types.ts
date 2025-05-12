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

export interface TeamAssessmentListService {
  createAssessment(
    options: {
      credentials: BackstageCredentials<BackstageUserPrincipal>;
    },
    targetUser: string,
    groupId: string
  ): Promise<Assessment>;

  getAssessments(options: {
    credentials: BackstageCredentials<BackstageUserPrincipal>;
  }, teamId: string): Promise<string[]>;

  getSampleText(options: {
    credentials: BackstageCredentials<BackstageUserPrincipal>;
  }): Promise<{ message: string }>;
}

export interface Comment {
  id: string;
  text: string;
}

export interface SectionSubmission {
  section: string;
  comments: Comment[];
}
