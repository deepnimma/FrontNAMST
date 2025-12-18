export interface CardImage {
    imageKey: string;
    setName: string;
    cardNumber: string;
    illustrator: string;
    releaseDate: string;
    cardTitle: string;
    tags: string;
    isReverseHolo: number;
    item: number;
    trainerOwned: number;
}

export interface ChangeItem {
    category: 'new' | 'improvements' | 'fixes' | 'cards';
    description: string;
}

export interface ChangelogEntry {
    version: string;
    date: string;
    title?: string; // Optional title for the version
    changes: ChangeItem[];
}
