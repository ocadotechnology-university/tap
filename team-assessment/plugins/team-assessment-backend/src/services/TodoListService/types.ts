import {
  BackstageCredentials,
  BackstageUserPrincipal,
} from '@backstage/backend-plugin-api';

export interface Assessment {
  id: number;
  createdBy: string;
  targetUser: string;
  createdAt: Date;
}

export interface TeamAssessmentListService {
  // createAssessment(
  //   // input: {
  //   //   entityRef?: string;
  //   // },
  //   options: {
  //     credentials: BackstageCredentials<BackstageUserPrincipal>;
  //   },
  // ): Promise<Assessment>;

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