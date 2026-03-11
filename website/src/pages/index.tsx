import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';

const ZH_LANGS = ['zh', 'zh-CN', 'zh-TW', 'zh-HK', 'zh-Hans', 'zh-Hant'];

function isChineseBrowser(): boolean {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  return langs.some(lang => ZH_LANGS.some(zh => lang.toLowerCase().startsWith(zh.toLowerCase())));
}

const PREF_KEY = 'openclaw-lang-redirected';

export default function Home(): JSX.Element {
  const history = useHistory();

  useEffect(() => {
    // Only auto-redirect once per session; user's explicit navigation takes over after that
    const alreadyRedirected = sessionStorage.getItem(PREF_KEY);
    if (!alreadyRedirected) {
      sessionStorage.setItem(PREF_KEY, '1');
      if (isChineseBrowser()) {
        history.replace('/zh/快速开始');
        return;
      }
    }
    history.replace('/Getting Started');
  }, []);

  // Render nothing while redirecting
  return null;
}
