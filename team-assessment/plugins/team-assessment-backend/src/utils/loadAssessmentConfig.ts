// team-assessment/plugins/team-assessment-backend/src/utils/loadAssessmentConfig.ts
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const prisma = new PrismaClient();

interface SectionConfig {
    area: string;
    title: string;
    description?: string;
    labels: string[];
}

/**
 * Reads `assessment-config.yaml` from the app’s public folder,
 * parses the “Soft Skills” sections, and for each section:
 *   1) upserts the `area` into Areas;
 *   2) upserts the `title` into Competencies (assigning a new competencyId if needed);
 *   3) upserts each `label` into SoftSkillsMarks.
 */
export async function loadAssessmentConfig(): Promise<void> {
    // 1) locate the YAML in app/public
    const filePath = path.join(
        process.cwd(),   // .../packages/backend
        '..',            // .../packages
        'app',           // .../packages/app
        'public',        // .../packages/app/public
        'assessment-config.yaml',
    );

    let rawDoc: any;
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        rawDoc = yaml.load(fileContents);
        console.log('>>> Loaded config:', JSON.stringify(rawDoc, null, 2));
    } catch (e) {
        console.error('Failed to read or parse assessment-config.yaml:', e);
        return;
    }

    // 2) pick out the array under “Soft Skills”
    const sections: SectionConfig[] = Array.isArray(rawDoc['Soft Skills'])
        ? rawDoc['Soft Skills']
        : Array.isArray(rawDoc.softSkillsSections)
            ? rawDoc.softSkillsSections
            : [];

    if (sections.length === 0) {
        console.warn(
            'No sections found under "Soft Skills" or "softSkillsSections". Skipping sync.'
        );
        return;
    }

    // 3) for each section, sync area, competency, and labels
    for (const { area, title, labels } of sections) {
        // --- upsert Area ---
        const areaRecord = await prisma.area.upsert({
            where: { text: area },
            update: {},
            create: { text: area },
        });

        // --- ensure Competency exists ---
        // try to find by (areaId + text)
        const existing = await prisma.competency.findFirst({
            where: { areaId: areaRecord.id, text: title },
        });

        if (!existing) {
            // compute next competencyId within this area
            const allForArea = await prisma.competency.findMany({
                where: { areaId: areaRecord.id },
                select: { competencyId: true },
            });
            const maxId = allForArea.reduce((m, c) => c.competencyId > m ? c.competencyId : m, 0);
            const nextCompetencyId = maxId + 1;

            await prisma.competency.create({
                data: {
                    areaId: areaRecord.id,
                    competencyId: nextCompetencyId,
                    text: title,
                },
            });
        }

        // --- upsert SoftSkillsMarks ---
        for (const label of labels) {
            await prisma.softSkillsMark.upsert({
                where: { text: label },
                update: {},
                create: { text: label },
            });
        }
    }

    console.log('assessment-config.yaml successfully synchronized to database');
}
