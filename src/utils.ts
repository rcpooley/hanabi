import { Col, Numb } from './types';

export function ANY(obj: any): any {
    return obj;
}

export class Utils {
    static enumValues<E>(e: Record<string, E | string>): E[] {
        return Object.keys(e)
            .filter((k) => !isNaN(+k))
            .map((k) => ANY(parseInt(k)));
    }

    static getLastColor(cols: Col[]): Col | null {
        const excluded = Utils.enumValues(Col).filter(
            (col) => !cols.includes(col)
        );
        if (excluded.length === 1) {
            return excluded[0];
        } else {
            return null;
        }
    }

    static getLastNumber(numbs: Numb[]): Numb | null {
        const excluded = Utils.enumValues(Numb).filter(
            (numb) => !numbs.includes(numb)
        );
        if (excluded.length === 1) {
            return excluded[0];
        } else {
            return null;
        }
    }
}
