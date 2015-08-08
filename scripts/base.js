/**
 * Some base functions necessary for page functioning?
 * Whatever I'm so tired. This project is so kludgy lol.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

function parse(text) {
  console.log(text);
  return text.replace("&nbsp;", " ")
             .replace(/&#160;/g, " ")
             .replace(/&#8217;/g, "'")
             .replace(/(&#8220;|&#8221;)/g, '"')
             .replace(/&#8230;/g, "...");
}

function display(number, query) {
  var query = document.getElementsByClassName('searchBar')[0].value;
  var articlesSection = document.getElementById('articles');
  articlesSection.innerHTML = "";
  Vestorly.getArticle(number, query, function(data) {
    var articles = data['articles'];

    if (articles.length == 0) {
      articlesSection.innerHTML = "No results found. Try a different query.";
    }

    for (var i = 0; i < articles.length; ++i) {
      console.log(articles[i]);

      var contentArticle = document.createElement('div');
      contentArticle.setAttribute('class', 'contentArticle');

      var articleContainer = document.createElement('div');
      articleContainer.setAttribute('class', 'articleContainer');
      contentArticle.appendChild(articleContainer);
      articlesSection.appendChild(contentArticle);

      if (articles[i].image_url) {
        var articleImage = document.createElement('img');
        articleImage.setAttribute(
            'src', 'https:' + articles[i].image_url);
        articleImage.setAttribute('class', 'articleImage');
        articleContainer.appendChild(articleImage);
      }

      var articleTitle = document.createElement('div');
      articleTitle.setAttribute('class', 'articleTitle');
      var articleTitleText = document.createTextNode(
          parse(articles[i].title));
      articleTitle.appendChild(articleTitleText);
      articleContainer.appendChild(articleTitle);

      var articleDetail = document.createElement('div');
      articleDetail.setAttribute('class', 'articleDetail');
      var articleDetailText = document.createTextNode(
          parse(articles[i].body));
      contentArticle.appendChild(articleDetailText);
      articleDetail.appendChild(articleDetailText);
      articleContainer.appendChild(articleDetail);

      var articleSourceLink = document.createElement('a');
      articleSourceLink.setAttribute(
          'href', articles[i].external_url_source);
      var articleSourceLinkText = document.createTextNode(
          "Sourced from: " + parse(articles[i].external_url_source));
      articleSourceLink.appendChild(articleSourceLinkText);
      articleContainer.appendChild(articleSourceLink);

      var hr = document.createElement('hr');
      articlesSection.appendChild(hr);
    }
  });
}
