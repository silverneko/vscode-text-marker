import DecorationOperator from './decoration-operator';
import PatternConverter from './pattern-converter';
import DecorationRegistry from './decoration-registry';
import TextDecorator from './text-decorator';
import WindowComponent from './editor-components/window';
import TextEditor from './text-editor';

export default class DecorationOperatorFactory {
    private readonly decorationRegistry: DecorationRegistry;
    private readonly textDecorator: TextDecorator;
    private readonly patternConverter: PatternConverter;
    private readonly windowComponent: WindowComponent;

    constructor(decorationRegistry: DecorationRegistry, textDecorator: TextDecorator, windowComponent: WindowComponent) {
        this.decorationRegistry = decorationRegistry;
        this.textDecorator = textDecorator;
        this.windowComponent = windowComponent;
        this.patternConverter = new PatternConverter();
    }

    createForVisibleEditors() {
        return this.create(this.windowComponent.visibleTextEditors);
    }

    create(editors: TextEditor[]) {
        return new DecorationOperator(editors, this.decorationRegistry, this.textDecorator, this.patternConverter);
    }

}