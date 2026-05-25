import React from "react";
import type { UserProfile } from "@auth0/nextjs-auth0/client";
import type { Subscription } from "../types";
import type { SubscriptionMutations } from "../hooks/useSubscriptionMutations";
import CardSubscription from "./CardSubscription";
import CardPlaceholder from "./CardPlaceholder";
import Subtitle from "./Subtitle";

interface Props {
  subscriptions: Subscription[];
  user: UserProfile | undefined;
  create: (subscription: Omit<Subscription, "id">) => Promise<unknown>;
  mutations: SubscriptionMutations;
  knownTags?: string[];
}

const SubscriptionList = ({ subscriptions, user, create, mutations, knownTags = [] }: Props) => {
  const {
    changedSubscriptions,
    updatedSubscriptions,
    deleteConfirmationDialogRef,
    updateConfirmationDialogRef,
    handleRemove,
    handleUpdate,
    handleChange,
    handleConfirmDelete,
    handleConfirmUpdate,
  } = mutations;

  return (
    <section>
      <Subtitle>Subscriptions</Subtitle>
      <div className="cards-container">
        {subscriptions.map((subscription) => {
          const pendingChange = changedSubscriptions[subscription.id!] ?? {};
          const mergedSubscription = {
            ...subscription,
            ...pendingChange,
            creditCard: {
              type:
                (pendingChange.creditCardType as string | undefined) ??
                subscription.creditCard?.type ??
                "",
              number:
                (pendingChange.creditCardNumber as number | undefined) ??
                subscription.creditCard?.number ??
                0,
            },
          };

          return (
            <CardSubscription
              key={subscription.id}
              title={mergedSubscription.title}
              tags={mergedSubscription.tags ?? []}
              knownTags={knownTags}
              currency={mergedSubscription.currency}
              creditCard={mergedSubscription.creditCard}
              time={mergedSubscription.time}
              price={mergedSubscription.price}
              isUpdated={updatedSubscriptions[subscription.id!]}
              onRemove={() => handleRemove(subscription.id!)}
              onUpdate={() => handleUpdate(subscription.id!)}
              onChange={(change) => handleChange(subscription.id!, change)}
            />
          );
        })}
        <CardPlaceholder
          text="Add new subscription"
          onClick={() => {
            create({
              title: "",
              tags: [],
              price: 0,
              currency: "USD",
              time: "MONTHLY",
              creditCard: { type: "MASTERCARD", number: 0 },
              userId: user?.sub ?? undefined,
            });
          }}
        />
      </div>
      <dialog ref={deleteConfirmationDialogRef} aria-label="Confirm subscription deletion">
        <form method="dialog">
          <p>Are you sure that you want to delete it?</p>
          <button onClick={handleConfirmDelete} aria-label="Confirm delete">
            Confirm delete
          </button>
          <button aria-label="Cancel delete">Cancel</button>
        </form>
      </dialog>
      <dialog ref={updateConfirmationDialogRef} aria-label="Confirm subscription update">
        <form method="dialog">
          <p>Are you sure that you want to update it?</p>
          <button onClick={handleConfirmUpdate} aria-label="Confirm update">
            Confirm update
          </button>
          <button aria-label="Cancel update">Cancel</button>
        </form>
      </dialog>

      <style jsx>{`
        .cards-container {
          width: 100%;
          min-height: 100%;
          display: grid;
          gap: 24px;
          place-content: start;
          grid-template-columns: minmax(280px, 1fr);
        }

        @media only screen and (min-width: 800px) {
          .cards-container {
            grid-template-columns: repeat(2, minmax(280px, 1fr));
          }
        }

        @media only screen and (min-width: 1000px) {
          .cards-container {
            grid-template-columns: repeat(3, minmax(280px, 1fr));
          }
        }

        @media only screen and (min-width: 1280px) {
          .cards-container {
            grid-template-columns: repeat(4, minmax(260px, 1fr));
          }
        }
      `}</style>
    </section>
  );
};

export default SubscriptionList;
