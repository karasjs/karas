let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M10,10L60,10L60,46.796875L10,46.796875L10,10"],["fill","rgba(0,0,0,0.3)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M10,11C10,8.238576250846032 12.238576250846032,6 15,6L49.70315,6L49.70315,31.875L15,31.875C12.238576250846032,31.875 10,29.63642374915397 10,26.875"],["fill","rgba(255,0,0,0.3)"]]},{"type":"item","tagName":"path","props":[["d","M11.464466094067262,7.464466094067262C11.753537734864679,7.1753944532698455 12.076970367456969,6.922865884680518 12.427521222862367,6.712535371437279L12.878679656440358,8.878679656440358M12.427521222862367,6.712535371437279C13.204598230739897,6.24628916671076 14.09378026969516,6 15,6L15,8C14.204350530481367,8 13.441288791784462,8.316070521096254 12.878679656440358,8.878679656440358M15,6L49.70315,6L49.70315,8L15,8"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M11.464466094067262,30.410533905932738C11.753537734864679,30.699605546730155 12.076970367456969,30.95213411531948 12.427521222862367,31.16246462856272L12.878679656440358,28.996320343559642M12.427521222862367,31.16246462856272C13.204598230739897,31.62871083328924 14.09378026969516,31.875 15,31.875L15,29.875C14.204350530481367,29.875 13.441288791784462,29.558929478903746 12.878679656440358,28.996320343559642M15,29.875L49.70315,29.875L49.70315,31.875L15,31.875"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M11.464466094067262,7.464466094067262C11.175394453269845,7.753537734864679 10.922865884680519,8.076970367456969 10.71253537143728,8.427521222862367L12.878679656440358,8.878679656440358M10.71253537143728,8.427521222862367C10.246289166710763,9.204598230739895 10,10.093780269695161 10,11L12,11C12,10.204350530481367 12.316070521096254,9.441288791784462 12.878679656440358,8.878679656440358M10,11L12,11L12,26.875L10,26.875M10,26.875C10,27.781219730304837 10.246289166710763,28.670401769260103 10.71253537143728,29.447478777137633L12.878679656440358,28.996320343559642C12.316070521096254,28.433711208215538 12,27.670649469518633 12,26.875M10.71253537143728,29.447478777137633C10.922865884680519,29.79802963254303 11.175394453269845,30.12146226513532 11.464466094067262,30.410533905932738L12.878679656440358,28.996320343559642"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M10,24.3984375L20.90625,24.3984375C23.66767374915397,24.3984375 25.90625,26.63701375084603 25.90625,29.3984375L25.90625,45.2734375C25.90625,48.03486124915397 23.66767374915397,50.2734375 20.90625,50.2734375L10,50.2734375"],["fill","rgba(255,0,0,0.3)"]]},{"type":"item","tagName":"path","props":[["d","M10,24.3984375L20.90625,24.3984375L20.90625,26.3984375L10,26.3984375M20.90625,24.3984375C21.81246973030484,24.3984375 22.701651769260103,24.64472666671076 23.478728777137633,25.11097287143728L23.027570343559642,27.277117156440358C22.464961208215538,26.714508021096254 21.701899469518633,26.3984375 20.90625,26.3984375M23.478728777137633,25.11097287143728C23.82927963254303,25.32130338468052 24.15271226513532,25.573831953269845 24.441783905932738,25.862903594067262L23.027570343559642,27.277117156440358"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M24.441783905932738,25.862903594067262C24.730855546730155,26.15197523486468 24.98338411531948,26.47540786745697 25.19371462856272,26.825958722862367L23.027570343559642,27.277117156440358M25.19371462856272,26.825958722862367C25.659960833289237,27.603035730739897 25.90625,28.492217769695163 25.90625,29.3984375L23.90625,29.3984375C23.90625,28.602788030481367 23.590179478903746,27.839726291784462 23.027570343559642,27.277117156440358M23.90625,29.3984375L25.90625,29.3984375L25.90625,45.2734375L23.90625,45.2734375M25.90625,45.2734375C25.90625,46.17965723030484 25.659960833289237,47.0688392692601 25.19371462856272,47.84591627713763L23.027570343559642,47.394757843559645C23.590179478903746,46.83214870821554 23.90625,46.06908696951863 23.90625,45.2734375M25.19371462856272,47.84591627713763C24.98338411531948,48.19646713254303 24.730855546730155,48.51989976513532 24.441783905932738,48.80897140593274L23.027570343559642,47.394757843559645"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M10,48.2734375L20.90625,48.2734375L20.90625,50.2734375L10,50.2734375M20.90625,50.2734375C21.81246973030484,50.2734375 22.701651769260103,50.02714833328924 23.478728777137633,49.560902128562724L23.027570343559642,47.394757843559645C22.464961208215538,47.95736697890375 21.701899469518633,48.2734375 20.90625,48.2734375M23.478728777137633,49.560902128562724C23.82927963254303,49.35057161531948 24.15271226513532,49.098043046730155 24.441783905932738,48.80897140593274L23.027570343559642,47.394757843559645"],["fill","rgba(0,255,0,0.5)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",17],["y",24.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"2"}]},{"bb":[{"type":"item","tagName":"path","props":[["d","M25.90625,10L49.70315,10L49.70315,27.875L25.90625,27.875L25.90625,10"],["fill","rgba(0,0,255,0.3)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",28.90625],["y",24.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",700],["font-style","normal"],["font-size","16px"]],"content":"33"}]}],"visibility":"visible","type":"dom"},{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",10],["y",42.8828125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"2"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M10,56.796875L60,56.796875L60,93.59375L10,93.59375L10,56.796875"],["fill","rgba(0,0,0,0.3)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M10,57.796875C10,55.03545125084603 12.238576250846032,52.796875 15,52.796875L55.60935,52.796875L55.60935,78.671875L15,78.671875C12.238576250846032,78.671875 10,76.43329874915396 10,73.671875"],["fill","rgba(255,0,0,0.3)"]]},{"type":"item","tagName":"path","props":[["d","M11.464466094067262,54.26134109406726C11.753537734864679,53.972269453269845 12.076970367456969,53.71974088468052 12.427521222862367,53.509410371437276L12.878679656440358,55.675554656440355M12.427521222862367,53.509410371437276C13.204598230739897,53.04316416671076 14.09378026969516,52.796875 15,52.796875L15,54.796875C14.204350530481367,54.796875 13.441288791784462,55.11294552109625 12.878679656440358,55.675554656440355M15,52.796875L55.60935,52.796875L55.60935,54.796875L15,54.796875"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M11.464466094067262,77.20740890593274C11.753537734864679,77.49648054673015 12.076970367456969,77.74900911531948 12.427521222862367,77.95933962856272L12.878679656440358,75.79319534355965M12.427521222862367,77.95933962856272C13.204598230739897,78.42558583328923 14.09378026969516,78.671875 15,78.671875L15,76.671875C14.204350530481367,76.671875 13.441288791784462,76.35580447890375 12.878679656440358,75.79319534355965M15,76.671875L55.60935,76.671875L55.60935,78.671875L15,78.671875"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M11.464466094067262,54.26134109406726C11.175394453269845,54.55041273486468 10.922865884680519,54.87384536745697 10.71253537143728,55.22439622286237L12.878679656440358,55.675554656440355M10.71253537143728,55.22439622286237C10.246289166710763,56.0014732307399 10,56.89065526969516 10,57.796875L12,57.796875C12,57.00122553048137 12.316070521096254,56.23816379178446 12.878679656440358,55.675554656440355M10,57.796875L12,57.796875L12,73.671875L10,73.671875M10,73.671875C10,74.57809473030484 10.246289166710763,75.46727676926011 10.71253537143728,76.24435377713763L12.878679656440358,75.79319534355965C12.316070521096254,75.23058620821554 12,74.46752446951864 12,73.671875M10.71253537143728,76.24435377713763C10.922865884680519,76.59490463254303 11.175394453269845,76.91833726513532 11.464466094067262,77.20740890593274L12.878679656440358,75.79319534355965"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M10,71.1953125L32.8125,71.1953125C35.57392374915397,71.1953125 37.8125,73.43388875084604 37.8125,76.1953125L37.8125,92.0703125C37.8125,94.83173624915396 35.57392374915397,97.0703125 32.8125,97.0703125L10,97.0703125"],["fill","rgba(255,0,0,0.3)"]]},{"type":"item","tagName":"path","props":[["d","M10,71.1953125L32.8125,71.1953125L32.8125,73.1953125L10,73.1953125M32.8125,71.1953125C33.71871973030484,71.1953125 34.6079017692601,71.44160166671077 35.38497877713763,71.90784787143728L34.933820343559645,74.07399215644035C34.37121120821554,73.51138302109625 33.60814946951863,73.1953125 32.8125,73.1953125M35.38497877713763,71.90784787143728C35.735529632543034,72.11817838468052 36.05896226513532,72.37070695326985 36.34803390593274,72.65977859406726L34.933820343559645,74.07399215644035"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M36.34803390593274,72.65977859406726C36.637105546730155,72.94885023486468 36.88963411531948,73.27228286745697 37.099964628562724,73.62283372286237L34.933820343559645,74.07399215644035M37.099964628562724,73.62283372286237C37.56621083328924,74.39991073073989 37.8125,75.28909276969516 37.8125,76.1953125L35.8125,76.1953125C35.8125,75.39966303048136 35.49642947890375,74.63660129178446 34.933820343559645,74.07399215644035M35.8125,76.1953125L37.8125,76.1953125L37.8125,92.0703125L35.8125,92.0703125M37.8125,92.0703125C37.8125,92.97653223030484 37.56621083328924,93.86571426926011 37.099964628562724,94.64279127713763L34.933820343559645,94.19163284355965C35.49642947890375,93.62902370821554 35.8125,92.86596196951864 35.8125,92.0703125M37.099964628562724,94.64279127713763C36.88963411531948,94.99334213254303 36.637105546730155,95.31677476513532 36.34803390593274,95.60584640593274L34.933820343559645,94.19163284355965"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M10,95.0703125L32.8125,95.0703125L32.8125,97.0703125L10,97.0703125M32.8125,97.0703125C33.71871973030484,97.0703125 34.6079017692601,96.82402333328923 35.38497877713763,96.35777712856272L34.933820343559645,94.19163284355965C34.37121120821554,94.75424197890375 33.60814946951863,95.0703125 32.8125,95.0703125M35.38497877713763,96.35777712856272C35.735529632543034,96.14744661531948 36.05896226513532,95.89491804673015 36.34803390593274,95.60584640593274L34.933820343559645,94.19163284355965"],["fill","rgba(0,255,0,0.5)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",17],["y",71.28125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"2"}]},{"bb":[{"type":"item","tagName":"path","props":[["d","M25.90625,56.796875L55.60935,56.796875L55.60935,74.671875L25.90625,74.671875L25.90625,56.796875"],["fill","rgba(0,0,255,0.3)"]]},{"type":"item","tagName":"path","props":[["d","M10,75.1953125L21.90625,75.1953125L21.90625,93.0703125L10,93.0703125L10,75.1953125"],["fill","rgba(0,0,255,0.3)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",28.90625],["y",71.28125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",700],["font-style","normal"],["font-size","16px"]],"content":"333"},{"type":"item","tagName":"text","props":[["x",10],["y",89.6796875],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",700],["font-style","normal"],["font-size","16px"]],"content":"3"}]}],"visibility":"visible","type":"dom"},{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",21.90625],["y",89.6796875],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"2"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M10,103.59375L60,103.59375L60,140.390625L10,140.390625L10,103.59375"],["fill","rgba(0,0,0,0.3)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M10,104.59375C10,101.83232625084604 12.238576250846032,99.59375 15,99.59375L52.71875,99.59375L52.71875,125.46875L15,125.46875C12.238576250846032,125.46875 10,123.23017374915396 10,120.46875"],["fill","rgba(255,0,0,0.3)"]]},{"type":"item","tagName":"path","props":[["d","M11.464466094067262,101.05821609406726C11.753537734864679,100.76914445326985 12.076970367456969,100.51661588468052 12.427521222862367,100.30628537143728L12.878679656440358,102.47242965644035M12.427521222862367,100.30628537143728C13.204598230739897,99.84003916671077 14.09378026969516,99.59375 15,99.59375L15,101.59375C14.204350530481367,101.59375 13.441288791784462,101.90982052109625 12.878679656440358,102.47242965644035M15,99.59375L52.71875,99.59375L52.71875,101.59375L15,101.59375"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M11.464466094067262,124.00428390593274C11.753537734864679,124.29335554673015 12.076970367456969,124.54588411531948 12.427521222862367,124.75621462856272L12.878679656440358,122.59007034355965M12.427521222862367,124.75621462856272C13.204598230739897,125.22246083328923 14.09378026969516,125.46875 15,125.46875L15,123.46875C14.204350530481367,123.46875 13.441288791784462,123.15267947890375 12.878679656440358,122.59007034355965M15,123.46875L52.71875,123.46875L52.71875,125.46875L15,125.46875"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M11.464466094067262,101.05821609406726C11.175394453269845,101.34728773486468 10.922865884680519,101.67072036745697 10.71253537143728,102.02127122286237L12.878679656440358,102.47242965644035M10.71253537143728,102.02127122286237C10.246289166710763,102.79834823073989 10,103.68753026969516 10,104.59375L12,104.59375C12,103.79810053048136 12.316070521096254,103.03503879178446 12.878679656440358,102.47242965644035M10,104.59375L12,104.59375L12,120.46875L10,120.46875M10,120.46875C10,121.37496973030484 10.246289166710763,122.26415176926011 10.71253537143728,123.04122877713763L12.878679656440358,122.59007034355965C12.316070521096254,122.02746120821554 12,121.26439946951864 12,120.46875M10.71253537143728,123.04122877713763C10.922865884680519,123.39177963254303 11.175394453269845,123.71521226513532 11.464466094067262,124.00428390593274L12.878679656440358,122.59007034355965"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M10,117.9921875L32.8125,117.9921875C35.57392374915397,117.9921875 37.8125,120.23076375084604 37.8125,122.9921875L37.8125,138.8671875C37.8125,141.62861124915398 35.57392374915397,143.8671875 32.8125,143.8671875L10,143.8671875"],["fill","rgba(255,0,0,0.3)"]]},{"type":"item","tagName":"path","props":[["d","M10,117.9921875L32.8125,117.9921875L32.8125,119.9921875L10,119.9921875M32.8125,117.9921875C33.71871973030484,117.9921875 34.6079017692601,118.23847666671077 35.38497877713763,118.70472287143728L34.933820343559645,120.87086715644035C34.37121120821554,120.30825802109625 33.60814946951863,119.9921875 32.8125,119.9921875M35.38497877713763,118.70472287143728C35.735529632543034,118.91505338468052 36.05896226513532,119.16758195326985 36.34803390593274,119.45665359406726L34.933820343559645,120.87086715644035"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M36.34803390593274,119.45665359406726C36.637105546730155,119.74572523486468 36.88963411531948,120.06915786745697 37.099964628562724,120.41970872286237L34.933820343559645,120.87086715644035M37.099964628562724,120.41970872286237C37.56621083328924,121.19678573073989 37.8125,122.08596776969516 37.8125,122.9921875L35.8125,122.9921875C35.8125,122.19653803048136 35.49642947890375,121.43347629178446 34.933820343559645,120.87086715644035M35.8125,122.9921875L37.8125,122.9921875L37.8125,138.8671875L35.8125,138.8671875M37.8125,138.8671875C37.8125,139.77340723030483 37.56621083328924,140.6625892692601 37.099964628562724,141.43966627713763L34.933820343559645,140.98850784355963C35.49642947890375,140.42589870821553 35.8125,139.66283696951862 35.8125,138.8671875M37.099964628562724,141.43966627713763C36.88963411531948,141.79021713254303 36.637105546730155,142.11364976513534 36.34803390593274,142.40272140593274L34.933820343559645,140.98850784355963"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M10,141.8671875L32.8125,141.8671875L32.8125,143.8671875L10,143.8671875M32.8125,143.8671875C33.71871973030484,143.8671875 34.6079017692601,143.62089833328923 35.38497877713763,143.15465212856273L34.933820343559645,140.98850784355963C34.37121120821554,141.55111697890374 33.60814946951863,141.8671875 32.8125,141.8671875M35.38497877713763,143.15465212856273C35.735529632543034,142.9443216153195 36.05896226513532,142.69179304673014 36.34803390593274,142.40272140593274L34.933820343559645,140.98850784355963"],["fill","rgba(0,255,0,0.5)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",17],["y",118.078125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"2"}]},{"bb":[{"type":"item","tagName":"path","props":[["d","M25.90625,103.59375L52.71875,103.59375L52.71875,121.46875L25.90625,121.46875L25.90625,103.59375"],["fill","rgba(0,0,255,0.3)"]]},{"type":"item","tagName":"path","props":[["d","M10,121.9921875L21.90625,121.9921875L21.90625,139.8671875L10,139.8671875L10,121.9921875"],["fill","rgba(0,0,255,0.3)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",28.90625],["y",118.078125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",700],["font-style","normal"],["font-size","16px"]],"content":"3"}]},{"bb":[{"type":"item","tagName":"path","props":[["d","M37.8125,103.59375L52.71875,103.59375L52.71875,121.46875L37.8125,121.46875L37.8125,103.59375"],["fill","rgba(0,255,0,0.3)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",40.8125],["y",118.078125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",700],["font-style","normal"],["font-size","16px"]],"content":"4"}]}],"visibility":"visible","type":"dom"},{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",10],["y",136.4765625],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",700],["font-style","normal"],["font-size","16px"]],"content":"3"}]}],"visibility":"visible","type":"dom"},{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",21.90625],["y",136.4765625],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"2"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[]}')
      .end();
  }
};
