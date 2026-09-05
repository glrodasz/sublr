import { withOnboardingGuard } from "../lib/withOnboardingGuard";
import { PageLayout } from "../components/organisms/PageLayout";
import { DomainView } from "../components/organisms/DomainView";
import { useUserDoc } from "../hooks/useUserDoc";

export const getServerSideProps = withOnboardingGuard();

export default function IncomesPage() {
  const { userDoc } = useUserDoc();
  return (
    <PageLayout title="Incomes" currency={userDoc?.mainCurrency}>
      <DomainView domain="INCOME" monthlyLabel="Monthly income" />
    </PageLayout>
  );
}
