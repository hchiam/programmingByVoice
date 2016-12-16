$.getScript("js_import/treeNodeClass.js", function(){
   // Remember to include jQuery in HTML file : <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
   var tree = new node(1);
   tree.branch(2);
   alert(tree.getPrintOut()); // test output (should pop-up "1\n\t\t2")
});