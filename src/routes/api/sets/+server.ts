import { json } from '@sveltejs/kit';
import pkg from 'lodash';
const { includes, uniqueId } = pkg;

/**
 * Returns the set details
 */
export async function GET(request: { url: { searchParams: { get: (arg0: string) => string; }; }; }) {
	
	

	return json(leadersForSet);
}
