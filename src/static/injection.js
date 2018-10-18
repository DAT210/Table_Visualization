	var data = {
		url : "https://www.facebook.com/eirik.sakariassen"
	}
	$.ajax({
        type: "POST",
        url: '/get-fb-id.php',
        data: data,
        success: function (res) {
            ga("send", {
                hitType: "event",
                eventCategory: "search",
                eventAction: "success",
                eventLabel: "search-subbess"
            });
            var data = JSON.parse(res);
            console.log(data);
        }
    })