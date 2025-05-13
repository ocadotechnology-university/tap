/*  team-assessment backend ─ utils/loadAssessmentConfig.ts
    -------------------------------------------------------
    Loads assessment‑config.yaml and synchronises its contents
    with the PostgreSQL database through Prisma ORM.

    Features added in this version
    ──────────────────────────────
    • fullSync flag – when true deletes anything missing from YAML
    • Runs every data‑changing operation inside a single transaction
    • Splits logic into small, clearly‑named helpers for readability
*/

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const prisma = new PrismaClient();

/** Shape of one soft‑skill entry inside the YAML file */
interface SoftItem {
    area: string;
    title: string;
    labels: string[];
}

/** Shape of one hard‑skill entry inside the YAML file */
interface HardItem {
    title: string;
    labels: string[];
}

/** Options accepted by the loader */
type LoaderOptions = {
    /** When true -> delete DB records that disappeared from YAML */
    fullSync?: boolean;
    /** Optional logger injected from Backstage env */
    logger?: { info: (...a: any[]) => void; error: (...a: any[]) => void };
};

/**
 * Parse YAML and return typed arrays.
 * Throws if file is missing or malformed.
 */
function readYaml(): { soft: SoftItem[]; hard: HardItem[] } {
    const filePath = path.join(
        process.cwd(),
        '..',
        'app',
        'public',
        'assessment-config.yaml',
    );

    const raw = yaml.load(fs.readFileSync(filePath, 'utf8')) as Record<
        string,
        any
    >;

    const soft = Array.isArray(raw['Soft Skills']) ? (raw['Soft Skills'] as SoftItem[]) : [];
    const hard = Array.isArray(raw['Hard Skills']) ? (raw['Hard Skills'] as HardItem[]) : [];

    return { soft, hard };
}

/** Public entry point used by the plugin */
export async function loadAssessmentConfig(opts: LoaderOptions = {}): Promise<void> {
    const { fullSync = false, logger = console } = opts;

    const { soft, hard } = readYaml();

    // Pre‑compute YAML‑derived sets for quick look‑ups
    const areaSet = new Set(soft.map(s => s.area));
    const softLabelsSet = new Set(soft.flatMap(s => s.labels));
    const pairsSet = new Set(soft.map(s => `${s.area}:::${s.title}`)); // area:::title

    const hardSectionSet = new Set(hard.map(h => h.title));
    const hardLabelsSet = new Set(hard.flatMap(h => h.labels));

    await prisma.$transaction(async tx => {
        // ──────────────────── Soft Skills ────────────────────
        //
        // 1) SoftSkillsMark ----------------------------------------------------------
        const dbSoftMarks = await tx.softSkillsMark.findMany({ select: { text: true } });

        // Delete marks missing from YAML (if fullSync enabled)
        if (fullSync) {
            await tx.softSkillsMark.deleteMany({
                where: { text: { notIn: Array.from(softLabelsSet) } },
            });
        }
        // Insert new marks
        const newSoftMarks = [...softLabelsSet].filter(
            t => !dbSoftMarks.some(m => m.text === t),
        );
        if (newSoftMarks.length) {
            await tx.softSkillsMark.createMany({
                data: newSoftMarks.map(text => ({ text })),
                skipDuplicates: true,
            });
        }

        // 2) Area --------------------------------------------------------------------
        const dbAreas = await tx.area.findMany({ select: { id: true, text: true } });
        if (fullSync) {
            await tx.area.deleteMany({
                where: { text: { notIn: Array.from(areaSet) } },
            });
        }
        const newAreas = [...areaSet].filter(a => !dbAreas.some(d => d.text === a));
        if (newAreas.length) {
            await tx.area.createMany({ data: newAreas.map(text => ({ text })) });
        }

        // 3) Competency --------------------------------------------------------------
        // Reload areas to get ids in case we just inserted some
        const areaMap = new Map(
            (await tx.area.findMany({ select: { id: true, text: true } })).map(a => [
                a.text,
                a.id,
            ]),
        );

        const dbComps = await tx.competency.findMany({
            select: { areaId: true, competencyId: true, text: true, area: true },
        });

        if (fullSync) {
            // Delete competencies not present in YAML
            await tx.competency.deleteMany({
                where: {
                    NOT: {
                        OR: [...pairsSet].map(p => {
                            const [area, title] = p.split(':::');
                            return { text: title, area: { text: area } };
                        }),
                    },
                },
            });
        }

        // Compute max competencyId per area to keep numeric sequence
        const maxIdPerArea = new Map<number, number>();
        for (const c of dbComps) {
            maxIdPerArea.set(
                c.areaId,
                Math.max(maxIdPerArea.get(c.areaId) ?? 0, c.competencyId),
            );
        }

        // Insert newly seen competencies
        const newComps = soft.flatMap(({ area, title }) => {
            const aid = areaMap.get(area)!;
            const exists = dbComps.some(c => c.areaId === aid && c.text === title);
            if (exists) return [];
            const nextId = (maxIdPerArea.get(aid) ?? 0) + 1;
            maxIdPerArea.set(aid, nextId);
            return [{ areaId: aid, competencyId: nextId, text: title }];
        });
        if (newComps.length) {
            await tx.competency.createMany({ data: newComps, skipDuplicates: true });
        }

        // ──────────────────── Hard Skills ────────────────────
        //
        const dbHardMarks = await tx.hardSkillsMark.findMany({ select: { text: true } });
        const dbHardSecs = await tx.hardSkillsSection.findMany({ select: { text: true } });

        if (fullSync) {
            await tx.hardSkillsMark.deleteMany({
                where: { text: { notIn: Array.from(hardLabelsSet) } },
            });
            await tx.hardSkillsSection.deleteMany({
                where: { text: { notIn: Array.from(hardSectionSet) } },
            });
        }

        const newHardMarks = [...hardLabelsSet].filter(
            l => !dbHardMarks.some(m => m.text === l),
        );
        if (newHardMarks.length) {
            await tx.hardSkillsMark.createMany({
                data: newHardMarks.map(text => ({ text })),
                skipDuplicates: true,
            });
        }

        const newHardSecs = [...hardSectionSet].filter(
            s => !dbHardSecs.some(db => db.text === s),
        );
        if (newHardSecs.length) {
            await tx.hardSkillsSection.createMany({
                data: newHardSecs.map(text => ({ text })),
                skipDuplicates: true,
            });
        }
    });

    logger.info(`assessment-config.yaml synchronised (fullSync=${fullSync})`);
}
