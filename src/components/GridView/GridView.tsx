import React, { useMemo } from "react";
import { useItem } from "../../hooks/UseItem";
import { Item } from "../../redux/models/Items/Item";
import { TrText } from "../Text/Text";
import { Flex } from "../Flex/Flex";
import { Bump } from "../Bump/Bump";
import { CheckItemAction } from "../../redux/actions/ItemActions";
import { Checkbox } from "../Checkbox/Checkbox";
import { MoreMath } from "../../utils/MoreMath";

const nonEmptyArrayOrDefault = (maybeArray: any, defaultValue: any) => (Array.isArray(maybeArray) && !!maybeArray.length) ? maybeArray : defaultValue
const pickBetween = (min: number, max: number) => MoreMath.Clamp(Math.round(min + (Math.random() * (max - min))), max, min)
const COL_WIDTH = 340
const EXPANDO_COL_WIDTH = 30

type ChildLookup = { [col: string]: { [row: string]: Item[] } }

export const GridView = React.memo((props: { parentItemId: string }) => {

    const { parentItemId } = props
    const { item, children } = useItem(parentItemId)

    // const { columns, rows, childLookup } = useMemo((): { columns: string[], rows: string[], childLookup: ChildLookup } => {
    //     const context = item?.data['_gridView'] || {}

    //     const childLookup: ChildLookup = {}
    //     for(const c of children) {
    //         const col = c.data?._gridView?.col || 0
    //         const row = c.data?._gridView?.row || 0
    //         if (!childLookup[col][row]) childLookup[col][row] = [c]
    //         else childLookup[col][row].push(c)
    //     }

    //     return {
    //         columns: nonEmptyArrayOrDefault(context.columns, ['Default']),
    //         rows: nonEmptyArrayOrDefault(context.rows, ['Default']),
    //         childLookup
    //     }
    // }, [ item, children ])

    const { columns, rows, childLookup } = useMemo((): { columns: string[], rows: string[], childLookup: ChildLookup } => {

        const columns = ['To Do', 'Doing', 'Testing', 'Done'];
        const rows = ['Mobile / P1', 'Mobile / P2', 'Web / P1', 'Web / P2'];
        const childLookup: ChildLookup = {}
        for(const c of children) {
            const col = pickBetween(0, columns.length)
            const row = pickBetween(0, rows.length)
            if (!childLookup[col]) childLookup[col] = {}
            if (!childLookup[col][row]) childLookup[col][row] = []
            childLookup[col][row].push(c)
        }

        return { columns, rows, childLookup }

    }, [ item, children ])

    return (
        <div>

            {/* Column titles */}
            <Flex row>
                <Bump w={ EXPANDO_COL_WIDTH } />
                { columns.map(c => (
                    <TrText medium bold style={{ width: COL_WIDTH, minWidth: COL_WIDTH }}>{c}</TrText>
                )) }
            </Flex>

            {
                // Separate into component with expanded state member, create Expando component, Spinny component
                rows.map((r, ridx) => (
                    <Flex row>

                        <div style={{ minWidth: EXPANDO_COL_WIDTH }}>
                            {/* Expando */}
                        </div>

                        <div>

                            <TrText bold medium>{ r }</TrText>
                            {/* Expand this div */}
                            <Flex row>
                            {
                                columns.map((c, cidx) => (
                                    <div style={{ width: COL_WIDTH, minWidth: COL_WIDTH }}>
                                        {/* TODO -- Progress bar */}
                                        {
                                            childLookup[cidx]?.[ridx]?.map(item => (
                                                <Flex>
                                                    <Checkbox itemId={ item._id } />
                                                    <Bump w={ 10 } />
                                                    <TrText bold>{ item.title }</TrText>
                                                </Flex>
                                            ))
                                        }

                                    </div>
                                ))
                            }
                            </Flex>

                        </div>
                    </Flex>
                ))
            }

        </div>
    )
    

})