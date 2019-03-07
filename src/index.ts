import Vue from 'vue';
import { PluginFunction } from 'vue';

interface Rules {
  [key: string]: () => void;
}

interface Declarations {
  [key: string]: Rules;
}

interface Results {
  $invalid: boolean;
  [key: string]: boolean | Results;
}

declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
    $v: object;
    [key: string]: any;
  }
}

interface Computed {
  dynamicKeys?: [string];
  dirty?: boolean;
  $invalid: () => boolean;
  $dirty: () => boolean;
  $error: () => boolean;
  [key: string]: any;
}

const defaultComputed: Computed = {
  $invalid(): boolean {
    return this.dynamicKeys.some((ruleOrNested: string) => {
      const val = this[ruleOrNested as keyof Computed];
      return typeof val === 'object' ? val.$invalid : !val;
    });
  },
  $dirty(): boolean {
    return (
      this.dirty ||
      this.dynamicKeys.some((ruleOrNested: string) => {
        const val = this[ruleOrNested as keyof Computed];
        return typeof val === 'object' ? val.$dirty : false;
      })
    );
  },
  $error(): boolean {
    return !!(this.$dirty && this.$invalid);
  },
};

class Vuelidate extends Vue {
  public dirty: boolean = false;

  constructor(validations: Declarations, vmObj: Vue) {
    super(createVuelidateOptions(validations, vmObj));
  }

  setDirty(newState: boolean = true) {
    this.dirty = !!newState;
  }
}

function VuelidatePlugin(Vue: Vue): void {
  Vue.mixin(VuelidateMixin);
}

const VuelidateMixin: Vue = {
  beforeCreate(): void {
    const options = this.$options;
    const validations: Declarations = options.validations;
    if (!validations) return;
    if (!options.computed) options.computed = {};
    if (options.computed.$v) return;

    this.__Vuelidate__ = new Vuelidate(validations, this);

    options.computed.$v = () => setupValidations(validations, this);
  },
  beforeDestroy(): void {
    if (this.__Vuelidate__) {
      this.__Vuelidate__.$destroy();
      this.__Vuelidate__ = null;
    }
  },
};

export default VuelidatePlugin;

export { VuelidatePlugin as Vuelidate, VuelidateMixin };

function createVuelidateOptions(validations: Declarations, vm: Vue) {
  const modelKeys: string[] = Object.keys(validations);
  const transformedKeys = modelKeys.map(mapDynamicKeyName);

  const rules = {};
  const nested = {};
  const groups = {};
  modelKeys.forEach(key => {
    const v = validations[key];
    let baseObj;

    if (isSingleRule(v)) {
      baseObj = rules;
    } else if (Array.isArray(v)) {
      baseObj = groups;
    } else {
      baseObj = nested;
    }
    baseObj[key] = v;
  });

  const componentOptions = {
    data: {
      dynamicKeys: transformedKeys,
    },
    computed: {
      ...buildDynamics(rules, mapRule),
      // ...buildDynamics(nested, mapChild),
      // ...buildDynamics(groups, mapGroup),
      ...defaultComputed,
    },
  };

  console.log(componentOptions);
  return componentOptions;

  function mapRule(rule, localProp) {
    return function() {
      return rule.call(vm);
    };
  }
}

function setupValidations(validations: Declarations, vm: Vue): object {
  const modelKeys: string[] = Object.keys(validations);

  const validationResults = modelKeys.reduce(constructResults, {
    $invalid: false,
  });

  return validationResults;

  function constructResults(results: Results, model: string) {
    const rules: Rules = validations[model];

    results[model] = validateModel(rules, vm[model]);
    results.$invalid = Object.keys(results).some(
      rule => results[rule].$invalid,
    );
    return results;
  }
}

function validateModel(rules: Rules, value: any): Results {
  const ruleKeys: string[] = Object.keys(rules);

  return ruleKeys.reduce(
    (results: Results, ruleKey: string): Results => {
      const valueIsValid = rules[ruleKey](value);

      results[ruleKey] = valueIsValid;
      // Set to TRUE if at least one rule is not passed
      results.$invalid = !valueIsValid || results.$invalid;
      return results;
    },
    { $invalid: false },
  );
}

function isSingleRule(ruleset: Function) {
  return typeof ruleset === 'function';
}

function mapDynamicKeyName(k): string {
  return 'v$$' + k;
}

function buildDynamics(obj, fn): object {
  return reduceObj(
    obj,
    (build, val, key) => {
      build[mapDynamicKeyName(key)] = fn(val, key);
      return build;
    },
    {},
  );
}

function reduceObj(obj, fn, init): string[] {
  return reduceKeys(obj, (o, key) => fn(o, obj[key], key), init);
}

function reduceKeys(obj, fn, init): string[] {
  return Object.keys(obj).reduce(fn, init);
}
