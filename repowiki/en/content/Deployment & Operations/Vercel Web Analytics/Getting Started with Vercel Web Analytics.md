# Getting Started with Vercel Web Analytics

This guide will help you get started with using Vercel Web Analytics on your project, showing you how to enable it, add the package to your project, deploy your app to Vercel, and view your data in the dashboard.

**Select your framework to view instructions on using the Vercel Web Analytics in your project**.

## Prerequisites

- A Vercel account. If you don't have one, you can [sign up for free](https://vercel.com/signup).
- A Vercel project. If you don't have one, you can [create a new project](https://vercel.com/new).
- The Vercel CLI installed. If you don't have it, you can install it using the following command:

### Install Vercel CLI

```bash tab="pnpm"
pnpm i vercel
```

```bash tab="yarn"
yarn i vercel
```

```bash tab="npm"
npm i vercel
```

```bash tab="bun"
bun i vercel
```

### Enable Web Analytics in Vercel

On the [Vercel dashboard](https://vercel.com/dashboard), select your Project and then click the **Analytics** tab and click **Enable** from the dialog.

> **ð¡ Note:** Enabling Web Analytics will add new routes (scoped at `/_vercel/insights/*`)
> after your next deployment.

## Framework-Specific Installation

### Add `@vercel/analytics` to your project

Using the package manager of your choice, add the `@vercel/analytics` package to your project:

```bash tab="pnpm"
pnpm i @vercel/analytics
```

```bash tab="yarn"
yarn i @vercel/analytics
```

```bash tab="npm"
npm i @vercel/analytics
```

```bash tab="bun"
bun i @vercel/analytics
```

## Framework Integration

### Next.js (Pages Directory)

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Next.js, including route support.

If you are using the `pages` directory, add the following code to your main app file:

```tsx filename="pages/_app.tsx" framework=nextjs
import type &#123; AppProps &#125; from "next/app";
import &#123; Analytics &#125; from "@vercel/analytics/next";

function MyApp(&#123; Component, pageProps &#125;: AppProps) &#123;
  return (
    <>
      <Component &#123;...pageProps&#125; />
      <Analytics />
    </>
  );
&#125;

export default MyApp;
```

```jsx filename="pages/_app.js" framework=nextjs
import &#123; Analytics &#125; from "@vercel/analytics/next";

function MyApp(&#123; Component, pageProps &#125;) &#123;
  return (
    <>
      <Component &#123;...pageProps&#125; />
      <Analytics />
    </>
  );
&#125;

export default MyApp;
```

### Next.js (App Router)

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Next.js, including route support.

Add the following code to the root layout:

```tsx filename="app/layout.tsx" framework=nextjs-app
import &#123; Analytics &#125; from "@vercel/analytics/next";

export default function RootLayout(&#123;
  children,
&#125;: &#123;
  children: React.ReactNode;
&#125;) &#123;
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        &#123;children&#125;
        <Analytics />
      </body>
    </html>
  );
&#125;
```

```jsx filename="app/layout.jsx" framework=nextjs-app
import &#123; Analytics &#125; from "@vercel/analytics/next";

export default function RootLayout(&#123; children &#125;) &#123;
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        &#123;children&#125;
        <Analytics />
      </body>
    </html>
  );
&#125;
```

### Remix

The `Analytics` component is a wrapper around the tracking script, offering a seamless integration with Remix, including route detection.

Add the following code to your root file:

```tsx filename="app/root.tsx" framework=remix
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
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Analytics />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
&#125;
```

```jsx filename="app/root.jsx" framework=remix
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
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Analytics />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
&#125;
```

### Nuxt

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Nuxt, including route support.

Add the following code to your main component:

```tsx filename="app.vue" framework=nuxt
<script setup lang="ts">
import &#123; Analytics &#125; from '@vercel/analytics/nuxt';
</script>

<template>
  <Analytics />
  <NuxtPage />
</template>
```

```jsx filename="app.vue" framework=nuxt
<script setup>
import &#123; Analytics &#125; from '@vercel/analytics/nuxt';
</script>

<template>
  <Analytics />
  <NuxtPage />
</template>
```

### SvelteKit

The `injectAnalytics` function is a wrapper around the tracking script, offering more seamless integration with SvelteKit.js, including route support.

Add the following code to the main layout:

```ts filename="src/routes/+layout.ts" framework=sveltekit
import &#123; dev &#125; from "$app/environment";
import &#123; injectAnalytics &#125; from "@vercel/analytics/sveltekit";

injectAnalytics(&#123; mode: dev ? "development" : "production" &#125;);
```

```js filename="src/routes/+layout.js" framework=sveltekit
import &#123; dev &#125; from "$app/environment";
import &#123; injectAnalytics &#125; from "@vercel/analytics/sveltekit";

injectAnalytics(&#123; mode: dev ? "development" : "production" &#125;);
```

### Astro

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Astro, including route support.

Add the following code to your base layout:

```tsx filename="src/layouts/Base.astro" framework=astro
---
import Analytics from '@vercel/analytics/astro';
&#123;/* ... */&#125;
---

<html lang="en">
	<head>
    <meta charset="utf-8" />
    <!-- ... -->
    <Analytics />
	</head>
	<body>
		<slot />
  </body>
</html>
```

```jsx filename="src/layouts/Base.astro" framework=astro
---
import Analytics from '@vercel/analytics/astro';
&#123;/* ... */&#125;
---

<html lang="en">
	<head>
    <meta charset="utf-8" />
    <!-- ... -->
    <Analytics />
	</head>
	<body>
		<slot />
  </body>
</html>
```

> **ð¡ Note:** The `Analytics` component is available in version `@vercel/analytics@1.4.0` and later.
> If you are using an earlier version, you must configure the `webAnalytics` property of the Vercel adapter in your `astro.config.mjs` file as shown in the code below.
> For further information, see the [Astro adapter documentation](https://docs.astro.build/en/guides/integrations-guide/vercel/#webanalytics).

```ts filename="astro.config.mjs" framework=astro
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

```js filename="astro.config.mjs" framework=astro
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

> **ð¡ Note:** When using the plain React implementation, there is no route support.

Add the following code to the main app file:

```tsx filename="App.tsx" framework=create-react-app
import &#123; Analytics &#125; from "@vercel/analytics/react";

export default function App() &#123;
  return (
    <div>
      &#123;/* ... */&#125;
      <Analytics />
    </div>
  );
&#125;
```

```jsx filename="App.jsx" framework=create-react-app
import &#123; Analytics &#125; from "@vercel/analytics/react";

export default function App() &#123;
  return (
    <div>
      &#123;/* ... */&#125;
      <Analytics />
    </div>
  );
&#125;
```

### Vue

The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Vue.

> **ð¡ Note:** Route support is automatically enabled if you're using `vue-router`.

Add the following code to your main component:

```tsx filename="src/App.vue" framework=vue
<script setup lang="ts">
import &#123; Analytics &#125; from '@vercel/analytics/vue';
</script>

<template>
  <Analytics />
  <!-- your content -->
</template>
```

```jsx filename="src/App.vue" framework=vue
<script setup>
import &#123; Analytics &#125; from '@vercel/analytics/vue';
</script>

<template>
  <Analytics />
  <!-- your content -->
</template>
```

### Plain HTML Sites

For plain HTML sites, you can add the following script to your `.html` files:

```ts filename="index.html" framework=html
<script>
  window.va = window.va || function () &#123; (window.vaq = window.vaq || []).push(arguments); &#125;;
</script>
<script defer src="/_vercel/insights/script.js"></script>
```

```js filename="index.html" framework=html
<script>
  window.va = window.va || function () &#123; (window.vaq = window.vaq || []).push(arguments); &#125;;
</script>
<script defer src="/_vercel/insights/script.js"></script>
```

> **ð¡ Note:** When using the HTML implementation, there is no need to install the
> `@vercel/analytics` package. However, there is no route support.

### Other Frameworks

Import the `inject` function from the package, which will add the tracking script to your app. **This should only be called once in your app, and must run in the client**.

> **ð¡ Note:** There is no route support with the `inject` function.

Add the following code to your main app file:

```ts filename="main.ts" framework=other
import &#123; inject &#125; from "@vercel/analytics";

inject();
```

```js filename="main.js" framework=other
import &#123; inject &#125; from "@vercel/analytics";

inject();
```

## Deployment

### Deploy your app to Vercel

Deploy your app using the following command:

```bash
vercel deploy
```

If you haven't already, we also recommend [connecting your project's Git repository](https://vercel.com/docs/git#deploying-a-git-repository),
which will enable Vercel to deploy your latest commits to main without terminal commands.

Once your app is deployed, it will start tracking visitors and page views.

> **ð¡ Note:** If everything is set up properly, you should be able to see a Fetch/XHR
> request in your browser's Network tab from `/_vercel/insights/view` when you
> visit any page.

### View your data in the dashboard

Once your app is deployed, and users have visited your site, you can view your data in the dashboard.

To do so, go to your [dashboard](https://vercel.com/dashboard), select your project, and click the **Analytics** tab.

After a few days of visitors, you'll be able to start exploring your data by viewing and [filtering](https://vercel.com/docs/analytics/filtering) the panels.

Users on Pro and Enterprise plans can also add [custom events](https://vercel.com/docs/analytics/custom-events) to their data to track user interactions such as button clicks, form submissions, or purchases.

Learn more about how Vercel supports [privacy and data compliance standards](https://vercel.com/docs/analytics/privacy-policy) with Vercel Web Analytics.

## Next Steps

Now that you have Vercel Web Analytics set up, you can explore the following topics to learn more:

- [Learn how to use the `@vercel/analytics` package](https://vercel.com/docs/analytics/package)
- [Learn how to set update custom events](https://vercel.com/docs/analytics/custom-events)
- [Learn about filtering data](https://vercel.com/docs/analytics/filtering)
- [Read about privacy and compliance](https://vercel.com/docs/analytics/privacy-policy)
- [Explore pricing](https://vercel.com/docs/analytics/limits-and-pricing)
- [Troubleshooting](https://vercel.com/docs/analytics/troubleshooting)
