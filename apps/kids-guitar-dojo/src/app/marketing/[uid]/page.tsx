import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Page({ params }: PageProps<"/marketing/[uid]">) {
	const { uid } = await params;
	const client = createClient();
	const page = await client.getByUID("marketing", uid);

	return <SliceZone slices={page.data.slices} components={components} />;
}