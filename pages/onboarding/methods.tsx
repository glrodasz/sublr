import { useState } from "react";
import { useRouter } from "next/router";
import auth0 from "../../lib/auth0";
import { OnboardingLayout } from "../../features/onboarding/components/OnboardingLayout";
import { MethodsStep } from "../../features/onboarding/components/MethodsStep";
import { useMethodsStep } from "../../features/onboarding/hooks/useMethodsStep";
import { WizardActions } from "../../features/onboarding/components/WizardActions";

export const getServerSideProps = auth0.withPageAuthRequired();

export default function OnboardingMethods() {
  const router = useRouter();
  const state = useMethodsStep();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flush = async () => {
    setBusy(true);
    setError(null);
    try {
      await state.save();
      return true;
    } catch (err) {
      console.error("Failed to save payment methods:", err);
      setError("Could not save your payment methods. Please try again.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  return (
    <OnboardingLayout
      step={2}
      description="Add your main payment methods"
      footer={
        <WizardActions
          onBack={() => router.push("/onboarding/categories")}
          onNext={async () => {
            if (await flush()) router.push("/onboarding/incomes");
          }}
          busy={busy}
          error={error}
        />
      }
    >
      <MethodsStep state={state} />
    </OnboardingLayout>
  );
}
