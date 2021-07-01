import {
  ValidationRuleWithoutParams,
  ValidationRuleWithParams,
  ValidationRule,
  ValidationArgs
} from '@vuelidate/core';
import { Ref } from 'vue-demi';

// Rules
export const alpha: ValidationRuleWithoutParams;
export const alphaNum: ValidationRuleWithoutParams;
export const and: (
  ...validators: ValidationRule[]
) => ValidationRuleWithoutParams;
export const between: (
  min: number | Ref<number>,
  max: number | Ref<number>
) => ValidationRuleWithParams<{ min: number, max: number }>;
export const decimal: ValidationRuleWithoutParams;
export const email: ValidationRuleWithoutParams;
export const integer: ValidationRuleWithoutParams;
export const ipAddress: ValidationRuleWithoutParams;
export const macAddress: (separator: string | Ref<string>) => ValidationRuleWithoutParams;
export const maxLength: (
  max: number | Ref<number>
) => ValidationRuleWithParams<{ max: number }>;
export const maxValue: (
  max: number | Ref<number> | string | Ref<string>
) => ValidationRuleWithParams<{ max: number }>;
export const minLength: (
  length: number | Ref<number>
) => ValidationRuleWithParams<{ length: number }>;
export const minValue: (
  min: number | Ref<number> | string | Ref<string>
) => ValidationRuleWithParams<{ min: number }>;
export const not: (validator: ValidationRule) => ValidationRuleWithoutParams;
export const numeric: ValidationRuleWithoutParams;
export const or: (
  ...validators: ValidationRule[]
) => ValidationRuleWithoutParams;
export const required: ValidationRuleWithoutParams;
export const requiredIf: (prop: boolean | string | (() => boolean | Promise<boolean>)) => ValidationRuleWithoutParams;
export const requiredUnless: (prop: boolean | string | (() => boolean | Promise<boolean>)) => ValidationRuleWithoutParams;
export const sameAs: <E = unknown>(
  equalTo: E,
  otherName?: string
) => ValidationRuleWithParams<{ equalTo: E, otherName: string }>;
export const url: ValidationRuleWithoutParams;
export const helpers: {
  withParams: (params: object, validator: ValidationRule) => ValidationRuleWithParams
  withMessage: (message: string | Function, validator: ValidationRule) => ValidationRuleWithParams
  req: Function
  len: Function
  regex: Function
  unwrap: Function
  withAsync: Function,
  forEach: (validators: ValidationArgs) => { $validator: ValidationRule, $message: () => string }
}
