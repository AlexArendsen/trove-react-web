import classNames from "classnames";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Colors } from "../../constants/Colors";
import { useStore } from "../../hooks/UseStore";
import { CheckItemAction, UncheckItemAction } from "../../redux/actions/ItemActions";
import './Checkbox.css';

interface CheckboxProps {
	checked?: boolean
	onClick?: () => void,
	className?: string,
	itemId?: string // Convenience prop, when passed will check / uncheck item accordingly
}

export const Checkbox = React.memo((props: CheckboxProps) => {

	const checked = props.checked;
	const dispatch = useDispatch();
	const item = useStore(s => props.itemId ? s.items.byId[props.itemId] : null);

	const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault();
		e.stopPropagation();
		if (item && props.itemId) item.checked ? dispatch(UncheckItemAction(props.itemId)) : dispatch(CheckItemAction(props.itemId))
		if (props.onClick) props.onClick()
	}, [ props.onClick, checked ])

	return (
		<div onClick={ handleClick } className={classNames({
			'checkbox': true,
			'checkbox-checked': checked
		})}>
		</div>
	)

})