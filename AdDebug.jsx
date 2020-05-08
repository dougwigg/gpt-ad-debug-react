// @flow 

/* global googletag */

import * as React from 'react';
import AdSlotListing from './AdSlotListing';
import DisplaySlotTargeting from './DisplaySlotTargeting';
import { isGoogletagLoaded, getAdSlots, getPageTargeting } from './utils';

import styles from './AdDebug.module.css';

const AdDebug = () => {
  // Show/Hide the debugger
  const [showDebug, setShowDebug] = React.useState(false);

  // The currently selected slot to display targeting for
  const [slotIdx, setSlotIdx] = React.useState(0);

  // The currently defined/active ad slots
  const adSlots: Slot[] = getAdSlots();

  /** * * * * * * * * * * * * *
   * Update AdDebug on ad render
   * * * * * * * * * * * * * * */

  let isRenderListenerAdded = false;
  const [slotRenders, setSlotRenders] = React.useState(0);

  const renderCallback = React.useCallback(() => {
    setSlotRenders(slotRenders + 1);
  }, [slotRenders]);

  // Used to detect ad renders and trigger AdDebug refresh
  const useGPTEvent = (event, callback) => {
    React.useEffect(() => {
      // you can't remove it
      if (!isRenderListenerAdded) {
        // eslint-disable-next-line no-restricted-globals
        window.googletag = window.googletag || { cmd: [] };
        googletag.cmd.push(() => {
          googletag.pubads().addEventListener(event, callback);
        });
        isRenderListenerAdded = true;
      }
    }, [event, callback]);
  };

  useGPTEvent('slotRenderEnded', renderCallback);

  /** * * * * * * * * * * *
   * Button click handlers
   * * * * * * * *  * * * */

  // Observe clicks on the slot targeting button and re-render when a new slot is selected
  const updateSelected = React.useCallback((event): void => {
    if (event.target instanceof HTMLButtonElement) {
      // handle slot targeting
      const idxAttr = event.target.getAttribute('data-slot-index');
      if (idxAttr && idxAttr.length) {
        setSlotIdx(parseInt(idxAttr, 10) || 0);
      }
    }
  }, []);

  // display the detailed DoubleClick console
  const openPublisherConsole = (): void => googletag.openConsole();

  const loadDebug = React.useCallback(() => {
    setShowDebug(true);
  }, []);

  const closeDebug = React.useCallback(() => {
    setShowDebug(false);
  }, []);

  return showDebug && isGoogletagLoaded() ? (
    <div className={styles.adDebug}>
      <div className={styles.header}>
        Ad Debug
        <span className={styles.close} onClick={closeDebug} />
      </div>

      <div className={styles.col}>
        <div className={styles.boxHdr}>Page Targeting</div>
        <div className={styles.box} dangerouslySetInnerHTML={{ __html: getPageTargeting() }} />
      </div>

      <div className={styles.col}>
        <div className={styles.boxHdr}>Ad Slots</div>
        <div className={styles.box}>
          {adSlots.map((slot, index) => (
            <div onClick={updateSelected} key={slot.getSlotId().getId()}>
              <AdSlotListing adSlot={slot} index={index} selected={index === slotIdx} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.col}>
        <div className={styles.boxHdr}>Slot Targeting</div>
        <div className={styles.box}>
          <DisplaySlotTargeting adSlot={adSlots[slotIdx]} />
        </div>
      </div>

      <div className={styles.buttons}>
        <div className={styles.btmLft}>
          <div className={styles.renders}>Ad Renders: {slotRenders}</div>
        </div>
        <div className={styles.btmRgt}>
          {adSlots.length > 0 && (
            <button className={styles.button} onClick={openPublisherConsole}>
              Open Publisher Console
            </button>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div>
      <button className={styles.loadButton} onClick={loadDebug}>
        Debug Ads
      </button>
    </div>
  );
};

export default AdDebug;
