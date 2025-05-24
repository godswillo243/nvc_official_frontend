import env from "../../../constants/env";

export async function signup(data: {
  name: string;
  email: string;
  password: string;
  nin: string;
  phone_number: string;
}): Promise<void> {
  const formData = {
    name: data.name.trim(),
    email: data.email.trim(),
    password: data.password,
    phone_number: data.phone_number.trim(),
    nin: data.nin.trim(),
  };

  if (!/^\d{11}$/.test(formData.nin)) {
    throw new Error("NIN must be exactly 11 digits.");
  }

  try {
    const response = await fetch("https://nvc-api.onrender.com/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.VITE_API_KEY,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.detail || "Registration failed");
    }
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to register. Please try again.");
  }
}
