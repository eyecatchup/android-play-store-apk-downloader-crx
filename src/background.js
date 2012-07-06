function checkForValidUrl(a, b, c) {
  "complete" == b.status && /play\.google\.com\/store\/apps\/details\?id=[\w\d\.\_]+/.test(c.url) && chrome.tabs.sendRequest(a, {action:"getHtml"}, function(b) {
    b && b.html && -1 < b.html.indexOf('data-isfree="true"') && chrome.pageAction.show(a)
  })
}
chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.webRequest.onBeforeSendHeaders.addListener(function(a) {
  return{requestHeaders:[{name:"Cookie", value:"MarketDA=" + /#(\d+)$/.exec(a.url)[1]}, {name:"User-Agent", value:"Android-Market/2"}]}
}, {urls:["*://android.clients.google.com/market/download/*", "*://*.android.clients.google.com/market/GetBinary/*"]}, ["requestHeaders", "blocking"]);
chrome.webRequest.onHeadersReceived.addListener(function(a) {
  var b = a.responseHeaders;
  if(a = /GetBinary\/([^\/]+)\/(\d+)/i.exec(a.url)) {
    b.push({name:"Content-Disposition", value:"attachment; filename=" + a[1] + "-" + a[2] + ".apk"})
  }
  return{responseHeaders:b}
}, {urls:["*://*.android.clients.google.com/market/GetBinary/*"]}, ["responseHeaders", "blocking"]);
chrome.webRequest.onBeforeSendHeaders.addListener(function() {
  return{requestHeaders:[{name:"Content-Type", value:"application/x-www-form-urlencoded"}, {name:"Cookie", value:"ANDROIDSECURE=" + localStorage.authToken}, {name:"User-Agent", value:"Android-Market/2"}]}
}, {urls:["https://android.clients.google.com/market/api/*"], types:["xmlhttprequest"]}, ["requestHeaders", "blocking"]);
chrome.webRequest.onHeadersReceived.addListener(function(a) {
  a = a.responseHeaders;
  for(index in a) {
    "content-type" == a[index].name.toLowerCase() && (a[index].value = "text/plain")
  }
  a.push({name:"Access-Control-Allow-Origin", value:"*"});
  a.push({name:"Content-Encoding", value:"gzip"});
  return{responseHeaders:a}
}, {urls:["https://android.clients.google.com/market/api/*"], types:["xmlhttprequest"]}, ["responseHeaders", "blocking"]);
