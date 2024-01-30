interface ValidationMessages {
  [key: string]: (params: any) => string;
}

export let VALIDATION_MESSAGES: ValidationMessages = {
  required: (): string => `Este campo es obligatorio.`,
  email: (): string => `El email no es válido.`,
  minlength: ({ requiredLength }): string => `El campo debe tener al menos ${requiredLength} caracteres.`,
  maxlength: ({ requiredLength }): string => `El campo no debe tener más de ${requiredLength} caracteres.`,
  notEqual: (): string => `La confirmación de contraseña no coincide.`,
  menorEdad: (): string => `Debes estar bajo la supervisión de un adulto para registrarte.`,
  min: ({ min }): string => `El valor mínimo es ${min}.`,
  max: ({ max }): string => `El valor máximo es ${max}.`,
  onlyDigits: (): string => `El campo solo puede contener números.`,
};
