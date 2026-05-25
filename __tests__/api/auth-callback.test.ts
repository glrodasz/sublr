import type { NextApiRequest, NextApiResponse } from "next";

const handleCallbackMock = jest.fn();

jest.mock("../../lib/auth0", () => ({
  __esModule: true,
  default: {
    handleAuth: jest.fn(),
    handleCallback: (...args: unknown[]) => handleCallbackMock(...args),
  },
}));

import { handleCallbackWithFallback } from "../../pages/api/auth/[...auth0]";

const mockRes = () => {
  const res = {} as NextApiResponse;
  res.writeHead = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

describe("handleCallbackWithFallback", () => {
  beforeEach(() => {
    handleCallbackMock.mockReset();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("delegates to handleCallback on the happy path", async () => {
    handleCallbackMock.mockResolvedValue(undefined);
    const res = mockRes();

    await handleCallbackWithFallback({} as NextApiRequest, res);

    expect(handleCallbackMock).toHaveBeenCalled();
    expect(res.writeHead).not.toHaveBeenCalled();
  });

  it("redirects to /login-error with the encoded reason when the callback throws", async () => {
    const err = Object.assign(new Error("state mismatch"), { status: 400 });
    handleCallbackMock.mockRejectedValue(err);
    const res = mockRes();

    await handleCallbackWithFallback({} as NextApiRequest, res);

    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: `/login-error?reason=${encodeURIComponent("state mismatch")}`,
    });
    expect(res.end).toHaveBeenCalled();
  });

  it("falls back to a status-derived reason when the error has no message", async () => {
    handleCallbackMock.mockRejectedValue(Object.assign(new Error(""), { status: 502 }));
    const res = mockRes();

    await handleCallbackWithFallback({} as NextApiRequest, res);

    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: "/login-error?reason=auth_502",
    });
  });
});
