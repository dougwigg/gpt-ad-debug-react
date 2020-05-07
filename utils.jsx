// @flow strict

/* global googletag */

export type PageTargeting = {|
  PageType?: string,
  country?: string,
  detail?: string,
  geo?: string,
  loctype?: string,
  rd?: string,
  slice?: string,
  airline?: string,
  o?: string,
  d?: string,
  oregion?: string,
  dregion?: string,
  r?: string,
  drs?: string | string[],
  hname?: string,
  pool?: string,
  /** Device platform (desktop, tablet, or mobile) */
  platform?: string,
  /** Page view ID */
  pv_id?: string,
  /** Session ID */
  sess?: string,
  /** Audience ID(s) */
  aud_id?: string | string[],
|};

// Preferred sort order for page targeting, items not spec'd will be at the bottom
const preferredOrder: PageTargeting = {
  PageType: '',
  country: '',
  detail: '',
  geo: '',
  loctype: '',
  platform: '',
  rd: '',
  slice: '',
  airline: '',
  o: '',
  d: '',
  oregion: '',
  dregion: '',
  r: '',
  drs: '',
  hname: '',
  sess: '',
  pool: '',
};

// Doubleclick ad content information or N/A
const getRespValOrNA = id => {
  if (typeof id === 'number') {
    return id;
  }
  return 'N/A';
};

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
 * Could be refactored to return html
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
 * Returns the primary targeting for ads on the page: /acct#/site/geo zone
 */
export const getBaseTargeting = () => {
  const slotMap = googletag.pubads().getSlotIdMap();
  if (Object.keys(slotMap).length) {
    return Object.keys(slotMap)[0].split(/_\d/)[0];
  }
  return 'Not set';
};

/**
 * Returns the page targeting delivered by the ad-context service
 */
export const getPageTargeting = (): string => {
  let pageTargeting = {};

  // pull targeting from API
  const targetingKeys = googletag.pubads().getTargetingKeys();

  targetingKeys.forEach(key => {
    pageTargeting[key] = googletag.pubads().getTargeting(key);
  });

  pageTargeting = Object.assign(preferredOrder, pageTargeting);

  // Remove unused preferred
  Object.keys(pageTargeting).forEach(key => {
    if (pageTargeting[key] === '') {
      delete pageTargeting[key];
    }
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