"use strict";
var User;
(function (User) {
    window.addEventListener("load", function () {
        fetch("/load/json")
            .then(function (r) { return r.json(); })
            .then(function (r) {
            var room = r;
            init(room);
        });
    });
    var rv;
    function init(roomPlan) {
        console.log("RoomPlan:");
        console.log(roomPlan);
        var visualizer = new InteractiveSVG();
        rv = new RoomVisualizer(visualizer);
        rv.SetRoomPlan(roomPlan);
        getBookings2(roomPlan.name).then(function (r) {
            console.log(r);
            rv.MarkTablesAsBooked(r.tables);
        });
        // temp button for testing
        var button = document.createElement("input");
        button.type = "button";
        button.value = "Print selected tables";
        button.style.zIndex = "10";
        button.onclick = function () { alert("Selected tables: " + rv.GetSelected()); };
        document.body.appendChild(button);
    }
    function getBookings() {
        // fetch (GET): get bookings from server
        return { tables: [0, 2, 3], people: 3 };
    }
    function getBookings2(rName) {
        var url = "/api/booking/" + rName;
        return fetch(url)
            .then(function (r) { return r.json(); })
            .then(function (r) { return r; });
    }
    function postTables(tableIDs) {
        //fetch (POST): send tableIDs to server
    }
})(User || (User = {}));
//# sourceMappingURL=user.js.map