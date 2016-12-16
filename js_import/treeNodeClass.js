var node = {
    val : null, // value of node
    refL : null, // right node if >
    refR : null, // left node if =<
    init : function(newVal) {
        this.val = newVal;
    },
    branch : function(newVal) {
        if (newVal > this.val) {
            if (this.refR === null) {
                this.refR = new node.init(newVal);
            } else {
                this.refR.branch(newVal);
            }
        } else if (newVal <= this.val) {
            if (this.refL === null) {
                this.refL = new node.init(newVal);
            } else {   
                this.refL.branch(newVal);
            }
        }
    },
    getPrintOut : function(currNode,level) {
        if (level === undefined) {
            level = 1;
        }
        // get current node
        var output = toString(currNode.val);
        alert('got into function : output = ' + output);
        
        // get left node or its branches
        if (currNode.refL !== null) {
            output += toString(getPrintOut(currNode.refL,level+1));
        }
        // get right node or its branches
        if (currNode.refR !== null) {
            output += "\t" + " "*level + toString(getPrintOut(currNode.refR,level+1));
        }
        return output;
    }
};

alert('asdas');
alert(node.val + " " + node.refL + " " + node.refR);
node.branch(1);
alert(node.val + " " + node.refL + " " + node.refR);

nodesToAdd = [5,3,7,2,4,6,0,9,8];


alert(node.getPrintOut(node));

node.branch(nodesToAdd[0]);

alert(node.getPrintOut(node));