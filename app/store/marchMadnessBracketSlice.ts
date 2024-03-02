// import node module libraries
import { createSlice } from '@reduxjs/toolkit'

// import data files
import { MARCH_MADNESS_2024 } from '@/data/march-madness/MarchMadness2024';


const initialState = {
    regions: MARCH_MADNESS_2024.regions,
    rounds: MARCH_MADNESS_2024.rounds,
};

const advanceLeftBracket = (team: any, currentMatchNumber: number, currentRound: number, isFinal: boolean, rounds: any[]) => {
    const nextRound = isFinal ? currentRound : currentRound + 1;
    const nextMatchNumber = Math.round(currentMatchNumber / 2);

    let currentMatchOpponent: any;
    const updatedRounds =  rounds.map((round) => {
        round.matches = round.matches.map((match, index) => {
            // get the current opponent
            if (round.order === currentRound && (index + 1) === currentMatchNumber) {
                currentMatchOpponent = match.topSeed.name === team.name ? match.bottomSeed : match.topSeed;
                currentMatchOpponent = currentMatchOpponent.name === 'TBC' ? null : currentMatchOpponent;
            }

            // if this is the Final, set the champion, and runner up
            if (isFinal) {
                // only set winner if there's an opponent
                if (currentMatchOpponent) {
                    if (team.name === match.topSeed.name) {
                        match.topSeed.isMatchWinner = true;
                        match.topSeed.isChampion = true;
                        match.topSeed.isRunnerUp = false;

                        match.bottomSeed.isMatchWinner = false;
                        match.bottomSeed.isChampion = false;
                        match.bottomSeed.isRunnerUp = true;

                    } else if (team.name === match.bottomSeed.name) {
                        match.bottomSeed.isMatchWinner = true;
                        match.bottomSeed.isChampion = true;
                        match.bottomSeed.isRunnerUp = false;

                        match.topSeed.isMatchWinner = false;
                        match.topSeed.isChampion = false;
                        match.topSeed.isRunnerUp = true;
                    }
                }

            } else if (currentMatchOpponent) { // only advance if there's an opponent in the current match

                // populate team in the next round
                if (round.order === nextRound && (index + 1) === nextMatchNumber) {

                    // change the team that advances if it was previously set
                    if (currentMatchOpponent.name === match.topSeed.name) {
                        match.topSeed = {
                            name: 'TBC',
                            logo: '',
                            seed: '',
                            isWinner: false,
                            score: ''
                        };
                    }
                    if (currentMatchOpponent.name === match.bottomSeed.name) {
                        match.bottomSeed = {
                            name: 'TBC',
                            logo: '',
                            seed: '',
                            isWinner: false,
                            score: ''
                        };
                    }

                    // if there's no team yet in the next round,
                    // and 'team' is not advanced yet set team as top seed
                    if (match.topSeed.name === 'TBC' && match.bottomSeed.name !== team.name) {
                        match.topSeed = team;
                    } else if (match.bottomSeed.name !== team.name && match.topSeed.name !== team.name) {
                        // if there's a top seed already, check if its seeded higher than 'team'
                        // if 'team' is the higher seed, set as top seed
                        const currentTopSeed = match.topSeed;
                        if (Number(currentTopSeed.seed) > Number(team.seed)) {
                            match.topSeed = team;
                            match.bottomSeed = currentTopSeed;
                        } else {
                            match.bottomSeed = team;
                        }
                    }
                }
            }

            return match;
        })
        return round;
    });

    // clean up: remove current opponent from all the next rounds
    return updatedRounds.map(round => {
        round.matches = round.matches.map(match => {
            if (currentMatchOpponent && round.order > currentRound) {
                if (match.topSeed.name === currentMatchOpponent.name) {
                    match.topSeed = {
                        name: 'TBC',
                        logo: '',
                        seed: '',
                        isWinner: false,
                        score: ''
                    };
                }
                if (match.bottomSeed.name === currentMatchOpponent.name) {
                    match.bottomSeed = {
                        name: 'TBC',
                        logo: '',
                        seed: '',
                        isWinner: false,
                        score: ''
                    };
                }
            }
            return match;
        });
        return round;
    });
}

const advanceRightBracket = (team: any, currentMatchNumber: number, currentRound: number, isFinal: boolean, rounds: any[]) => {
    const nextRound = isFinal ? currentRound : currentRound - 1;
    const nextMatchNumber = Math.round(currentMatchNumber / 2);

    let currentMatchOpponent: any;
    const updatedRounds =  rounds.slice().reverse().map((round) => {
        round.matches = round.matches.map((match, index) => {
            // get the current opponent
            if (round.order === currentRound && (index + 1) === currentMatchNumber) {
                currentMatchOpponent = match.topSeed.name === team.name ? match.bottomSeed : match.topSeed;
                currentMatchOpponent = currentMatchOpponent.name === 'TBC' ? null : currentMatchOpponent;
            }

            // if this is the Final, set the champion, and runner up
            if (isFinal) {
                // only set winner if there's an opponent
                if (currentMatchOpponent) {
                    if (team.name === match.topSeed.name) {
                        match.topSeed.isMatchWinner = true;
                        match.topSeed.isChampion = true;
                        match.topSeed.isRunnerUp = false;

                        match.bottomSeed.isMatchWinner = false;
                        match.bottomSeed.isChampion = false;
                        match.bottomSeed.isRunnerUp = true;

                    } else if (team.name === match.bottomSeed.name) {
                        match.bottomSeed.isMatchWinner = true;
                        match.bottomSeed.isChampion = true;
                        match.bottomSeed.isRunnerUp = false;

                        match.topSeed.isMatchWinner = false;
                        match.topSeed.isChampion = false;
                        match.topSeed.isRunnerUp = true;
                    }
                }

            } else if (currentMatchOpponent) { // only advance if there's an opponent in the current match

                // populate team in the next round
                if (round.order === nextRound && (index + 1) === nextMatchNumber) {

                    // change the team that advances if it was previously set
                    if (currentMatchOpponent.name === match.topSeed.name) {
                        match.topSeed = {
                            name: 'TBC',
                            logo: '',
                            seed: '',
                            isWinner: false,
                            score: ''
                        };
                    }
                    if (currentMatchOpponent.name === match.bottomSeed.name) {
                        match.bottomSeed = {
                            name: 'TBC',
                            logo: '',
                            seed: '',
                            isWinner: false,
                            score: ''
                        };
                    }

                    // if there's no team yet in the next round,
                    // and 'team' is not advanced yet set team as top seed
                    if (match.topSeed.name === 'TBC' && match.bottomSeed.name !== team.name) {
                        match.topSeed = team;
                    } else if (match.bottomSeed.name !== team.name && match.topSeed.name !== team.name) {
                        // if there's a top seed already, check if its seeded higher than 'team'
                        // if 'team' is the higher seed, set as top seed
                        const currentTopSeed = match.topSeed;
                        if (Number(currentTopSeed.seed) > Number(team.seed)) {
                            match.topSeed = team;
                            match.bottomSeed = currentTopSeed;
                        } else {
                            match.bottomSeed = team;
                        }
                    }
                }
            }

            return match;
        })
        return round;
    });

    // clean up: remove current opponent from all the next rounds
    return updatedRounds.map(round => {
        round.matches = round.matches.map(match => {
            if (currentMatchOpponent && round.order < currentRound) {
                if (match.topSeed.name === currentMatchOpponent.name) {
                    match.topSeed = {
                        name: 'TBC',
                        logo: '',
                        seed: '',
                        isWinner: false,
                        score: ''
                    };
                }
                if (match.bottomSeed.name === currentMatchOpponent.name) {
                    match.bottomSeed = {
                        name: 'TBC',
                        logo: '',
                        seed: '',
                        isWinner: false,
                        score: ''
                    };
                }
            }
            return match;
        });
        return round;
    }).slice().reverse();
}

const advanceToNextRound = (team: any, currentMatchNumber: number, currentRound: number, isFinal: boolean, rounds: any[]) => {
    return currentRound < (rounds.length / 2) ?
        advanceLeftBracket(team, currentMatchNumber, currentRound, isFinal, rounds) :
        advanceRightBracket(team, currentMatchNumber, currentRound, isFinal, rounds);
}

export const matchMadnessBracketSlice = createSlice({
    name: 'marchMadness2024',
    initialState,
    reducers: {
        advanceTeam: (state, action) => {
            state.rounds = advanceToNextRound(
                action.payload.team,
                action.payload.matchNumber,
                action.payload.currentRound,
                action.payload.isFinalRound,
                state.rounds
            )
        },
        resetBracket: (state, action) => {
            // TODO: allow reset bracket
        }
    },
})

export const { advanceTeam } = matchMadnessBracketSlice.actions

export default matchMadnessBracketSlice.reducer
