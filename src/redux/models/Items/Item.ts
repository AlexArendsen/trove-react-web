import { LensConfiguration } from "../../../components/ItemEditor/ItemEditorNewLensPage"

export interface Item {
	_id: string
	title: string
	description?: string
	data?: {
		__lenses?: LensConfiguration[]
	} & any
	parent_id?: string
	user_id: string
	checked: boolean
	updated_at?: string
	created_at?: string
	completed_at?: string
	descendants?: number
	rank?: number
	completed?: number
	isRoot?: boolean
}