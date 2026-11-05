
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:5001";

export interface VolunteerRegistration {
  id: string;
  eventId: string;
  userId: string;
  status: "joined";
  joinedAt: string;
}

interface JoinEventResponse {
  success: boolean;
  message?: string;
  data?: VolunteerRegistration;
}

export interface RegistrationStatusResponse {
  success: boolean;
  joined: boolean;
  message?: string;
  data: VolunteerRegistration | null;
}

/**
 * Read an API response and handle errors.
 */
async function readApiResponse<T>(
  response: Response
): Promise<T> {
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message ??
        `Request failed with status ${response.status}`
    );
  }

  return result as T;
}

export async function joinEventApi(
  eventId: string,
  token: string
): Promise<VolunteerRegistration> {
  const response = await fetch(
    `${API_BASE_URL}/api/events/${eventId}/join`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const result =
    await readApiResponse<JoinEventResponse>(response);

  if (!result.data) {
    throw new Error(
      "Registration confirmation was not returned."
    );
  }

  return result.data;
}

export async function getMyRegistrationApi(
  eventId: string,
  token: string,
  signal?: AbortSignal
): Promise<RegistrationStatusResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/events/${eventId}/my-registration`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal,
    }
  );

  return readApiResponse<RegistrationStatusResponse>(
    response
  );
}
