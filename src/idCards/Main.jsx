

import Bems_Hub from "./Bems_Hub";
import Irenose_Devs from "./NEC";
import NA from "./NA";
import NPF from "./npf";
import "./src/input.css";
import "./src/output.css";
import PropTypes from "prop-types";
import ZENITH from "./ZENITH";
import GTB from "./GTB.TSX";
import NBA from "./NBA";

function MainIds({company}) {

    const ids = {
        'Irenose_Devs' : <Irenose_Devs />,
        'Bems_Hub'  : <Bems_Hub/>,
        'NPF' : <NPF/>,
        'NA' : <NA/>,
        'ZENITH' : <ZENITH/>,
        'GTB' : <GTB/>,
        'NBA' : <NBA/>,
        'NEC' : <Irenose_Devs/>
    }
  return (
   <>
    {ids[company]}
   </>
  );
}


export default MainIds;

MainIds.propTypes = {
  company: PropTypes.any,
};