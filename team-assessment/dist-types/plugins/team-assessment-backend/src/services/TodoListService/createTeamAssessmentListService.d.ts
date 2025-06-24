import { AuthService, LoggerService } from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import { TeamAssessmentListService } from './types';
export declare function createAssessmentListService({ auth, logger, catalog, }: {
    auth: AuthService;
    logger: LoggerService;
    catalog: typeof catalogServiceRef.T;
}): Promise<TeamAssessmentListService>;
