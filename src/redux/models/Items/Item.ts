export interface Item {
	_id: string
	title: string
	description?: string
	parent_id?: string
	user_id: string
	checked: boolean
	updated_at?: string
	created_at?: string
	completed_at?: string
	descendants?: number
	completed?: number
	props?: { [key: string]: string }
}