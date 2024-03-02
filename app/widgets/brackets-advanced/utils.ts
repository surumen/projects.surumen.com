

export const advanceToNextRound = (team: any, currentMatchNumber: number, currentRound: number, isFinal: boolean, rounds: any[]) => {
  const nextRound = isFinal ? currentRound : currentRound + 1;
  const nextMatchNumber = Math.round(currentMatchNumber / 2);

  return rounds.map((round) => {
    round.matches = round.matches.map((match, index) => {
      if (round.order === nextRound && (index + 1) === nextMatchNumber) {
        if (match.topSeed.name === 'TBC') {
          match.topSeed = team;
        } else {
          const currentTopSeed = match.topSeed;
          if (Number(currentTopSeed.seed) < Number(team.seed)) {
            match.topSeed = team;
            match.bottomSeed = currentTopSeed;
          } else {
            match.bottomSeed = team;
          }
        }
      }
      return match;
    })
    return round;
  });
}

const findMatchByTeamName = (teamName:string, currentRound: string, rounds: any[]) => {

}
