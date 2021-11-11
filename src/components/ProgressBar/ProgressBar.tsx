import classNames from "classnames";
import React, { useEffect, useMemo } from "react";
import { Item } from "../../redux/models/Items/Item";
import './ProgressBar.css';

interface ProgressBarProps {
	floating?: boolean
	percent?: number
	item?: Item | null
}

export const ProgressBar = React.memo((props: ProgressBarProps) => {

	const { floating, percent, item } = props;

	const pct = useMemo(() => {
		if (item) return item.checked ? 1 : (item.completed || 0) / (item.descendants || 1)
		else if (percent) return (percent > 1) ? percent / 100 : percent;
		return 0;
	}, [ item, percent, item?.completed, item?.descendants ])

	return (
		<div className={ classNames({ 'progress-bar-background': true, 'progress-bar-floating': floating }) }>
			<div className={ classNames({ 'progress-bar-contents': true, 'progress-bar-floating': floating }) } style={{ width: `${ pct * 100 }%` }}>
			</div>
		</div>
	)

})