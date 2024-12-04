export const TOKEN_KEY = "247_token";

export const BASE_URL =
  import.meta.env.VITE_API_BASE || "https://stagingapi.247securityandforensic.com/api/";
  // import.meta.env.VITE_API_BASE || "http://localhost:5000/api/";

  export const ENDPOINTS = {
    register: "user/register",
    login: "user/login",
    forgetpassword: "auth/send-password-otp",
    resetpassword: "user/reset-password",
    profile: "user/user-profile",
    updateprofile: "user/update-profile",
    verifyOtp: "auth/verify-otp",
    verifyUser: "check-user",
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
    add_medical: "medical/record/create",
    update_medial2: "medical/record/update", 

    // properties
    properties: "landlord/get-properties",
    addproperty: "landlord/create-property",
    editproperty: "landlord/update-property",
    getunit: "landlord/property-unit/getall",
    editunit: "landlord/property-unit/update",

    registertenat: "landlord/register-tenant",
    addtenantunit: "landlord/property-unit/add-tenant",
    gettenats: "/landlord/tenants/all",
    singletenant: "/landlord/tenants/single",
    deletetenant: "landlord/property-unit/delete-tenant",

    // units
    addunits: "landlord/property-unit/create",

    // Business
    getcompanies: "ceo/company/get-all",
    registercompany: "ceo/company/register",
    updatecompany: "ceo/company/update",
    deletcompany: "ceo/company/delete",

    branches: "ceo/company/branch/getall",
    allbranch: "ceo/company/branch/getall-branches",
    addbranch: "ceo/company/branch/create",
    updatebranch: "ceo/company/branch/update",

    getemployee: "ceo/company/employee/getall",
    singleemployee: "ceo/company/employee/single",
    addemployee: "ceo/company/employee/register",
    terminate: "ceo/company/employee/terminate",
    updateemployee: "ceo/company/employee/update",

    addmedical: "medical/record/create",

    addcrime: "user/crime-report/create",
    crime: "user/crime-report/view",
    update_crime: "user/crime-report/update",

    //Force
    getforce:"admin-panel/admin/organization/force/view",
    createforce: "admin-panel/admin/organization/force/create",
    
  };