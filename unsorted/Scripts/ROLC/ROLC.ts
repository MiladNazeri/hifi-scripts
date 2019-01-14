class NodePoint {
    name: string;
    data: any;
    constructor(newName: string) {
        this.name = newName;
    }
    getName() {
        return this.name;
    }
    getData() {
        return this.data;
    }
}

class ROLC {
    nodeStore: Array<NodePoint>;
    getNodeStore() {
        return this.nodeStore;
    }
    addNode(newNode: NodePoint) {
        this.nodeStore.push(newNode);
    }
}

 
class Reference extends ROLC {

}

class Organize extends ROLC {

}

class Learn extends ROLC {

}

class Create extends ROLC {

}

let reference = new Reference();



/*

Nodefgrt54


Reference
Organize
Learn
Create


*/