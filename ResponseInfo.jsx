// @flow 

import * as React from 'react';
import styles from './AdDebug.module.css';

type Props = {|
  adSlot: object,
|};

/**
 * This component displays slot targeting for the selected ad slot
 */
const ResponseInfo = ({ adSlot }: Props) => {
 
  const respInfo = adSlot?.getResponseInformation() || {};
  
  const { advertiserId = 'N/A', campaignId = 'N/A', creativeId = 'N/A'} = respInfo;

  return (
    <div className={styles.tableWrap}>
      <table className={styles.respInfo}>
        <tr>
          <th className={styles.respItm}>advertiserId</th>
          <th className={styles.respItm}>campaignId</th>
          <th className={styles.respItm}>creativeId</th>
        </tr>
        <tr>
          <td className={styles.respItm}>{advertiserId}</td>
          <td className={styles.respItm}>{campaignId}</td>
          <td className={styles.respItm}>{creativeId}</td>
        </tr>
      </table>
    </div>
  );
};

export default ResponseInfo;