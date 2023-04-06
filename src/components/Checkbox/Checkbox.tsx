import classNames from "classnames";
import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Colors } from "../../constants/Colors";
import { useItemProgress } from "../../hooks/UseItemProgress";
import { useLens } from "../../hooks/UseLens";
import { useStore } from "../../hooks/UseStore";
import { CheckItemAction, UncheckItemAction } from "../../redux/actions/ItemActions";
import './Checkbox.css';

interface CheckboxProps {
	checked?: boolean
	onClick?: () => void,
	className?: string,
	itemId?: string, // Convenience prop, when passed will check / uncheck item accordingly
	small?: boolean,
	showProgress?: boolean
}

export const Checkbox = React.memo((props: CheckboxProps) => {

	const dispatch = useDispatch();
	const item = useStore(s => props.itemId ? s.items.byId[props.itemId] : null);
	const lens = useLens()

	const checked = useMemo(() => {
		return item ? item.checked : props.checked;
	}, [ props.checked, item ])

	const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault();
		e.stopPropagation();
		if (item && props.itemId) {
			item.checked ? dispatch(UncheckItemAction(props.itemId)) : dispatch(CheckItemAction(props.itemId))
		}
		if (props.onClick) props.onClick()
	}, [ props.onClick, checked, lens.current ])

	const progress = useItemProgress(item);

	return (
		<div onClick={ handleClick } style={{
			background: props.showProgress ? `linear-gradient(45deg, #4931AB ${progress * 100}%, transparent ${progress * 100}%)` : undefined,
			borderColor: props.showProgress && progress > 0 ? '#4931AB' : undefined
		}} className={classNames({
			'checkbox': true,
			'checkbox-small': props.small,
			'checkbox-checked': checked
		})}>
		</div>
	)

})