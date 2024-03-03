// import node module libraries
import { useSelector } from 'react-redux'

const useMarchMadness = () => {
    const regions = useSelector((state: any) => state.matchMadness.regions);
    const rounds = useSelector((state: any) => state.matchMadness.rounds);


    // get all messages by passing message id
    // const getThreadMessages = (messageId) => {
    //     let result = messages.find(({ id }) => id === messageId);
    //     return typeof result === 'object' && result.chatMessages.length > 0
    //         ? result
    //         : 0;
    // };


    return {
        regions,
        rounds
    };
};

export default useMarchMadness;
