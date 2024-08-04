//'use client';
import { SliceSimulator, SliceSimulatorParams, getSlices } from '@slicemachine/adapter-next/simulator';
import { SliceZone } from '@prismicio/react';

import { components } from '../../slices';
import { redirect } from 'next/navigation';

export default function SliceSimulatorPage({
  searchParams,
}: SliceSimulatorParams & {
  searchParams: { secret?: string };
}) {
  if (process.env.SLICE_SIMULATOR_SECRET && searchParams.secret !== process.env.SLICE_SIMULATOR_SECRET) {
    redirect('/');
  }
  const slices = getSlices(searchParams.state);

  return (
    <SliceSimulator>
      <SliceZone slices={slices} components={components} />
    </SliceSimulator>
  );
}
