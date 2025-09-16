import { LitElement, html, css } from 'lit';

export class TernaryControl extends LitElement {
    static styles = css`
        .strip { background-color: #888888; }
        .input { color: #3700dd; }
        .output { color: #7800c0; }
    `;
    static properties = {
        name: { type: String },
        direction: { type: String }
    }

    constructor() {
        super();
        this.name = 'ternary';
        this.direction = "output";
    }

    convert() {
        let input = this.renderRoot.querySelector("#input");
        let decNumber = Number(input.value);

        let ternaryNumbers = this.renderRoot.querySelectorAll("ternary-number");
        for (let t of ternaryNumbers)
            t.decValue = decNumber;
    }

    render() {
        return html`
            ${this.direction.startsWith("input") ?
                html`<label for="input">DEC:</label>
                    <input type="text" id="input" name="input" value="0" />
                    <button @click=${this.convert}>Convert</button>` : ``
        }
        <div class="strip ${this.direction}">
            <ternary-number class="${this.name}" decValue="0" balanced></ternary-number>
            <ternary-number class="${this.name}" decValue="0"></ternary-number>
        </div>`;
    }
}


customElements.define('ternary-control', TernaryControl);