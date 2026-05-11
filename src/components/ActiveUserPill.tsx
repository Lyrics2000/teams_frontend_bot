export function ActiveUserPill({ active }: { active?: boolean }) {
  return (
    <span className={active ? 'active-pill online' : 'active-pill offline'}>
      <span />
      {active ? 'Active now' : 'Inactive'}
    </span>
  );
}
