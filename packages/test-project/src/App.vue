<template>
  <div id="app">
    <div class="navigation">
      <ul>
        <li>
          <router-link to="/">
            Simple Form
          </router-link>
        </li>
        <li>
          <router-link to="/async-simple">
            Async Form
          </router-link>
        </li>
        <li>
          <router-link to="/i18n-simple">
            i18n Simple Form
          </router-link>
        </li>
        <li>
          <router-link to="/old-api">
            Old api
          </router-link>
        </li>
        <li>
          <router-link to="/nested-validations">
            Nested Validations
          </router-link>
        </li>
        <li>
          <router-link to="/nested-ref">
            Nested Ref
          </router-link>
        </li>
        <li>
          <router-link to="/collection-validations">
            Collection Validations
          </router-link>
        </li>
        <li>
          <router-link to="/external-validations">
            External Validations
          </router-link>
        </li>
        <li>
          <router-link to="/nested-validations-with-scopes">
            Nested Validations with Scopes
          </router-link>
        </li>
        <li>
          <router-link to="/reward-early">
            $rewardEarly
          </router-link>
        </li>
      </ul>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
body {
  background: #203041;
  color: #f6f6f6;
}

pre {
  background: #1b2637;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 60px;
}

ul {
  list-style-type: none;
  display: flex;
  border-radius: 5px;
  background: #1b2637;
  padding: 8px 10px;

  li {
    margin: 0 5px;

    a {
      color: white;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
