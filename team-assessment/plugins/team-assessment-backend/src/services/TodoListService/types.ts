import {
  BackstageCredentials,
  BackstageUserPrincipal,
} from '@backstage/backend-plugin-api';

export interface Assessment {
  title: string;
  createdBy: string;
}

export interface TeamAssessmentListService {
  createAssessment(
    input: {
      title: string;
      entityRef?: string;
    },
    options: {
      credentials: BackstageCredentials<BackstageUserPrincipal>;
    },
  ): Promise<Assessment>;

  getAssessments(): Promise<{ items: Assessment[] }>;
  getSampleText(options: {
    credentials: BackstageCredentials<BackstageUserPrincipal>;
  }): Promise<{ message: string }>;
}
