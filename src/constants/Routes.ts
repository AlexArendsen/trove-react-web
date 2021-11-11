export const Routes = {
	item: (itemId: string) => `/?item=${ itemId }&view=items`,
	search: (query: string) => `/?query=${ query }&view=search`
}