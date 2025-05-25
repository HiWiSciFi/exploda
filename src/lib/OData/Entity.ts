import Edm from "./EdmTypes";

export class ODataProperty {
    key: boolean;
    type: Edm.DataType;
    value?: Edm.Data;

    constructor() {
        this.key = false;
        this.type = Edm.DataType.Null;
        this.value = new Edm.Null();
    }
}

export class ODataEntity {
    properties: Map<string, ODataProperty>;

    constructor() {
        this.properties = new Map<string, ODataProperty>();
    }
}
