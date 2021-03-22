let path = require('path');
let fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('input', '{"bb":[],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M10,10L40,10L40,28.3984375L10,28.3984375L10,10"],["fill","rgba(0,0,0,0.3)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M10,11C10,8.238576250846032 12.238576250846032,6 15,6L27.90625,6C30.66767374915397,6 32.90625,8.238576250846032 32.90625,11L32.90625,26.875C32.90625,29.63642374915397 30.66767374915397,31.875 27.90625,31.875L15,31.875C12.238576250846032,31.875 10,29.63642374915397 10,26.875"],["fill","rgba(255,0,0,0.3)"]]},{"type":"item","tagName":"path","props":[["d","M10,11C10,8.238576250846034 12.238576250846034,6 15,6L15,8C12.238576250846034,8 10,9.34314575050762 10,11M15,6L27.90625,6L27.90625,8L15,8M27.90625,6C28.81246973030484,6 29.701651769260103,6.24628916671076 30.478728777137633,6.712535371437279L30.027570343559642,8.878679656440358C29.464961208215538,8.316070521096254 28.701899469518633,8 27.90625,8M30.478728777137633,6.712535371437279C30.82927963254303,6.922865884680518 31.15271226513532,7.1753944532698455 31.441783905932738,7.464466094067262L30.027570343559642,8.878679656440358"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M31.441783905932738,7.464466094067262C31.730855546730155,7.753537734864679 31.98338411531948,8.076970367456969 32.193714628562724,8.427521222862367L30.027570343559642,8.878679656440358M32.193714628562724,8.427521222862367C32.65996083328924,9.204598230739895 32.90625,10.093780269695161 32.90625,11L30.90625,11C30.90625,10.204350530481367 30.590179478903746,9.441288791784462 30.027570343559642,8.878679656440358M30.90625,11L32.90625,11L32.90625,26.875L30.90625,26.875M32.90625,26.875C32.90625,27.781219730304837 32.65996083328924,28.670401769260103 32.193714628562724,29.447478777137633L30.027570343559642,28.996320343559642C30.590179478903746,28.433711208215538 30.90625,27.670649469518633 30.90625,26.875M32.193714628562724,29.447478777137633C31.98338411531948,29.79802963254303 31.730855546730155,30.12146226513532 31.441783905932738,30.410533905932738L30.027570343559642,28.996320343559642"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M10,26.875C10,29.636423749153966 12.238576250846034,31.875 15,31.875L15,29.875C12.238576250846034,29.875 10,28.53185424949238 10,26.875M15,29.875L27.90625,29.875L27.90625,31.875L15,31.875M27.90625,31.875C28.81246973030484,31.875 29.701651769260103,31.62871083328924 30.478728777137633,31.16246462856272L30.027570343559642,28.996320343559642C29.464961208215538,29.558929478903746 28.701899469518633,29.875 27.90625,29.875M30.478728777137633,31.16246462856272C30.82927963254303,30.95213411531948 31.15271226513532,30.699605546730155 31.441783905932738,30.410533905932738L30.027570343559642,28.996320343559642"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M11.464466094067262,7.464466094067262C11.175394453269845,7.753537734864679 10.922865884680519,8.076970367456969 10.71253537143728,8.427521222862367L12.878679656440358,8.878679656440358M10.71253537143728,8.427521222862367C10.246289166710763,9.204598230739895 10,10.093780269695161 10,11L12,11C12,10.204350530481367 12.316070521096254,9.441288791784462 12.878679656440358,8.878679656440358M10,11L12,11L12,26.875L10,26.875M10,26.875C10,27.781219730304837 10.246289166710763,28.670401769260103 10.71253537143728,29.447478777137633L12.878679656440358,28.996320343559642C12.316070521096254,28.433711208215538 12,27.670649469518633 12,26.875M10.71253537143728,29.447478777137633C10.922865884680519,29.79802963254303 11.175394453269845,30.12146226513532 11.464466094067262,30.410533905932738L12.878679656440358,28.996320343559642"],["fill","rgba(0,255,0,0.5)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",17],["y",24.484375],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"2"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M10,38.3984375L40,38.3984375L40,75.1953125L10,75.1953125L10,38.3984375"],["fill","rgba(0,0,0,0.3)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M10,39.3984375C10,36.63701375084603 12.238576250846032,34.3984375 15,34.3984375L34.8125,34.3984375L34.8125,60.2734375L15,60.2734375C12.238576250846032,60.2734375 10,58.03486124915397 10,55.2734375"],["fill","rgba(255,0,0,0.3)"]]},{"type":"item","tagName":"path","props":[["d","M11.464466094067262,35.86290359406726C11.753537734864679,35.573831953269845 12.076970367456969,35.32130338468052 12.427521222862367,35.110972871437276L12.878679656440358,37.277117156440355M12.427521222862367,35.110972871437276C13.204598230739897,34.64472666671076 14.09378026969516,34.3984375 15,34.3984375L15,36.3984375C14.204350530481367,36.3984375 13.441288791784462,36.71450802109625 12.878679656440358,37.277117156440355M15,34.3984375L34.8125,34.3984375L34.8125,36.3984375L15,36.3984375"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M11.464466094067262,58.80897140593274C11.753537734864679,59.098043046730155 12.076970367456969,59.35057161531948 12.427521222862367,59.560902128562724L12.878679656440358,57.394757843559645M12.427521222862367,59.560902128562724C13.204598230739897,60.02714833328924 14.09378026969516,60.2734375 15,60.2734375L15,58.2734375C14.204350530481367,58.2734375 13.441288791784462,57.95736697890375 12.878679656440358,57.394757843559645M15,58.2734375L34.8125,58.2734375L34.8125,60.2734375L15,60.2734375"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M11.464466094067262,35.86290359406726C11.175394453269845,36.15197523486468 10.922865884680519,36.47540786745697 10.71253537143728,36.82595872286237L12.878679656440358,37.277117156440355M10.71253537143728,36.82595872286237C10.246289166710763,37.6030357307399 10,38.49221776969516 10,39.3984375L12,39.3984375C12,38.60278803048137 12.316070521096254,37.83972629178446 12.878679656440358,37.277117156440355M10,39.3984375L12,39.3984375L12,55.2734375L10,55.2734375M10,55.2734375C10,56.17965723030484 10.246289166710763,57.0688392692601 10.71253537143728,57.84591627713763L12.878679656440358,57.394757843559645C12.316070521096254,56.83214870821554 12,56.06908696951863 12,55.2734375M10.71253537143728,57.84591627713763C10.922865884680519,58.19646713254303 11.175394453269845,58.51989976513532 11.464466094067262,58.80897140593274L12.878679656440358,57.394757843559645"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M10,52.796875L20.90625,52.796875C23.66767374915397,52.796875 25.90625,55.03545125084603 25.90625,57.796875L25.90625,73.671875C25.90625,76.43329874915396 23.66767374915397,78.671875 20.90625,78.671875L10,78.671875"],["fill","rgba(255,0,0,0.3)"]]},{"type":"item","tagName":"path","props":[["d","M10,52.796875L20.90625,52.796875L20.90625,54.796875L10,54.796875M20.90625,52.796875C21.81246973030484,52.796875 22.701651769260103,53.04316416671076 23.478728777137633,53.509410371437276L23.027570343559642,55.675554656440355C22.464961208215538,55.11294552109625 21.701899469518633,54.796875 20.90625,54.796875M23.478728777137633,53.509410371437276C23.82927963254303,53.71974088468052 24.15271226513532,53.972269453269845 24.441783905932738,54.26134109406726L23.027570343559642,55.675554656440355"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M24.441783905932738,54.26134109406726C24.730855546730155,54.55041273486468 24.98338411531948,54.87384536745697 25.19371462856272,55.22439622286237L23.027570343559642,55.675554656440355M25.19371462856272,55.22439622286237C25.659960833289237,56.0014732307399 25.90625,56.89065526969516 25.90625,57.796875L23.90625,57.796875C23.90625,57.00122553048137 23.590179478903746,56.23816379178446 23.027570343559642,55.675554656440355M23.90625,57.796875L25.90625,57.796875L25.90625,73.671875L23.90625,73.671875M25.90625,73.671875C25.90625,74.57809473030484 25.659960833289237,75.46727676926011 25.19371462856272,76.24435377713763L23.027570343559642,75.79319534355965C23.590179478903746,75.23058620821554 23.90625,74.46752446951864 23.90625,73.671875M25.19371462856272,76.24435377713763C24.98338411531948,76.59490463254303 24.730855546730155,76.91833726513532 24.441783905932738,77.20740890593274L23.027570343559642,75.79319534355965"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M10,76.671875L20.90625,76.671875L20.90625,78.671875L10,78.671875M20.90625,78.671875C21.81246973030484,78.671875 22.701651769260103,78.42558583328923 23.478728777137633,77.95933962856272L23.027570343559642,75.79319534355965C22.464961208215538,76.35580447890375 21.701899469518633,76.671875 20.90625,76.671875M23.478728777137633,77.95933962856272C23.82927963254303,77.74900911531948 24.15271226513532,77.49648054673015 24.441783905932738,77.20740890593274L23.027570343559642,75.79319534355965"],["fill","rgba(0,255,0,0.5)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",17],["y",52.8828125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"22"},{"type":"item","tagName":"text","props":[["x",10],["y",71.28125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"2"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"},{"bb":[{"type":"item","tagName":"path","props":[["d","M10,85.1953125L40,85.1953125L40,140.390625L10,140.390625L10,85.1953125"],["fill","rgba(0,0,0,0.3)"]]}],"children":[{"bb":[{"type":"item","tagName":"path","props":[["d","M10,86.1953125C10,83.43388875084604 12.238576250846032,81.1953125 15,81.1953125L34.8125,81.1953125L34.8125,107.0703125L15,107.0703125C12.238576250846032,107.0703125 10,104.83173624915396 10,102.0703125"],["fill","rgba(255,0,0,0.3)"]]},{"type":"item","tagName":"path","props":[["d","M10,81.1953125L34.8125,81.1953125L34.8125,107.0703125L10,107.0703125L10,81.1953125"],["fill","#FFF"],["filter","url(#karas-defs-0-0)"],["clip-path","url(#karas-defs-0-1)"]]},{"type":"item","tagName":"path","props":[["d","M11.464466094067262,82.65977859406726C11.753537734864679,82.37070695326985 12.076970367456969,82.11817838468052 12.427521222862367,81.90784787143728L12.878679656440358,84.07399215644035M12.427521222862367,81.90784787143728C13.204598230739897,81.44160166671077 14.09378026969516,81.1953125 15,81.1953125L15,83.1953125C14.204350530481367,83.1953125 13.441288791784462,83.51138302109625 12.878679656440358,84.07399215644035M15,81.1953125L34.8125,81.1953125L34.8125,83.1953125L15,83.1953125"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M11.464466094067262,105.60584640593274C11.753537734864679,105.89491804673015 12.076970367456969,106.14744661531948 12.427521222862367,106.35777712856272L12.878679656440358,104.19163284355965M12.427521222862367,106.35777712856272C13.204598230739897,106.82402333328923 14.09378026969516,107.0703125 15,107.0703125L15,105.0703125C14.204350530481367,105.0703125 13.441288791784462,104.75424197890375 12.878679656440358,104.19163284355965M15,105.0703125L34.8125,105.0703125L34.8125,107.0703125L15,107.0703125"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M11.464466094067262,82.65977859406726C11.175394453269845,82.94885023486468 10.922865884680519,83.27228286745697 10.71253537143728,83.62283372286237L12.878679656440358,84.07399215644035M10.71253537143728,83.62283372286237C10.246289166710763,84.39991073073989 10,85.28909276969516 10,86.1953125L12,86.1953125C12,85.39966303048136 12.316070521096254,84.63660129178446 12.878679656440358,84.07399215644035M10,86.1953125L12,86.1953125L12,102.0703125L10,102.0703125M10,102.0703125C10,102.97653223030484 10.246289166710763,103.86571426926011 10.71253537143728,104.64279127713763L12.878679656440358,104.19163284355965C12.316070521096254,103.62902370821554 12,102.86596196951864 12,102.0703125M10.71253537143728,104.64279127713763C10.922865884680519,104.99334213254303 11.175394453269845,105.31677476513532 11.464466094067262,105.60584640593274L12.878679656440358,104.19163284355965"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M10,104.59375C10,101.83232625084604 12.238576250846032,99.59375 15,99.59375L27.8125,99.59375L27.8125,125.46875L15,125.46875C12.238576250846032,125.46875 10,123.23017374915396 10,120.46875"],["fill","rgba(255,0,0,0.3)"]]},{"type":"item","tagName":"path","props":[["d","M10,99.59375L27.8125,99.59375L27.8125,125.46875L10,125.46875L10,99.59375"],["fill","#FFF"],["filter","url(#karas-defs-0-2)"],["clip-path","url(#karas-defs-0-3)"]]},{"type":"item","tagName":"path","props":[["d","M10,99.59375L12,99.59375L12,101.59375L10,99.59375M12,99.59375L27.8125,99.59375L27.8125,101.59375L12,101.59375"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M10,125.46875L12,123.46875L12,125.46875L10,125.46875M12,123.46875L27.8125,123.46875L27.8125,125.46875L12,125.46875"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M10,117.9921875L20.90625,117.9921875C23.66767374915397,117.9921875 25.90625,120.23076375084604 25.90625,122.9921875L25.90625,138.8671875C25.90625,141.62861124915398 23.66767374915397,143.8671875 20.90625,143.8671875L10,143.8671875"],["fill","rgba(255,0,0,0.3)"]]},{"type":"item","tagName":"path","props":[["d","M10,117.9921875L25.90625,117.9921875L25.90625,143.8671875L10,143.8671875L10,117.9921875"],["fill","#FFF"],["filter","url(#karas-defs-0-4)"],["clip-path","url(#karas-defs-0-5)"]]},{"type":"item","tagName":"path","props":[["d","M10,117.9921875L20.90625,117.9921875L20.90625,119.9921875L10,119.9921875M20.90625,117.9921875C21.81246973030484,117.9921875 22.701651769260103,118.23847666671077 23.478728777137633,118.70472287143728L23.027570343559642,120.87086715644035C22.464961208215538,120.30825802109625 21.701899469518633,119.9921875 20.90625,119.9921875M23.478728777137633,118.70472287143728C23.82927963254303,118.91505338468052 24.15271226513532,119.16758195326985 24.441783905932738,119.45665359406726L23.027570343559642,120.87086715644035"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M24.441783905932738,119.45665359406726C24.730855546730155,119.74572523486468 24.98338411531948,120.06915786745697 25.19371462856272,120.41970872286237L23.027570343559642,120.87086715644035M25.19371462856272,120.41970872286237C25.659960833289237,121.19678573073989 25.90625,122.08596776969516 25.90625,122.9921875L23.90625,122.9921875C23.90625,122.19653803048136 23.590179478903746,121.43347629178446 23.027570343559642,120.87086715644035M23.90625,122.9921875L25.90625,122.9921875L25.90625,138.8671875L23.90625,138.8671875M25.90625,138.8671875C25.90625,139.77340723030483 25.659960833289237,140.6625892692601 25.19371462856272,141.43966627713763L23.027570343559642,140.98850784355963C23.590179478903746,140.42589870821553 23.90625,139.66283696951862 23.90625,138.8671875M25.19371462856272,141.43966627713763C24.98338411531948,141.79021713254303 24.730855546730155,142.11364976513534 24.441783905932738,142.40272140593274L23.027570343559642,140.98850784355963"],["fill","rgba(0,255,0,0.5)"]]},{"type":"item","tagName":"path","props":[["d","M10,141.8671875L20.90625,141.8671875L20.90625,143.8671875L10,143.8671875M20.90625,143.8671875C21.81246973030484,143.8671875 22.701651769260103,143.62089833328923 23.478728777137633,143.15465212856273L23.027570343559642,140.98850784355963C22.464961208215538,141.55111697890374 21.701899469518633,141.8671875 20.90625,141.8671875M23.478728777137633,143.15465212856273C23.82927963254303,142.9443216153195 24.15271226513532,142.69179304673014 24.441783905932738,142.40272140593274L23.027570343559642,140.98850784355963"],["fill","rgba(0,255,0,0.5)"]]}],"children":[{"type":"text","children":[{"type":"item","tagName":"text","props":[["x",17],["y",99.6796875],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"22"},{"type":"item","tagName":"text","props":[["x",10],["y",118.078125],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"22"},{"type":"item","tagName":"text","props":[["x",10],["y",136.4765625],["fill","rgba(0,0,0,1)"],["font-family","arial"],["font-weight",400],["font-style","normal"],["font-size","16px"]],"content":"2"}]}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom"}],"visibility":"visible","type":"dom","defs":[{"tagName":"filter","props":[["x",-1.0881612090680102],["y",-1.0434782608695652],["width",3.1763224181360203],["height",3.0869565217391304]],"children":[{"tagName":"feDropShadow","props":[["dx",0],["dy",0],["stdDeviation",2.5],["flood-color","rgba(0,0,255,1)"]]}],"id":0,"uuid":"karas-defs-0-0","index":0},{"tagName":"clipPath","children":[{"tagName":"path","props":[["d","M10,81.1953125L34.8125,81.1953125L34.8125,107.0703125L10,107.0703125L10,81.1953125M0,71.1953125L0,117.0703125L44.8125,117.0703125L44.8125,71.1953125L0,71.1953125"],["fill","#FFF"]]}],"id":1,"uuid":"karas-defs-0-1","index":1},{"tagName":"filter","props":[["x",-1.5157894736842106],["y",-1.0434782608695652],["width",4.031578947368422],["height",3.0869565217391304]],"children":[{"tagName":"feDropShadow","props":[["dx",0],["dy",0],["stdDeviation",2.5],["flood-color","rgba(0,0,255,1)"]]}],"id":2,"uuid":"karas-defs-0-2","index":2},{"tagName":"clipPath","children":[{"tagName":"path","props":[["d","M10,99.59375L27.8125,99.59375L27.8125,125.46875L10,125.46875L10,99.59375M0,89.59375L0,135.46875L37.8125,135.46875L37.8125,89.59375L0,89.59375"],["fill","#FFF"]]}],"id":3,"uuid":"karas-defs-0-3","index":3},{"tagName":"filter","props":[["x",-1.6974459724950883],["y",-1.0434782608695652],["width",4.394891944990176],["height",3.0869565217391304]],"children":[{"tagName":"feDropShadow","props":[["dx",0],["dy",0],["stdDeviation",2.5],["flood-color","rgba(0,0,255,1)"]]}],"id":4,"uuid":"karas-defs-0-4","index":4},{"tagName":"clipPath","children":[{"tagName":"path","props":[["d","M10,117.9921875L25.90625,117.9921875L25.90625,143.8671875L10,143.8671875L10,117.9921875M0,107.9921875L0,153.8671875L35.90625,153.8671875L35.90625,107.9921875L0,107.9921875"],["fill","#FFF"]]}],"id":5,"uuid":"karas-defs-0-5","index":5}]}')
      .end();
  }
};
