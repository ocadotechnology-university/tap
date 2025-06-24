import { HttpAuthService } from '@backstage/backend-plugin-api';
import express from 'express';
import { TeamAssessmentListService } from './services/TodoListService/types';
export declare function createRouter({ httpAuth, teamAssessmentListService, }: {
    httpAuth: HttpAuthService;
    teamAssessmentListService: TeamAssessmentListService;
}): Promise<express.Router>;
