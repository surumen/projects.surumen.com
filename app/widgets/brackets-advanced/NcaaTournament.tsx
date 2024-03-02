/***************************
 Component : Tournament
 ****************************

 Available Parameters

 */

// import node module libraries
import React, { Fragment } from "react";
import PropTypes from 'prop-types';

// import widget/custom components

// import data
import FinalRound from "@/widgets/brackets-advanced/Final";
import SemiFinal from "@/widgets/brackets-advanced/SemiFinal";
import Bracket4 from "@/widgets/brackets-advanced/Bracket4";
import Bracket3 from "@/widgets/brackets-advanced/Bracket3";
import Bracket2 from "@/widgets/brackets-advanced/Bracket2";
import Bracket1 from "@/widgets/brackets-advanced/Bracket1";
import Bracket8 from "@/widgets/brackets-advanced/Bracket8";
import Bracket9 from "@/widgets/brackets-advanced/Bracket9";
import Bracket10 from "@/widgets/brackets-advanced/Bracket10";
import Bracket11 from "@/widgets/brackets-advanced/Bracket11";


const NcaaTournament = () => {

    return (
        <div className='ncaa-tournament-bracket'>
            <div className='full-bracket'>
                <div>
                    <h3 className='region-holder region-holder-top'><span>WEST</span><span className="region-right">SOUTH</span></h3>

                    <div className='bracket-container full-screen'>

                        <Bracket1 />
                        <Bracket2 />
                        <Bracket3 />
                        <Bracket4 />
                        <SemiFinal type={'left'} />
                        <FinalRound />
                        <SemiFinal type={'right'} />
                        <Bracket8 />
                        <Bracket9 />
                        <Bracket10 />
                        <Bracket11 />
                    </div>
                    <h4 className="bottom-swipe-note">Swipe for Other Regions →</h4>
                    <h3 className="region-holder region-holder-bottom"><span>EAST</span><span className="region-right">MIDWEST</span></h3>
                </div>
            </div>
        </div>
    );
};



export default NcaaTournament;

