import Vue, { PluginFunction } from 'vue';

export interface Rules {
  [key: string]: () => void;
}

export interface Declarations {
  [key: string]: Rules;
}

export interface Results {
  $invalid: boolean;
  [key: string]: boolean | Results;
}

export interface Computed {
  dynamicKeys?: [string];
  dirty?: boolean;
  $invalid: () => boolean;
  $dirty: () => boolean;
  $error: () => boolean;
  [key: string]: any;
}

declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
    $v: object;
    [key: string]: any;
  }
}
