import { LitElement, html, css } from 'lit';

export class TernaryNumber extends LitElement {
    static styles = css`
            :host { display: inline-block; padding: 10px; border: 1px solid #ccc; }
            .output { font-family: "Ubuntu Mono", sans-serif; font-size: 1.2em; }
        
            .rotate { transform: rotate(180deg); }
            .digit
            {
                width: 25px;
                height: 25px;
                display: inline-block;
                border: 1px solid #ccc;
                vertical-align: middle;
                text-align: center;
            }
            .sub
            {
                margin-left: -16px;
                display: inline-block;
                font-size: 12px;
                vertical-align: sub;
            }
      `;

    static properties = {
        decValue: { type: Number },
        balanced: { type: Boolean }
    }

    constructor() {
        super();

        this.unbalancedDigits = ["0"];
        this.balancedDigits = ["0"];
    }

    set decValue(value) {
        const old = this._decValue;
        this._decValue = Number(value);
        this.unbalancedDigits = this.toUnbalancedTernary(this._decValue);
        this.balancedDigits = this.toBalancedTernary(this._decValue);
        this.requestUpdate('decValue', old);
    }
    get decValue() {
        return this._decValue;
    }

    toUnbalancedTernary(value) {
        let digits = [];
        let cubicRoot = Math.floor(Math.cbrt(value));
        let remaining = value;

        for (let i = cubicRoot; i >= 0; i--) {
            let currPow = Math.pow(3, i);
            if (remaining >= currPow * 2) {
                remaining -= currPow * 2;
                digits.push("2");
            } else if (remaining >= currPow) {
                remaining -= currPow;
                digits.push("1");
            } else {
                digits.push("0");
            }
        }

        digits = this.removeLeadingZeros(digits);
        return digits;
    }

    toBalancedTernary(value) {
        let digits = [];
        let remaining = value;

        while (remaining !== 0) {
            let r = remaining % 3;
            remaining = Math.floor(remaining / 3);

            if (r === 2) {   // 2 → -1, carry 1
                digits.unshift("rot1");
                remaining += 1;
            } else {
                digits.unshift(r.toString());
            }
        }

        digits = this.removeLeadingZeros(digits);

        if (digits.length === 0)
            digits.push("0");

        return digits;
    }

    removeLeadingZeros(digits) {
        let result = [...digits];

        while (result.length > 1 && (result[0] === "0" || result[0] === 0))
            result.shift();

        return result;
    }

    render() {
        if (this.balanced) {
            return html`
                <div class="output">
                    ${this.balancedDigits.map(digit => {
                        const rotate = digit.startsWith("rot") ? "rotate" : "";
                        return html`<div class="digit ${rotate}">${digit.slice(-1)}</div>`;
                    })}
                    <div class="sub">&#x2329;3b&#x232A;</div>
                </div>`;
        }
        else {
            return html`
                <div class="output">
                    ${this.unbalancedDigits.map(digit => {
                        return html`<div class="digit">${digit}</div>`;
                    })}
                    <div class="sub">&#x2329;3u&#x232A;</div>
                </div>`;
        }
    }
}

customElements.define('ternary-number', TernaryNumber);