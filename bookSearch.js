var baseURL = 'https://www.googleapis.com/books/v1/volumes?q=';
var searchInfo = '';
var searchType = '';
var orderType = '';
var startIndex = 0;
var prevIndex = '';
var maxResult = 20;
var totalResults = 0;
var currentResults = '';

function bookhunt()
{
	fullReset();
	searchInfo = $("#search-bar").val();
	switch ($("#typeSearch").val())
	{
		case "Author":
			searchType = "+inauthor:";
			break;
		case "Title":
			searchType = "+intitle:";
			break;
		default:
			searchType = '';
	}
	switch ($("#orderSearch").val())
	{
	case "Publish Date":
		orderType = "&orderBy=newest";
		break;
	default:
		orderType = '';
	}
	if(searchInfo == '')
	{
		$(".result").replaceWith('<div class="result">Please enter something in the field first<div class="list"></div></div>');
		document.getElementById("pageTurner").style.display = "none";
	}
	else
	{
		retrieveResults();
	}
}

function Next()
{
	startIndex = startIndex + maxResult;
	retrieveResults()
	$('html, body').animate({ scrollTop: 0 }, 'slow');
}

function Prev() 
{
	startIndex = startIndex - maxResult;
	retrieveResults()
	$('html, body').animate({ scrollTop: 0 }, 'slow');
}
			
function fullReset()
{
	searchInfo = '';
	searchType = '';
	orderType = '';
	startIndex = 0;
	prevIndex = '';
	maxResult = 20;
	currentResults = '';
}

function retrieveResults()
{
	$(".result").replaceWith('<div class="result"><div class="list"></div></div>');
	$.get(baseURL + searchType + searchInfo + "&startIndex=" + startIndex + "&maxResults=" + maxResult + orderType, function(response)
	{
		var urlhook = '';
		var image = '';
		var imgLink = '';
		var title = '';
		var author = '';

		$(".result").replaceWith('<div class="result"><div class="list"></div></div>');
		if (response.items)
		{	
			for(i=0;i<response.items.length;i++) 
			{
				urlhook = response.items[i].volumeInfo.infoLink;
				if (response.items[i].volumeInfo.imageLinks)
				{
					image = response.items[i].volumeInfo.imageLinks.thumbnail;
					imgLink = '<a href=' + urlhook + '><img src=' + image + '></a>';
				}
				else
				{
					image = 'https://books.google.com/googlebooks/images/no_cover_thumb.gif';
					imgLink = '<a href=' + urlhook + '><img src=' + image + ' width="128"></a>';
				}
				title = '<a href=' + urlhook + '><h3>' + response.items[i].volumeInfo.title + '</h3></a>';
				author = '<h4>By: ' + response.items[i].volumeInfo.authors + '</h4>';
				
				var entry = '<div class="thisBook">' + imgLink + title + author + "</div>";
				$(".list").append(entry);
			}
			if (startIndex == 0)
			{
				totalResults = response.totalItems;
			}
			currentResults = response.items.length + startIndex;
			if (startIndex != 0 && startIndex < totalResults && response.items.length == maxResult)
			{
				$("#pageTurner").replaceWith('<div id="pageTurner"><input type="button" class="navibtn" onClick="Prev()" value="<"> ' +
				currentResults + ' out of ' + totalResults + ' results' + ' <input type="button" class="navibtn" onClick="Next()" value=">"></div>');
				document.getElementById("pageTurner").style.display = "inherit";
				$('html, body').animate({ scrollTop: 0 }, 'slow');
			}
			else
			{	
				if(startIndex != 0)
				{
					$("#pageTurner").replaceWith('<div id="pageTurner"><input type="button" class="navibtn" onClick="Prev()" value="<"> ' +
					currentResults + ' out of ' + totalResults + ' results</div>');
					document.getElementById("pageTurner").style.display = "inherit";
					$('html, body').animate({ scrollTop: 0 }, 'slow');
				}
				else
				{
					$("#pageTurner").replaceWith('<div id="pageTurner">' + currentResults + ' out of ' + totalResults + 
					' results' + ' <input type="button" class="navibtn" onClick="Next()" value=">"></div>');
					document.getElementById("pageTurner").style.display = "inherit";
					$('html, body').animate({ scrollTop: 0 }, 'slow');
				}
			}
		}
		else
		{
			$(".result").replaceWith('<div class="result">No results found matching that criteria.<div class="list"></div></div>');
			document.getElementById("pageTurner").style.display = "none";
			$('html, body').animate({ scrollTop: 0 }, 'slow');
		}
	});	
}
