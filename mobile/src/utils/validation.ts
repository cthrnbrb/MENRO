export interface LoginFormData {
  email: string;
  password: string;
}

export function validateLoginForm(data: LoginFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Email is invalid";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}

export interface CodeFormData {
  code: string;
}

export function validateCodeForm(data: CodeFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.code) {
    errors.code = "Organization code is required";
  } else if (data.code.length < 3) {
    errors.code = "Code must be at least 3 characters";
  } else if (data.code.length > 20) {
    errors.code = "Code must be less than 20 characters";
  }

  return errors;
}

export interface RegisterFormData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  contact_number?: string;
  address?: string;
}

export type ValidationErrors = Record<string, string>;

export function validateRegisterForm(data: RegisterFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // First Name
  if (!data.first_name) {
    errors.first_name = "First name is required";
  } else if (data.first_name.length < 2) {
    errors.first_name = "First name must be at least 2 characters";
  }

  // Last Name
  if (!data.last_name) {
    errors.last_name = "Last name is required";
  } else if (data.last_name.length < 2) {
    errors.last_name = "Last name must be at least 2 characters";
  }

  // Email
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Email is invalid";
  }

  // Password
  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  // Password Confirmation
  if (!data.password_confirmation) {
    errors.password_confirmation = "Password confirmation is required";
  } else if (data.password !== data.password_confirmation) {
    errors.password_confirmation = "Passwords do not match";
  }

  // Contact Number (optional)
  if (data.contact_number && data.contact_number.length < 10) {
    errors.contact_number = "Contact number must be at least 10 digits";
  }

  // Address (optional)
  if (data.address && data.address.length < 10) {
    errors.address = "Address must be at least 10 characters";
  }

  return errors;
}
