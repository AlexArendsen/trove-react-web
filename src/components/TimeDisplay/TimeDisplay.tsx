import { format, formatDistanceToNowStrict } from "date-fns";
import React, { useMemo } from "react";
import { Text } from "../Text/Text";

interface TimeDisplayProps {
	time?: Date | string | number
	style?: React.CSSProperties
	long?: boolean
}

const replacements: any = { se: 's', mi: 'min', ho: 'h', da: 'd', mo: 'mo', ye: 'y' }

export const TimeDisplay = React.memo((props: TimeDisplayProps) => {

	const { toNow, formatted, date } = useMemo(() => {
		if (!props.time) return { toNow: '??', formatted: '', date: null }
		const d = new Date(props.time);
		return {
			date: d,
			toNow: formatDistanceToNowStrict(d, { addSuffix: true }),
			formatted: format(d, 'd MMM y hh:mm:ss aa')
		}
	}, [ props.time ])

	const text = useMemo(() => {
		if (props.long) return toNow;
		const space = toNow.indexOf(' ');
		const stem = toNow.substr(space + 1, 2);
		const num = toNow.substr(0, space)
		return num + replacements[stem] || toNow;
	}, [ props ])

	if (!props.time) return null;

	return (
		<div title={ `${ formatted } (${ toNow })` }>
			<Text faded style={ props.style }>{ text }</Text>
		</div>
	)

})