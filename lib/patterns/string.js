
const AbstractPattern = require('./abstract');

class StringPattern extends AbstractPattern {

    get type() {
        return 'String';
    }

    get displayText() {
        return this._phrase;
    }

    _findCandidateRanges(text) {
        const memo = {
            ranges: [],
            lastOffset: 0
        };
        const textInFrontOfSelectedText = this._getTextForComparison(text)
                .split(this._getPhraseForComparison())
                .slice(0, -1);
        const finalMemo = textInFrontOfSelectedText.reduce((memo, textInFront) => {
            const start = memo.lastOffset + textInFront.length;
            const end = start + this._phrase.length;
            return {
                ranges: memo.ranges.concat({start, end}),
                lastOffset: end
            };
        }, memo);
        return finalMemo.ranges;
    }

    _getPhraseForComparison() {
        return this.ignoreCase ? this._phrase.toLowerCase() : this._phrase;
    }

    _getTextForComparison(text) {
        return this.ignoreCase ? text.toLowerCase() : text;
    }

    toggleCaseSensitivity() {
        return new StringPattern({
            phrase: this._phrase,
            ignoreCase: !this.ignoreCase,
            wholeMatch: this.wholeMatch
        });
    }

    toggleWholeMatch() {
        return new StringPattern({
            phrase: this._phrase,
            ignoreCase: this.ignoreCase,
            wholeMatch: !this.wholeMatch
        });
    }

}

module.exports = StringPattern;