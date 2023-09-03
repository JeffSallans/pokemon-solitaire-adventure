import { json } from '@sveltejs/kit';
import { generatePack } from './solitaire-pack';

export async function GET() {
	const pack = await generatePack('base1');

	return json(pack);
}

