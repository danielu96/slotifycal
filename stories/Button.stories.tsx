import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
    title: 'Basics/Button',
    component: Button,
    argTypes: {
        onClick: { action: 'clicked' }, // still works for Default
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {
        label: 'Kliknij mnie',
    },
};

export const CounterButton: Story = {
    render: (args) => {
        const [count, setCount] = React.useState(0);
        return (
            <>
                <p>Kliknięto: {count} razy</p>
                <Button {...args} onClick={() => setCount((c) => c + 1)} />
            </>
        );
    },
    args: {
        label: 'Kliknij',
    },
};






// import type { Meta, StoryObj } from '@storybook/react';
// import { Button } from './Button';

// const meta: Meta<typeof Button> = {
//     title: 'Basics/Button',
//     component: Button,
//     argTypes: {
//         onClick: { action: 'clicked' },
//     },
// };

// export default meta;
// type Story = StoryObj<typeof Button>;

// export const Default: Story = {
//     args: {
//         label: 'Kliknij mnie',
//     },
// };

// export const CounterButton: Story = {
//   render: (args) => {
//     const [count, setCount] = React.useState(0);
//     return (
//       <>
//         <p>Kliknięto: {count} razy</p>
//         <Button {...args} onClick={() => setCount((c) => c + 1)} />
//       </>
//     );
//   },
//   args: {
//     label: 'Kliknij',
//   },
// };