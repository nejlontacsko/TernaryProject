export class CalcService extends EventTarget {
    #data = {};
    #digitCount = 0;

    get data() {
        return this.#data;
    }

    set data(value) {
        if (this.#data !== value) {
            console.log(value);
            this.#data = value;
            this.dispatchEvent(new CustomEvent("data-changed", {
                detail: this.#data
            }));
        }
    }

    get digitCount() {
        return this.#digitCount;
    }

    set digitCount(value) {
        let prev = this.#digitCount;
        this.#digitCount = Math.max(this.#digitCount, value);
        if (prev !== this.#digitCount) {
            console.log("Length: " + this.#digitCount + " digits.");
            this.dispatchEvent(new CustomEvent("length-changed", {
                detail: this.#digitCount
            }));
        }
    }

    resetLength() {
        this.#digitCount = 0;
    }

    setProperty(property, value) {
        // Direct access to a property of #data wouldn't trigger the setter's event.
        const local = structuredClone(this.data);
        local[property] = value;
        this.data = local;
    }

    execute() {
        const requiredKeys = ["Operand Left", "Operand Right", "Operator"];
        const allExistAndValid = requiredKeys.every(
            key => Object.hasOwn(this.#data, key) && typeof this.#data[key] !== "undefined"
        );

        if (!allExistAndValid || this.#data["Operator"] === "None") {
            this.setProperty("Result", 0);
            return false;
        }

        const operators = {
            "Add (+)": (a, b) => a + b,
            "Sub (-)": (a, b) => a - b,
            "Mul (*)": (a, b) => a * b,
            "Div (/)": (a, b) => a / b,
            "Rem (%)": (a, b) => a % b
        };

        this.result = operators[this.#data["Operator"]](
            Number(this.#data["Operand Left"]),
            Number(this.#data["Operand Right"]));

        this.setProperty("Result", this.result);
        return true;
    }
}