export class ActionNames {
	base: string
	loading: string
	success: string
	failure: string

	constructor(base: string) {
		this.loading = `${ base }_LOADING`
		this.success = `${ base }_SUCCESS`
		this.failure = `${ base }_FAILURE`
		this.base = base
	}
}