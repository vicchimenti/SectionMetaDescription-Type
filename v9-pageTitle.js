// Import T4 Utilities
importClass(com.terminalfour.publish.utils.BrokerUtils);




// Processing necessary T4 tags
var pageTitleField = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Custom Title' output='normal' display_field='value' />");
var t4PageTitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='title' append-content='true' append-element='Article Title' separator=' - ' />");




// Set title construction to false
titleConstruction = false;




// Main
try {
    
  // Determine if page is fulltext (article)
  isFulltext = BrokerUtils.isFullTextPage(publishCache)

  // If so get article title
  if (isFulltext) {
    if (t4PageTitle) {
      t4PageTitleArray = t4PageTitle.split("-")
      articleTitle = t4PageTitleArray[t4PageTitleArray.length - 1].trim()
    }
  }

  // If custompage title use only custom page title
  if (pageTitleField != '') {
    document.write('<title>' + pageTitleField + ' | Seattle University</title>');
  } else {
    // Else use recursive title construction
    var channel = publishCache.getChannel();
    document.write("<title>");
    var titleString = "<title>"; // debugging value
    titleConstruction = true;
    if (isFulltext) {
      titleString += articleTitle + " - ";
    }
    // Loop though section parents and append section names seperated by pipes
    while (section && section.getLevel(channel) > 0) {
      document.write(section.getName('en'));
      titleString += section.getName('en');
      if (section.getLevel(channel) > 1) {
        document.write(" | ");
        titleString += " | ";
      }
      section = section.getParent();
    }
    document.write("</title>");
    titleConstruction = false;


  }
} catch (error) {
  // Report error
  document.write('<!-- <script>eval(String("console.error(\'' + error + '\')"));</script> -->\n');
  // Close title if title construction incomplete
  if (titleConstruction) {
    document.write("</title>");
    titleConstruction = false;
  }

}