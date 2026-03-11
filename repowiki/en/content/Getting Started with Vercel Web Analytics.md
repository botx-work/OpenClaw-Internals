# Getting started with Vercel Web Analytics

This guide will help you get started with using Vercel Web Analytics on your project, showing you how to enable it, add the package to your project, deploy your app to Vercel, and view your data in the dashboard.

**Select your framework to view instructions on using the Vercel Web Analytics in your project**.

## Prerequisites

- A Vercel account. If you don't have one, you can [sign up for free](https://vercel.com/signup).
- A Vercel project. If you don't have one, you can [create a new project](https://vercel.com/new).
- The Vercel CLI installed. If you don't have it, you can install it using the following command:

**pnpm:**
```bash
pnpm i vercel
```

**yarn:**
```bash
yarn i vercel
```

**npm:**
```bash
npm i vercel
```

**bun:**
```bash
bun i vercel
```

### Enable Web Analytics in Vercel

On the [Vercel dashboard](https://vercel.com/dashboard), select your Project and then click the **Analytics** tab and click **Enable** from the dialog.

> **💡 Note:** Enabling Web Analytics will add new routes (scoped at `/_vercel/insights/*`) after your next deployment.

## Installation

### Add `@vercel/analytics` to your project

Using the package manager of your choice, add the `@vercel/analytics` package to your project:

**pnpm:**
```bash
pnpm i @vercel/analytics
```

**yarn:**
```bash
yarn i @vercel/analytics
```

**npm:**
```bash
npm i @vercel/analytics
```

**bun:**
```bash
bun i @vercel/analytics
```

## Framework Integration

### Next.js (Pages Directory)

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Next.js, including route support.

If you are using the `pages` directory, add the following code to your main app file:

**TypeScript (`pages/_app.tsx`):**
```tsx
import type &#123; AppProps &#125; from "next/app";
import &#123; Analytics &#125; from "@vercel/analytics/next";

function MyApp(&#123; Component, pageProps &#125;: AppProps) &#123;
  return (
    &lt;&gt;
      &lt;Component &#123;...pageProps&#125; /&gt;
      &lt;Analytics /&gt;
    &lt;/&gt;
  );
&#125;

export default MyApp;
```

**JavaScript (`pages/_app.js`):**
```jsx
import &#123; Analytics &#125; from "@vercel/analytics/next";

function MyApp(&#123; Component, pageProps &#125;) &#123;
  return (
    &lt;&gt;
      &lt;Component &#123;...pageProps&#125; /&gt;
      &lt;Analytics /&gt;
    &lt;/&gt;
  );
&#125;

export default MyApp;
```

### Next.js (App Directory)

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Next.js, including route support.

Add the following code to the root layout:

**TypeScript (`app/layout.tsx`):**
```tsx
import &#123; Analytics &#125; from "@vercel/analytics/next";

export default function RootLayout(&#123;
  children,
&#125;: &#123;
  children: React.ReactNode;
&#125;) &#123;
  return (
    &lt;html lang="en"&gt;
      &lt;head&gt;
        &lt;title&gt;Next.js&lt;/title&gt;
      &lt;/head&gt;
      &lt;body&gt;
        &#123;children&#125;
        &lt;Analytics /&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  );
&#125;
```

**JavaScript (`app/layout.jsx`):**
```jsx
import &#123; Analytics &#125; from "@vercel/analytics/next";

export default function RootLayout(&#123; children &#125;) &#123;
  return (
    &lt;html lang="en"&gt;
      &lt;head&gt;
        &lt;title&gt;Next.js&lt;/title&gt;
      &lt;/head&gt;
      &lt;body&gt;
        &#123;children&#125;
        &lt;Analytics /&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  );
&#125;
```

### Remix

The `Analytics` component is a wrapper around the tracking script, offering a seamless integration with Remix, including route detection.

Add the following code to your root file:

**TypeScript (`app/root.tsx`):**
```tsx
import &#123;
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
&#125; from "@remix-run/react";
import &#123; Analytics &#125; from "@vercel/analytics/remix";

export default function App() &#123;
  return (
    &lt;html lang="en"&gt;
      &lt;head&gt;
        &lt;meta charSet="utf-8" /&gt;
        &lt;meta name="viewport" content="width=device-width, initial-scale=1" /&gt;
        &lt;Meta /&gt;
        &lt;Links /&gt;
      &lt;/head&gt;
      &lt;body&gt;
        &lt;Analytics /&gt;
        &lt;Outlet /&gt;
        &lt;ScrollRestoration /&gt;
        &lt;Scripts /&gt;
        &lt;LiveReload /&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  );
&#125;
```

**JavaScript (`app/root.jsx`):**
```jsx
import &#123;
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
&#125; from "@remix-run/react";
import &#123; Analytics &#125; from "@vercel/analytics/remix";

export default function App() &#123;
  return (
    &lt;html lang="en"&gt;
      &lt;head&gt;
        &lt;meta charSet="utf-8" /&gt;
        &lt;meta name="viewport" content="width=device-width, initial-scale=1" /&gt;
        &lt;Meta /&gt;
        &lt;Links /&gt;
      &lt;/head&gt;
      &lt;body&gt;
        &lt;Analytics /&gt;
        &lt;Outlet /&gt;
        &lt;ScrollRestoration /&gt;
        &lt;Scripts /&gt;
        &lt;LiveReload /&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  );
&#125;
```

### Nuxt

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Nuxt, including route support.

Add the following code to your main component.

**TypeScript (`app.vue`):**
```vue
&lt;script setup lang="ts"&gt;
import &#123; Analytics &#125; from '@vercel/analytics/nuxt';
&lt;/script&gt;

&lt;template&gt;
  &lt;Analytics /&gt;
  &lt;NuxtPage /&gt;
&lt;/template&gt;
```

**JavaScript (`app.vue`):**
```vue
&lt;script setup&gt;
import &#123; Analytics &#125; from '@vercel/analytics/nuxt';
&lt;/script&gt;

&lt;template&gt;
  &lt;Analytics /&gt;
  &lt;NuxtPage /&gt;
&lt;/template&gt;
```

### SvelteKit

The `injectAnalytics` function is a wrapper around the tracking script, offering more seamless integration with SvelteKit, including route support.

Add the following code to the main layout:

**TypeScript (`src/routes/+layout.ts`):**
```ts
import &#123; dev &#125; from "$app/environment";
import &#123; injectAnalytics &#125; from "@vercel/analytics/sveltekit";

injectAnalytics(&#123; mode: dev ? "development" : "production" &#125;);
```

**JavaScript (`src/routes/+layout.js`):**
```js
import &#123; dev &#125; from "$app/environment";
import &#123; injectAnalytics &#125; from "@vercel/analytics/sveltekit";

injectAnalytics(&#123; mode: dev ? "development" : "production" &#125;);
```

### Astro

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Astro, including route support.

Add the following code to your base layout:

**TypeScript (`src/layouts/Base.astro`):**
```astro
---
import Analytics from '@vercel/analytics/astro';
&#123;/* ... */&#125;
---

&lt;html lang="en"&gt;
  &lt;head&gt;
    &lt;meta charset="utf-8" /&gt;
    &lt;!-- ... --&gt;
    &lt;Analytics /&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;slot /&gt;
  &lt;/body&gt;
&lt;/html&gt;
```

**JavaScript (`src/layouts/Base.astro`):**
```astro
---
import Analytics from '@vercel/analytics/astro';
&#123;/* ... */&#125;
---

&lt;html lang="en"&gt;
  &lt;head&gt;
    &lt;meta charset="utf-8" /&gt;
    &lt;!-- ... --&gt;
    &lt;Analytics /&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;slot /&gt;
  &lt;/body&gt;
&lt;/html&gt;
```

> **💡 Note:** The `Analytics` component is available in version `@vercel/analytics@1.4.0` and later. If you are using an earlier version, you must configure the `webAnalytics` property of the Vercel adapter in your `astro.config.mjs` file as shown in the code below. For further information, see the [Astro adapter documentation](https://docs.astro.build/en/guides/integrations-guide/vercel/#webanalytics).

**TypeScript (`astro.config.mjs`):**
```ts
import &#123; defineConfig &#125; from "astro/config";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig(&#123;
  output: "server",
  adapter: vercel(&#123;
    webAnalytics: &#123;
      enabled: true, // set to false when using @vercel/analytics@1.4.0
    &#125;,
  &#125;),
&#125;);
```

**JavaScript (`astro.config.mjs`):**
```js
import &#123; defineConfig &#125; from "astro/config";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig(&#123;
  output: "server",
  adapter: vercel(&#123;
    webAnalytics: &#123;
      enabled: true, // set to false when using @vercel/analytics@1.4.0
    &#125;,
  &#125;),
&#125;);
```

### Create React App

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with React.

> **💡 Note:** When using the plain React implementation, there is no route support.

Add the following code to the main app file:

**TypeScript (`App.tsx`):**
```tsx
import &#123; Analytics &#125; from "@vercel/analytics/react";

export default function App() &#123;
  return (
    &lt;div&gt;
      &#123;/* ... */&#125;
      &lt;Analytics /&gt;
    &lt;/div&gt;
  );
&#125;
```

**JavaScript (`App.jsx`):**
```jsx
import &#123; Analytics &#125; from "@vercel/analytics/react";

export default function App() &#123;
  return (
    &lt;div&gt;
      &#123;/* ... */&#125;
      &lt;Analytics /&gt;
    &lt;/div&gt;
  );
&#125;
```

### Vue

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Vue.

> **💡 Note:** Route support is automatically enabled if you're using `vue-router`.

Add the following code to your main component:

**TypeScript (`src/App.vue`):**
```vue
&lt;script setup lang="ts"&gt;
import &#123; Analytics &#125; from '@vercel/analytics/vue';
&lt;/script&gt;

&lt;template&gt;
  &lt;Analytics /&gt;
  &lt;!-- your content --&gt;
&lt;/template&gt;
```

**JavaScript (`src/App.vue`):**
```vue
&lt;script setup&gt;
import &#123; Analytics &#125; from '@vercel/analytics/vue';
&lt;/script&gt;

&lt;template&gt;
  &lt;Analytics /&gt;
  &lt;!-- your content --&gt;
&lt;/template&gt;
```

### HTML (Plain)

For plain HTML sites, you can add the following script to your `.html` files:

**TypeScript (`index.html`):**
```html
&lt;script&gt;
  window.va = window.va || function () &#123; (window.vaq = window.vaq || []).push(arguments); &#125;;
&lt;/script&gt;
&lt;script defer src="/_vercel/insights/script.js"&gt;&lt;/script&gt;
```

**JavaScript (`index.html`):**
```html
&lt;script&gt;
  window.va = window.va || function () &#123; (window.vaq = window.vaq || []).push(arguments); &#125;;
&lt;/script&gt;
&lt;script defer src="/_vercel/insights/script.js"&gt;&lt;/script&gt;
```

> **💡 Note:** When using the HTML implementation, there is no need to install the `@vercel/analytics` package. However, there is no route support.

### Other Frameworks

Import the `inject` function from the package, which will add the tracking script to your app. **This should only be called once in your app, and must run in the client**.

> **💡 Note:** There is no route support with the `inject` function.

Add the following code to your main app file:

**TypeScript (`main.ts`):**
```ts
import &#123; inject &#125; from "@vercel/analytics";

inject();
```

**JavaScript (`main.js`):**
```js
import &#123; inject &#125; from "@vercel/analytics";

inject();
```

## Deployment

### Deploy your app to Vercel

Deploy your app using the following command:

```bash
vercel deploy
```

If you haven't already, we also recommend [connecting your project's Git repository](https://vercel.com/docs/git#deploying-a-git-repository), which will enable Vercel to deploy your latest commits to main without terminal commands.

Once your app is deployed, it will start tracking visitors and page views.

> **💡 Note:** If everything is set up properly, you should be able to see a Fetch/XHR request in your browser's Network tab from `/_vercel/insights/view` when you visit any page.

### View your data in the dashboard

Once your app is deployed, and users have visited your site, you can view your data in the dashboard.

To do so, go to your [dashboard](https://vercel.com/dashboard), select your project, and click the **Analytics** tab.

After a few days of visitors, you'll be able to start exploring your data by viewing and [filtering](https://vercel.com/docs/analytics/filtering) the panels.

Users on Pro and Enterprise plans can also add [custom events](https://vercel.com/docs/analytics/custom-events) to their data to track user interactions such as button clicks, form submissions, or purchases.

Learn more about how Vercel supports [privacy and data compliance standards](https://vercel.com/docs/analytics/privacy-policy) with Vercel Web Analytics.

## Next steps

Now that you have Vercel Web Analytics set up, you can explore the following topics to learn more:

- [Learn how to use the `@vercel/analytics` package](https://vercel.com/docs/analytics/package)
- [Learn how to set update custom events](https://vercel.com/docs/analytics/custom-events)
- [Learn about filtering data](https://vercel.com/docs/analytics/filtering)
- [Read about privacy and compliance](https://vercel.com/docs/analytics/privacy-policy)
- [Explore pricing](https://vercel.com/docs/analytics/limits-and-pricing)
- [Troubleshooting](https://vercel.com/docs/analytics/troubleshooting)
