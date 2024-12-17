<<<<<<< Updated upstream


import Bems_Hub from "./Bems_Hub";
import Irenose_Devs from "./Irenose_Devs";
import "./src/input.css";
import "./src/output.css";
import PropTypes from "prop-types";

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
=======
>>>>>>> Stashed changes
