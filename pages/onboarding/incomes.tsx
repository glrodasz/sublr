import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import auth0 from "../../lib/auth0";
import { OnboardingLayout } from "../../features/onboarding/components/OnboardingLayout";
import { RecurrentStep } from "../../features/onboarding/components/RecurrentStep";
import { useRecurrentStep } from "../../features/onboarding/hooks/useRecurrentStep";
import { CurrencyPicker } from "../../features/onboarding/components/CurrencyPicker";
import { WizardActions } from "../../features/onboarding/components/WizardActions";
import { useUserDoc } from "../../hooks/useUserDoc";
import type { Currency } from "../../types";

export const getServerSideProps = auth0.withPageAuthRequired();

export default function OnboardingIncomes() {
  const router = useRouter();
  const { userDoc, update } = useUserDoc();
  const [currency, setCurrency] = useState<Currency>("USD");
  const [currencyTouched, setCurrencyTouched] = useState(false);
  const state = useRecurrentStep("INCOME", currency);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Adopt the stored currency until the user picks one themselves.
  useEffect(() => {
    if (!currencyTouched && userDoc?.mainCurrency) {
      setCurrency(userDoc.mainCurrency);
    }
  }, [userDoc?.mainCurrency, currencyTouched]);

  const flush = async () => {
    setBusy(true);
    setError(null);
    try {
      if (currency !== userDoc?.mainCurrency) {
        await update({ mainCurrency: currency });
      }
      await state.save();
      return true;
    } catch (err) {
      console.error("Failed to save incomes:", err);
      setError("Could not save your incomes. Please try again.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  return (
    <OnboardingLayout
      step={3}
      footer={
        <WizardActions
          onBack={() => router.push("/onboarding/methods")}
          onNext={async () => {
            if (await flush()) router.push("/onboarding/expenses");
          }}
          busy={busy}
          error={error}
        />
      }
    >
      <CurrencyPicker
        value={currency}
        onChange={(next) => {
          setCurrencyTouched(true);
          setCurrency(next);
        }}
      />

      <section className="incomes">
        <h2 className="heading">Set up your incomes</h2>
        <RecurrentStep state={state} />
      </section>

      <style jsx>{`
        .incomes {
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
