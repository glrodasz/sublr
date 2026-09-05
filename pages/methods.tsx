import auth0 from "../lib/auth0";
import { PageLayout } from "../components/organisms/PageLayout";
import { Card } from "../components/atoms/Card";
import { EmptyState } from "../components/atoms/EmptyState";

export const getServerSideProps = auth0.withPageAuthRequired();

export default function MethodsPage() {
  return (
    <PageLayout title="Payment methods">
      <Card>
        <EmptyState
          title="Payment methods coming soon"
          description="You'll be able to add cards and bank accounts here, then link them to your incomes and expenses."
        />
      </Card>
    </PageLayout>
  );
}
