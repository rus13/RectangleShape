/*
* O(n^2) solution
* Uses kind of sweep line algorithm, the endpoints of the rectangles are sorted in the events array
* open_rect holds all the rectangles the sweep line is intersecting
* To make the algorithm into O(n log n) we need to make open rect into a priority queue with getMax, delete, and add operation in O(log n)
* */
function shape(rect) {
    var events = [];
    for (var i = 0; i < rect.length; ++i) {
        events.push([rect[i][0], i]);
        events.push([rect[i][1], i]);
    }
    var comp = function (x, y) {
        var x1 = x[0];
        var y1 = y[0];
        var hx = rect[x[1]][2];
        var hy = rect[y[1]][2];
        if (x1 == y1 && hx == hy)
            return (x1 == rect[x[1]][0]) ? -1 : 1;
        if (x1 == y1)
            return hy - hx;
        else
            return x1 - y1;
    };
    events.sort(comp);
    var res = [];
    var cur_rect = -1;
    var cur_h = 0;
    var open_rect = {};
    for (var i = 0; i < events.length; ++i) {
        var e_x = events[i][0];
        var e_id = events[i][1];
        var e_h = rect[e_id][2];
        if (e_x == rect[e_id][0]) {// rectangle starts
            if (e_h > cur_h) {
                res.push([e_x, cur_h]);
                res.push([e_x, e_h]);
                cur_rect = e_id;
                cur_h = e_h;
            }
            open_rect[e_id] = 1;
        }
        else{//rectangle ends
            if(e_id == cur_rect){
                res.push([e_x, cur_h]);
                cur_rect = -1;
                cur_h = 0;
                for (var j in open_rect){
                    if (rect[j][1] > e_x && rect[j][2] > cur_h){
                        cur_rect = j;
                        cur_h = rect[j][2];
                    }
                }
                res.push([e_x, cur_h]);
            }
            delete open_rect[e_id];
        }
    }
    return res;
}