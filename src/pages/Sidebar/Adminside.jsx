import { Build, Home, HomeMax, Event, People, Security, HouseSharp, Settings, Tune, Domain, VerifiedUser } from "@mui/icons-material";
import Navlinks from "../../Components/Navlinks";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

export default function Adminside({ setAside }) {
  const userRole = useSelector((state) => state.userDetails.user.user);
  const userIndustry = useSelector((state) => state.userDetails.user.industry);
  
  console.log('User Role:', userRole);
  console.log('User Industry:', userIndustry);

  const settingsSubMenu = [
    { link: "/settings/general", name: "General", icon: <Build /> },
    { link: "/settings/advanced", name: "Advanced", icon: <Tune /> },
  ];
  
  const organizationSubMenu = [
    {
      link: `/${userRole.role}/manage-companies`,
      name: "Manage Companies",
      icon: <Home />,
    },
    {
      link: `/${userRole.role}/manage-branches`,
      name: "Manage Branches",
      icon: <Home />,
    },
  ];

  const eventSubMenu = [
    {
      link: `/${userRole.role}/manage-events`,
      name: "Manage Events",
      icon: <Event />,
    },
    {
      link: `/${userRole.role}/manage-manifest`,
      name: "Manage Manifest",
      icon: <Event />,
    },
    {
      link: `/${userRole.role}/manage-attendee`,
      name: "Manage Events Attendees",
      icon: <People />,
    },
    {
      link: `/${userRole.role}/Event attendees`,
      name: "Bouncers",
      icon: <Security />,
    },
  ];

  const medicalSubMenu = [
    {
      link: `/${userRole.role}/manage-records`,
      name: "Manage Records",
      icon: <Event />,
    },
    {
      link: `/${userRole.role}/request-records`,
      name: "Request for Medical Records",
      icon: <People />,
    },
  ];

  return (
    <div>
      <Navlinks
        link={`/${userRole.role}/dashboard`}
        name="Dashboard"
        icon={<Home />}
        setAside={setAside}
      />
      <Navlinks
        link={`/${userRole.role}/profile`}
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
        link={`/${userRole.role}/manage-staffs`}
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
        link={`/${userRole.role}/crime-diary`}
        name="Crime Diary"
        icon={<VerifiedUser />}
        setAside={setAside}
      />
      <Navlinks
        link={`/${userRole.role}/missing-persons`}
        name="Missing Persons"
        icon={<VerifiedUser />}
        setAside={setAside}
      />

      {/* Render Medical Menu only for Healthcare or Pharmaceuticals */}
      {(userIndustry === "healthcare" || userIndustry === "pharmaceuticals") && (
        <Navlinks
          name="Manage Medicals"
          subMenu={medicalSubMenu}
          icon={<Domain />}
          setAside={setAside}
        />
      )}
        
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
};
