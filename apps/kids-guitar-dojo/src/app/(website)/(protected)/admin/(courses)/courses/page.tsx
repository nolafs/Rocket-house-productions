import { redirect } from 'next/navigation';

// Database
import { db } from '@rocket-house-productions/integration';
import { auth } from '@clerk/nextjs/server';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

const CoursesPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/');
  }

  const courses = await db.course.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
