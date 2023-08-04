import React, { useEffect, useState } from "react";
import { useItem } from "../../../hooks/UseItem";
import { FormatNumber } from "../../../utils/FormatNumber";
import { Bump } from "../../Bump/Bump";
import { Flex } from "../../Flex/Flex";
import { SpinnerNumericPicker } from "../../SpinnerPicker/SpinnerNumericPicker";
import { SpinnerOptionPicker, SpinnerPickerOption } from "../../SpinnerPicker/SpinnerOptionPicker";
import { DEFAULT_TASK_ITEM_DATA, TASK_ITEM_DATA_SUBKEY, TaskItemData } from "./TaskItemData";
import { BooleanBubbles } from "../../BooleanBubbles/BooleanBubble";

const IntervalOptions: SpinnerPickerOption[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' },
    { label: 'Ever', value: 'ever' }
]

const TimeOfDayOptions: SpinnerPickerOption[] = [
    { label: 'Any Time', value: 'anytime' },
    { label: 'In The Morning', value: 'morning' },
    { label: 'In The Afternoon', value: 'afternoon' },
    { label: 'In The Evening', value: 'evening' }
]

const DayOfWeekOptions = [
    { label: 'M', value: 0 },
    { label: 'Tu', value: 1 },
    { label: 'W', value: 2 },
    { label: 'Th', value: 3 },
    { label: 'F', value: 4 },
    { label: 'Sa', value: 5 },
    { label: 'Su', value: 6 }
]

export const TaskEditor = React.memo((props: {
    itemId?: string
}) => {

    const { itemId } = props
    const item = useItem(itemId)
    const [ setup, setSetup ] = useState<TaskItemData>(DEFAULT_TASK_ITEM_DATA)

    useEffect(() => {
        if (itemId) setSetup({ ...DEFAULT_TASK_ITEM_DATA, ...item?.item?.data[TASK_ITEM_DATA_SUBKEY] })
    }, [ itemId ])

    return (
        <div>

            <Flex row>
                <SpinnerNumericPicker value={ setup.nTimes } onChange={ (value: number) => setSetup({ ...setup, nTimes: value }) } min={ 1 } max={ 25 } renderLabel={(v) => {
                    switch (v) {
                        case 1: return 'Once';
                        case 2: return 'Twice';
                        default: return `${v} Times`;
                    }
                }} style={{ minWidth: 170 }} />
                {
                    setup.interval === 'ever' ? null : (
                        <>
                            <Bump w={ 20 } />
                            <SpinnerNumericPicker value={ setup.each } onChange={ (value: number) => setSetup({ ...setup, each: value }) } min={ 1 } max={ 10 } renderLabel={(v) => {
                                switch (v) {
                                    case 1: return 'Every';
                                    case 2: return 'Every Other';
                                    default: return `Every ${FormatNumber.toNth(v)}`;
                                }
                            }} style={{ minWidth: 200 }} />
                        </>
                    )
                }
                <Bump w={ 20 } />
                <SpinnerOptionPicker options={ IntervalOptions } value={ setup.interval } onChange={ interval => setSetup({ ...setup, interval }) } style={{ minWidth: 170 }} />
                <Bump w={ 20 } />
                <SpinnerOptionPicker options={ TimeOfDayOptions } value={ setup.timeOfDay } onChange={ timeOfDay => setSetup({ ...setup, timeOfDay }) } style={{ minWidth: 220 }} />
            </Flex>

            <Bump h={ 20 } />
            <BooleanBubbles options={ DayOfWeekOptions } selected={ setup.daysOfWeek || [] } onSelectedChange={ daysOfWeek => setSetup({ ...setup, daysOfWeek }) } />

        </div>
    );

})




