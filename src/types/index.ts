/**
 * Common types used throughout the application
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "user" | "viewer";
}

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
}

export interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: "success" | "error";
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Theme and UI related types
 */
export type ThemeMode = "light" | "dark" | "system";

export interface ThemeConfig {
  mode: ThemeMode;
  accentColor: string;
  radius: "none" | "small" | "medium" | "large" | "full";
}

/**
 * Form related types
 */
export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "select" | "textarea";
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
}