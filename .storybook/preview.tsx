import React from 'react';
import type { Preview } from '@storybook/react';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import { Toaster } from 'react-hot-toast';
import '../app/globals.css';

initialize();

const preview: Preview = {
    decorators: [
        mswDecorator,
        (Story, context) => (
            <>
                <Toaster />
                <Story {...context} />
            </>
        ),
    ],
    parameters: {
        controls: { matchers: { color: /(background|color)/i, date: /Date$/ } },
        nextjs: { appDirectory: true },
        actions: { argTypesRegex: '^on[A-Z].*' },
    },
};

export default preview;
