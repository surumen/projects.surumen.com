const accentColors: string[] = [
    'ocean',
    'crimson',
    'rust',
    'canopy',
    'navy',
    'plum',
    'magenta',
    'gold',
    'zen',
    'sunset',
    'tangerine',
    'lime',
    'cloud',
    'orchid',
    'pink',
    'banana',
    'coconut',
    'graphite'
];

const languageNames: string[] = [
    'AI Agents',
    'Model Context Protocol',
    'Python',
    'OpenAI',
    'Java',
    'Anthropic',
    'D3.js',
    'Typescript',
    'React',
    'Angular',
    'Vue',
    'Next.js',
    'Go',
    'Machine Learning',
    'OpenCV',
] as const;

export const LanguageColorMap = languageNames.map((color, i) => ({
    color,
    scheme: accentColors[i % accentColors.length]
}));
