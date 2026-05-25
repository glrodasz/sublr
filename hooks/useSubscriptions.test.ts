import { renderHook, waitFor } from "@testing-library/react";

const onSnapshotMock = jest.fn();
const signInWithCustomTokenMock = jest.fn();

jest.mock("../firebase/client", () => ({ db: {}, auth: {} }));
jest.mock("firebase/auth", () => ({
  signInWithCustomToken: (...args: unknown[]) => signInWithCustomTokenMock(...args),
}));
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  onSnapshot: (...args: unknown[]) => onSnapshotMock(...args),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  setDoc: jest.fn(),
  doc: jest.fn(),
}));

import useSubscriptions from "./useSubscriptions";

describe("useSubscriptions", () => {
  beforeEach(() => {
    onSnapshotMock.mockReset();
    signInWithCustomTokenMock.mockReset();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("loads subscriptions from the snapshot", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ firebaseToken: "t" }) }) as never;
    signInWithCustomTokenMock.mockResolvedValue({ user: { uid: "u1" } });
    onSnapshotMock.mockImplementation((_q, onNext) => {
      onNext({ docs: [{ id: "s1", data: () => ({ title: "Netflix" }) }] });
      return () => {};
    });

    const { result } = renderHook(() => useSubscriptions());

    await waitFor(() => expect(result.current.finishedFirstFetch).toBe(true));
    expect(result.current.subscriptions).toEqual([{ id: "s1", title: "Netflix" }]);
    expect(result.current.error).toBeNull();
  });

  it("surfaces an error when the token endpoint fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 401 }) as never;

    const { result } = renderHook(() => useSubscriptions());

    await waitFor(() => expect(result.current.finishedFirstFetch).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.subscriptions).toEqual([]);
  });
});
