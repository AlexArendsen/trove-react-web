import classNames from "classnames";
import React, { useCallback, useEffect, useMemo } from "react";
import { useItemProgress } from "../../hooks/UseItemProgress";
import { useItemStore } from "../../stores/ItemStore/useItemStore";
import { useMultiSelect } from "../../stores/useMultiSelect";
import './Checkbox.css';

interface CheckboxProps {
	checked?: boolean
	onClick?: () => void,
	className?: string,
	itemId?: string, // Convenience prop, when passed will check / uncheck item accordingly
	small?: boolean,
	hitSlop?: 'full' | 'slim' | 'none'
	showProgress?: boolean
}

export const Checkbox = React.memo((props: CheckboxProps) => {

	const item = useItemStore(s => props.itemId ? s.byId[props.itemId] : null);
	const ms = useMultiSelect()

	const checked = useMemo(() => {
		if (ms.isEnabled) return props.itemId ? ms.itemIsSelected(props.itemId) : false;
		else return item ? item.checked : props.checked;
	}, [ props.checked, item?.checked, ms.isEnabled, ms.itemIds ])

	const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault();
		e.stopPropagation();

		if (ms.isEnabled)
		{
			if (props.itemId) ms.toggleItem(props.itemId)
		}
		else
		{
			if (item && props.itemId) {
				item.checked ? useItemStore.getState().uncheckOne(props.itemId) : useItemStore.getState().checkOne(props.itemId)
			}
			if (props.onClick) props.onClick()
		}

	}, [ props.onClick, checked, ms.isEnabled, ms.toggleItem, props.itemId ])

	const handleRightClick = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault();
		e.stopPropagation();
		if (!props.itemId) return
		if (!ms.isEnabled) ms.start(props.itemId)
		else ms.toggleItem(props.itemId)
	}, [ ms.start, ms.isEnabled, props.itemId ])

	const progress = useItemProgress(item);
	const showProgress = props.showProgress && !ms.isEnabled
	const [ vslop, hslop ] = useMemo(() => {
		switch(props.hitSlop) {
			case 'full': return [15, 15];
			case 'slim': return [5, 15];
			default: return [0, 0];
		}
	}, [ props.hitSlop ])

	return (
		<div
			onClick={ handleClick }
			onContextMenu={ handleRightClick }
			style={{
				margin: `-${vslop}px -${hslop}px`,
				padding: `${vslop}px ${hslop}px`
			}}
			>
				<div
					style={{
						background: showProgress ? `linear-gradient(45deg, #4931AB ${progress * 100}%, transparent ${progress * 100}%)` : undefined,
						borderColor: showProgress && progress > 0 ? '#4931AB' : undefined
					}}
					className={classNames({
						'checkbox': true,
						'checkbox-small': props.small,
						'checkbox-checked': checked,
						'multiselect': ms.isEnabled
					})
				}>
				</div>
		</div>
	)

})