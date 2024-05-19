import * as _ from 'underscore';
import { Game } from '@/types/Brackets';

export const winningPathLength = (game: Game, visited: { [ id: string ]: true } = {}): number => {
    if (visited[ game.id ]) {
        return 0;
    }
    visited[ game.id ] = true;
    return (
        1 + (
            _.keys(game.sides).length > 0 ?
                Math.max.apply(
                    Math,
                    _.map(
                        game.sides,
                        ({sourceGame}) => {
                            return sourceGame ? winningPathLength(sourceGame, visited) : 0;
                        }
                    )
                ) :
                0
        )
    );
}
