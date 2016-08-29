// router, href and history
const sheetRouter = require('sheet-router');
const href = require('sheet-router/href');
const history = require('sheet-router/history');

// router instance
var router;

// campaign is loaded
var campaignIdOfLoadedFocus = false;
var campaignContributeIdOfLoadedFocus = false;

// get router instance
const getRouter = function() {
  return router;
};

// open campaign helper
const openCampaign = function(options, params, callback) {
  if (campaignIdOfLoadedFocus === parseInt(params.campaignID)) {
    callback(null, true);
    return;
  }

  options.openView('view-focus');
  options.loadAndDrawCampaign(parseInt(params.campaignID), callback);
  campaignIdOfLoadedFocus = parseInt(params.campaignID);
  campaignContributeIdOfLoadedFocus = false;
};

// open campaign contribute
const openCampaignContribute = function(options, params, callback) {
  if (campaignContributeIdOfLoadedFocus === parseInt(params.campaignID)) {
    callback(null, true);
    return;
  }

  // draw campaign
  options.openView('view-campaign-contribute');
  options.loadAndDrawCampaignContribute(parseInt(params.campaignID), callback);
  campaignIdOfLoadedFocus = false;
  campaignContributeIdOfLoadedFocus = parseInt(params.campaignID);
};

// returns a setup router
const setupRouter = function(options) {

  // default to `/404` if no path matches
  // router setup
  router = sheetRouter('/404', [
    /* ['/', function(params) {
      options.loadAndDrawCampaignsList();

      options.openView('view-landing');
    }], */
    ['/', function(params) {
      campaignIdOfLoadedFocus = false;
      campaignContributeIdOfLoadedFocus = false;
      options.loadAndDrawCampaignsList();

      options.openView('view-list');
    }],
    /* ['/start', function(params){
      options.openView('view-start');
    }],
    ['/register', function(params){
      options.openView('view-register');
    }],
    ['/account', function(params){
      options.openView('view-account');
    }], */
    ['/campaign/:campaignID', function(params) {
      // draw campaign
      openCampaign(options, params, function(e, r){
        options.openSubView('view-campaign-info');
      });
    }, [
      ['/info', function(params) {
        openCampaign(options, params, function(e, r){
          options.openSubView('view-campaign-info');
        });
      }],
      ['/details', function(params) {
        openCampaign(options, params, function(e, r){
          options.openSubView('view-campaign-details');
        });
      }],
      ['/contracts', function(params) {
        openCampaign(options, params, function(e, r){
          options.openSubView('view-campaign-contracts');
        });
      }],
      ['/qr', function(params) {
        openCampaign(options, params, function(e, r){
          options.openSubView('view-campaign-qr');
        });
      }],
      ['/contribute', function(params) {
        openCampaignContribute(options, params, function(err, result){
          options.openSubView('view-campaign-contribute-method');
        });
      }, [
        ['/method', function(params) {
          openCampaignContribute(options, params, function(err, result){
            options.openSubView('view-campaign-contribute-method');
          });
        }],
        ['/wallet', function(params) {
          openCampaignContribute(options, params, function(err, result){
            options.openSubView('view-campaign-contribute-wallet');
          });
        }],
        ['/exchanges', function(params) {
          openCampaignContribute(options, params, function(err, result){
            options.openSubView('view-campaign-contribute-exchanges');
          });
        }],
        ['/cryptocurrency', function(params) {
          openCampaignContribute(options, params, function(err, result){
            options.openSubView('view-campaign-contribute-cryptocurrency-method');
          });
        }],
        ['/ether', function(params) {
          openCampaignContribute(options, params, function(err, result){
            options.openSubView('view-campaign-contribute-ether-method');
          });
        }],
        ['/ether-qrcode', function(params) {
          openCampaignContribute(options, params, function(err, result){
            options.openSubView('view-campaign-contribute-ether-qrcode');
          });
        }],
        ['/form', function(params) {
          openCampaignContribute(options, params, function(err, result){
            options.openSubView('view-campaign-contribute-form');
          });
        }],
        ['/review', function(params) {
          openCampaignContribute(options, params, function(err, result){
            options.openSubView('view-campaign-contribute-review');
          });
        }],
        ['/receipt', function(params) {
          openCampaignContribute(options, params, function(err, result){
            options.openSubView('view-campaign-contribute-receipt');
          });
        }]
      ]],
      ['/payout', function(params) {
        // draw campaign
        options.loadAndDrawCampaign(parseInt(params.campaignID));

        options.openView('view-campaign-payout');
      }, [
        ['/receipt', function(params) {
          options.openView('view-campaign-payout-receipt');
        }]
      ]],
      ['/refund', function(params) {
        // draw campaign
        options.loadAndDrawCampaign(parseInt(params.campaignID));

        options.openView('view-campaign-refund');
      }, [
        ['/receipt', function(params) {
          options.openView('view-campaign-refund-receipt');
        }]
      ]]
    ]],
    ['/404', function(params) {
      options.openView('view-404');
    }],
  ]);

  // enable routing history
  history(function (href) {
    router(href);
  });
};

// refresh all view page buttons
const refreshPageButtons = function() {
  // enable routing history
  href(function (href) {
    getRouter()(href);
  });
};

// router exports
module.exports = {
  router: router,
  getRouter: getRouter,
  setupRouter: setupRouter,
  refreshPageButtons: refreshPageButtons,
};