# gpt-ad-debug-react
Adding DoubleClick GPT Ads to your web app?

This debug tool for React covers some of the same ground as the Publisher Console ( googletag.openConsole() ) but renders 
faster and focuses more on the details that are relevant to the developer working on the implementation or debugging a problem.

The component can be used as follows:

import SampleAd from './gpt-ad-debug/SampleAd';
import AdDebug from './gpt-ad-debug/AdDebug';

...

const debug = true; // suppress on production
  
return (
  <>
    <SampleAd width="728" height="90" position="banner1" />
    <SampleAd width="300" height="250" position="rail1" />
    { debug && 
      <AdDebug />
    }
  </>
)

The SampleAd component is configured to run ads from the DoubleClick test account. 

![screenshot](https://user-images.githubusercontent.com/22104323/81356338-f5b90f80-909e-11ea-8b18-5e29efcd449f.png)


