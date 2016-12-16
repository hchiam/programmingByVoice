function test() {
    alert('test');
}

function run() {
    function node(val) {
        this.val = val; // value of node
        this.refL = null; // right node if >
        this.refR = null; // left node if =<
        this.branch = function(newVal) {
            if (newVal > this.val) {
                if (this.refR === null) {
                    this.refR = new node(newVal);
                } else {
                    this.refR.branch(newVal);
                }
            } else if (newVal <= this.val) {
                if (this.refL === null) {
                    this.refL = new node(newVal);
                } else {   
                    this.refL.branch(newVal);
                }
            }
        };
        this.getPrintOut = function(currNode, level) {
            if (level === undefined) {
                level = 1;
            }
            // get current node
            var output = currNode.val;
            
            // get left node or its branches
            if (currNode.refL !== null) {
                output += "" + currNode.refL.getPrintOut(currNode.refL, level+1);
            }
            // get right node or its branches
            if (currNode.refR !== null) {
                output += "\n\t" + Array(level).join("\t") + currNode.refR.getPrintOut(currNode.refR, level+1);
            }
            return output;
        };
    }
    
    function test() {
        alert('START TREE TEST');
        var tree = new node(1);
        alert(tree.getPrintOut(tree));
        tree.branch(2);
        alert(tree.getPrintOut(tree));
        nodesToAdd = [5,3,7,2,4,6,0,9,8,3,1,4,1,5,9,2,6,5,3,5,8,9,7,9,3,2,3,8,4,6];
        alert(nodesToAdd.length);
        for (i=0; i<nodesToAdd.length; i++) {
            tree.branch(nodesToAdd[i]);
            alert(tree.getPrintOut(tree));
        }
        alert('DONE TREE TEST');
    }
    
    test();
    
}