import { useState } from "react";
import { useRouter } from "next/router";
import auth0 from "../../lib/auth0";
import { OnboardingLayout } from "../../features/onboarding/components/OnboardingLayout";
import { RecurrentStep } from "../../features/onboarding/components/RecurrentStep";
import { useRecurrentStep } from "../../features/onboarding/hooks/useRecurrentStep";
import { WizardActions } from "../../features/onboarding/components/WizardActions";
import { useUserDoc } from "../../hooks/useUserDoc";

export const getServerSideProps = auth0.withPageAuthRequired();

export default function OnboardingExpenses() {
  const router = useRouter();
  const { userDoc, update } = useUserDoc();
  const state = useRecurrentStep("EXPENSE", userDoc?.mainCurrency ?? "USD");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finish = async () => {
    setBusy(true);
    setError(null);
    try {
      await state.save();
      await update({ onboardingCompleted: true, onboardingMode: "ASSISTED" });
      router.push("/");
    } catch (err) {
      console.error("Failed to finish onboarding:", err);
      setError("Could not save your expenses. Please try again.");
      setBusy(false);
    }
  };

  return (
    <OnboardingLayout
      step={4}
      footer={
        <WizardActions
          onBack={() => router.push("/onboarding/incomes")}
          onNext={finish}
          nextLabel="Finish"
          busy={busy}
          error={error}
        />
      }
    >
      <section className="expenses">
        <h2 className="heading">Set up your expenses</h2>
        <RecurrentStep state={state} showPaymentMethod />
      </section>

      <style jsx>{`
        .expenses {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .heading {
          margin: 0;
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--fg-1);
        }
      `}</style>
    </OnboardingLayout>
  );
}
