import api from "../../api";
import createPersistedState from "vuex-persistedstate";
import helpers from "../../utils/helper";
import lang from "../../lang";

export default {
  namespaced: true,
  state: {
    isSidebarActive: false,
    reduceSidebar: false,
    themeColor: "#2962ff",
    menu: [],
    configurationMenu: {},
    componentList: [],
    groupList: [],
    config: {},
    user: {
      avatar: 'files/shares/default-user.png'
    },
    locale: lang.languages,
    selectedLocale: {
      key: "en",
      label: "English",
    },
    keyIssue: {
      invalid: false,
    },
    authorizationIssue: {
      unauthorized: false,
    },
    isOnline: false,
    countUnreadMessage: 0,
  },
  mutations: {
    //This is for Sidbar trigger in mobile
    IS_SIDEBAR_ACTIVE(state, value) {
      state.isSidebarActive = value;
    },
    REDUCE_SIDEBAR(state, value) {
      state.reduceSidebar = value;
    },
    FETCH_MENU(state) {
      const menuKey = process.env.MIX_BADASO_MENU
        ? process.env.MIX_BADASO_MENU
        : "admin";
      const prefix = process.env.MIX_ADMIN_PANEL_ROUTE_PREFIX
        ? process.env.MIX_ADMIN_PANEL_ROUTE_PREFIX
        : "badaso-dashboard";
      api.badasoMenu
        .browseItemByKeys({
          menu_key: menuKey,
        })
        .then((res) => {
          var menus = [];
          for (let index = 0; index < res.data.length; index++) {
            let menu = res.data[index].menu;
            let items = res.data[index].menuItems;
            if (menu.key === "admin") {
              items.map((item) => {
                if (helpers.isValidHttpUrl(item.url)) {
                  item.url = item.url;
                } else {
                  item.url = "/" + prefix + "" + item.url;
                }

                if (item.children && item.children.length > 0) {
                  item.children.map((subItem) => {
                    if (helpers.isValidHttpUrl(subItem.url)) {
                      subItem.url = subItem.url;
                    } else {
                      subItem.url = "/" + prefix + "" + subItem.url;
                    }
                    return subItem;
                  });
                }

                return item;
              });
            } else {
              items.map((item) => {
                if (helpers.isValidHttpUrl(item.url)) {
                  item.url = item.url;
                } else {
                  item.url = "/" + prefix + "" + item.url;
                }

                if (item.children && item.children.length > 0) {
                  item.children.map((subItem) => {
                    if (helpers.isValidHttpUrl(subItem.url)) {
                      subItem.url = subItem.url;
                    } else {
                      subItem.url = "/" + prefix + "" + subItem.url;
                    }
                    return subItem;
                  });
                }

                return item;
              });
            }
            menus.push({
              menu: res.data[index].menu,
              mainMenu: items,
            });
          }
          state.menu = menus;
        })
        .catch((err) => {});
    },
    FETCH_CONFIGURATION_MENU(state) {
      const prefix = process.env.MIX_ADMIN_PANEL_ROUTE_PREFIX
        ? process.env.MIX_ADMIN_PANEL_ROUTE_PREFIX
        : "badaso-dashboard";
      api.badasoMenu
        .browseItemByKey({
          menu_key: "core",
        })
        .then((res) => {
          let menuItems = res.data.menuItems;
          menuItems.map((item) => {
            if (helpers.isValidHttpUrl(item.url)) {
              item.url = item.url;
            } else {
              item.url = "/" + prefix + "" + item.url;
            }

            if (item.children && item.children.length > 0) {
              item.children.map((subItem) => {
                if (helpers.isValidHttpUrl(subItem.url)) {
                  subItem.url = subItem.url;
                } else {
                  subItem.url = "/" + prefix + "" + subItem.url;
                }
                return subItem;
              });
            }
            return item;
          });
          state.configurationMenu = {
            menu: res.data.menu,
            menuItems: menuItems,
          };
        })
        .catch((err) => {});
    },
    FETCH_COMPONENT(state) {
      api.badasoData
        .component()
        .then((res) => {
          state.componentList = res.data.components;
        })
        .catch((err) => {});
    },
    FETCH_CONFIGURATION_GROUPS(state) {
      api.badasoData
        .configurationGroups()
        .then((res) => {
          state.groupList = res.data.groups;
        })
        .catch((err) => {});
    },
    FETCH_CONFIGURATION(state) {
      api.badasoConfiguration
        .applyable()
        .then((res) => {
          state.config = res.data.configuration;
        })
        .catch((err) => {});
    },
    FETCH_USER(state) {
      api.badasoAuthUser
        .user()
        .then((res) => {
          state.user = res.data.user;
        })
        .catch((err) => {});
    },
    SET_LOCALE(state, value) {
      state.selectedLocale = value;
    },
    SET_KEY_ISSUE(state, value) {
      state.keyIssue = value;
    },
    SET_AUTH_ISSUE(state, value) {
      state.authorizationIssue = value;
    },
    LOGOUT(state) {
      localStorage.clear();
      window.location.reload();
    },

    SET_GLOBAL_STATE(state, { key, value }) {
      state[key] = value;
    },
  },
  actions: {},
  getters: {
    getMenu: (state) => {
      return state.menu;
    },
    getConfigurationMenu: (state) => {
      return state.configurationMenu;
    },
    getComponent: (state) => {
      return state.componentList;
    },
    getSiteGroup: (state) => {
      return state.groupList;
    },
    getConfig: (state) => {
      return state.config;
    },
    getUser: (state) => {
      return state.user;
    },
    getLocale: (state) => {
      return state.locale;
    },
    getSelectedLocale: (state) => {
      return state.selectedLocale;
    },
    getGlobalState: (state) => {
      return state;
    },
  },
  plugins: [createPersistedState()],
};
