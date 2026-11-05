

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:5000";

type UploadResponse = {
  success: boolean;
  message?: string;
  data?: {
    url: string;
  };
};

export async function uploadEventImage(
  file: File,
  token: string
): Promise<string> {
  const formData = new FormData();

  // Must match upload.single("image") in Express.
  formData.append("image", file);

  const response = await fetch(
    `${API_BASE_URL}/api/uploads/event-image`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
      },

      // Browser sets multipart boundary automatically.
      body: formData,
    }
  );

  const result =
    (await response.json()) as UploadResponse;

  if (!response.ok || !result.success || !result.data?.url) {
    throw new Error(
      result.message || "Unable to upload image."
    );
  }

  return result.data.url;
}
