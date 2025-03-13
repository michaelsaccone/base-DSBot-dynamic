import {property, schema} from "@axarai/axar";


@schema()
class SubscribeSchema {

    @property("The email to subscribe")
    email: string;

}

export default SubscribeSchema;
