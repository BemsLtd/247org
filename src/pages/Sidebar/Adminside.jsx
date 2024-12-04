import { Build, Home, HomeMax, Event, People, Security, HouseSharp, Settings, Tune, Domain, VerifiedUser } from "@mui/icons-material";
import Navlinks from "../../Components/Navlinks";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

export default function Adminside({setAside}) {
const userRole = useSelector((state) => state.userDetails.user?.role);
    const settingsSubMenu = [
      { link: "/settings/general", name: "General", icon: <Build /> },
      { link: "/settings/advanced", name: "Advanced", icon: <Tune /> },
    ];
    
    const organizationSubMenu = [
      {
        link: `/${userRole}/manage-companies`,
        name: "Manage Companies",
        icon: <Home />,
      },
      {
        link: `/${userRole}/manage-branches`,
        name: "Manage Branches",
        icon: <Home />,
      },
      {
        link: `/${userRole}/manage-force`,
        name: "Manage Force",
        icon: <Home />,
      },
      {
        link: `/${userRole}/onboarding`,
        name: "Onboarding",
        icon: <Home />,
      },
    ];

    const eventSubMenu = [
      {
        link: `/${userRole}/manage-events`,
        name: "Manage Events",
        icon: <Event />,
      },
      {
        link: `/${userRole}/manage-manifest`,
        name: "Manage manifest",
        icon: <Event />,
      },
      {
        link: `/${userRole}/manage-attendee`,
        name: "Manage Events Attendees",
        icon: <People />,
      },
      {
        link: `/${userRole}/Event attendees`,
        name: "Bouncers",
        icon: <Security />,
      },
    ];


  return (
    <div>
      <Navlinks
        link={`/${userRole}/dashboard`}
        name="Dashboard"
        icon={<Home />}
        setAside={setAside}
      />
      <Navlinks
        link={`/${userRole}/profile`}
        name="Profile"
        icon={<HomeMax />}
        setAside={setAside}
      />
    
      <Navlinks
        name="Organizations"
        subMenu={organizationSubMenu}
        icon={<Domain />}
        setAside={setAside}
      />
      <Navlinks
        link={`/${userRole}/manage-staffs`}
        name="Manage Staffs"
        icon={<People />}
        setAside={setAside}
      />
      <Navlinks
        name="Events & Manifest"
        subMenu={eventSubMenu}
        icon={<Domain />}
        setAside={setAside}
      />
    
      <Navlinks
        link={`/${userRole}/crime-diary`}
        name="Crime Diary"
        icon={<VerifiedUser />}
        setAside={setAside}
      />
      <Navlinks
        link={`/${userRole}/missing-persons`}
        name="Missing Persons"
        icon={<VerifiedUser />}
        setAside={setAside}
      />
        
      <Navlinks
        link="/"
        name="Verification"
        icon={<HouseSharp />}
        setAside={setAside}
      />
      <Navlinks
        name="Settings"
        icon={<Settings />}
        subMenu={settingsSubMenu}
        setAside={setAside}
      />
    </div>
  );
}

Adminside.propTypes = {
  setAside: PropTypes.any,
}