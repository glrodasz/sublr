import { useRef, useState } from "react";
import type { FieldChange, Subscription } from "../types";
import {
  getCreditCardInfoFromCurrentSubscription,
  shouldUpdateSubscriptionPrice,
} from "../helpers";

type PendingChange = Record<string, FieldChange["value"]>;

export interface SubscriptionMutations {
  currentSubscriptionId: string | null;
  changedSubscriptions: Record<string, PendingChange>;
  updatedSubscriptions: Record<string, number>;
  deleteConfirmationDialogRef: React.RefObject<HTMLDialogElement>;
  updateConfirmationDialogRef: React.RefObject<HTMLDialogElement>;
  handleRemove: (id: string) => void;
  handleUpdate: (id: string) => void;
  handleChange: (subscriptionId: string, change: FieldChange) => void;
  handleConfirmDelete: () => void;
  handleConfirmUpdate: () => void;
}

const useSubscriptionMutations = (
  remove: (id: string) => Promise<unknown>,
  update: (id: string, subscription: Partial<Subscription>) => Promise<unknown>
): SubscriptionMutations => {
  const [currentSubscriptionId, setCurrentSubscriptionId] = useState<string | null>(null);
  const [changedSubscriptions, setChangedSubscriptions] = useState<Record<string, PendingChange>>(
    {}
  );
  const [updatedSubscriptions, setUpdatedSubscriptions] = useState<Record<string, number>>({});
  const deleteConfirmationDialogRef = useRef<HTMLDialogElement>(null);
  const updateConfirmationDialogRef = useRef<HTMLDialogElement>(null);

  const handleRemove = (id: string) => {
    deleteConfirmationDialogRef.current?.showModal();
    setCurrentSubscriptionId(id);
  };

  const handleUpdate = (id: string) => {
    updateConfirmationDialogRef.current?.showModal();
    setCurrentSubscriptionId(id);
  };

  const handleChange = (subscriptionId: string, { id, value }: FieldChange) => {
    const newValue = id === "creditCardNumber" ? (value as string).slice(-4) : value;
    setChangedSubscriptions((prev) => ({
      ...prev,
      [subscriptionId]: { ...prev[subscriptionId], [id]: newValue },
    }));
  };

  const handleConfirmDelete = () => {
    if (currentSubscriptionId) remove(currentSubscriptionId);
  };

  const handleConfirmUpdate = () => {
    if (!currentSubscriptionId) return;
    const pending = changedSubscriptions[currentSubscriptionId] ?? {};
    update(currentSubscriptionId, {
      ...pending,
      ...shouldUpdateSubscriptionPrice(
        pending as Parameters<typeof shouldUpdateSubscriptionPrice>[0]
      ),
      ...(getCreditCardInfoFromCurrentSubscription(
        pending as Parameters<typeof getCreditCardInfoFromCurrentSubscription>[0]
      ) as Partial<Subscription>),
    });
    setUpdatedSubscriptions((prev) => ({
      ...prev,
      [currentSubscriptionId]: (prev[currentSubscriptionId] ?? 0) + 1,
    }));
  };

  return {
    currentSubscriptionId,
    changedSubscriptions,
    updatedSubscriptions,
    deleteConfirmationDialogRef,
    updateConfirmationDialogRef,
    handleRemove,
    handleUpdate,
    handleChange,
    handleConfirmDelete,
    handleConfirmUpdate,
  };
};

export default useSubscriptionMutations;
