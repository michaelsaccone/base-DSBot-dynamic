import {property, schema} from "@axarai/axar";

@schema()
class FractionSchema {
    @property("First number of the sum")
    a: number;

    @property("Second number of the sum")
    b: number;

    @property("Dividend")
    c: number;

}

export default FractionSchema;
