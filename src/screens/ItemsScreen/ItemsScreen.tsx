import { faAnglesLeft, faAnglesRight, faColumns, faRightLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router";
import { Breadcrumbs, SelectedItemBreadcrumbs } from "../../components/Breadcrumbs/Breadcrumbs";
import { Button } from "../../components/Button/Button";
import { Flex } from "../../components/Flex/Flex";
import { Routes } from "../../constants/Routes";
import { useSelectedItem } from "../../hooks/UseSelectedItem";
import { useWindowSize } from "../../hooks/UseWindowSize";
import { Item } from "../../redux/models/Items/Item";
import { useLayout } from "../../stores/useLayout";
import { ItemBlade } from "./ItemBlade/ItemBlade";
import { SelectedItemDisplay } from "./SelectedItemDisplay/SelectedItemDisplay";
import { Sidebar } from "./Sidebar";
import './ItemsScreen.css';
import classNames from "classnames";

export const ItemsScreen = React.memo(() => {

	const history = useHistory()
	const { item, parent, grandparent } = useSelectedItem();
	const { isMobile } = useWindowSize()
	const layout = useLayout()

	const showGrandparent = grandparent && layout.generationsToShow >= 2
	const showParent = parent && layout.generationsToShow >= 1
	const showParentButton = !!parent

	const handleBladeItemClick = useCallback((item: Item) => { history.push(Routes.item(item._id)) }, [])

	if (isMobile) return (
		<Flex column>
			<Flex row justify='space-between' align='center'>
				{
					layout.sidebarVisible
						? <Breadcrumbs itemId={ layout.sidebarItemId || '' } onSelectCrumb={ i => layout.setSidebarItemId(i?._id || null) } />
						: <SelectedItemBreadcrumbs />
				}
				<Button onClick={ layout.toggleSidebar } style={{ margin: '0 10px', padding: 8 }} variant={ layout.sidebarVisible ? 'submit' : undefined }>
					<FontAwesomeIcon icon={ faColumns } />
				</Button>
			</Flex>
			<Flex row style={{ height: 'calc(100vh - 112px)', maxHeight: 'calc(100vh - 115px)', overflow: 'hidden' }}>
				{ layout.sidebarVisible ? <Sidebar /> : <SelectedItemDisplay /> }
			</Flex>
		</Flex>

	)

	return (
		<Flex column>
			<Flex row justify='space-between' align='center'>
				<SelectedItemBreadcrumbs />
				<Flex row align='center'>
					{ layout.sidebarVisible ? <Breadcrumbs reverse itemId={ layout.sidebarItemId || '' } onSelectCrumb={ i => layout.setSidebarItemId(i?._id || null) } /> : null }
					<Button onClick={ layout.toggleSidebar } style={{ margin: '0 10px', padding: 8 }} variant={ layout.sidebarVisible ? 'submit' : undefined }>
						<FontAwesomeIcon icon={ faColumns } style={{ color: 'inherit' }} />
					</Button>
				</Flex>
			</Flex>
			<Flex row className='item-container'>
				{ showGrandparent ? <ItemBlade shadeLevel={1} itemId={ grandparent?._id } selected={ parent?._id } style={{ zIndex: 100 }} onItemClick={ handleBladeItemClick } /> : null }
				{ showParent ? <ItemBlade
						itemId={ parent?._id }
						selected={ item?._id }
						className={ classNames({
							'parent': true,
							'parent-grandparent-visible': showGrandparent
						}) }
						// style={{ marginLeft: showGrandparent ? -250 : 0, zIndex: 200 }}
						onItemClick={ handleBladeItemClick } />
					: null }
				{ showParentButton ? <ParentsFloatingButton pushRight={ layout.generationsToShow <= 0 } /> : null }
				<SelectedItemDisplay />
				<SidebarFloatingButton />
				<Sidebar />
			</Flex>
		</Flex>
	)

})

export const ParentsFloatingButton = React.memo((props: {
	pushRight?: boolean
}) => {

	const layout = useLayout()

	const handleClick = useCallback(() => {
		const n = layout.generationsToShow <= 0 ? 2 : layout.generationsToShow - 1
		layout.setGenerationsToShow(n)
	}, [layout.generationsToShow])

	return (
		<FloatingButton onClick={ handleClick } style={{ position: 'relative', left: props.pushRight ? 80 : undefined }}>
			<FontAwesomeIcon icon={ layout.generationsToShow > 0 ? faAnglesLeft : faAnglesRight } />
		</FloatingButton>
	)

})

export const SidebarFloatingButton = React.memo(() => {

	const history = useHistory()
	const selected = useSelectedItem()
	const layout = useLayout()

	const handleSwap = useCallback(() => {
		const selMain = selected.item?._id
		const selSide = layout.sidebarItemId
		if (!selMain || !selSide) return
		layout.setSidebarItemId(selMain)
		history.push(Routes.item(selSide))
	}, [layout.sidebarItemId, selected.item?._id])

	if (!layout.sidebarVisible) return null

	return (
		<FloatingButton onClick={ handleSwap }>
			<FontAwesomeIcon icon={ faRightLeft } />
		</FloatingButton>
	)
})


const FloatingButton = React.memo((props: {
	onClick: () => void
	children: JSX.Element
	style?: React.CSSProperties
}) => {

	return (
		<Flex column align='center' style={{ width: 0, ...props.style }}>
			<div style={{ flex: 10 }}></div>
			<Button style={{ zIndex: 500 }} variant='accent' onClick={ props.onClick }>
				{ props.children }
			</Button>
			<div style={{ flex: 1 }}></div>
		</Flex>
	)

})