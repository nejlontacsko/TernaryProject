import { LitElement, html, css } from 'lit';
import { calcService } from 'services';

export class TernaryNumber extends LitElement {
    static styles = css`
        :host { display: inline-block; padding: 10px; }
        .output { font-family: "Ubuntu Mono", sans-serif; font-size: 1.2em; }

        .zerofill { color: #444444; }
        .rotate { transform: rotate(180deg); }
        .digit
        {
            width: 25px;
            height: 25px;
            display: inline-block;
            
            vertical-align: middle;
            text-align: center;
        }
        
        .sub
        {
            margin-left: -10px;
            display: inline-block;
            font-size: 12px;
            vertical-align: sub;
        }
    
        .blue
        {
            border: 2px solid #3700dd;
        }
        .purple
        {
            border: 2px solid #7800c0;
        }
    `;

    static properties = {
        decValue: { type: Number },
        balanced: { type: Boolean },
        showComplement: { type: Boolean },
        color: { type: String }
    }

    constructor() {
        super();

        this.balanced = false;
        this.showComplement = false;

        this.unbalancedDigits = ["0"];
        this.unbalancedComplement = ["0"]
        this.balancedDigits = ["0"];
    }

    padArray(arr, targetLength) {
        const diff = Math.abs(targetLength - arr.length);
        if (diff > 0)
            return Array(diff).fill("fil0").concat(arr);
        return arr;
    }

    set decValue(value) {
        this._decValue = Number(value);
        this._sign = this._decValue < 0;
        this._decValue = Math.abs(this._decValue);

        this.unbalancedDigits = this.toUnbalancedTernary(this._decValue);
        calcService.digitCount = this.unbalancedDigits.length;

        this.balancedDigits = this.toBalancedTernary(this._decValue);
        calcService.digitCount = this.balancedDigits.length;

        if (this._sign) {
            this.unbalancedDigits = ["-", ...this.toUnbalancedTernary(this._decValue)]
            calcService.digitCount = this.unbalancedDigits.length;
            this.unbalancedComplement = this.makeComplement(this._decValue, calcService.digitCount);

            this.balancedDigits = this.invert(this.balancedDigits);
            calcService.digitCount = this.balancedDigits.length;
        }

        this.unbalancedDigits = this.padArray(this.unbalancedDigits, calcService.digitCount);
        this.unbalancedComplement = this.padArray(this.unbalancedComplement, calcService.digitCount);
        this.balancedDigits = this.padArray(this.balancedDigits, calcService.digitCount);

        this.requestUpdate('decValue');
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

    makeComplement(value, len) {
        let modulus = Math.pow(3, len);
        let comp = (modulus - value) % modulus;
        return this.toUnbalancedTernary(comp);
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

    invert(digits) {
        let res = [];
        for (let i = 0; i < digits.length; i++) {
            if (digits[i] === "1")
                res.push("rot1");
            else if (digits[i] === "rot1")
                res.push("1");
            else
                res.push(digits[i]);
        }
        return res;
    }

    connectedCallback() {
        super.connectedCallback();
        calcService.addEventListener("length-changed", this._onLength);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        calcService.removeEventListener("length-changed", this._onLength);
    }

    _onLength = (e) => {
        this.latest = e.detail;
        this.decValue = this._decValue;
    };

    render() {
        if (this.balanced) {
            return html`
                <div class="output">
                    ${this.balancedDigits.map(digit => {
                        const fill = digit.startsWith("fil") ? "zerofill" : "";
                        const rotate = digit.startsWith("rot") ? "rotate" : "";
                        return html`<div class="digit ${this.color} ${rotate} ${fill}">${digit.slice(-1)}</div>`;
                    })}
                    <div class="sub">&#x2329;3b&#x232A;</div>
                </div>`;
        }
        else if (this.showComplement) {
            return html`
                <div class="output">
                    ${this.unbalancedComplement.map(digit => {
                        const fill = digit.startsWith("fil") ? "zerofill" : "";
                        return html`<div class="digit ${this.color} ${fill}">${digit.slice(-1)}</div>`;
                    })}
                    <div class="sub">&#x2329;3c&#x232A;</div>
                </div>`;
        }
        else {
            return html`
                <div class="output">
                    ${this.unbalancedDigits.map(digit => {
                        const fill = digit.startsWith("fil") ? "zerofill" : "";
                        return html`<div class="digit ${this.color} ${fill}">${digit.slice(-1)}</div>`;
                    })}
                    <div class="sub">&#x2329;3u&#x232A;</div>
                </div>`;
        }
    }
}