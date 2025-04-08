import {
  BackstageCredentials,
  BackstageUserPrincipal,
} from '@backstage/backend-plugin-api';

export interface Assessment {
  id: number;
  createdBy: string;
  createdAt: Date;
}

export interface TeamAssessmentListService {
  createAssessment(
    // input: {
    //   entityRef?: string;
    // },
    options: {
      credentials: BackstageCredentials<BackstageUserPrincipal>;
    },
  ): Promise<Assessment>;

  getAssessments(options: {
    credentials: BackstageCredentials<BackstageUserPrincipal>;
  }): Promise<Assessment[]>;
  
  getSampleText(options: {
    credentials: BackstageCredentials<BackstageUserPrincipal>;
  }): Promise<{ message: string }>;
}
