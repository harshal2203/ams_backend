import path from "path";

export const DS = "/";
export const ROOT_DIR = path.resolve('./');
export const ASSETS_DIR = `${ROOT_DIR}${DS}assets`;
export const ASSETS_TMP_DIR = `${ASSETS_DIR}${DS}tmp`;
export const ASSET_IMAGES_DIR = `${ASSETS_DIR}${DS}images${DS}`;
export const LOGO_IMAGES_DIR = `${ASSETS_DIR}${DS}images${DS}logo${DS}`;


export default {
  pageSize: 15,
  pageSizeLimit: 200,
  thumbMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/bmp'],
  imageMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/bmp'],
  fontMimeTypes: ['ttf', 'otf'],
  standardDateFormat: "YYYY-MM-DD HH:mm:ss",
}

export const userRoles = {
  ADMIN_ROLE: {
    id: 1,
    title: "admin"
  },
  VENDOR_ROLE: {
    id: 2,
    title: "hr"
  },
  EMPLOYEE_ROLE: {
    id: 3,
    title: "employee"
  },
  
}


/**
* All the MB conversion are made in bytes
*
*/
export const bytesMb = {
  "mb_1": 1048576,
  "mb_2": 2097152,
  "mb_3": 3145728,
  "mb_4": 4194304,
  "mb_5": 5242880,
  "mb_10": 10485760,
  "mb_30": 31457280,
  "mb_50": 52428800,
};


export const emailVerifyStatuses = {
  UNVERIFIED: {
    id: 0,
    title: "unverified"
  },
  VERIFIED: {
    id: 1,
    title: "verified"
  }
}

export const commonStatuses = {
  ACTIVE: {
    id: 1,
    title: "active"
  },
  INACTIVE: {
    id: 0,
    title: "inactive"
  }
}