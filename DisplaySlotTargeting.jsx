// @flow 

import * as React from 'react';
import { stringifyTargeting } from './utils';
import styles from './AdDebug.module.css';

type Props = {|
  adSlot: Slot,
|};

/**
 * This component displays slot targeting for the selected ad slot
 */
const DisplaySlotTargeting = ({ adSlot }: Props) => {
  // Ad slots are destroyed on GptAd component unmount
  const slotHdr: string = adSlot ? adSlot.getSlotElementId() : 'select an ad slot';

  // The legacy stringify code is a little gnarly (<br/> etc.), we can replace it with proper HTML later
  const slotTargeting: string = adSlot ? stringifyTargeting(adSlot.getTargetingMap()) : '';
  return (
    <div> 
      <div className={styles.slotTargetingHeader}>{slotHdr}</div>
      {/* TODO */}
      <div dangerouslySetInnerHTML={{ __html: slotTargeting }}/>
    </div>
  );
};

export default DisplaySlotTargeting;