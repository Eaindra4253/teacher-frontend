import { loginSchema } from "@/configs/schema";
import { z } from "zod";

export function login(
  formValue: z.infer<typeof loginSchema>
): Promise<LoginResponse> {
  console.log("Dummy login attempted with:", formValue);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (formValue.email === "error@example.com") {
        reject(new Error("Invalid credentials"));
      } else {
        resolve({
          accessToken: "dummy-jwt-token-for-testing",
          user: {
            id: 1,
            username: "thiha",
            email: "thiha@gmail.com",
            password: "thiha123",
            status: "ACTIVE",
            role: "ADMIN",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      }
    }, 1000);
  });
}
