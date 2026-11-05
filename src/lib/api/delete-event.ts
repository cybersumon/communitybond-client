

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:5001";

export async function deleteEventApi(
  eventId: string,
  token: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/events/${eventId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ?? "Unable to delete event."
    );
  }

  if (!result.success) {
    throw new Error("Event deletion was not confirmed.");
  }
}
