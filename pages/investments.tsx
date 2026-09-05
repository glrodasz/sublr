import { withOnboardingGuard } from "../lib/withOnboardingGuard";
import { PageLayout } from "../components/organisms/PageLayout";
import { DomainView } from "../components/organisms/DomainView";
import { useUserDoc } from "../hooks/useUserDoc";

export const getServerSideProps = withOnboardingGuard();

export default function InvestmentsPage() {
  const { userDoc } = useUserDoc();
  return (
    <PageLayout title="Investments" currency={userDoc?.mainCurrency}>
      <DomainView domain="INVESTMENT" monthlyLabel="Monthly investments" />
    </PageLayout>
  );
}
