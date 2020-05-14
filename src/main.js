import Vue from "vue";
import App from "./App.vue";

import { BootstrapVue } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// Import Amplify Modules, Plugins, and aws exports file
import Amplify, * as AmplifyModules from "aws-amplify";
import { AmplifyPlugin } from "aws-amplify-vue";
import { AmazonAIPredictionsProvider } from "@aws-amplify/predictions";
import awsconfig from "./aws-exports";

// Configure Amplify in project
Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

// Configure vue to use plugins and modules
Vue.use(AmplifyPlugin, AmplifyModules);

// Configure BootstrapVue
Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");