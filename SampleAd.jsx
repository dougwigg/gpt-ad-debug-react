// @flow 

/**
 * We'll use a DoubleClick test ad for demo purposes:
 * https://developers.google.com/doubleclick-gpt/samples/display-test-ad
 */

/* global googletag */

import * as React from 'react';
import styles from './AdDebug.module.css';


type Props = {|
  /* width - width of the display ad */
  width: string,
  /* height - height of the display ad */
  height: string,  
  /* position - value for "pos=" targeting param specific to this ad */
  position: string,
|};

/**
 * Render a test/sample ad 
 */
const SampleAd = ({ width, height, position }: Props) => {
  
  // Load the DoubleClick GPT API
  const loadAPI = () => {
    if (!window.googletag?.apiReady) {
      const api = document.createElement('script');
      api.src = 'https://www.googletagservices.com/tag/js/gpt.js';  
      document.body.appendChild(api);
    }
  };

  // Sample ad targeting for all ads on page
  const pageTargeting = {
    platform: 'desktop', 
    pageype: 'restaurants',
    category: 'romantic', 
  };

  const elemId = `gpt-${width}x${height}-${position}`;

  let slot;

  const loadAd = (width, height, position) => {
    Object.keys(pageTargeting).forEach((key) => {
      googletag.pubads().setTargeting(key, pageTargeting[key]);
    });

    slot = googletag.defineSlot('/6355419/Travel/Europe/France/Paris', [parseInt(width,10), parseInt(height,10)], elemId);
    slot.setTargeting('pos', position);
    slot.addService(googletag.pubads());

    googletag.enableServices();
    googletag.display(elemId);
  };
 
  React.useEffect(() => {
    window.googletag = window.googletag || {};
    googletag.cmd = googletag.cmd || [];
    
    loadAPI();

    googletag.cmd.push(()=>{
      loadAd(width, height, position);
    });
  
    // destroy the slot object on unmount.
    return () => googletag.destroySlots([slot]);

  });
  return <div className={styles.sampleAd} id={elemId} />;
};

export default SampleAd;