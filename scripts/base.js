/**
 * Some base functions necessary for page functioning?
 * Whatever I'm so tired. This project is so kludgy lol.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

String.prototype.count = function(search) {
    var m = this.match(new RegExp(search.toString().replace(/(?=[.\\+*?[^\]$(){}\|])/g, "\\"), "g"));
    return m ? m.length:0;
}

function parse(text) {
  return text.replace("&nbsp;", " ")
             .replace(/&#160;/g, " ")
             .replace(/&#8217;/g, "'")
             .replace(/(&#8220;|&#8221;)/g, '"')
             .replace(/&#8230;/g, "...");
}

function display(number, query, sort_criteria) {
  var query = document.getElementsByClassName('searchBar')[0].value;
  var articlesSection = document.getElementById('articles');
  articlesSection.innerHTML = "";
  Vestorly.getArticle(number, query, sort_criteria, function(data) {
    var articles = data['articles'];

    if (articles.length == 0) {
      articlesSection.innerHTML = "No results found. Try a different query.";
    }

    var articlesQueue = new PriorityQueue({
        comparator: function(a, b) {
          var searchTerms = getQueryTerms();
          var aHits = 0;
          var bHits = 0;
          // The original query counts more than historical queries.
          aHits += a.body.count(query) * 5;
          bHits += b.body.count(query) * 5;
          for (var i = 0; i < searchTerms.length; ++i) {
            aHits += a.body.count(searchTerms[i]);
            bHits += b.body.count(searchTerms[i]);
          }
          return aHits - bHits;
        }
    });
    for (var i = 0; i < articles.length; ++i) {
      articlesQueue.queue(articles[i]);
    }

    while (articlesQueue.length != 0) {
      var currentArticle = articlesQueue.dequeue();

      var contentUrl = document.createElement('a');
      contentUrl.setAttribute('href', currentArticle.external_url);

      var contentArticle = document.createElement('div');
      contentArticle.setAttribute('class', 'contentArticle');
      contentUrl.appendChild(contentArticle);

      var articleContainer = document.createElement('div');
      articleContainer.setAttribute('class', 'articleContainer');
      contentArticle.appendChild(articleContainer);
      articlesSection.appendChild(contentArticle);

      if (currentArticle.image_url) {
        var articleImageLink = document.createElement('a');
        articleImageLink.setAttribute(
            'href', currentArticle.external_url_source);
        articleContainer.appendChild(articleImageLink);

        var articleImage = document.createElement('img');
        articleImage.setAttribute(
            'src', 'https:' + currentArticle.image_url);
        articleImage.setAttribute('class', 'articleImage');
        articleImageLink.appendChild(articleImage);
      }

      var articleTitle = document.createElement('div');
      articleTitle.setAttribute('class', 'articleTitle');
      var articleTitleText = document.createTextNode(
          parse(currentArticle.title));
      articleTitle.appendChild(articleTitleText);
      articleContainer.appendChild(articleTitle);

      var articleDetail = document.createElement('div');
      articleDetail.setAttribute('class', 'articleDetail');
      var articleDetailText = document.createTextNode(
          parse(currentArticle.body));
      contentArticle.appendChild(articleDetailText);
      articleDetail.appendChild(articleDetailText);
      articleContainer.appendChild(articleDetail);

      var articleSourceLink = document.createElement('a');
      articleSourceLink.setAttribute(
          'href', currentArticle.external_url);
      articleSourceLink.setAttribute('class',"sourceLink");
      var articleSourceLinkText = document.createTextNode(
          "Source");
      articleSourceLink.appendChild(articleSourceLinkText);
      articleContainer.appendChild(articleSourceLink);
    }
  });
}

function getQueryTerms() {
  return JSON.parse(docCookies.getItem('queries'));
}

function recordQuery(query) {
  var queries = docCookies.getItem('queries');
  console.log(queries);
  if (queries) {
    queries = JSON.parse(queries)
    queries.push(query);
    queries = JSON.stringify(queries);
  } else {
    queries = JSON.stringify([query]);
  }
  docCookies.setItem('queries', queries, Infinity);
}
