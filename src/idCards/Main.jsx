

import Bems_Hub from "./Bems_Hub";
import Irenose_Devs from "./Irenose_Devs";
import "./src/input.css";
import "./src/output.css";
import PropTypes from "prop-types";
import ZENITH from "./ZENITH";
import GTB from "./GTB.tsx";
import NBA from "./NBA";

function MainIds({company}) {

    const ids = {
        'Irenose_Devs' : <Irenose_Devs />,
        'Bems_Hub'  : <Bems_Hub/>
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
