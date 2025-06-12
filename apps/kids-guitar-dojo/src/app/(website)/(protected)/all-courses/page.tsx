import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/prismicio';
import Image from 'next/image';
import LogoFull from '@assets/logo_full.png';
import { CourseCard } from './_components/course-card';


import { db } from '@rocket-house-productions/integration';

export default async function Page({ params }: { params: { product: string[]; purchaseId: string } }) {
  const { userId } = await auth();


  if (!userId) {
    return redirect('/');
  }

  let purchase = null;

  let courses: any[] = [];

  let userPurchasedCourseIds: any[] = [];

  let isCapableUser = false;
  // check if params contain childId and account

  if (!params.purchaseId) {
    // get childId from account
    // const account = await getAccount(userId);
    const account = await db.account.findFirst({
      where: {
        userId: userId,
      },
    });


    purchase = await db.purchase.findFirst({
      where: {
        accountId: account?.id,
      },
      include: {
        course: true,
      },
    });

    if (!purchase) {
      return redirect(`/courses/error?status=error&message=No%20purchase%20found`);
    }



    if (!purchase.childId) {
      return redirect('/courses');
    }

    // if (purchase.category === 'premium' ) {
    //   return redirect('/courses');
    // }
    params.purchaseId = purchase.id;

    // const client = createClient();
    // courses = await client.getAllByType('courses');

    courses = await db.course.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        createdAt: 'desc', // optional: order courses by creation date
      },
    });


    userPurchasedCourseIds = await db.purchase.findMany({
      where: {
        accountId: account?.id,
      },
      select: {
        course: {
          select: {
            id: true,
          },
        },
      },
    }).then((purchases) => purchases.map((purchase) => purchase.course.id));  

    console.log("PURCHASED COURSES ", userPurchasedCourseIds);


    if (purchase.category === 'premium' || purchase.category === 'standard') {
        isCapableUser = true;
    }
  }


  return (
    <main>
      <div className={'mt-5 flex w-full flex-col items-center justify-center'}>
        <div>
          <Image src={LogoFull} alt={'Kids Guitar Dojo'} width={112} height={28} />
        </div>
        <div className={'px-5 text-center'}>
          <h1 className={'mb-5 text-2xl font-bold lg:text-3xl'}>Explore All Courses</h1>
        </div>
      </div>

      <div className="grid px-5 grid-cols-1 min-h-svh sm:grid-cols-2 md:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard 
          key={course.id}
          course={course} 
          isCapableUser={isCapableUser}
          hasPurchasedCourse={userPurchasedCourseIds.includes(course.id)}
        />
      ))}
    </div>
    </main>
  );
}
