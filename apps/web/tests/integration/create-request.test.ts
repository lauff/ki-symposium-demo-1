import { describe, it, expect, vi } from "vitest";

vi.mock("../../lib/db", () => ({
  db: {
    repairRequest: {
      create: vi.fn().mockResolvedValue({
        id: "test-id",
        title: "Test repair",
        category: "ELECTRONICS",
        description: "Test description",
        photos: [],
        status: "SUBMITTED",
        createdByUserId: "user-id",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    },
  },
}));

import { createRequest } from "../../lib/services/repair-request.service";

describe("createRequest", () => {
  it("creates a repair request with SUBMITTED status", async () => {
    const result = await createRequest({
      title: "Test repair",
      category: "ELECTRONICS",
      description: "Test description",
      photos: [],
      createdByUserId: "user-id",
    });

    expect(result.status).toBe("SUBMITTED");
    expect(result.title).toBe("Test repair");
  });
});
