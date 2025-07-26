import { z } from "zod"

/**
 * Authentication Form Validation Schemas
 * 
 * Implements enterprise-grade validation for authentication forms
 * with comprehensive error messages and security considerations.
 */

/**
 * Login Form Validation Schema
 * 
 * Validates email and password with security-focused rules:
 * - Email format validation with proper RFC compliance
 * - Password minimum requirements for security
 * - Sanitization to prevent injection attacks
 */
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .max(254, "Email address is too long") // RFC 5321 limit
    .toLowerCase() // Normalize email for consistency
    .trim(), // Remove whitespace
  
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password is too long") // Prevent DoS via large passwords
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
  
  rememberMe: z
    .boolean()
    .optional()
    .default(false),
})

export type LoginFormData = z.infer<typeof loginFormSchema>

/**
 * Password Reset Request Schema
 */
export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .max(254, "Email address is too long")
    .toLowerCase()
    .trim(),
})

export type PasswordResetRequestData = z.infer<typeof passwordResetRequestSchema>

/**
 * Password Reset Schema
 */
export const passwordResetSchema = z.object({
  token: z
    .string()
    .min(1, "Reset token is required")
    .max(256, "Invalid reset token"),
  
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
  
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export type PasswordResetData = z.infer<typeof passwordResetSchema>

/**
 * API Response Validation Schema
 * 
 * Validates responses from the Spearfish authentication API
 * to ensure type safety and proper error handling.
 */
export const authApiResponseSchema = z.object({
  success: z.boolean(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    fullName: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    userName: z.string().optional(),
    primaryTenantId: z.number(),
    tenantMemberships: z.array(z.number()).optional(),
    roles: z.array(z.string()).optional(),
    authType: z.string().optional(),
  }).optional(),
  error: z.string().optional(),
  message: z.string().optional(),
  validationErrors: z.record(z.array(z.string())).optional(),
})

export type AuthApiResponse = z.infer<typeof authApiResponseSchema>

/**
 * Form Validation Utilities
 */
export const authValidation = {
  /**
   * Validates login form data and returns formatted errors
   */
  validateLoginForm: (data: unknown) => {
    const result = loginFormSchema.safeParse(data)
    return {
      success: result.success,
      data: result.success ? result.data : undefined,
      errors: result.success ? undefined : result.error.flatten().fieldErrors,
    }
  },

  /**
   * Validates API response and ensures type safety
   */
  validateApiResponse: (response: unknown) => {
    const result = authApiResponseSchema.safeParse(response)
    return {
      success: result.success,
      data: result.success ? result.data : undefined,
      error: result.success ? undefined : result.error.message,
    }
  },

  /**
   * Sanitizes user input to prevent injection attacks
   */
  sanitizeInput: (input: string): string => {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .slice(0, 1000) // Limit length to prevent DoS
  },

  /**
   * Validates email format with comprehensive checks
   */
  isValidEmail: (email: string): boolean => {
    const emailSchema = z.string().email()
    return emailSchema.safeParse(email).success
  },

  /**
   * Checks password strength
   */
  getPasswordStrength: (password: string): {
    score: number
    feedback: string[]
  } => {
    const feedback: string[] = []
    let score = 0

    if (password.length >= 8) score += 1
    else feedback.push("Use at least 8 characters")

    if (/[a-z]/.test(password)) score += 1
    else feedback.push("Include lowercase letters")

    if (/[A-Z]/.test(password)) score += 1
    else feedback.push("Include uppercase letters")

    if (/\d/.test(password)) score += 1
    else feedback.push("Include numbers")

    if (/[^a-zA-Z\d]/.test(password)) score += 1
    else feedback.push("Include special characters")

    if (password.length >= 12) score += 1

    return { score, feedback }
  },
}

/**
 * Security Constants
 */
export const AUTH_SECURITY = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  SESSION_TIMEOUT: 12 * 60 * 60 * 1000, // 12 hours
  REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_MAX_LENGTH: 254,
} as const