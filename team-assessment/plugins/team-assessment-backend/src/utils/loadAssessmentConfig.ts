// team-assessment/plugins/team-assessment-backend/src/utils/loadAssessmentConfig.ts

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const prisma = new PrismaClient();

interface SoftSectionConfig {
    area: string;
    title: string;
    labels: string[];
}

interface HardSectionConfig {
    title: string;
    labels: string[];
}

/**
 * !!! IMPORTANT TO READ !!!
 * Reads 'assessment-config.yaml' from the app's public directory,
 * parses both "Soft Skills" and "Hard Skills" sections, and:
 *
 * Soft Skills:
 *   1. Inserts any new Areas into the 'Areas' table.
 *   2. Inserts any new Competencies (scoped by area) into 'Competencies' with auto-assigned IDs.
 *   3. Inserts any new labels into 'SoftSkillsMarks'.
 *
 * Hard Skills:
 *   1. Inserts any new section titles into 'HardSkillsSections'.
 *   2. Inserts any new labels into 'HardSkillsMarks'.
 *
 * All operations use bulk 'createMany' with 'skipDuplicates' to minimize
 * round-trips and speed up startup.
 */
export async function loadAssessmentConfig(): Promise<void> {
    // Locate the YAML file
    const filePath = path.join(
        process.cwd(),
        '..',
        'app',
        'public',
        'assessment-config.yaml',
    );

    let rawDoc: any;
    try {
        rawDoc = yaml.load(fs.readFileSync(filePath, 'utf8'));
        console.log('>>> Loaded config:', JSON.stringify(rawDoc, null, 2));
    } catch (error) {
        console.error('\nFailed to load or parse assessment-config.yaml:', error);
        return;
    }

    //
    // === SOFT SKILLS SYNC ===
    //
    const softSections: SoftSectionConfig[] = Array.isArray(rawDoc['Soft Skills'])
        ? rawDoc['Soft Skills']
        : [];

    if (softSections.length > 0) {
        // 1) Collect unique areas, titles and labels
        const areas = Array.from(new Set(softSections.map(s => s.area)));
        const labels = Array.from(new Set(softSections.flatMap(s => s.labels)));
        const pairs = softSections.map(s => ({ area: s.area, title: s.title }));

        // 2) Fetch current DB state
        const existingAreas = await prisma.area.findMany({ select: { id: true, text: true } });
        const existingMarks = await prisma.softSkillsMark.findMany({ select: { text: true } });
        const existingComps = await prisma.competency.findMany({
            select: { areaId: true, competencyId: true, text: true },
        });

        // 3) Insert new Areas
        const newAreas = areas
            .filter(a => !existingAreas.some(x => x.text === a))
            .map(text => ({ text }));
        if (newAreas.length > 0) {
            await prisma.area.createMany({ data: newAreas, skipDuplicates: true });
        }

        // 4) Insert new Marks
        const newMarks = labels
            .filter(l => !existingMarks.some(x => x.text === l))
            .map(text => ({ text }));
        if (newMarks.length > 0) {
            await prisma.softSkillsMark.createMany({ data: newMarks, skipDuplicates: true });
        }

        // 5) Reload Areas to get IDs
        const allAreas = await prisma.area.findMany({ select: { id: true, text: true } });
        const areaMap = new Map(allAreas.map(a => [a.text, a.id]));

        // 6) Compute next competencyId per area
        const maxMap = new Map<number, number>();
        for (const c of existingComps) {
            maxMap.set(c.areaId, Math.max(maxMap.get(c.areaId) ?? 0, c.competencyId));
        }

        // 7) Prepare new Competencies
        const newComps: { areaId: number; competencyId: number; text: string }[] = [];
        for (const { area, title } of pairs) {
            const aid = areaMap.get(area)!;
            if (!existingComps.some(c => c.areaId === aid && c.text === title)) {
                const nextId = (maxMap.get(aid) ?? 0) + 1;
                maxMap.set(aid, nextId);
                newComps.push({ areaId: aid, competencyId: nextId, text: title });
            }
        }

        if (newComps.length > 0) {
            await prisma.competency.createMany({ data: newComps, skipDuplicates: true });
        }

        console.log(`\nSoft Skills synchronized (${areas.length} areas, ${labels.length} marks, ${newComps.length} competencies).\n`);
    }

    //
    // === HARD SKILLS SYNC ===
    //
    const hardSections: HardSectionConfig[] = Array.isArray(rawDoc['Hard Skills'])
        ? rawDoc['Hard Skills']
        : [];

    if (hardSections.length > 0) {
        // 1) Collect unique titles and labels
        const titles = Array.from(new Set(hardSections.map(h => h.title)));
        const hardLabels = Array.from(new Set(hardSections.flatMap(h => h.labels)));

        // 2) Fetch current DB state
        const existingSecs = await prisma.hardSkillsSection.findMany({ select: { text: true } });
        const existingHMarks = await prisma.hardSkillsMark.findMany({ select: { text: true } });

        // 3) Insert new Sections
        const newSecs = titles
            .filter(t => !existingSecs.some(x => x.text === t))
            .map(text => ({ text }));
        if (newSecs.length > 0) {
            await prisma.hardSkillsSection.createMany({ data: newSecs, skipDuplicates: true });
        }

        // 4) Insert new HardSkillsMarks
        const newHMarks = hardLabels
            .filter(l => !existingHMarks.some(x => x.text === l))
            .map(text => ({ text }));
        if (newHMarks.length > 0) {
            await prisma.hardSkillsMark.createMany({ data: newHMarks, skipDuplicates: true });
        }

        console.log(`\nHard Skills synchronized (${titles.length} sections, ${hardLabels.length} marks).\n`);
    }

    console.log('\nassessment-config.yaml fully synchronized to database\n');
}
