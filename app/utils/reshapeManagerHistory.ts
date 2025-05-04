type ManagerHistory = {
    managerName: string;
    entryId: number;
    history: {
        event: number;
        total_points: number;
    }[];
};

export const reshapeFPLHistory = (allHistories: ManagerHistory[]) => {
    const eventMap: { [event: number]: any } = {};

    allHistories.forEach(({ managerName, history }) => {
        history.forEach(({ event, total_points }) => {
            if (!eventMap[event]) eventMap[event] = { week: event };
            eventMap[event][managerName] = total_points;
        });
    });

    const reshaped = Object.values(eventMap).sort((a, b) => a.week - b.week);

    return reshaped;
};
