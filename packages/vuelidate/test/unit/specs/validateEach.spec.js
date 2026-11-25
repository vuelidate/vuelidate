import { computed, h, nextTick, reactive } from 'vue-demi'
import { mount, flushPromises } from '../test-utils'
import ValidateEach from '@vuelidate/components/src/ValidateEach'

const required = (value) => !!value

const mountValidateEach = () => {
  let captured
  const state = reactive({
    members: [{ human: true, name: '', nick: '' }]
  })
  const rulesPerMember = computed(() =>
    state.members.map((member) =>
      member.human
        ? { name: { required } }
        : { nick: { required } }
    )
  )
  const wrapper = mount({
    name: 'validateEachHarness',
    setup () {
      return () =>
        h(
          ValidateEach,
          { rules: rulesPerMember.value[0], state: state.members[0] },
          {
            default: ({ v }) => {
              captured = v
              return h('div')
            }
          }
        )
    }
  })
  return { wrapper, state, getV: () => captured }
}

describe('ValidateEach', () => {
  it('revalidates with new rules when the rules prop is replaced', async () => {
    const { state, getV } = mountValidateEach()
    await flushPromises()

    // initially the `human` rule set applies: `name` is required, `nick` has no rules
    expect(getV().name).toBeTruthy()
    expect(getV().nick).toBeUndefined()

    state.members[0].human = false
    await nextTick()
    await flushPromises()

    // after switching to non-human, the `nick` rule set should apply instead
    expect(getV().nick).toBeTruthy()
    expect(getV().name).toBeUndefined()

    // the new rules must be live: empty nick is invalid once dirty
    getV().nick.$touch()
    await flushPromises()
    expect(getV().nick.$invalid).toBe(true)
  })
})
