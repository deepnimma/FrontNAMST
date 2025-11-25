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
}

export interface ChangelogEntry {
    version: string;
    date: string;
    changes: string[];
}
