interface HeaderSimpleProps {
  header: string | undefined | null;
}
export function HeaderSimple({header}: HeaderSimpleProps) {
  return (
    <div className="bg-white px-6 py-24 sm:pt-32 sm:pb-26 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">{header}</h2>
      </div>
    </div>
  );
}

export default HeaderSimple;
