// @flow 

import * as React from 'react';
import ResponseInfo from './ResponseInfo';
import styles from './AdDebug.module.css';

type Props = {|
  adSlot: Slot,
  index: number,
  selected: boolean, // style item background if selected
|};

/**
 * This component renders a list item for each ad slot that has been created
 */
const AdSlotListing = ({ adSlot, index, selected }: Props) => {
  const slotClass = selected ? styles.adSlotSelected : styles.adSlot;

  return (
    adSlot && (
      <div className={slotClass}>
        <div className={styles.adSlotId}>{adSlot.getSlotElementId()}</div>
        <div>{adSlot.getAdUnitPath()}</div>
        {/* the click here is observed in AdDebug.jsx */}
        <button className={styles.button} data-slot-index={index}>
          display slot targeting
        </button>
        <ResponseInfo adSlot={adSlot} />
      </div>
    )
  );
};

export default AdSlotListing;