import db from '@rocket-house-productions/integration/db';
import { Card, CardContent, CardHeader, CardTitle } from '@rocket-house-productions/shadcn-ui';
import { TrendingDown } from 'lucide-react';
import { ProgressChart } from './progress-chart';

export interface ModuleProgressSlot {
  label: string;
  module: string;
  book: number;
  students: number;
  lessons: number;
}

type CourseWithModules = {
  id: string;
  title: string;
  order: number | null;
  modules: {
    id: string;
    title: string;
    position: number;
    lessons: { id: string }[];
  }[];
};

function buildSlots(
  courses: CourseWithModules[],
  progress: { childId: string; lessonId: string }[],
  filterChildIds?: Set<string>,
): ModuleProgressSlot[] {
  const lessonToModule = new Map<string, number>();
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

  const childrenPerSlot = new Map<number, Set<string>>();
  for (const p of progress) {
    if (filterChildIds && !filterChildIds.has(p.childId)) continue;
    const slotIdx = lessonToModule.get(p.lessonId);
    if (slotIdx === undefined) continue;
    if (!childrenPerSlot.has(slotIdx)) childrenPerSlot.set(slotIdx, new Set());
    childrenPerSlot.get(slotIdx)!.add(p.childId);
  }

  for (const [idx, children] of childrenPerSlot) {
    slots[idx].students = children.size;
  }

  return slots;
}

async function getProgressData() {
  const [rawCourses, progress, paidChildren] = await Promise.all([
    db.course.findMany({
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
            lessons: { where: { isPublished: true }, select: { id: true } },
          },
        },
      },
    }),
    db.childProgress.findMany({
      where: { isCompleted: true },
      select: { childId: true, lessonId: true },
    }),
    // Children whose account has at least one paid (standard/premium) purchase
    db.child.findMany({
      where: {
        account: {
          purchases: {
            some: { type: 'charge', category: { in: ['standard', 'premium'] } },
          },
        },
      },
      select: { id: true },
    }),
  ]);

  const courses = rawCourses as unknown as CourseWithModules[];
  const paidChildIds = new Set(paidChildren.map(c => c.id));

  const allSlots = buildSlots(courses, progress);
  const customerSlots = buildSlots(courses, progress, paidChildIds);

  const totalLessons = allSlots.reduce((s, m) => s + m.lessons, 0);
  const totalStudents = await db.child.count();

  return { allSlots, customerSlots, totalStudents, customerCount: paidChildIds.size, totalLessons };
}

export async function ProgressVisualisation() {
  const { allSlots, customerSlots, totalStudents, customerCount, totalLessons } = await getProgressData();

  return (
    <Card>
      <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Student Progress — Drop-off by Module</CardTitle>
        </div>
        <TrendingDown className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-6 text-sm text-muted-foreground">
          <span><strong className="text-foreground">{totalStudents}</strong> all students</span>
          <span><strong className="text-foreground">{customerCount}</strong> customers</span>
          <span><strong className="text-foreground">{totalLessons}</strong> total lessons</span>
          <span><strong className="text-foreground">{allSlots.length}</strong> modules</span>
        </div>
        <ProgressChart allSlots={allSlots} customerSlots={customerSlots} />
      </CardContent>
    </Card>
  );
}

export default ProgressVisualisation;
