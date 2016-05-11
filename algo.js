/*
* O(n^2) solution
* Uses a sweep line algorithm, the endpoints of the rectangles are sorted in the events array.
* We also store the currently highest rectangle.
* open_rect holds all the rectangles the sweep line is currently intersecting
* On a rectangle starts event we add this rectangle to open_rect. If the new rectangle is higher than the current one, then we the currently highest rect and add new points
* On a rectangle ends event we delete this rectangle from open_rect. Also we check if the ended rectangle is the currently highest. If yes, we update the currently highest rect (use open_rect)
* To make the algorithm into O(n log n) we need the getMax, delete, and add operation of open_rect to be in O(log n) -> Either priority queue or balanced tree. 
* */
function shape(rect) {
    //create events: start and end points of rectangles, the events hold the x coordinates and the ids of the rectangles
    var events = [];
    for (var i = 0; i < rect.length; ++i) {
        events.push([rect[i][0], i]);
        events.push([rect[i][1], i]);
    }
    //compare function
    var comp = function (x, y) {
        var x1 = x[0];
        var y1 = y[0];
        var hx = rect[x[1]][2];
        var hy = rect[y[1]][2];
        if (x1 == y1 && hx == hy) //start points before end points
            return (x1 == rect[x[1]][0]) ? -1 : 1;
        if (x1 == y1) // hight of the rectangle
            return hy - hx;
        else //else x coordinate
            return x1 - y1;
    };
    events.sort(comp);
    // res contains the points
    var res = [];
    var cur_rect = -1;
    var cur_h = 0;
    var open_rect = {};
    for (var i = 0; i < events.length; ++i) {
        var e_x = events[i][0];
        var e_id = events[i][1];
        var e_h = rect[e_id][2];
        if (e_x == rect[e_id][0]) {//rectangle starts
            open_rect[e_id] = 1;
            if (e_h > cur_h) { //only if the new rectangle is higher then the current highest
                res.push([e_x, cur_h]);
                res.push([e_x, e_h]);
                cur_rect = e_id;
                cur_h = e_h;
            }
        }
        else{//rectangle ends
            delete open_rect[e_id];
            if(e_id == cur_rect){
                var tmp_rect = -1;
                var tmp_h = 0;
                for (var j in open_rect){
                    if (rect[j][1] > e_x && rect[j][2] > tmp_h){
                        tmp_rect = j;
                        tmp_h = rect[j][2];
                    }
                }
                if(cur_h != tmp_h){ // if the rectangle start at the same height dont add points
                    res.push([e_x, cur_h]);
                    res.push([e_x, tmp_h]);
                }
                cur_h = tmp_h;
                cur_rect = tmp_rect;
            }
        }
    }
    return res;
}