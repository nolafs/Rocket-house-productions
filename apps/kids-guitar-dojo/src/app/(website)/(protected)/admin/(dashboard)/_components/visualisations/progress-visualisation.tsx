import db from '@rocket-house-productions/integration/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@rocket-house-productions/shadcn-ui';
import { TrendingDown } from 'lucide-react';
import { ProgressChart } from './progress-chart';

export interface ModuleProgressSlot {
  label: string;   // "B1 · M1", "B1 · M2", …
  module: string;  // full module title (for tooltip)
  book: number;
  students: number; // distinct children who completed ≥1 lesson here
  lessons: number;  // total published lessons in this module
}

async function getProgressData(): Promise<{
  slots: ModuleProgressSlot[];
  totalStudents: number;
  totalLessons: number;
}> {
  // Load all published courses in order, with their modules and lesson IDs
  const courses = await db.course.findMany({
    where: { isPublished: true },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      title: true,
      order: true,
      modules: {
        where: { isPublished: true },
        orderBy: { position: 'asc' },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            where: { isPublished: true },
            select: { id: true },
          },
        },
      },
    },
  });

  // All completed progress records — just childId + lessonId
  const progress = await db.childProgress.findMany({
    where: { isCompleted: true },
    select: { childId: true, lessonId: true },
  });

  // Build a lessonId → moduleIndex lookup
  const lessonToModule = new Map<string, number>(); // lessonId → slot index
  const slots: ModuleProgressSlot[] = [];

  courses.forEach((course, bookIdx) => {
    course.modules.forEach((mod, modIdx) => {
      const slotIdx = slots.length;
      slots.push({
        label: `B${bookIdx + 1}·M${modIdx + 1}`,
        module: mod.title,
        book: bookIdx + 1,
        students: 0,
        lessons: mod.lessons.length,
      });
      mod.lessons.forEach(l => lessonToModule.set(l.id, slotIdx));
    });
  });

  // Count distinct children per module slot
  // Use a Map<slotIdx, Set<childId>> to deduplicate children per module
  const childrenPerSlot = new Map<number, Set<string>>();

  for (const p of progress) {
    const slotIdx = lessonToModule.get(p.lessonId);
    if (slotIdx === undefined) continue;
    if (!childrenPerSlot.has(slotIdx)) childrenPerSlot.set(slotIdx, new Set());
    childrenPerSlot.get(slotIdx)!.add(p.childId);
  }

  for (const [idx, children] of childrenPerSlot) {
    slots[idx].students = children.size;
  }

  const totalStudents = await db.child.count();
  const totalLessons = slots.reduce((s, m) => s + m.lessons, 0);

  return { slots, totalStudents, totalLessons };
}

export async function ProgressVisualisation() {
  const { slots, totalStudents, totalLessons } = await getProgressData();

  // Drop-off: first module students minus last module with any students
  const withStudents = slots.filter(s => s.students > 0);
  const firstCount = withStudents[0]?.students ?? 0;
  const lastCount = withStudents[withStudents.length - 1]?.students ?? 0;
  const dropOffPct = firstCount > 0 ? (((firstCount - lastCount) / firstCount) * 100).toFixed(0) : '0';

  return (
    <Card>
      <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Student Progress — Drop-off by Module</CardTitle>
          <CardDescription className="text-2xl font-bold">{dropOffPct}% drop-off</CardDescription>
        </div>
        <TrendingDown className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-6 text-sm text-muted-foreground">
          <span><strong className="text-foreground">{totalStudents}</strong> enrolled students</span>
          <span><strong className="text-foreground">{totalLessons}</strong> total lessons</span>
          <span><strong className="text-foreground">{slots.length}</strong> modules</span>
        </div>
        <ProgressChart slots={slots} />
      </CardContent>
    </Card>
  );
}

export default ProgressVisualisation;
