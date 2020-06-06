# Advanced usage

## Per component mixin

Alternatively it is possible to import a mixin directly to components in which it will be used.

```vue
<script>
import { VuelidateMixin } from '@vuelidate/core'

export default {
  mixins: [VuelidateMixin],
  validations() { }
}
</script>
```

## Composition API

## Validating nested forms
