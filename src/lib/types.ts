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
    category: 'new' | 'improvements' | 'fixes';
    description: string;
}

export interface ChangelogEntry {
    version: string;
    date: string;
    changes: ChangeItem[];
}
