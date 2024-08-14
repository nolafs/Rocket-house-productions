import { Card, CardContent, CardHeader, CardTitle } from '@rocket-house-productions/shadcn-ui';
import { CreditCard, GraduationCapIcon } from 'lucide-react';
import { db } from '@rocket-house-productions/integration';

export async function CardEnrollment() {
  const childrenCount = await db.child.count();

  // calculate the percentage increase from the previous month
  const currentMonthStart = new Date();
  currentMonthStart.setDate(1); // Set to the first day of the current month
  currentMonthStart.setHours(0, 0, 0, 0); // Set to the start of the day

  const childrenCountCurrentMonth = await db.child.count({
    where: {
      createdAt: {
        gte: currentMonthStart,
      },
    },
  });

  console.log(`Children added this month: ${childrenCountCurrentMonth}`);

  const previousMonthStart = new Date(currentMonthStart);
  previousMonthStart.setMonth(previousMonthStart.getMonth() - 1); // Move to the start of the previous month

  const childrenCountPreviousMonth = await db.child.count({
    where: {
      createdAt: {
        gte: previousMonthStart,
        lt: currentMonthStart, // Less than the start of the current month
      },
    },
  });

  console.log(`Children added last month: ${childrenCountPreviousMonth}`);

  const difference = childrenCountCurrentMonth - childrenCountPreviousMonth;

  let percentDifference;

  if (childrenCountPreviousMonth === 0) {
    // If no children were added last month, the percentage increase is 100%
    percentDifference = childrenCountCurrentMonth > 0 ? 100 : 0;
  } else {
    percentDifference = ((childrenCountCurrentMonth - childrenCountPreviousMonth) / childrenCountPreviousMonth) * 100;
  }

  return (
    <Card x-chunk="dashboard-01-chunk-2">
      <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Students</CardTitle>
        <GraduationCapIcon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{childrenCount}</div>
        <p className="text-muted-foreground text-xs">+{percentDifference}% from last month</p>
      </CardContent>
    </Card>
  );
}

export default CardEnrollment;
