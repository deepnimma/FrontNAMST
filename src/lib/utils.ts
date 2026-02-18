// Helper to capitalize words
export const capitalizeWords = (str: string) => {
    if (!str) return '';
    return str.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

// Helper to parse the tags string (handles Python-style list strings)
export const parseTags = (tagsString: string): string[] => {
    try {
        const inner = tagsString.trim().replace(/^\[|\]$/g, '').trim();
        if (!inner) return [];

        const tags: string[] = [];
        let inQuote = false;
        let quoteChar = '';
        let current = '';

        for (const ch of inner) {
            if (!inQuote && (ch === '"' || ch === "'")) {
                inQuote = true;
                quoteChar = ch;
            } else if (inQuote && ch === quoteChar) {
                inQuote = false;
                if (current) tags.push(current);
                current = '';
            } else if (inQuote) {
                current += ch;
            }
        }

        return tags;
    } catch {
        return [];
    }
};

// Helper to generate TCGPlayer link
export const generateTcgplayerLink = (setName: string, cardTitle: string): string => {
    const searchString = `${cardTitle.toLowerCase().replace(/-/g, ' ')} ${setName.toLowerCase().replace(/-/g, ' ')}`;
    const tcgplayerLink = `https://www.tcgplayer.com/search/pokemon/product?productLineName=pokemon&q=${searchString}&view=grid&productTypeName=Cards`;
    const encodedTcgplayerLink = encodeURIComponent(tcgplayerLink);

    return `https://partner.tcgplayer.com/namst?u=${encodedTcgplayerLink}`;
};
