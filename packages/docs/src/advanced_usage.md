# Advanced usage

## Per component mixin

Alternatively it is possible to apply all the Vuelidate functionality to dedicated components via a mixin.

```vue
<script>
import { VuelidateMixin } from '@vuelidate/core'

export default {
  mixins: [VuelidateMixin],
  data(){ },
  validations() { }
}
</script>
```

Everything else is the same.

## Composition API

## Validating collections

## Validating nested forms
