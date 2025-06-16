import {
  BackstageCredentials,
  BackstageUserPrincipal,
} from '@backstage/backend-plugin-api';

// === Типи для виводу статистики ===

export interface HardSkillMarkStat {
  user: string;
  mark: string;
}
export interface SoftSkillCommentEntry {
  user: string;
  comment: string;
  mark: string;
}

export interface NamedSoftSkillStatGroup {
  _areaName: string;
  [competencyId: string]: {
    _competencyName: string;
    entries: SoftSkillCommentEntry[];
  } | string;
}

export interface NamedHardSkillMark extends HardSkillMarkStat {
  _questionText?: string;
}

export interface AssessmentStat {
  softSkills: Record<string, NamedSoftSkillStatGroup>;
  hardSkills: Record<string, NamedHardSkillMark[]>;
}

// === Базові типи моделей ===

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

export interface AssessmentData {
  id: number;
  createdBy: string;
  targetUser: string;
  date: Date;
  groupId: string;
  softSkills: SoftSkillCommentStat[];
  hardSkills: HardSkillStat[];
}

// === Допоміжні типи ===

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

// === Основний інтерфейс сервісу ===

export interface TeamAssessmentListService {
  // Статистика
  getUserAssessmentStat(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
    userId: string
  ): Promise<AssessmentStat>;

  // Оцінювання
  createAssessment(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
    targetUser: string,
    groupId: string
  ): Promise<Assessment>;

  upsertHardSkill(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
    assessmentId: number,
    questionId: number,
    markId: number
  ): Promise<HardSkill>;

  upsertSoftSkillComment(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
    assessmentId: number,
    areaId: number,
    competencyId: number,
    markId: number,
    commentId: number | null,
    commentText: string
  ): Promise<{ id: string; commentText: string; key: number }>;

  // Отримання оцінок/коментарів
  getHardSkillMarksByAssessment(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
    assessmentId: number
  ): Promise<Array<{ questionId: number; markId: number }>>;

  getSoftSkillComment(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
    assessmentId: number,
    areaId: number,
    competencyId: number,
    markId: number
  ): Promise<{ id: string; commentText: string } | null>;

  getSoftSkillComments(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
    assessmentId: number
  ): Promise<
    {
      id: number;
      commentText: string;
      areaId: number;
      competencyId: number;
      markId: number;
    }[]
  >;

  // Словники
  getHardSkillSections(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> }
  ): Promise<SectionRow[]>;

  getHardSkillMarks(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> }
  ): Promise<MarkRow[]>;

  getSoftSkillAreas(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> }
  ): Promise<SectionRow[]>;

  getSoftSkillMarks(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> }
  ): Promise<MarkRow[]>;

  getSoftSkillCompetencies(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> }
  ): Promise<Competency[]>;

  // Інше
  getAssessments(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> },
    teamId: string
  ): Promise<{ targetUser: string; id: number }[]>;

  getSampleText(
    options: { credentials: BackstageCredentials<BackstageUserPrincipal> }
  ): Promise<{ message: string }>;
}
