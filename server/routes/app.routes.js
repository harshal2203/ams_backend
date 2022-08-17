// API Prefixed from where application starts pointing
export const API_PREFIXED = "/api";

/**
 * Module routes
 *
 */
export const moduleRoutes = {
  user: "/user",
  category: "/category",
  product: "/product",
  allocation: "/allocation",
  combo: "/combo",
};

/**
 * Generate User router routes
 *
 */
export const userRoutes = {
  login: {
    path: "/login",
  },
  logout: {
    path: "/logout",
  },
  create: {
    path: "/create",
  },
  changePassword: {
    path: "/change-password",
  },
  profile: {
    path: "/:id",
  },
  update: {
    path: "/:id",
  },
  delete: {
      path: "/:id",
  },
  emp_profile: {
    path: "/emp/:id",
  },
  users: {
    path: "/",
  },
  /* category_list: {
    path: "/list",
  }, */
  status_change: {
    path: "/status/:id",
  },
};


export const categoryRoutes = {
  
  profile: {
    path: "/:id",
  },
  update: {
    path: "/:id",
  },
  delete: {
    path: "/:id",
  },
  multiple_delete: {
    path: "/",
  },
  create: {
    path: "/create",
  },
  category_list: {
    path: "/list",
  },
  stock:{
    path: "/stock"
  },
  category_details: {
    path: "/",
  },
  status_change: {
    path: "/status/:id",
  },
 
};


export const productRoutes = {
  profile: {
    path: "/:id",
  },
  update: {
    path: "/:id",
  },
  delete: {
    path: "/:id",
  },
  create: {
    path: "/create",
  },
  product_details: {
    path: "/",
  },
  status_change: {
    path: "/status/:id",
  },

};





export const allocationRoutes = {
  get: {
    path: "/:id",
  },
  update: {
    path: "/:id",
  },
  delete: {
    path: "/:id",
  },
  create: {
    path: "/create",
  },
  allocation_details: {
    path: "/",
  }

};


export const comboRoutes = {
  get: {
      path: "/:id",
  },
  update: {
    path: "/:id",
  },
  delete: {
    path: "/:id",
  },
  create: {
    path: "/create",
  },
  combo_details: {
    path: "/",
  }

};