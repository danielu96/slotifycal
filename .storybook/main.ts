import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
    stories: ['../**/*.stories.@(ts|tsx)', '../**/*.stories.@(ts|tsx)'],
    addons: [
        '@storybook/addon-essentials',
        'msw-storybook-addon'
    ],
    framework: { name: '@storybook/nextjs', options: {} },
};

export default config;
