import { useEffect } from 'react';

interface UrlSyncState {
    query: string;
    isCameo: boolean;
    isTrainer: boolean;
    isIllustrator: boolean;
    isSet: boolean;
    sortOrder: 'asc' | 'desc';
}

export function useUrlSync(state: UrlSyncState): void {
    const { query, isCameo, isTrainer, isIllustrator, isSet, sortOrder } = state;

    useEffect(() => {
        const params = new URLSearchParams();
        if (query) params.set('query', query);
        if (isCameo) params.set('isCameo', 'true');
        if (isTrainer) params.set('isTrainer', 'true');
        if (isIllustrator) params.set('isIllustrator', 'true');
        if (isSet) params.set('isSet', 'true');
        if (sortOrder !== 'asc') params.set('sortOrder', sortOrder);
        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    }, [query, isCameo, isTrainer, isIllustrator, isSet, sortOrder]);
}
