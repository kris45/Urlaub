
$(document).ready(function () {

	var pageNumber;
	var minPerPage = 3;
	var maxPerPage = 200;
	var perPage = 20;
	var cardIndex = 0;

	function doSearch(query, pageNumber, perPage) {

		return new Promise(function(resolve, reject) {
			var perPageQuery = Math.min(maxPerPage, Math.max(minPerPage, perPage));

			$.ajax({
		        url: 'https://pixabay.com/api/?key=3750037-59b70644a0ea3a4147bb2a2ad&image_type=photo&per_page=' + perPageQuery + '&q=' + query + '&page=' + pageNumber,
		        dataType: 'jsonp',
				crossDomain: true,
				cache: false,
		        success: function (data) {
		        	resolve([data, perPage, query]);
		        },
				error: function(xhr){
					reject(JSON.stringify(xhr));
				}
		    });
		});

	};

	function drawAllImages(dataAll) {

		for (var j = 0; j < dataAll.length; j++) {
			var data = dataAll[j];

			drawImage(data);
		}
	}

	function drawImage(data) {

		var imageData = data[0];
		var perPage = data[1];
		var query = data[2];
		var hitsCount = imageData.totalHits;
		var hits = imageData.hits;

		for (var i = 0; i < Math.min(perPage, hits.length); i++) {
			cardIndex++;
			if (perPage == 1) {
				$(".ideas-block__searchResult").append("<a class='pic__block pic__block--" + cardIndex + "' href='" + hits[i].pageURL + "' data-title='" + query + "' ><img src='" + hits[i].webformatURL +"'/></a>");
			}
			else {
				$(".ideas-block__searchResult").append("<a class='pic__block pic__block--" + cardIndex + "' href='" + hits[i].pageURL + "' data-title='" + hits[i].tags + "' ><img src='" + hits[i].webformatURL +"'/></a>");
			}
		}
	}

	function printError(errorMessage) {
		console.log('Error occured');
		console.log(errorMessage);
	}

	$(".searchBtn").click(function (e) {
		e.preventDefault();
		var query = $(".searchTxt").val();
		pageNumber = 1;
		cardIndex = 0;
		$(".ideas-block__searchResult").empty();
		doSearch(query, 1, 7)
		.then(drawImage)
		.then(doMasonry)
		.catch(printError);

	});

	function doMasonry() {
		$('.ideas-block__searchResult').masonry('reloadItems', {
			columnWidth: 200,
			itemSelector: '.pic__block',
			isFitWidth: true
		}).masonry();
	}

	function doMasonryInitial() {

		$('.ideas-block__searchResult').masonry({
			itemSelector: '.pic__block',
			gutter: 20,
			isFitWidth: true
		});
	}

	function searchForQueries(queries) {

		var searchPromises = [];

		for (var i = 0; i < queries.length; i++) {
			searchPromises.push(doSearch(queries[i], 1, 1));
		}

		return Promise.all(searchPromises).then(function (values) { 
			return values;
		})
		.then(drawAllImages)
		.then(doMasonryInitial)
		.catch(printError);

	}

	var firstSearchData = ["Sport and Activity", "Wellness and Health", "Extreme Sports and Expeditions",
		"Games", "Culture and Education", "Relaxation", "Travelling"];

	searchForQueries(firstSearchData);

})
