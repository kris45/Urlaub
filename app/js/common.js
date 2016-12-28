console.log('hello')
$(document).ready(function () {

	var pageNumber;
	var minPerPage = 3;
	var maxPerPage = 200;
	var perPage = 20;
	var cardIndex = 0;

	function doSearch(query, pageNumber, perPage) {

		//console.log('Searching for ' + query + " with pageNumber " + pageNumber + " with perPage " + perPage);
		var perPageQuery = Math.min(maxPerPage, Math.max(minPerPage, perPage));

		$.ajax({
	        url: 'https://pixabay.com/api/?key=3750037-59b70644a0ea3a4147bb2a2ad&image_type=photo&per_page=' + perPageQuery + '&q=' + query + '&page=' + pageNumber,
	        dataType: 'json',
	        success: function (data) {
				var hitsCount = data.totalHits;
				var hits = data.hits;
				console.log('Found images by searching for ' + query + " : " + hitsCount);
				for (var i = 0; i < Math.min(perPage, hits.length); i++) {
					cardIndex++;
					if (perPage == 1 ) {
						$(".ideas-block__searchResult").append("<a class='pic__block pic__block--" + cardIndex + "' href='" + hits[i].pageURL + "' data-title='" + query + "' ><img src='" + hits[i].webformatURL +"'/></a>");
					}
					else {
						$(".ideas-block__searchResult").append("<a class='pic__block pic__block--" + cardIndex + "' href='" + hits[i].pageURL + "' data-title='" + hits[i].tags + "' ><img src='" + hits[i].webformatURL +"'/></a>");
					}
				}

	        },
			error: function(xhr){
				console.log('Error');
				console.log(xhr);
			}
	      });

	};

	$(".searchBtn").click(function (e) {
		e.preventDefault();
		var query = $(".searchTxt").val();

		pageNumber = 1;
		cardIndex = 0;
		$(".ideas-block__searchResult").empty();
		doSearch(query, 1, 7);
		setTimeout(function () {
			console.log("Doing masonry");
			$('.ideas-block__searchResult').masonry('reloadItems', {
				columnWidth: 200,
				itemSelector: '.pic__block',
				isFitWidth: true
			}).masonry();
			console.log("Finished doinng masonry");
		}, 1000);
	});

	var firstSearchData = ["Sport and Activity", "Wellness and Health", "Extreme Sports and Expeditions",
		"Games", "Culture and Education", "Relaxation", "Travelling"];

	for (var j = 0; j < firstSearchData.length; j++) {
		var query = firstSearchData[j];
		doSearch(query, 1, 1);
	}

	setTimeout(function () {
		console.log("Doing masonry");
		$('.ideas-block__searchResult').masonry({
			itemSelector: '.pic__block',
			gutter: 20,
			isFitWidth: true
		});
		console.log("Finished doinng masonry");
	}, 1000);

})
