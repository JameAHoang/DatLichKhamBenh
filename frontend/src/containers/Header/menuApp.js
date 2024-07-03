export const adminMenu = [
  //Quản lý người dùng
  {
    name: "menu.admin.user",
    menus: [
      {
        name: "menu.admin.databoard",
        link: "/system/databoard",
      },
      {
        name: "menu.admin.manage-user",
        link: "/system/user-manage",
      },
      // {
      //   name: "menu.admin.crud-redux",
      //   link: "/system/user-redux",
      // },
      // {
      //   name: "menu.admin.manage-doctor",
      //   link: "/system/manage-doctor",
      //   // subMenus: [
      //   //   {
      //   //     name: "menu.system.system-administrator.user-manage",
      //   //     link: "/system/user-manage",
      //   //   },
      //   //   {
      //   //     name: "menu.system.system-administrator.user-redux",
      //   //     link: "/system/user-redux",
      //   //   },
      //   // ],
      // },
      // {
      //   name: "menu.admin.manage-admin",
      //   link: "/system/user-admin",
      // },

      // {
      //   name: "menu.doctor.manage-schedule",
      //   link: "/doctor/manage-schedule",
      // },
    ],
  },
  //Quản lý bác sĩ
  {
    name: "menu.admin.doctor",
    menus: [
      {
        name: "menu.admin.manage-doctor",
        link: "/system/manage-doctor",
      },
      {
        name: "menu.doctor.manage-schedule",
        link: "/doctor/manage-schedule",
      },
    ],
  },
  //Quản lý phòng phám
  {
    name: "menu.admin.clinic",
    menus: [
      {
        name: "menu.admin.manage-clinic",
        link: "/system/manage-clinic",
      },
      {
        name: "menu.clinic.detail-manage-clinic",
        link: "/system/detail-manage-clinic",
      },
    ],
  },
  //Quản lý chuyên khoa
  {
    name: "menu.admin.specialty",
    menus: [
      {
        name: "menu.admin.manage-specialty",
        link: "/system/manage-specialty",
      },
      {
        name: "menu.speciality.detail-manage-specialty",
        link: "/system/detail-manage-specialty",
      },
    ],
  },
  //Quản lý bệnh nhân
  {
    name: "menu.admin.patient",
    menus: [
      {
        name: "menu.admin.manage-patient",
        link: "/system/manage-patient",
      },
      {
        name: "menu.doctor.manage-history",
        link: "/system/manage-history",
      },
    ],
  },
];

export const doctorMenu = [
  {
    name: "menu.admin.doctor",
    menus: [
      //Quản lý kế hoạch khám bệnh của bác sĩ
      {
        name: "menu.doctor.manage-schedule",
        link: "/doctor/manage-schedule",
      },
      //Quản lý bệnh nhân khám bệnh của bác sĩ
      {
        name: "menu.doctor.manage-patient",
        link: "/doctor/manage-patient",
      },
      {
        name: "menu.doctor.manage-history",
        link: "/doctor/manage-history",
      },
    ],
  },
];
