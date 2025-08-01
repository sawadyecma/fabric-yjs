import type { ClientToken } from "@y-sweet/sdk";
import type { Result } from "./result";

export class ApiClient {
  private serverBaseUrl: string;
  constructor(serverBaseUrl: string) {
    this.serverBaseUrl = serverBaseUrl;
  }

  async fetchYSweetToken(docId: string): Promise<Result<ClientToken>> {
    try {
      const response = await fetch(`${this.serverBaseUrl}/api/get-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docId: docId }),
      });

      if (response.ok) {
        const data = await response.json();
        return { ok: true, data: data.clientToken };
      } else {
        const errorData = await response.json();
        return {
          ok: false,
          error: errorData.error || "Failed to fetch Y-Sweet token",
        };
      }
    } catch (error) {
      if (error instanceof Error) {
        return { ok: false, error: error.message };
      } else {
        return { ok: false, error: "Unknown error occurred" };
      }
    }
  }
}
