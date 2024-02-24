import classNames from "classnames";
import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Colors } from "../../constants/Colors";
import { useItemProgress } from "../../hooks/UseItemProgress";
import { useLens } from "../../hooks/UseLens";
import { useStore } from "../../hooks/UseStore";
import { CheckItemAction, UncheckItemAction } from "../../redux/actions/ItemActions";
import './Checkbox.css';
import { useMultiSelect } from "../../stores/useMultiSelect";

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

	const dispatch = useDispatch();
	const item = useStore(s => props.itemId ? s.items.byId[props.itemId] : null);
	const lens = useLens()
	const ms = useMultiSelect()

	const checked = useMemo(() => {
		if (ms.isEnabled) return props.itemId ? ms.itemIsSelected(props.itemId) : false;
		else return item ? item.checked : props.checked;
	}, [ props.checked, item, ms.isEnabled, ms.itemIds ])

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
				item.checked ? dispatch(UncheckItemAction(props.itemId)) : dispatch(CheckItemAction(props.itemId))
			}
			if (props.onClick) props.onClick()
		}

	}, [ props.onClick, checked, lens.current, ms.isEnabled, ms.toggleItem, props.itemId ])

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
				//backgroundColor: '#0000ff33',
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