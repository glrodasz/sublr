import type { NextApiRequest, NextApiResponse } from "next";
import { request } from "../../lib/request";
import handler from "../../pages/api/currencies";

jest.mock("../../lib/request");
const mockedRequest = request as jest.MockedFunction<typeof request>;

const mockRes = () => {
  const res = {} as NextApiResponse;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("/api/currencies", () => {
  const original = process.env.EXCHANGE_RATES_API_KEY;

  afterEach(() => {
    process.env.EXCHANGE_RATES_API_KEY = original;
    mockedRequest.mockReset();
  });

  it("returns 503 when the API key is missing", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    delete process.env.EXCHANGE_RATES_API_KEY;
    const res = mockRes();

    await handler({} as NextApiRequest, res);

    expect(res.status).toHaveBeenCalledWith(503);
  });

  it("responds with the rates payload using the apikey header", async () => {
    process.env.EXCHANGE_RATES_API_KEY = "secret";
    mockedRequest.mockResolvedValue({ rates: { COP: 4000 } });
    const res = mockRes();

    await handler({} as NextApiRequest, res);

    expect(mockedRequest).toHaveBeenCalledWith(expect.stringContaining("base=USD"), {
      headers: { apikey: "secret" },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ COP: 4000 });
  });

  it("returns 500 when the upstream request throws", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    process.env.EXCHANGE_RATES_API_KEY = "secret";
    mockedRequest.mockRejectedValue(new Error("boom"));
    const res = mockRes();

    await handler({} as NextApiRequest, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
