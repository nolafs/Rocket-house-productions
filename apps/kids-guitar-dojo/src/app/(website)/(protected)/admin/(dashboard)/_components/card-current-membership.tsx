import { Card, CardContent, CardHeader, CardTitle } from '@rocket-house-productions/shadcn-ui';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui/server';
import Link from 'next/link';
import { getAppSettings } from '@rocket-house-productions/actions/server';

export async function CardCurrentMembership() {
  const appSettingsRes = await getAppSettings();

  return (
    <Card x-chunk="dashboard-01-chunk-6">
      <CardHeader>
        <CardTitle>Current Membership Settings</CardTitle>
      </CardHeader>

      <CardContent className="text-muted-foreground space-y-6 text-sm">
        {/* Membership Course */}
        <div className="rounded-md border bg-white p-4">
          <p className="text-foreground mb-2 text-base font-medium">Membership Course</p>
          {appSettingsRes?.membershipSettings?.course ? (
            <div>
              <p>
                <strong>Title:</strong>{' '}
                <span className="font-medium">{appSettingsRes.membershipSettings.course.title}</span>
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                This is the course that acts as the entry point for membership.
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground italic">No membership course has been assigned.</p>
          )}
        </div>

        {/* Included Books */}
        <div className="rounded-md border bg-white p-4">
          <p className="text-foreground mb-2 text-base font-medium">Included Books</p>

          {appSettingsRes?.membershipSettings?.included?.length ? (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">Title</th>
                </tr>
              </thead>
              <tbody>
                {appSettingsRes.membershipSettings.included.map((includedCourse, index) => (
                  <tr key={includedCourse.id} className="border-b last:border-0">
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2">{includedCourse.includedCourse.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted-foreground italic">No books are currently included in this membership.</p>
          )}

          <p className="text-muted-foreground mt-2 text-xs">
            Included books are granted automatically to Premium members.
          </p>
        </div>

        {/* Info + Link */}
        <div>
          <p className="mb-2">To edit membership settings, please manage them from the associated course.</p>
          {appSettingsRes?.membershipSettings?.courseId && (
            <Link
              href={`/admin/courses/${appSettingsRes.membershipSettings.courseId}`}
              className={buttonVariants({ size: 'sm' })}>
              View Membership Course
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default CardCurrentMembership;
