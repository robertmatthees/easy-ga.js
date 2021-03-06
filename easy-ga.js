/*  easy-ga.js (version: 0.1)

    Easy to Set-up Google Analytics Tracking
    Supporting Enhanced Ecommerce Transactions (EC)
    & Respecting Data Privacy User Choices
    (Do-not-track Browser Settings & Opt-out Cookies)
    Docs: https://www.robert-matthees.de/ecommerce/easy-ga/

    Copyright (C) 2018 Robert Matthees (contact: www.robert-matthees.de)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation Version 3.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

//***Hello World
function Tracking() {

  //***************
  //***Create Options, Extend Defaults
  //***************
  var defaults = {
    'php': 'easy-ga.php',
    'selector': 'a[href$=".opt()"]',
    'default_optout': 0,
    'opt_link': 1,
    'msg_confirm': 1,
    'msg_txt_opt_in': 'opt-in successfull (tracking active)',
    'msg_txt_opt_out': 'opt-out successfull (tracking stopped)',
    'msg_txt_conflict': 'cookie opt-in, but -do not track- browser settings (still no tracking)',
    'msg_txt_no_cookie': 'you need to enable cookies in your browser settings to use this feature',
    'msg_txt_no_cookie_optout': 'you need to enable cookies in your browser settings to use this feature (tracking disabled by default)',
    'msg_cl_opt_in': '#ffa501',
    'msg_cl_opt_out': '#009400',
    'msg_cl_conflict': '#ff0000',
    'msg_cl_no_cookie': '#ff0000',
    'msg_cl_no_cookie_optout': '#ff0000',
    'msg_time': 2750,
    'msg_container': '',
    'warning': 0,
    'warning_optout': 'Important: There is an Opt-out Cookie saved in your Browser that prevents us from optimizing your experience on our site.',
    'warning_do_not_track': 'Important: There are Do-not-track Settings activated in your Browser which prevent us from optimizing your experience on our site.',
    'warning_both': 'Important: There is an Opt-out Cookie saved in your Browser & Do-not-track Settings which prevent us from optimizing your experience on our site.',
    'warning_adblock': 'Important: Using AdBlockers is like Stealing Pocket Money from Children in Primary School.',
    'warning_cookies_disabled': 'Please enable Cookies in your Browser Settings to enjoy all features on our site.',
    'warning_container': '',
    'debug': 0,
    'adblock': 0
  };
  if(arguments[0] && typeof arguments[0] === "object") {
    this.options = extend_defaults(defaults, arguments[0]);
  }
  this.options.disable_str = "ga-disable-" + this.options.property;

  //***Do Not Track Browser Settings OR Opt-out Cookie active?
  this.options.optout = Boolean(document.cookie.indexOf(this.options.disable_str + '=true') > -1);
  this.options.do_not_track = Boolean(navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack);
  if((this.options.do_not_track === true) && (this.options.optout === false)) {
    //***Conflict: No Cookie Opt-out, but Blocked by Browser Settings
    this.options.cookie_vs_browser = 1;
  } else {
    //***No Conflict
    this.options.cookie_vs_browser = 0;
  }
  //***Default Opt-out
  if(this.options.default_optout) {
    //***Set Cookie if none
    if(!this.options.optout) {
      document.cookie = this.options.disable_str + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
      this.options.optout = 1;
      if(this.options.debug) console.log("opt-out cookie");
    }
  }
  //***Default Opt-out & Cookies Disabled
  if(this.options.default_optout && !navigator.cookieEnabled)
  {
    this.options.no_cookie = 1;
    if(this.options.debug) console.log("default optout, but cookies disabled");
  } else {
    this.options.no_cookie = 0;
  }

  //***Continue When DOM Ready
  ready(this.options);

  //***************
  //***Init Tracking
  //***************
  this.init = function () {

    //***Extend Options
    var action, products, transaction, i, ga;
    if(arguments[0] && typeof arguments[0] === "object") {
      this.options = extend_defaults(this.options, arguments[0]);
      if(this.options.track.action) action = this.options.track.action;
      if(this.options.track.products) products = this.options.track.products;
      if(this.options.track.transaction) transaction = this.options.track.transaction;

      //******************************************************
      //***TO DO: ADD VARS FOR FURTHER TRACKING SCENARIOS HERE
      //******************************************************

    }

    //***Do Not Track
    if(this.options.do_not_track || this.options.optout || this.options.no_cookie) {

      if(this.options.debug) console.log("optout/do not track/no cookie");
      window[this.options.disable_str] = true;

    } else {
    //***Start Tracking

      if(this.options.debug) console.log("start tracking");
      window[this.options.disable_str] = false;

      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      ga('create', this.options.property, 'auto');
      ga('require', 'ec');
      ga('set', 'anonymizeIp', true);

      //***Detect AdBlocker
      if(!(window.ga && ga.create)) this.options.adblock = 1;

      //***Purchase-Transaction
      if(action == "purchase") {

        //***Add Products
        for(i = 0; i < products.length; i++) {
          ga('ec:addProduct', products[i]);
          if(this.options.debug) console.log("product"+(i+1)+" added");
        }

        //***Add Transactions
        ga('ec:setAction', 'purchase', transaction);
        if(this.options.debug) console.log("set purchase");

      }

      //******************************************************
      //***TO DO: ADD FURTHER TRACKING SCENARIOS HERE
      //******************************************************

      //***Send Pageview
      ga('send', 'pageview');
      if(this.options.debug) console.log("pageview sent");

    }

    //***Ajax Transaction-Tracking for AdBlocker-, Do Not Track- & Default Optout+Cookies Disabled
    if ((this.options.adblock || this.options.do_not_track || this.options.optout || this.options.no_cookie) && (action == "purchase")) {

      if(this.options.debug) console.log("start ajax tracking");

      //***Create Data Set for Ajax Call
      var postdata = "tid="+this.options.property+"&pa=purchase";

      //***Add Products to Data Set
      for(i = 0; i < products.length; i++) {
        postdata += "&pr"+(i+1)+"id="+products[i].id + "&pr"+(i+1)+"nm="+products[i].name;
        if(products[i].brand) postdata += "&pr"+(i+1)+"br="+products[i].brand;
        if(products[i].category) postdata += "&pr"+(i+1)+"ca="+products[i].category;
        if(products[i].variant) postdata += "&pr"+(i+1)+"va="+products[i].variant;
        if(products[i].price) postdata += "&pr"+(i+1)+"pr="+products[i].price;
        if(products[i].quantity) postdata += "&pr"+(i+1)+"qt="+products[i].quantity;
        if(products[i].coupon) postdata += "&pr"+(i+1)+"cc="+products[i].coupon;
        if(this.options.debug) console.log("product"+(i+1)+" added");
      }

      //***Add Transaction Info to Data Set
      postdata += "&ti="+transaction.id;
      if(transaction.affiliation) postdata += "&ta="+transaction.affiliation;
      if(transaction.revenue) postdata += "&tr="+transaction.revenue;
      if(transaction.tax) postdata += "&tt="+transaction.tax;
      if(transaction.shipping) postdata += "&ts="+transaction.shipping;
      if(transaction.coupon) postdata += "&tcc="+transaction.coupon;
      if(this.options.debug) console.log("transaction added");

      //***Ajax Call
      var xhttp = new XMLHttpRequest();
      xhttp.open("POST", this.options.php, true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send(postdata);
      if(this.options.debug) console.log("ajax call");

    }

  };

  //***************
  //***Tracking Opt-In/Out
  //***************
  this.opt = function () {

    //***Read Cookie & Update Info
    this.options.optout = Boolean(document.cookie.indexOf(this.options.disable_str + '=true') > -1);

    //***Opt-In
    if(this.options.optout === true) {
      
      document.cookie = this.options.disable_str + '=false; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
      if(this.options.debug) console.log("opt-in cookie");

    } else {
    //***Opt-Out

      document.cookie = this.options.disable_str + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
      if(this.options.debug) console.log("opt-out cookie");

    }

    //***Update Options
    this.options.optout = !this.options.optout;
    window[this.options.disable_str] = this.options.optout;

    //***Conflict? No Cookie Opt-out, but Blocked by Browser Settings
    if((this.options.do_not_track === true) && (this.options.optout === false)) this.options.cookie_vs_browser = 1;
    else this.options.cookie_vs_browser = 0;

    //***Update Opt-In/Out Link Text & Display Confirmation Message
    if(this.options.opt_link) opt_link(this.options, 1);

  };

  //******************************************************
  //***PRIVATE PART:
  //******************************************************

  //***************
  //***Update Opt-In/Out Link Anchor Text & Display Confirmation Message (on Opt-out/Opt-in)
  //***************
  function opt_link(options, confirm) {

    var i, el = document.querySelectorAll(options.selector);

    //***Display Warning
    if(options.warning) {

      var warn = "", w_el = document.querySelectorAll(options.warning_container);

      //***Set Warning Message
      if(options.optout) warn = options.warning_optout;
      if(options.do_not_track) warn = options.warning_do_not_track;
      if((options.optout) && (options.do_not_track)) warn = options.warning_both;
      if(options.adblock) warn = options.warning_adblock;
      if(!navigator.cookieEnabled) warn = options.warning_cookies_disabled;

      //***Display Warning
      for(i = 0; i < w_el.length; i++) {
        w_el[i].innerHTML = warn;
        if(options.debug) console.log("warning "+(i+1));
      }

    }

    //***Update Anchor Text 
    if (options.opt_link) {

      var child = "", hide, show, j;

      //***Span-Tags to Hide/Show
      if(options.optout) child = "last";
      else child = "first";

      //***Hide/Show Span-Tags
      for(i = 0; i < el.length; i++) {
        hide = el[i].querySelectorAll("span:not(:"+child+"-child)");
        show = el[i].querySelector("span:"+child+"-child");
        for(j = 0; j < hide.length; j++) {
          hide[j].style.display = "none";
        }
        show.style.display = "inline";
        if(options.debug) console.log("updated anchor text "+(i+1));
      }

    }

    //***Show Confirmation Message
    if(confirm && options.msg_confirm) confirm_msg(el, options);

  }

  //***************
  //***Show Opt-In/Out Confirmation Message
  //***************
  function confirm_msg(el, options) {

    var msg, i, parent = [], old_el = [], new_el = [];
    if(options.msg_container) el = document.querySelectorAll(options.msg_container);

    //***Set Message & Color
    if(options.optout) {
      msg = [options.msg_txt_opt_out, options.msg_cl_opt_out];
    } else {
      msg = [options.msg_txt_opt_in, options.msg_cl_opt_in];
      if(options.cookie_vs_browser) { msg = [options.msg_txt_conflict, options.msg_cl_conflict]; options.msg_time *= 2; }
    }
    if(!navigator.cookieEnabled) {
      msg = [options.msg_txt_no_cookie, options.msg_cl_no_cookie]; options.msg_time *= 2;
      if(options.default_optout) msg = [options.msg_txt_no_cookie_optout, options.msg_cl_no_cookie_optout];
    }

    //***Create & Show Message
    for(i = 0; i < el.length; i++) {
      parent.push(el[i].parentNode);
      new_el.push(document.createElement('span'));
      old_el.push(el[i]);
      new_el[i].innerHTML = msg[0];
      new_el[i].style.color = msg[1];
      parent[i].replaceChild(new_el[i], el[i]);
      if(options.debug) console.log("swapped to confirmation messaage "+(i+1)+" (wait "+options.msg_time+"ms)");
    }

    //***Swap Back to Original Content
    setTimeout(function() {
      for(i = 0; i < el.length; i++) {
        parent[i].replaceChild(old_el[i], new_el[i]);
        if(options.debug) console.log("swapped back "+(i+1));
      }
    }, options.msg_time);

  }

  //***************
  //***Ready-State/Waiting for DOM
  //***************
  function ready(options){
    if(document.readyState != 'loading') opt_link(options);
    else if(document.addEventListener) document.addEventListener('DOMContentLoaded', function() { opt_link(options); });
    else document.attachEvent('onreadystatechange', function() {
        if(document.readyState=='complete') opt_link(options);
    });
  }

  //***************
  //***Extend Default Options
  //***************
  function extend_defaults(source, properties) {
    var property;
    for(property in properties) {
      if(properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }
}
