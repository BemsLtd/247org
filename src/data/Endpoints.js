export const TOKEN_KEY = "247_token";
export const TOKEN_KEY2 = "247_token_user";

export const BASE_URL =
import.meta.env.VITE_API_BASE || "https://orgserviceapi.247securityandforensic.com/api/";
  // import.meta.env.VITE_API_BASE || "http://localhost:5000/api/";

  export const BASE_URL2 =
  import.meta.env.VITE_API_BASE || "https://stagingapi.247securityandforensic.com/api/";

  export const ENDPOINTS = {
    register: "auth/register",
    login: "auth/login",
    forgetpassword: "auth/send-password-otp",
    resetpassword: "user/reset-password",
    profile: "profile",
    updateprofile: "profile",
    verifyOtp: "auth/verify-otp",
    verifyUser: "auth/verifyemail",
    switchUser: "user/switch-role",
    minireg: "user/indirect-register",
    addVehicle: "user/vehicle/register",

    // Profiles

    updateVehicle: "user/vehicle/update",

    // phone
    phone_add: "user/phone/register",
    update_phone: "user/phone/update", 

    //medical
    update_medical: "user/update/medical-profile",
    addmedical: "medical/record/create",
    update_medial2: "medical/record/update", 
    getmedical: "medical/record/get",



    registertenat: "landlord/register-tenant",
    addtenantunit: "landlord/property-unit/add-tenant",
    gettenats: "/landlord/tenants/all",
    singletenant: "/landlord/tenants/single",
    deletetenant: "landlord/property-unit/delete-tenant",

    // units
    addunits: "landlord/property-unit/create",

    // Business
    getcompanies: "company",

    branches: 'branch',
    addbranches: "branch",
    allbranch: "branch",
    updatebranch: "branch",
    deletebranch: "branch",

    getemployee: "staff",
    singleemployee: "ceo/company/employee/single",
    addstaff: "staff",
    terminate: "ceo/company/employee/terminate",
    updateemployee: "ceo/company/employee/update",

   

    addcrime: "user/crime-report/create",
    crime: "user/crime-report/view",
    update_crime: "user/crime-report/update",

    //Force
    getforce:"admin-panel/admin/organization/force/view",
    createforce: "admin-panel/admin/organization/force/create",

    //Organization Unit
    createunit: "unit",
    getunit: "unit"
    
  };