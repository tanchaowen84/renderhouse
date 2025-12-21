import { PaymentTypes, PlanIntervals } from '@/payment/types';
import type { WebsiteConfig } from '@/types';

/**
 * website config, without translations
 *
 * docs:
 * https://mksaas.com/docs/config/website
 */
export const websiteConfig: WebsiteConfig = {
  metadata: {
    theme: {
      defaultTheme: 'default',
      enableSwitch: true,
    },
    mode: {
      defaultMode: 'light',
      enableSwitch: false,
    },
    images: {
      ogImage: '/og.png',
      logoLight: '/logo.png',
      logoDark: '/logo-dark.png',
    },
    social: {
      github: 'https://github.com/MkSaaSHQ',
      twitter: 'https://mksaas.link/twitter',
      blueSky: 'https://mksaas.link/bsky',
      discord: 'https://mksaas.link/discord',
      mastodon: 'https://mksaas.link/mastodon',
      linkedin: 'https://mksaas.link/linkedin',
      youtube: 'https://mksaas.link/youtube',
    },
  },
  features: {
    enableDiscordWidget: false,
    enableUpgradeCard: true,
    enableAffonsoAffiliate: false,
    enablePromotekitAffiliate: false,
    enableDocsPage: false,
    enableAIPages: false,
    enableMagicUIPage: false,
    enableBlocksPages: false,
  },
  routes: {
    defaultLoginRedirect: '/dashboard',
  },
  analytics: {
    enableVercelAnalytics: false,
    enableSpeedInsights: false,
  },
  auth: {
    enableGoogleLogin: true,
    enableGithubLogin: true,
  },
  i18n: {
    defaultLocale: 'en',
    locales: {
      en: {
        flag: '🇺🇸',
        name: 'English',
      },
      // zh: {
      //   flag: '🇨🇳',
      //   name: '中文',
      // },
    },
  },
  blog: {
    paginationSize: 6,
    relatedPostsSize: 3,
  },
  mail: {
    provider: 'resend',
    fromEmail: 'MkSaaS <support@mksaas.com>',
    supportEmail: 'MkSaaS <support@mksaas.com>',
  },
  newsletter: {
    provider: 'resend',
    autoSubscribeAfterSignUp: true,
  },
  storage: {
    provider: 's3',
  },
  payment: {
    provider: 'creem',
  },
  price: {
    plans: {
      free: {
        id: 'free',
        prices: [],
        isFree: true,
        isLifetime: false,
        credits: 3,
      },
      starter: {
        id: 'starter',
        prices: [
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_STARTER_MONTHLY!,
            amount: 900,
            currency: 'USD',
            interval: PlanIntervals.MONTH,
          },
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_STARTER_YEARLY!,
            amount: 8400,
            currency: 'USD',
            interval: PlanIntervals.YEAR,
          },
        ],
        isFree: false,
        isLifetime: false,
        credits: 60,
      },
      pro: {
        id: 'pro',
        prices: [
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO_MONTHLY!,
            amount: 1900,
            currency: 'USD',
            interval: PlanIntervals.MONTH,
          },
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO_YEARLY!,
            amount: 18000,
            currency: 'USD',
            interval: PlanIntervals.YEAR,
          },
        ],
        isFree: false,
        isLifetime: false,
        recommended: true,
        credits: 200,
      },
      studio: {
        id: 'studio',
        prices: [
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_STUDIO_MONTHLY!,
            amount: 4900,
            currency: 'USD',
            interval: PlanIntervals.MONTH,
          },
          {
            type: PaymentTypes.SUBSCRIPTION,
            priceId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_STUDIO_YEARLY!,
            amount: 46800,
            currency: 'USD',
            interval: PlanIntervals.YEAR,
          },
        ],
        isFree: false,
        isLifetime: false,
        credits: 700,
      },
      pack60: {
        id: 'pack60',
        prices: [
          {
            type: PaymentTypes.ONE_TIME,
            priceId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PACK_60!,
            amount: 900,
            currency: 'USD',
          },
        ],
        isFree: false,
        isLifetime: false,
        credits: 60,
      },
      pack200: {
        id: 'pack200',
        prices: [
          {
            type: PaymentTypes.ONE_TIME,
            priceId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PACK_200!,
            amount: 1900,
            currency: 'USD',
          },
        ],
        isFree: false,
        isLifetime: false,
        credits: 200,
      },
      pack700: {
        id: 'pack700',
        prices: [
          {
            type: PaymentTypes.ONE_TIME,
            priceId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PACK_700!,
            amount: 4900,
            currency: 'USD',
          },
        ],
        isFree: false,
        isLifetime: false,
        credits: 700,
      },
    },
  },
};
