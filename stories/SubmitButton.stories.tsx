import type { Meta, StoryObj } from '@storybook/react';
import { SubmitButton } from './SubmitButton';

const meta: Meta<typeof SubmitButton> = {
    title: 'Form/SubmitButton',
    component: SubmitButton,
    args: {
        text: 'Wyślij',
        size: 'lg',
    },
    argTypes: {
        isPending: {
            control: 'boolean',
            description: 'Override form hook and force loading state',
        },
    },
};

export default meta;
type Story = StoryObj<typeof SubmitButton>;

export const Default: Story = {};

export const SmallVariant: Story = {
    args: {
        size: 'sm',
        text: 'Zapisz',
    },
};

export const CustomClass: Story = {
    args: {
        className: 'bg-green-500 text-white rounded px-6 py-2 hover:drop-shadow-lg',
        text: 'Gotowe!',
    },
};

export const LoadingState: Story = {
    args: {
        text: 'Wyślij',
        isPending: true,      // ← now valid!
    },
};
