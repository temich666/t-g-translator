import Dexie from 'dexie';

import {Translate} from './translate.model';

export const DATABASE_NAME = 'TG_TRANSLATES_TEST_1';
export const DEFAULT_LIMIT_HISTORIES = 32;
export const DEFAULT_LIMIT_FAVORITES = 32;

export class TranslatesService extends Dexie {
    public favorites: Dexie.Table<Translate, number>;
    public histories: Dexie.Table<Translate, number>;

    constructor() {
        super(DATABASE_NAME);
        this.version(1).stores({
            favorites: '++id, date, source.text, result.text',
            histories: '++id, date, source.text, result.text'
        });
    }

    getAll(): Promise<any> {
        return Promise.all([
            this.getFavoritesCount(),
            this.getHistoriesCount(),
            this.getFavorites(),
            this.getHistories()
        ])
            .then((data) => ({
                favoritesCount: data[0],
                historiesCount: data[1],
                favorites: data[2],
                histories: data[3]
            }));
    }

    /* Favorites */

    getFavoritesCount(): Promise<number> {
        return this.favorites
            .toArray()
            .then(favorites => favorites.length);
    }

    getFavorites(limit: number = DEFAULT_LIMIT_FAVORITES): Promise<Translate[]> {
        return this.favorites
            .reverse()
            .limit(limit)
            .toArray()
            .then(favorites => favorites.map(favorite => new Translate(favorite)));
    }

    addFavorite(translate: Translate): Promise<Translate[]> {
        return this.favorites.add(translate)
            .then(() => this.getFavorites())
            .catch(e => {
                console.error('error: ' + e.stack || e);
                return Promise.reject(e);
            });
    }

    removeFavorite(translate: Translate, limit): Promise<Translate[]> {
        return this.favorites.delete(translate.id)
            .then(() => this.getFavorites(limit))
            .catch(e => {
                console.error('error: ' + e.stack || e);
                return Promise.reject(e);
            });
    }

    /* Histories */

    getHistoriesCount(): Promise<number> {
        return this.histories
            .toArray()
            .then(favorites => favorites.length);
    }

    getHistories(limit: number = DEFAULT_LIMIT_HISTORIES): Promise<Translate[]> {
        return this.histories
            .reverse()
            .limit(limit)
            .toArray()
            .then(histories => histories.map(history => new Translate(history)));
    }

    addHistory(translate: Translate): Promise<Translate[]> {
        return this.histories.add(translate)
            .then(() => this.getHistories())
            .catch(e => {
                console.error('error: ' + e.stack || e);
                return Promise.reject(e);
            });
    }

    removeHistory(translate: Translate, limit): Promise<Translate[]> {
        return this.histories.delete(translate.id)
            .then(() => this.getHistories(limit))
            .catch(e => {
                console.error('error: ' + e.stack || e);
                return Promise.reject(e);
            });
    }
}