// Helper to capitalize words
export const capitalizeWords = (str: string) => {
    if (!str) return '';
    return str.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

// Helper to parse the tags string
export const parseTags = (tagsString: string): string[] => {
    try {
        const validJsonString = tagsString.replace(/'/g, '"');
        const tags = JSON.parse(validJsonString);
        if (Array.isArray(tags)) return tags;
    } catch (error) {
        console.error("Error parsing tags:", error);
    }
    return [];
};
