import Vue = require('vue');
import Component from 'vue-class-component';
import { IVuelidate, ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';
import { assert, expect } from 'chai';

function predicate(value: any): boolean {
    return value ? true : false;
}

function predicateFactory(param: number): (value: any) => boolean {
    return (value) => predicate(value);
}

interface IComplexProp {
    value1: string;
    value2?: number;
}

type SimpleProp = string;

interface IComponentData {
    simpleProp: SimpleProp;
    complexProp: IComplexProp;
    simpleCollection: Array<SimpleProp>;
    complexCollection: Array<IComplexProp>;
    validationGroup: string[];
};

let validations: ValidationRuleset<IComponentData> = {
    simpleProp: {
        predicate
    },
    complexProp: {
        value1: {
            predicate,
            funcGen: predicateFactory(1)
        },
        value2: {
            predicate,
            funcGen: predicateFactory(1)
        }
    },
    simpleCollection: {
        $each: {
            predicate
        }
    },
    complexCollection: {
        $each: {
            value1: {
                predicate,
                funcGen: predicateFactory(1)
            }
        }
    },
    validationGroup: ['simpleProp', 'complexProp.value2']
};

@Component({
    mixins: [validationMixin],
    name: 'RulesetTest',
    template: '<div></div>',
    validations: validations
})
class TestComponent extends Vue implements IVuelidate<IComponentData> {

    constructor() {
        super();
    }

    simpleProp: string = 'true';

    complexProp: IComplexProp = {
        value1: '',
        value2: 1
    }

    simpleCollection: SimpleProp[] = ['A', 'B', 'C'];

    complexCollection: IComplexProp[] = [
        { value1: 'A' },
        { value1: 'B' },
        { value1: 'C' }
    ];

    simpleMethod(): boolean {
        return this.$v.complexProp.$dirty;
    }

    $v: Vuelidate<IComponentData>
}

describe('Typescript', () => {

    it('should have a $v key defined when validationMixin is injected', () => {
        const vm = new TestComponent();
        expect(vm.$v).to.exist;
    })

    it('should have $error set to false on initialization', () => {
        const vm = new TestComponent();
        expect(vm.$v.complexProp.$error).to.be.false;
    })

    it('should have a $v key accessible to instance member calls', () => {
        const vm = new TestComponent();
        expect(vm.simpleMethod()).to.be.false;
    })

    it('should apply validation rules to simple properties', () => {
        const vm = new TestComponent();
        vm.$v.simpleProp.$touch();
        expect(vm.$v.simpleProp.$error).to.be.false;
    })

    it('should apply validation rules to collection of simple properties', () => {
        const vm = new TestComponent();
        vm.$v.simpleCollection.$touch();
        for (let i = 0; i < vm.$v.simpleCollection.length; i++) {
            let item = vm.$v.simpleCollection.$each[i];
            expect(item.$dirty).to.be.true;
            expect(item.$error).to.be.false;
        }
    })

    it('should apply validation rules to complex properties', () => {
        const vm = new TestComponent();
        vm.$v.complexProp.$touch();
        expect(vm.$v.complexProp.value1.$error).to.be.true;
    })

    it('should apply validation rules to collection of complex properties', () => {
        const vm = new TestComponent();
        vm.$v.complexCollection.$touch();
        for (let i = 0; i < vm.$v.complexCollection.length; i++) {
            let item = vm.$v.complexCollection.$each[i];
            expect(item.$dirty).to.be.true;
            expect(item.value1.$error).to.be.false;
        }
    })

    it('should have $invalid set to false when all in group pass', () => {
        const vm = new TestComponent();
        expect(vm.$v.validationGroup.$invalid).to.be.false;
    })

    it('should have $invalid set to true when one in group fails', () => {
        const vm = new TestComponent();
        vm.simpleProp = null;
        expect(vm.$v.simpleProp.$invalid).to.be.true;
        expect(vm.$v.validationGroup.$invalid).to.be.true;
    })

});