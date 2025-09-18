import { LitElement, html, css } from 'lit';
import { calcService } from 'services';

export class TernaryControl extends LitElement {
    static styles = css`
        .strip
        {
            padding: 8px;
            margin: 16px 0 0 0;
        }

        .blue { border-left: 4px solid #3700dd; }
        .purple { border-left: 4px solid #7800c0; }
        
        .title { font-weight: bold; }
        
        ul.radix { margin: 0; }
        ul.radix li { list-style: none; }
    `;

    static properties = {
        name: { type: String },
        direction: { type: String }
    }

    constructor() {
        super();
        this.name = 'ternary';
        this.direction = "output";
        this.latest = {};
    }

    convertValue() {
        let input = this.renderRoot.querySelector("#input");
        let decNumber = Number(input.value);

        let ternaryNumbers = this.renderRoot.querySelectorAll("ternary-number");
        for (let t of ternaryNumbers)
            t.decValue = decNumber;

        calcService.setProperty(this.name, decNumber);
    }

    setOperator() {
        let selectElement = this.renderRoot.querySelector("#operator");
        let selectedValue = selectElement.selectedOptions[0].text
        calcService.setProperty("Operator", selectedValue);
    }

    execute() {
        calcService.execute();
    }

    connectedCallback() {
        super.connectedCallback();
        calcService.addEventListener("data-changed", this._onData);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        calcService.removeEventListener("data-changed", this._onData);
    }

    _onData = (e) => {
        this.latest = e.detail;
        if (this.direction === "output")
            this.requestUpdate();
    };

    render() {
        const color = this.direction === "output" ? "purple" : "blue";
        return html`
            <p class="title">${this.name}</p>
            ${this.direction.startsWith("input") ?
                html`<label for="input">DEC:</label>
                    <input type="text" id="input" name="input" value="0" />
                    <button @click=${this.convertValue}>Convert</button>` :
                html`<label for="operator">Operator:</label>
                    <select id="operator" name="operator">
                        <option selected>None</option>
                        <option>Add (+)</option>
                        <option>Sub (-)</option>
                        <option>Mul (*)</option>
                        <option>Div (/)</option>
                        <option>Rem (%)</option>
                    </select>
                    <button @click=${this.setOperator}>Set</button><br />
                    Execute calculation in
                    <ul class="radix">
                        <li><input type="radio" name="radix" value="dec" checked /> Decimal</li>
                        <li><input type="radio" name="radix" value="ter" disabled /> Ternary (Soon...)</li>
                    </ul>
                    <button @click=${this.execute}>Execute</button>`
        }
        <div class="strip ${color}">
            <ternary-number class="${this.name}" color="${color}" decValue="${this.latest[this.name]}" balanced></ternary-number>
            <ternary-number class="${this.name}" color="${color}" decValue="${this.latest[this.name]}"></ternary-number>
            <ternary-number class="${this.name}" color="${color}" decValue="${this.latest[this.name]}" showComplement></ternary-number>
        </div>`;
    }
}