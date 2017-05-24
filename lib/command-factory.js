
const RemoveAllHighlightsCommand = require('./commands/remove-all-highlights');
const UnhighlightCommand = require('./commands/unhighlight');
const ColourRegistry = require('./colour-registry');
const ConfigStore = require('./config-store');
const Debouncer = require('./debouncer');
const DecorationOperatorFactory = require('./decoration-operator-factory');
const DecorationRefresher = require('./decoration-refresher');
const DecorationRegistry = require('./decoration-registry');
const HighlightPatternPicker = require('./highlight-pattern-picker');
const HighlightUsingRegexCommand = require('./commands/highlight-using-regex');
const ToggleHighlightCommand = require('./commands/toggle-highlight');
const RegexReader = require('./regex-reader');
const SelectedTextFinder = require('./selected-text-finder');
const TextDecorator = require('./text-decorator');
const TextLocator = require('./text-locator');
const generateUuid = require('uuid/v4');

class CommandFactory {

    constructor({vscode, logger}) {
        this._vscode = vscode;
        this._logger = logger;
    }

    createToggleHighlightCommand() {
        return new ToggleHighlightCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            selectedTextFinder: new SelectedTextFinder(),
            logger: this._logger,
            vsWindow: this._vscode.window
        });
    }

    createHighlightUsingRegex() {
        return new HighlightUsingRegexCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            logger: this._logger,
            regexReader: new RegexReader({vsWindow: this._vscode.window}),
            vsWindow: this._vscode.window
        });
    }

    createUnhighlightCommand() {
        const highlightPatternPicker = new HighlightPatternPicker({
            decorationRegistry: this._getDecorationRegistry(),
            vsWindow: this._vscode.window
        });
        return new UnhighlightCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            logger: this._logger,
            vsWindow: this._vscode.window,
            highlightPatternPicker
        });
    }

    createRemoveAllHighlightsCommand() {
        return new RemoveAllHighlightsCommand({
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            logger: this._logger,
            vsWindow: this._vscode.window
        });
    }

    createDecorationRefresher() {
        return new DecorationRefresher({
            debouncer: new Debouncer({configStore: this._getConfigStore()}),
            decorationOperatorFactory: this._getDecorationOperatorFactory(),
            logger: this._logger,
            vsWindow: this._vscode.window
        });
    }

    _getDecorationOperatorFactory() {
        this._decorationOperatorFactory = this._decorationOperatorFactory || this._createDecorationOperatorFactory();
        return this._decorationOperatorFactory;
    }

    _getConfigStore() {
        this._configStore = this._configStore || new ConfigStore({workspace: this._vscode.workspace});
        return this._configStore;
    }

    _getDecorationRegistry() {
        this._decorationRegistry = this._decorationRegistry || this._createDecorationRegistry();
        return this._decorationRegistry;
    }

    _createDecorationOperatorFactory() {
        const textLocator = new TextLocator({Range: this._vscode.Range});
        return new DecorationOperatorFactory({
            textDecorator: new TextDecorator({textLocator}),
            decorationRegistry: this._getDecorationRegistry()
        });
    }

    _createDecorationRegistry() {
        const colourRegistry = new ColourRegistry({configStore: this._getConfigStore()});
        return new DecorationRegistry({
            colourRegistry,
            generateUuid,
            window: this._vscode.window
        });
    }

}

module.exports = CommandFactory;