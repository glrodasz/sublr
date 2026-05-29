import auth0 from "../lib/auth0";
import { PageLayout } from "../components/organisms/PageLayout";
import { DomainView } from "../components/organisms/DomainView";
import { useUserDoc } from "../hooks/useUserDoc";

export const getServerSideProps = auth0.withPageAuthRequired();

export default function IncomesPage() {
  const userDoc = useUserDoc();
  return (
    <PageLayout title="Incomes" currency={userDoc?.mainCurrency}>
      <DomainView domain="INCOME" monthlyLabel="Monthly income" />
    </PageLayout>
  );
}
