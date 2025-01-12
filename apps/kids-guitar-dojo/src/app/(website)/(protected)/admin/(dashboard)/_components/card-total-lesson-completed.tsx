import { Card, CardContent, CardHeader, CardTitle } from '@rocket-house-productions/shadcn-ui';
import { Activity } from 'lucide-react';
import { db } from '@rocket-house-productions/integration';

export async function CardTotalLessonCompleted() {
  const childProgression = await db.childProgress.aggregate({
    where: {
      isCompleted: true,
    },
    _count: {
      id: true,
    },
  });

  return (
    <Card x-chunk="dashboard-01-chunk-3">
      <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Lesson Completed</CardTitle>
        <Activity className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{childProgression._count.id}</div>
        <p className="text-muted-foreground text-xs">since it went live</p>
      </CardContent>
    </Card>
  );
}

export default CardTotalLessonCompleted;
