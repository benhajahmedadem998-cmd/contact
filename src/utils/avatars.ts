interface PortraitOptions {
  bgTop: string;
  bgBottom: string;
  skin: string;
  skinShadow: string;
  hair: string;
  shirt: string;
  collar: string;
  hairStyle: 'short' | 'bob' | 'waves' | 'parted' | 'curly' | 'buzz';
  glasses?: boolean;
  beard?: boolean;
}

export function createPortraitSvg(opts: PortraitOptions): string {
  const {
    bgTop,
    bgBottom,
    skin,
    skinShadow,
    hair,
    shirt,
    collar,
    hairStyle,
    glasses = false,
    beard = false,
  } = opts;

  let hairBack = '';
  let hairFront = '';

  if (hairStyle === 'waves') {
    hairBack = `
      <path d="M52 108 C46 72, 68 40, 100 40 C132 40, 154 72, 148 108 C148 136, 142 152, 134 156 L66 156 C58 152, 52 136, 52 108 Z" fill="${hair}"/>
    `;
    hairFront = `
      <path d="M62 84 C65 56, 86 44, 106 46 C126 48, 138 64, 138 86 C132 70, 118 62, 100 62 C82 62, 70 72, 62 84 Z" fill="${hair}"/>
    `;
  } else if (hairStyle === 'bob') {
    hairBack = `
      <path d="M55 104 C55 62, 74 42, 100 42 C126 42, 145 62, 145 104 L142 132 C132 136, 126 130, 126 122 L74 122 C74 130, 68 136, 58 132 Z" fill="${hair}"/>
    `;
    hairFront = `
      <path d="M62 86 C64 56, 82 46, 102 46 C124 46, 138 60, 138 86 C128 70, 112 66, 94 68 C78 70, 68 76, 62 86 Z" fill="${hair}"/>
    `;
  } else if (hairStyle === 'curly') {
    hairBack = `
      <circle cx="68" cy="70" r="18" fill="${hair}"/>
      <circle cx="132" cy="70" r="18" fill="${hair}"/>
      <circle cx="100" cy="52" r="22" fill="${hair}"/>
      <circle cx="78" cy="56" r="17" fill="${hair}"/>
      <circle cx="122" cy="56" r="17" fill="${hair}"/>
    `;
    hairFront = `
      <path d="M64 82 C68 62, 84 56, 100 56 C116 56, 132 62, 136 82 C126 70, 114 66, 100 66 C86 66, 74 70, 64 82 Z" fill="${hair}"/>
    `;
  } else if (hairStyle === 'parted') {
    hairFront = `
      <path d="M62 88 C60 58, 80 42, 104 42 C126 42, 140 58, 138 88 C134 72, 124 62, 108 60 C92 58, 76 64, 62 88 Z" fill="${hair}"/>
    `;
  } else if (hairStyle === 'buzz') {
    hairFront = `
      <path d="M65 86 C65 56, 80 46, 100 46 C120 46, 135 56, 135 86 C130 70, 118 62, 100 62 C82 62, 70 70, 65 86 Z" fill="${hair}"/>
    `;
  } else {
    hairFront = `
      <path d="M62 86 C62 56, 80 43, 102 43 C124 43, 138 58, 138 86 C130 68, 114 60, 96 62 C80 64, 69 72, 62 86 Z" fill="${hair}"/>
    `;
  }

  const glassesSvg = glasses
    ? `
      <rect x="75" y="90" width="21" height="14" rx="4" fill="none" stroke="#1E293B" stroke-width="2.4"/>
      <rect x="104" y="90" width="21" height="14" rx="4" fill="none" stroke="#1E293B" stroke-width="2.4"/>
      <line x1="96" y1="96" x2="104" y2="96" stroke="#1E293B" stroke-width="2.4"/>
    `
    : '';

  const beardSvg = beard
    ? `
      <path d="M68 106 C69 128, 82 140, 100 140 C118 140, 131 128, 132 106 C126 116, 116 122, 100 122 C84 122, 74 116, 68 106 Z" fill="${hair}" opacity="0.88"/>
    `
    : '';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${bgTop}"/>
          <stop offset="100%" stop-color="${bgBottom}"/>
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#bg)"/>
      ${hairBack}
      <path d="M40 200 C42 162, 66 146, 100 146 C134 146, 158 162, 160 200 Z" fill="${shirt}"/>
      <path d="M84 146 L100 166 L116 146 Z" fill="${collar}"/>
      <rect x="87" y="128" width="26" height="26" rx="10" fill="${skinShadow}"/>
      <circle cx="66" cy="100" r="8" fill="${skinShadow}"/>
      <circle cx="134" cy="100" r="8" fill="${skinShadow}"/>
      <path d="M66 92 C66 64, 80 54, 100 54 C120 54, 134 64, 134 92 C134 120, 119 138, 100 138 C81 138, 66 120, 66 92 Z" fill="${skin}"/>
      ${beardSvg}
      <circle cx="86" cy="96" r="3.2" fill="#0F172A"/>
      <circle cx="114" cy="96" r="3.2" fill="#0F172A"/>
      <path d="M78 86 Q86 82 93 85" fill="none" stroke="${hair}" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M107 85 Q114 82 122 86" fill="none" stroke="${hair}" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M98 98 L97 109 Q100 111 103 109" fill="none" stroke="${skinShadow}" stroke-width="2" stroke-linecap="round"/>
      <path d="M90 118 Q100 125 110 118" fill="none" stroke="#9F4A4A" stroke-width="2.6" stroke-linecap="round"/>
      ${glassesSvg}
      ${hairFront}
    </svg>
  `.trim().replace(/\s+/g, ' ');

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
