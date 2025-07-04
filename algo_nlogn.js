/*
 * O(n log n) solution
 * Uses a sweep line algorithm, the endpoints of the rectangles are sorted in the events array.
 * We also store the currently highest rectangle.
 * open_rect holds all the rectangles the sweep line is currently intersecting
 * On a rectangle starts event we add this rectangle to open_rect. If the new rectangle is higher than the current one, then we update the currently highest rect and add new points
 * On a rectangle ends event we delete this rectangle from open_rect. Also we check if the ended rectangle is the currently highest. If yes, we update the currently highest rect (use open_rect)
 * To make the algorithm into O(n log n) we need the getMax, delete, and add operations of open_rect to be in O(log n) -> Either priority queue or balanced tree.
 * The format of rectangles is [x0, x1, h], where x0 is the left x coordinate, x1 the right x coordinate and h the height of the rectangle.
 * */
function skyline(rect) {
    //create events: start and end points of rectangles, the events hold the x coordinates and the ids of the rectangles
    var events = [];
    for (var i = 0; i < rect.length; ++i) {
        events.push([rect[i][0], i]);
        events.push([rect[i][1], i]);
    }
    //compare function
    var comp = function (r1, r2) {
        var r1x = r1[0];
        var r2x = r2[0];
        var r1h = rect[r1[1]][2];
        var r2h = rect[r2[1]][2];
        var r1s = (r1x == rect[r1[1]][0]) ? 0 : 1; // 0 if r1 is a start point, 1 otherwise
        var r2s = (r2x == rect[r2[1]][0]) ? 0 : 1;
        if(r1x != r2x) // x coordinate
            return r1x - r2x;
        if(r1s != r2s) //start points before end points
            return r1s - r2s;
        return r2h - r1h; // height of the rectangle
    };
    events.sort(comp);
    // res contains the desired points
    var res = [];
    var cur_rect = null; //the currently highest rectangle
    var open_rect = new AVLTree(function (x1, x2) { //x[0] is the height and x[1] the id of the rectangles
        return (x1[0] != x2[0]) ? x2[0] - x1[0] : x1[1] - x2[1]; // given the ids of the rect, compare their heights
    });
    for (i = 0; i < events.length; ++i) {
        var e_x = events[i][0];
        var e_id = events[i][1];
        var e_h = rect[e_id][2];
        var cur_h = (cur_rect == null) ? 0 : rect[cur_rect][2];
        if (e_x == rect[e_id][0]) {//rectangle starts
            open_rect.insert([e_h, e_id], e_id);
            if (e_h > cur_h) { //only if the new rectangle is higher then the current highest
                res.push([e_x, cur_h]);
                res.push([e_x, e_h]);
                cur_rect = e_id;
            }
        }
        else{//rectangle ends
            open_rect.erase([e_h, e_id]);
            if(e_id == cur_rect){
                cur_rect = open_rect.getMin();
                var new_h = (cur_rect == null) ? 0 : rect[cur_rect][2];
                if(cur_h != new_h){ // if the new current rectangle is at the same height don't add points
                    res.push([e_x, cur_h]);
                    res.push([e_x, new_h]);
                }
            }
        }
    }
    return res;
}