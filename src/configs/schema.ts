import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .refine((val) => val.length > 0, "Email is required"),
  password: z.string().refine((val) => val.length > 0, "Password is required"),
});

export const merchantCreateSchema = z
  .object({
    merchantName: z
      .string()
      .refine((val) => val.length > 0, "Merchant Name is required"),
    merchantType: z
      .any()
      .refine((val) => Boolean(val), "Merchant Type is required"),
    phone: z.string().refine((val) => val.length > 0, "Password is required"),
    districtId: z.string().nullable(),
    townshipId: z.array(z.string()).nullable(),
    address: z.any().refine((val) => val.length > 0, {
      message: "Address is required",
    }),
  })
  .refine(
    (val) => (val.merchantType !== "SUPER_AGENT" ? true : val.districtId),
    {
      path: ["districtId"],
      message: "District is required",
    }
  )
  .refine(
    (val) =>
      val.merchantType !== "SUPER_AGENT" ? true : val.townshipId?.length,
    {
      path: ["townshipId"],
      message: "Township is required",
    }
  );

export const storeCreateSchema = z.object({
  outletName: z
    .string()
    .refine((value) => value.length, { message: "Outlet name is required" }),
  ddmName: z
    .string()
    .refine((value) => value.length, { message: "DDM Name is required" }),
  ddmPhone: z
    .string()
    .refine((value) => value.length, { message: "DDM Phone is required" }),
  address: z.string().refine((value) => value.length, {
    message: "Address is required",
  }),
  outletType: z.enum(["GNG", "CAPITAL"]),
  merchantId: z.any().refine((value) => value !== null, {
    message: "Merchant is required",
  }),
});

export const requestorCreateSchema = z.object({
  username: z
    .string()
    .refine((value) => value.length, { message: "Name is required" }),
  type: z.enum(["BCF"]),
  phone: z
    .string()
    .refine((value) => value.length, { message: "Phone is required" }),
});

export const userUpdateSchema = z.object({
  username: z
    .string()
    .refine((value) => value.length, { message: "Username is required" }),
  department: z.string().refine((value) => value.length, {
    message: "Department is required",
  }),
  email: z
    .string()
    .email()
    .refine((value) => value.length, { message: "Email is required" }),
  role: z.enum(["MODERATOR", "ADMIN", "AUDIT"], {
    message: "Role is required",
  }),
});

export const userCreateSchema = userUpdateSchema.extend({
  password: z
    .string()
    .refine((value) => value.length, { message: "Password is required" }),
});

export const userChangePasswordSchema = z
  .object({
    password: z
      .string()
      .refine((value) => value.length, { message: "New Password is required" }),
    confirmPassword: z.string().refine((value) => value.length, {
      message: "Confirm Password is required",
    }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export const tabletCreateSchema = z.object({
  tabletName: z.string().refine((val) => val.length > 0, "Name is required"),
});
