export function Shape3({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      height="315"
      className={className}>
      <path className="elementor-shape-fill" d="M 50 0 S75 0 100 100 L100 0"></path>
    </svg>
  );
}

export default Shape3;
