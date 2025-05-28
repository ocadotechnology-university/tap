import fs from 'fs';
import yaml from 'yaml';
import path from 'path';

export type AccessConfig = {
  permissions: {
    teamAssessment: {
      allowedGroups: string[];
      adminUsers: string[];
    };
  };
};

let accessConfig: AccessConfig;

const accessConfigPath = path.resolve(
  __dirname,
  '../../../../plugins/team-assessment-backend/access-config.yaml',
);

export function getAccessConfig(): AccessConfig {
  return accessConfig;
}

export function loadAccessConfig(): void {
  const fileContent = fs.readFileSync(accessConfigPath, 'utf8');
  accessConfig = yaml.parse(fileContent);
}
