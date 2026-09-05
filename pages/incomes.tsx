import { withOnboardingGuard } from "../features/onboarding/helpers/onboardingGuard";
import { PageLayout } from "../components/organisms/PageLayout";
import { DomainView } from "../features/domains/components/DomainView";
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
