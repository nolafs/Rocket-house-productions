'use server';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@rocket-house-productions/integration/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@rocket-house-productions/shadcn-ui';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui/server';
import Link from 'next/link';
export default async function Page(props: { params: Promise<{ childId: string }> }) {
  const params = await props.params;
  const { userId, sessionClaims } = await auth();
  let totalScore = 0;

  if (!userId) {
    return redirect('/');
  }

  if (sessionClaims.metadata.role !== 'admin') {
    return redirect('/');
  }

  const user = await db.child.findFirst({
    where: {
      id: params.childId,
    },
    include: {
      account: true,
    },
  });

  const awards = await db.award.findMany({
    where: {
      childId: params.childId,
    },
    include: {
      awardType: true,
      module: {
        select: {
          title: true,
        },
      },
    },
  });

  const score = await db.childScore.findMany({
    where: {
      childId: params.childId,
    },
    include: {
      course: {
        select: {
          title: true,
        },
      },
    },
  });

  if (score.length) {
    totalScore = score.reduce((sum, value) => sum + (value.score || 0), 0);
  }

  const progress = await db.childProgress.findMany({
    where: { childId: params.childId },
    include: {
      course: { select: { title: true } }, // ok to select inside include
      lesson: {
        include: {
          module: {
            include: {
              course: { select: { title: true } },
            },
          },
        },
      },
    },
  });

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Child Account detail</h1>
          </div>
        </div>
        <div className="mb-10 mt-16 grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Child Details</CardTitle>
              <CardDescription>Edit account details and view purchases of client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <span className={'text-sm font-bold'}>id</span>
                  <code>{user?.id}</code>
                </div>
                <div className="grid gap-3">
                  <span className={'text-sm font-bold'}>Name</span>
                  <p>{user?.name}</p>
                </div>
                <div className="grid gap-3">
                  <span className={'text-sm font-bold'}>Birthday</span>
                  <p>{user?.birthday.toDateString()}</p>
                </div>
                <div className="grid gap-3">
                  <span className={'text-sm font-bold'}>Notification</span>
                  <p>{user?.notifications ? 'Notification Active' : 'No notification'}</p>
                </div>
                <div className="grid gap-3">
                  <span className={'text-sm font-bold'}>Parent</span>
                  <Link href={`/admin/users/${user?.account.id}`} className={buttonVariants({ size: 'sm' })}>
                    View
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Child Awards</CardTitle>
              <CardDescription>Completed Modules with award</CardDescription>
            </CardHeader>
            <CardContent>
              {awards.length ? (
                <Table>
                  <TableCaption>A list of your recent Awards.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">id</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Module</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {awards?.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <code>{item.id}</code>
                        </TableCell>
                        <TableCell>{item.awardType.name}</TableCell>
                        <TableCell>{item?.module?.title || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>Total</TableCell>
                      <TableCell className="text-right">{awards.length}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              ) : (
                <div>No awards found</div>
              )}
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Child Score</CardTitle>
              <CardDescription>Score by course</CardDescription>
            </CardHeader>
            <CardContent>
              {score.length ? (
                <Table>
                  <TableCaption>A list of your recent scores.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">id</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {score?.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <code>{item.id}</code>
                        </TableCell>
                        <TableCell>{item.course.title}</TableCell>
                        <TableCell>{item?.score || '0'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>Total</TableCell>
                      <TableCell className="text-right">{totalScore}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              ) : (
                <div>No score found</div>
              )}
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>Child Progress</CardTitle>
              <CardDescription>Lessons & completion status</CardDescription>
            </CardHeader>

            <CardContent>
              {progress?.length ? (
                <Table>
                  <TableCaption>A list of your recent learning progress.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[110px]">ID</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Lesson</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Replays</TableHead>
                      <TableHead className="text-right">Updated</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {progress.map((item: any) => {
                      const courseTitle = item.course?.title ?? item.lesson?.module?.course?.title ?? '—';
                      const moduleTitle = item.lesson?.module?.title ?? '—';
                      const lessonTitle = item.lesson?.title ?? '—';
                      const status =
                        item.isCompleted === true ? 'Completed' : item.isCompleted === false ? 'In progress' : '—';
                      const updated = item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '—';

                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            <code>{item.id}</code>
                          </TableCell>
                          <TableCell>{courseTitle}</TableCell>
                          <TableCell>{moduleTitle}</TableCell>
                          <TableCell>{lessonTitle}</TableCell>
                          <TableCell>{status}</TableCell>
                          <TableCell>{item.currentProgress}</TableCell>
                          <TableCell>{item.replayCount}</TableCell>
                          <TableCell className="text-right">{updated}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div>No progress found</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
