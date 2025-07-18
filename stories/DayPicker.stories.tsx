// src/components/Calendar/DayPicker.stories.tsx

import React, { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const meta: Meta = {
    title: 'Calendar/DayPicker',
    component: DayPicker,
    args: {
        mode: 'single',
        weekStartsOn: 1,
        showOutsideDays: true,
    },
};

export default meta;

const Template: StoryFn<Parameters<typeof DayPicker>[0]> = (args) => {
    const [selected, setSelected] = useState<Date | undefined>();

    return (
        <DayPicker
            {...args}
            selected={selected}
            onDayClick={(day) => setSelected(day)}
            modifiers={{
                disabled: (day) => day < new Date(), // disable past days by default
            }}
            modifiersClassNames={{
                disabled: 'text-gray-400 cursor-not-allowed',
            }}
            classNames={{
                root: 'p-4',
                nav: 'flex justify-between mb-4',
                month: 'p-2',
                day: 'p-2 rounded hover:bg-blue-100',
                selected: 'bg-blue-500 text-white',
            }}
        />
    );
};

export const Default = Template.bind({});
Default.args = {};

export const HideOutsideDays = Template.bind({});
HideOutsideDays.args = {
    showOutsideDays: false,
};

export const DisableWeekends = Template.bind({});
DisableWeekends.args = {
    modifiers: {
        disabled: (day) => [0, 6].includes(day.getDay()) || day < new Date(),
    },
};
