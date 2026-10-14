/** Icon sprite (rendered once in the layout) and an <Icon> helper. */
export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="i-bed" viewBox="0 0 24 24"><path d="M3 18V8m0 6h18v4M21 14v-2.5A2.5 2.5 0 0 0 18.5 9H11v5M7.5 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></symbol>
        <symbol id="i-chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></symbol>
        <symbol id="i-chevron-r" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></symbol>
        <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></symbol>
        <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.7"/><path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></symbol>
        <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></symbol>
        <symbol id="i-minus" viewBox="0 0 24 24"><path d="M5 12h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></symbol>
        <symbol id="i-close" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></symbol>
        <symbol id="i-trash" viewBox="0 0 24 24"><path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.9 12.2h9.2L17.5 7M10 10.5v6M14 10.5v6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></symbol>
        <symbol id="i-bag" viewBox="0 0 24 24"><path d="M3 17h18M5 17a7 7 0 0 1 14 0M12 10V8.5m-2 0h4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></symbol>
        <symbol id="i-list" viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></symbol>
        <symbol id="i-grid" viewBox="0 0 24 24"><path d="M4 4h6.5v6.5H4zM13.5 4H20v6.5h-6.5zM4 13.5h6.5V20H4zM13.5 13.5H20V20h-6.5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></symbol>
        <symbol id="i-flame" viewBox="0 0 24 24"><path d="M12 21c-3.9 0-6.5-2.6-6.5-6.1 0-3.4 2.4-5.3 3.6-8.4.4 1.9 1.4 3 2.6 3.6C12 7 13.4 4.6 15.8 3c-.4 3 .9 4.7 1.9 6.3.8 1.3 1.3 2.5 1.3 4.2C19 17.9 16.1 21 12 21Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M12 21c-1.7 0-2.8-1.1-2.8-2.7 0-1.8 1.6-2.6 2.2-4.3 1.6 1 3.4 2.4 3.4 4.3 0 1.6-1.1 2.7-2.8 2.7Z" fill="currentColor" opacity=".35"/></symbol>
        <symbol id="i-chevron-l" viewBox="0 0 24 24"><path d="m15 6-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></symbol>
        <symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></symbol>
        <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></symbol>
        <symbol id="i-key" viewBox="0 0 24 24"><circle cx="8" cy="15" r="4" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="m11 12 8-8m-3 3 2 2m-4 0 1.5 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></symbol>
        <symbol id="i-size" viewBox="0 0 24 24"><path d="M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></symbol>
        <symbol id="i-eye" viewBox="0 0 24 24"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6"/></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></symbol>
        <symbol id="i-phone" viewBox="0 0 24 24"><path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></symbol>
        <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="m3.5 7 8.5 6 8.5-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></symbol>
        <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.6"/></symbol>
        <symbol id="i-plane" viewBox="0 0 24 24"><path d="M10.5 13.5 3 11l1.5-1.5 8 1L17 6a2 2 0 0 1 3 3l-4.5 4.5 1 8L15 23l-2.5-7.5L9 19v2.5L7.5 23 6 18 1 16.5 2.5 15H5l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></symbol>
        <symbol id="i-train" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M5 11h14M8 21l2-4m6 4-2-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="9" cy="14" r="1" fill="currentColor"/><circle cx="15" cy="14" r="1" fill="currentColor"/></symbol>
        <symbol id="i-bag2" viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6L5 8Zm4 0V6.5a3 3 0 0 1 6 0V8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></symbol>
        <symbol id="i-wifi" viewBox="0 0 24 24"><path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.7 16a5 5 0 0 1 6.6 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="12" cy="19" r="1.2" fill="currentColor"/></symbol>
        <symbol id="i-car" viewBox="0 0 24 24"><path d="M4 16v-4l2-5h12l2 5v4H4Zm0 0v2.5M20 16v2.5M4 12h16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><circle cx="7.5" cy="14" r="1" fill="currentColor"/><circle cx="16.5" cy="14" r="1" fill="currentColor"/></symbol>
        <symbol id="i-bell" viewBox="0 0 24 24"><path d="M4 17h16M6 17a6 6 0 0 1 12 0M12 9.5V8m-2 0h4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></symbol>
        <symbol id="i-paw" viewBox="0 0 24 24"><ellipse cx="12" cy="16" rx="4.5" ry="3.8" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="6" cy="10.5" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="18" cy="10.5" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="9.5" cy="6.5" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="14.5" cy="6.5" r="1.8" fill="none" stroke="currentColor" strokeWidth="1.5"/></symbol>
        <symbol id="i-briefcase" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M9 7V5h6v2M3 12.5h18" fill="none" stroke="currentColor" strokeWidth="1.6"/></symbol>
        <symbol id="i-access" viewBox="0 0 24 24"><circle cx="12" cy="4.5" r="1.8" fill="currentColor"/><path d="M5 8.5l7 1.5 7-1.5M12 10v4.5m0 0-3.5 6.5M12 14.5l3.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></symbol>
        <symbol id="i-instagram" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="17" cy="7" r="1" fill="currentColor"/></symbol>
        <symbol id="i-facebook" viewBox="0 0 24 24"><path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V9a.5.5 0 0 1 .5-.5Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></symbol>
        <symbol id="i-youtube" viewBox="0 0 24 24"><rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="m10 9 5 3-5 3V9Z" fill="currentColor"/></symbol>
      </svg>
  );
}

type IconProps = { name: string; size?: 'sm' | 'lg'; className?: string };

export function Icon({ name, size, className = '' }: IconProps) {
  return (
    <svg className={`icon${size ? ` icon--${size}` : ''} ${className}`.trim()} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}
