import { LitElement, html, css } from 'lit';

export class TernaryControl extends LitElement {
    static styles = css`
        .strip
        {
            padding: 8px;
            margin: 16px 0 0 0;
        }

        .blue
        {
            border-left: 4px solid #3700dd;
        }
        .purple
        {
            border-left: 4px solid #7800c0;
        }
        
        .title
        {
            font-weight: bold;
        }
    `;

    static properties = {
        name: { type: String },
        direction: { type: String },
        operandLeft: { type: Number },
        operandRight: { type: Number }
    }

    constructor() {
        super();
        this.name = 'ternary';
        this.direction = "output";
        this.operandLeft = 0;
        this.operandRight = 0;
    }

    convert() {
        let input = this.renderRoot.querySelector("#input");
        let decNumber = Number(input.value);

        let ternaryNumbers = this.renderRoot.querySelectorAll("ternary-number");
        for (let t of ternaryNumbers)
            t.decValue = decNumber;
    }

    execute() {
        //TODO
    }

    render() {
        const color = this.direction === "output" ? "purple" : "blue";
        return html`
            <p class="title">${this.name}</p>
            ${this.direction.startsWith("input") ?
                html`<label for="input">DEC:</label>
                    <input type="text" id="input" name="input" value="0" />
                    <button @click=${this.convert}>Convert</button>` :
                html`<label for="input">Operator:</label>
                    <select id="operator" name="operator">
                        <option selected>None</option>
                        <option>Add (+)</option>
                        <option>Sub (-)</option>
                        <option>Mul (*)</option>
                        <option>Div (/)</option>
                        <option>Rem (%)</option>
                    </select>
                    <button @click=${this.execute}>Execute</button>`
        }
        <div class="strip ${color}">
            <ternary-number class="${this.name}" color="${color}" decValue="0" balanced></ternary-number>
            <ternary-number class="${this.name}" color="${color}" decValue="0"></ternary-number>
            <ternary-number class="${this.name}" color="${color}" decValue="0" showComplement></ternary-number>
        </div>`;
    }
}


customElements.define('ternary-control', TernaryControl);