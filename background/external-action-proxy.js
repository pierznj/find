'use strict';

/**
 * Create the Background ExternalActionProxy namespace. Mediates messages from external extensions.
 * */
Find.register("Background.ExternalActionProxy", function () {

  /**
   * Initialize the port connection with the browser action popup.
   * */
  console.log('adding external listener');
  // Find.browser.runtime.onConnectExternal.addListener((externalActionPort) => {
  //   // if (externalActionPort.name !== '2steps') {
  //   //   return;
  //   // }
  //   let activeTab = null;
  //   Find.browser.tabs.query({
  //     active: true,
  //     currentWindow: true
  //   }, (tabs) => {
  //     activeTab = tabs[0];
  //     //Invoke action on message from external extension
  //     console.log('adding a listener');
  //     externalActionPort.onMessage.addListener((message) => {
  //       console.log(`received a cross-extension message: ${JSON.stringify(message)}`);
  //       actionDispatch(message, activeTab, (resp) => {
  //         console.log(`received a cross-extension message response: ${JSON.stringify(resp)}`);
  //         externalActionPort.postMessage(resp);

  //         // only build the DOM representation object after the browser action is initialized
  //         if (message.action === 'init') {
  //           Find.Background.initializePage(activeTab);
  //         }
  //       });
  //     });
  //   });
  // });

  Find.browser.runtime.onMessageExternal.addListener(
    function (message, sender, sendResponse) {
      let activeTab = null;
      Find.browser.tabs.query({
        // active: true,
        // currentWindow: true
      }, (tabs) => {
        activeTab = tabs[0];
        console.log(`received a cross-extension message: ${JSON.stringify(message)}`);
        actionDispatch(message, activeTab, (resp) => {
          console.log(`received a cross-extension message response: ${JSON.stringify(resp)}`);
          sendResponse(resp);
        });
      });

    });


  /**
   * Dispatcher for calls for action by the browser action popup.
   * Invokes the appropriate function in the Background based on the
   * message.action field.
   *
   * @param {object} message - The message received from the popup
   * @param {object} tab - Information about the active tab in the current window
   * @param {function} sendResponse - Function used to issue a response back to the popup.
   * */
  function actionDispatch(message, tab, sendResponse) {
    let action = message.action;
    switch (action) {
      case 'get_matches':
        Find.Background.updateSearch(message, tab, () => {
          Find.Background.extractOccurrences(message, tab, sendResponse);
        });
        break;
      case 'init':
        Find.Background.initializeBrowserAction(message, tab, () => {
          Find.Background.initializePage(tab);
          sendResponse();
        });
        break;
      default:
        const msg = `Unknown action type ${action} received`;
        console.log(msg);
        sendResponse({
          error: msg
        });
    }
  }
});