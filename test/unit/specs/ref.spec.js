import { ref } from 'src/validators/common'
const vm = { id: Symbol('vm') };
const parentVm = { id: Symbol('parentVm'), vm };
describe('ref (common helper)', () => {
  it('should call function with given context & arguments if passed a function', () => {
    // testFn cannot be an arrow function as the injected 'this' context is being tested
    const testFn = function(...args) {
      return [this].concat(args);
    };
    expect(ref(testFn, vm, parentVm)).to.have.ordered.members([vm, parentVm]);
  });

  it('should return property of parentVm if passed a string', () => {
    expect(ref('id', vm, parentVm)).to.equal(parentVm.id);
  })

  it('should return a deep property of parentVm if passed a string containing \'.\'', () => {
    expect(ref('vm.id', vm, parentVm)).to.equal(vm.id);
  })

  it('should return undefined if string containing \'.\' is a deep property not yet defined', () => {
    expect(ref('vm.a.b', vm, parentVm)).to.equal(void 0);
  })
})
