import { Tabs, TabsContent, TabsList, TabsTrigger } from '@rocket-house-productions/shadcn-ui';
import RevenuVisualisation from '@/app/(website)/(protected)/admin/(dashboard)/_components/visualisations/revenu-visualisation';
import ChildAgeVisualisation from '@/app/(website)/(protected)/admin/(dashboard)/_components/visualisations/child-age-visualisation';
import MembershipTypeVisualisation from '@/app/(website)/(protected)/admin/(dashboard)/_components/visualisations/membership-type-visualisation';
import LifecycleVisualisation from '@/app/(website)/(protected)/admin/(dashboard)/_components/visualisations/lifecycle-visualisation';

export async function CardVisualisation() {
  return (
    <Tabs defaultValue="revenue" className="w-full flex-col justify-start gap-6">
      <TabsList>
        <TabsTrigger value="revenue">Last 12 month Revenu</TabsTrigger>
        <TabsTrigger value="age">Children Age</TabsTrigger>
        <TabsTrigger value="membership">Membership type</TabsTrigger>
        <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
      </TabsList>

      <TabsContent value="revenue">
        <RevenuVisualisation />
      </TabsContent>
      <TabsContent value="age">
        <ChildAgeVisualisation />
      </TabsContent>
      <TabsContent value="membership">
        <MembershipTypeVisualisation />
      </TabsContent>
      <TabsContent value="lifecycle">
        <LifecycleVisualisation />
      </TabsContent>
    </Tabs>
  );
}

export default CardVisualisation;
