import classNames from "classnames";
import React, { useEffect, useMemo } from "react";
import { useItemProgress } from "../../hooks/UseItemProgress";
import { Item } from "../../redux/models/Items/Item";
import './ProgressBar.css';
import { useMultiSelect } from "../../stores/useMultiSelect";

interface ProgressBarProps {
	floating?: boolean
	percent?: number
	item?: Item | null
}

export const ProgressBar = React.memo((props: ProgressBarProps) => {

	const { floating, percent, item } = props;
	const msEnabled = useMultiSelect().isEnabled

	const itemPct = useItemProgress(item);
	const propPct = useMemo(() => {
		if (percent) return (percent > 1) ? percent / 100 : percent;
		return 0;
	}, [ percent ])
	const pct = itemPct || propPct;

	return (
		<div className={ classNames({ 'progress-bar-background': true, 'progress-bar-floating': floating }) }>
			<div className={ classNames({
				'progress-bar-contents': true,
				'progress-bar-floating': floating,
				'multiselect': msEnabled
			}) } style={{ width: `${ pct * 100 }%` }}>
			</div>
		</div>
	)

})