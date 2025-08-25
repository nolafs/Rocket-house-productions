import CardRevenue from './_components/card-revenue';
import CardAccounts from './_components/card-accounts';
import CardEnrollment from './_components/card-enrollment';
import CardRecentSales from './_components/card-recent-sales';
import CardServiceList from './_components/card-service-list';
import CardTotalLessonCompleted from './_components/card-total-lesson-completed';

export default function Page() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <CardRevenue />
        <CardAccounts />
        <CardEnrollment />
        <CardTotalLessonCompleted />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-2">
        <CardRecentSales />
        <CardServiceList />
      </div>
    </main>
  );
}
