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
        getBookings(roomPlan.name).then(function (r) {
            console.log(r);
            displayRoom(r, roomPlan);
        });
    }
    function displayRoom(bookings, roomPlan) {
        if (!bookings.tables && !bookings.nrOfPeople) {
            console.error("Malformed response: ", JSON.stringify(bookings));
            return;
        }
        var visualizer = new InteractiveSVG();
        rv = new RoomVisualizer(visualizer);
        rv.SetRoomPlan(roomPlan);
        rv.CenterContent();
        var nrOfPeople = 0;
        nrOfPeople = bookings.nrOfPeople;
        console.log(nrOfPeople);
        rv.MarkTablesAsBooked(bookings.tables);
        var roomtables = rv.GetRoomPlan();
        var button = document.createElement("input");
        button.type = "button";
        button.value = "Print selected tables";
        button.style.zIndex = "10";
        button.onclick = function () {
            if (roomtables) {
                var capacityTables = 0;
                var rtables = roomtables.tables;
                var select = rv.GetSelected();
                for (var i = 0; i < select.length; i++) {
                    var t = rtables[select[i]];
                    if (t !== undefined) {
                        var x = t.capacity;
                        if (x !== undefined) {
                            capacityTables += x;
                        }
                    }
                }
                if (capacityTables >= nrOfPeople) {
                    testFunn(rv.GetSelected());
                }
                else {
                    alert("Not enough tables");
                }
            }
        };
        document.body.appendChild(button);
        var testBut = document.createElement("button");
        testBut.onclick = function () { console.log("clisk"); postTables([1, 2, 3]); };
        testBut.innerHTML = "Test";
        testBut.style.zIndex = "1000";
        document.body.appendChild(testBut);
    }
    function getBookings(restaurantName) {
        var url = "/api/booking/" + restaurantName;
        return fetch(url)
            .then(function (r) { return r.json(); })
            .then(function (r) { return r; });
    }
    function testFunn(tableIDs) {
        var body = { "tables": tableIDs };
        console.log(JSON.stringify(body));
        console.log(body["tables"]);
        console.log("Det funker");
    }
    function postTables(tableIDs) {
        //fetch (POST): send tableIDs to server
        console.log("sent post");
        var url = "/api/booking/posttables";
        var tables = { "tables": tableIDs };
        fetch(url, {
            method: "post",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(tables)
        })
            .then(function (res) { console.log(res); });
    }
})(User || (User = {}));
//# sourceMappingURL=user.js.map