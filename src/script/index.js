var remembered = window.localStorage.getItem('mastodon_instance');
if (remembered != null) {
    document.getElementById('instance').value = remembered;
}

var parsedQuery = {};

var paramPairs = window.location.search.substr(1).split('&');
var paramPairsLength = paramPairs.length;

for (var i = 0; i < paramPairsLength; i++) {
    var paramPair = paramPairs[i].split('=');
    parsedQuery[paramPair[0]] = paramPair[1];
}
delete i
delete paramPair

document
  .getElementById('form')
  .addEventListener('submit', function (e) {
    e.preventDefault();
    var instance = e.target.elements['instance'].value;
    var remember = e.target.elements['remember'].checked;


    if (!(instance.startsWith("https://") || instance.startsWith("http://"))) {
        instance = "https://" + instance;
    }
    if (!instance.endsWith("/")){
        instance = instance + "/";
    }

    if (remember) {
        window.localStorage.setItem('mastodon_instance', instance);
    }

    var shareUrl = instance + "share?text=" + parsedQuery.text;
    window.open(shareUrl, '_blank', 'noopener,noreferrer')
})
