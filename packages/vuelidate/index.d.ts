import { Ref, defineComponent, Plugin } from 'vue-demi';
type Component = ReturnType<typeof defineComponent>;

/*
 * Structure
 *
 * This package is mainly a validation engine. This engine requires 2
 * inputs: validation arguments and the state to be validated. The output
 * is a validation result.
 *
 * The structure of the validation object is constrained by the structure
 * of the validation arguments. These validation arguments also constraint
 * the type of the states that can be validated. And although the state does
 * not affect the structure of the validation result, it can narrow the
 * property "$model" in the validation result.
 *
 * Why do validation arguments constraint the type of the states that can
 * be validated? Because validation arguments make assumptions about the state.
 * For instance we expect a state `{ foo?: string }`, and we want to check
 * that `foo` is not empty, so we write `(foo?.length ?? 0) > 0`. If now we try
 * to validate the state `{ foo: [1] }` our validation result is meaningless.
 * This state would pass our test, but clearly it's not a valid object. This
 * situation was possible because that state violated our initial assumptions.
 *
 *
 *          Validation Arguments
 *                   |
 *              _____|____
 *             /          \
 *            |            |
 *            |      States to be validated
 *            |            |
 *            |            |
 *           Validation Result
 *
 */

export type ValidatorFn <T = unknown> = (value: T) => boolean;

export interface ValidationRuleWithoutParams <T = unknown> {
  $validator: ValidatorFn<T>
  $message?: string | Ref<string> | (() => string)
}

export interface ValidationRuleWithParams<P extends object = object, T = unknown> {
  $validator: ValidatorFn<T>
  $message: (input: { $params: P }) => string
  $params: P
}

export type ValidationRule <T = unknown> = ValidationRuleWithParams<any, T> | ValidationRuleWithoutParams<T> | ValidatorFn<T>;

type ValidationRuleCollection <T = unknown> = Record<string, ValidationRule<T>>;

interface ValidationArgs {
  [K: string]: ValidationRule | ValidationArgs
}

export interface RuleResultWithoutParams {
  readonly $message: string
  readonly $pending: boolean
  readonly $invalid: boolean
}

export interface RuleResultWithParams <P extends object = object> extends RuleResultWithoutParams {
  readonly $params: P
}

export type RuleResult = RuleResultWithoutParams | RuleResultWithParams;

type ExtractRuleResult <R extends ValidationRule> = R extends ValidationRuleWithParams<infer P> ? RuleResultWithParams<P> : RuleResultWithoutParams;

type ExtractRulesResults <T, Vrules extends ValidationRuleCollection<T> | undefined> = {
  readonly [K in keyof Vrules]: Vrules[K] extends ValidationRule ? ExtractRuleResult<Vrules[K]> : undefined;
};

export interface ErrorObject {
  readonly $propertyPath: string
  readonly $property: string
  readonly $validator: string
  readonly $message: string | Ref<string>
  readonly $params: object
  readonly $pending: boolean
}

type BaseValidation <
  T = unknown,
  Vrules extends ValidationRuleCollection<T> | undefined = undefined,
> = (
  Vrules extends ValidationRuleCollection<T>
    ? ExtractRulesResults<T, Vrules>
    : unknown) & {
  readonly $model: T
  // const validationGetters
  readonly $dirty: boolean
  readonly $error: boolean
  readonly $errors: ErrorObject[]
  readonly $invalid: boolean
  readonly $anyDirty: boolean
  readonly $pending: boolean

  // const validationMethods
  readonly $touch: () => void
  readonly $reset: () => void
};

type NestedValidations <Vargs extends ValidationArgs = ValidationArgs, T = unknown> = {
  readonly [K in keyof Vargs]: BaseValidation<
  T extends Record<K, unknown> ? T[K] : unknown,
  Vargs[K] extends ValidationRuleCollection
    ? Vargs[K] : undefined
  > & (
    Vargs[K] extends Record<string, ValidationArgs>
      ? NestedValidations<Vargs[K], T extends Record<K, unknown> ? T[K] : unknown>
      : unknown
  )
};

interface ChildValidations {
  readonly $validate?: () => Promise<boolean>
  readonly $getResultsForChild?: (key: string) => (BaseValidation & ChildValidations) | undefined
}

export type Validation <Vargs extends ValidationArgs = ValidationArgs, T = unknown> =
  NestedValidations<Vargs, T> &
  BaseValidation<T, Vargs extends ValidationRuleCollection ? Vargs : undefined> &
  ChildValidations;

type ExtractStateLeaf <Vrules extends ValidationRuleCollection> =
  Vrules extends ValidationRuleCollection<infer T>
    ? T
    : unknown;

type ChildStateLeafs <Vargs extends ValidationArgs = ValidationArgs> = {
  [K in keyof Vargs]?: (
  Vargs[K] extends ValidationRuleCollection
    ? ExtractStateLeaf<Vargs[K]>
    : unknown
  ) & (
  Vargs[K] extends Record<string, ValidationArgs>
    ? ChildStateLeafs<Vargs[K]>
    : unknown
  )
};

type ExtractState <Vargs extends ValidationArgs> = Vargs extends ValidationRuleCollection
  ? ExtractStateLeaf<Vargs> & ChildStateLeafs<Vargs>
  : ChildStateLeafs<Vargs>;

type ToRefs <T> = { [K in keyof T]: Ref<T[K]> };

export const useVuelidate: <
  Vargs extends ValidationArgs,
  T extends ExtractState<Vargs>
>(
  validationsArgs: Ref<Vargs> | Vargs,
  state: T | Ref<T> | ToRefs<T>,
  registerAs?: string
) => Ref<Validation<Vargs>>;
export const VuelidatePlugin: Plugin;

export default useVuelidate;
