import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration/server';

export async function POST(req: NextRequest, props: { params: Promise<{ courseId: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });
    const params = await props.params;
    const courseId = params.courseId;
    if (!courseId) return new NextResponse('Missing courseId', { status: 400 });

    const { includedCourseIds = [], makePrimary = true } = (await req.json()) as {
      includedCourseIds?: string[];
      makePrimary?: boolean;
    };

    // Ensure course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });
    if (!course) return new NextResponse('Course not found', { status: 404 });

    // Filter duplicates/self-references safely
    const uniqueIncluded = Array.from(new Set(includedCourseIds)).filter(id => id && id !== courseId);

    const result = await db.$transaction(async tx => {
      // 1) Upsert MembershipSettings for this course (FK lives on MembershipSettings.courseId)
      const ms = await tx.membershipSettings.upsert({
        where: { courseId },
        update: {},
        create: { courseId },
      });

      // 2) Replace includes
      await tx.membershipInclude.deleteMany({ where: { membershipId: ms.id } });

      if (uniqueIncluded.length) {
        await tx.membershipInclude.createMany({
          data: uniqueIncluded.map(includedCourseId => ({
            membershipId: ms.id,
            includedCourseId,
          })),
          skipDuplicates: true,
        });
      }

      // 3) Enforce single membership for the whole app (optional toggle)
      if (makePrimary) {
        // a) Make only THIS course the membership entry
        await tx.course.updateMany({
          where: { isMembershipEntry: true, NOT: { id: courseId } },
          data: { isMembershipEntry: false },
        });
        await tx.course.update({
          where: { id: courseId },
          data: { isMembershipEntry: true },
        });

        // b) Update AppSettings singleton to point at this membership
        await tx.appSettings.upsert({
          where: { id: 'singleton' },
          update: { membershipSettingsId: ms.id },
          create: { id: 'singleton', membershipSettingsId: ms.id },
        });
      }

      // Return the fresh snapshot
      return tx.membershipSettings.findUnique({
        where: { courseId },
        include: {
          included: {
            include: { includedCourse: { select: { id: true, title: true } } },
          },
        },
      });
    });

    return NextResponse.json({ ok: true, membership: result });
  } catch (error) {
    console.error('[COURSE_ID_MEMBERSHIP]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
