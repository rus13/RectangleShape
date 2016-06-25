function Node(key, data) {
    this.key = key;
    this.data = data;
    this.height = 1;
    this.left = null;
    this.right = null;
    this.parent = null;
}

function AVLTree(comp_func) {
    var root = null;
    var comp = (comp_func != null) ? comp_func : (function (x, y) {
        return x - y;
    });
    
    this.getMin = function () {
        var m = minNode(root);
        return (m == null) ? null : m.data;
    };
    
    this.find = function(key) {
        var z = getNode(root, key);
        return (z == null) ? null : z.data;
    };

    this.insert = function(key, data) {
        var z = new Node(key, data);
        insertNode(root, z);
        // fix the balanced property
        avl_fix_up_insert(z.parent);
    };

    this.erase = function(key) {
        var z = getNode(root, key);
        if (z != null) {
            z = deleteNode(z);
            // fix the balanced property
            avl_fix_up_delete(z);
        }
    };

    function minNode(x) {
        if (x == null || x.left == null)
            return x;
        return minNode(x.left);
    }

    function getNode(x, key) {
        if (x == null || comp(key, x.key) == 0)
            return x;
        if (comp(key, x.key) < 0)
            return getNode(x.left, key);
        else
            return getNode(x.right, key);
    }

    function successorNode(x) {
        if (x.right != null)
            return minNode(x.right);
        var y = x.parent;
        while (y != null && x == y.right) {
            x = y;
            y = y.parent;
        }
        return y;
    }

    // standard insert of a binary tree
    function insertNode(x, z) {
        if (x == null) { // case 1 : empty tree
            root = z;
            z.parent = null;
            return;
        }
        if (comp(x.key, z.key) > 0) { // case 2 : insert in the left subtree
            if (x.left == null) {
                x.left = z;
                z.parent = x;
            }
            else
                insertNode(x.left, z);
        }
        else { // case 3 : insert in the right subtree
            if (x.right == null) {
                x.right = z;
                z.parent = x;
            }
            else
                insertNode(x.right, z);
        }
    }

    /*
    * Standard delete of a binary tree
    * */
    function deleteNode(z) {
        var y, x;
        // select y to splice out
        y = (z.left == null || z.right == null) ? z : successorNode(z);
        // x is child of y (or null)
        x = (y.left != null) ? y.left : y.right;
        if (x != null)
            x.parent = y.parent;
        if (y.parent == null)
            root = x;
        else {
            if (y.parent.left == y) {
                y.parent.left = x;
            }
            else
                y.parent.right = x;
        }
        if (y != z) {
            z.key = y.key;
            z.data = y.data;
        }
        return y.parent;
    }

    /*
     * Functions used to fix the balanced property of the tree
     * */
    function fixHeight(x){
        if(x == null)
            return;
        x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
    }

    function getHeight(x){
        if(x == null)
            return 0;
        return x.height;
    }
    
    function balance(x) {
        if (x == null)
            return 0;
        return getHeight(x.left) - getHeight(x.right);
    }
    
    function leftRotate(x) {
        if (x != null && x.right != null) {
            var z = x.right;
            x.right = z.left;
            if(z.left != null)
                z.left.parent = x;
            z.left = x;
            z.parent = x.parent;
            x.parent = z;
            if (z.parent == null)
                root = z;
            else {
                if (z.parent.left == x) {
                    z.parent.left = z;
                }
                else
                    z.parent.right = z;
            }
            //fix height
            fixHeight(x);
            fixHeight(z);
        }
    }

    function rightRotate(z) {
        if (z != null && z.left != null) {
            var x = z.left;
            z.left = x.right;
            if(x.right != null)
                x.right.parent = z;
            x.right = z;
            x.parent = z.parent;
            z.parent = x;
            if (x.parent == null)
                root = x;
            else {
                if (x.parent.left == z) {
                    x.parent.left = x;
                }
                else
                    x.parent.right = x;
            }
            //fix height
            fixHeight(z);
            fixHeight(x);
        }
    }

    function doubleRightRotate(x) {
        leftRotate(x.left);
        rightRotate(x);
    }

    function doubleLeftRotate(x) {
        rightRotate(x.left);
        leftRotate(x);
    }

    function doRotationInsert(v) {
        if (balance(v) == -2) {// insert in right subtree
            if (balance(v.right) == -1)
                leftRotate(v);
            else
                doubleLeftRotate(v);
        }
        else {// insert in left subtree
            if (balance(v.left) == 1)
                rightRotate(v);
            else
                doubleRightRotate(v);
        }
    }

    function avl_fix_up_insert(v) {
        if(v == null)
            return;
        fixHeight(v);
        if (balance(v) == 2 || balance(v) == -2)
            doRotationInsert(v);
        if (balance(v) == 0)
            return;
        avl_fix_up_insert(v.parent)
    }

    function doRotationDelete(v) {
        if (balance(v) == -2) {// deletion in left subtree
            if (balance(v.right) == 0 || balance(v.right) == -1)
                leftRotate(v);
            else
                doubleLeftRotate(v);
        }
        else {// deletion in right subtree
            if (balance(v.left) == 0 || balance(v.left) == 1)
                rightRotate(v);
            else
                doubleRightRotate(v);
        }
    }

    function avl_fix_up_delete(v) {
        if(v == null)
            return;
        fixHeight(v);
        if (balance(v) == 2 || balance(v) == -2)
            doRotationDelete(v);
        if (balance(v) == 1 || balance(v) == -1)
            return;
        avl_fix_up_delete(v.parent)
    }
}