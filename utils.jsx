// @flow

/* global googletag */

/**
 *  We can only run ADebug if the gpt API is loaded
 */
export const isGoogletagLoaded = () =>
  typeof googletag !== 'undefined' && typeof googletag.pubads === 'function';

/**
 * Get the slots from the API
 */
export const getAdSlots = (): Slot[] => {
  if (isGoogletagLoaded()) {
    return googletag.pubads().getSlots();
  }
  return [];
};

/**
 * This creates a prettier string containing the targeting
 * TODO: refactor to use component
 */
export const stringifyTargeting = (json: PageTargeting): string => {
  const prettyVals = {};

  // Join with placeholder ~ to preserve the look of arrays in the display
  Object.keys(json).forEach(key => {
    if (Array.isArray(json[key])) {
      prettyVals[key] = `[${json[key].join('~')}]`;
    }
  });
  // line breaks for booleans and "," etc.
  return JSON.stringify(prettyVals)
    .replace(/e,/g, 'e<br/>')
    .replace(/","/g, '<br/>')
    .replace(/[{}"]/g, '')
    .replace(/~/g, ', ')
    .replace(/:/g, '=');
};

/**
 * Returns the page targeting that has been set in googletag for the page
 */
export const getPageTargeting = (): string => {
  const pageTargeting = {};
  // pull targeting from API
  const targetingKeys = googletag.pubads().getTargetingKeys();
  targetingKeys.forEach(key => {
    pageTargeting[key] = googletag.pubads().getTargeting(key);
  });
  return stringifyTargeting(pageTargeting);
};

/**
 * Get details about the specific ad rendered by the ad slot
 */
export const getResponseInfo = (adSlot?: Slot): Object => {
  if (adSlot) {
    const info = adSlot.getResponseInformation();
    if (info) {
      const { advertiserId = 'N/A', campaignId = 'N/A', creativeId = 'N/A'} = info;
      const tableStart = '<table><tr><td>advertiserId</td><td>campaignId</td><td>creativeId</td></tr>';
      return {__html:`${tableStart}<tr><td>${advertiserId}</td><td>${campaignId}</td><td>${creativeId}</td></tr></table>`};
    }
    return 'Not rendered';
  }
}

export default {};