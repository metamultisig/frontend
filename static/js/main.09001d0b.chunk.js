(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{252:function(e,t,a){e.exports=a(554)},257:function(e,t,a){},260:function(e,t,a){},261:function(e,t){},269:function(e,t){},271:function(e,t){},303:function(e,t){},386:function(e,t){},388:function(e,t){},554:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(34),i=a.n(l),s=(a(257),a(36)),o=a.n(s),c=a(48),u=a(22),h=a(24),d=a(26),m=a(25),p=a(27),g=a(107),v=a(54),b=a(248),f=a.n(b),y=a(247),w=a.n(y),O=a(144),E=a.n(O),j=a(146),C=a.n(j),k=a(145),S=a.n(k),x=a(250),T=a.n(x),W=a(246),N=a.n(W),A=a(143),D=a.n(A),K=a(72),I=a.n(K),L=a(55),R=a.n(L),B=a(56),F=a.n(B),M=a(57),q=a.n(M),U=a(251),P=a.n(U),$=a(249),J=a.n($),z=a(29),G=a.n(z),H=a(17),V=(a(260),a(42)),Q=a(105),X=function e(t){var a=this;Object(u.a)(this,e),this.provider=void 0,this.event=void 0,this.ownersWatched=void 0,this.walletsWatched=void 0,this.wallets=void 0,this.addOwnerWatch=function(e,t){a.ownersWatched[Object(V.getAddress)(e)]=t,a.provider.getLogs({fromBlock:5473234,toBlock:"latest",topics:a.event.encodeTopics([e])}).then(a.processKeyholderChanges)},this.removeOwnerWatch=function(e){delete a.ownersWatched[Object(V.getAddress)(e)]},this.addMultisigWatch=function(e,t){a.walletsWatched[Object(V.getAddress)(e)]=t,a.provider.getLogs({fromBlock:5473234,toBlock:"latest",topics:a.event.encodeTopics([]),address:e}).then(a.processKeyholderChanges)},this.removeMultisigWatch=function(e){delete a.ownersWatched[Object(V.getAddress)(e)]},this.processKeyholderChanges=function(e){var t=!0,n=!1,r=void 0;try{for(var l,i=e[Symbol.iterator]();!(t=(l=i.next()).done);t=!0){var s=l.value,o=Object(V.getAddress)(s.address),c=a.wallets[o];void 0===c&&(c=a.wallets[o]={keyholders:{}});var u=a.event.decode(s.data,s.topics),h=Object(V.getAddress)(u.keyholder);0==u.weight.toNumber()?delete c.keyholders[h]:c.keyholders[h]=u.weight.toNumber(),a.walletsWatched[o]&&a.walletsWatched[o](c.keyholders),a.ownersWatched[h]&&a.ownersWatched[h](a.getOwnedWallets(h))}}catch(d){n=!0,r=d}finally{try{t||null==i.return||i.return()}finally{if(n)throw r}}},this.getOwnedWallets=function(e){for(var t={},n=0,r=Object.keys(a.wallets);n<r.length;n++){var l=r[n],i=a.wallets[l];void 0!==i.keyholders[e]&&(t[l]=i.keyholders[e])}return t},this.provider=t,this.ownersWatched={},this.walletsWatched={},this.wallets={};var n=new v.ethers.utils.Interface(Array.from(Q.a));this.event=n.events.KeyholderChanged},Y=a(49),Z=a.n(Y),_=a(106),ee=a.n(_),te=a(46),ae=a.n(te),ne=a(243),re=a.n(ne),le=a(244),ie=a.n(le),se=a(245),oe=a.n(se),ce=a(110),ue=a.n(ce),he=a(58),de=a.n(he),me=a(242),pe=a.n(me),ge=a(238),ve=a.n(ge),be=a(239),fe=a.n(be),ye=a(108),we=a.n(ye),Oe=a(142),Ee=a.n(Oe),je=a(109),Ce=a.n(je),ke=a(241),Se=a.n(ke),xe=a(240),Te=a.n(xe),We=a(18),Ne=a(47),Ae=a.n(Ne),De=a(236),Ke=a.n(De),Ie=/^0x[0-9a-fA-f]{64}$/,Le=function(e){function t(e){var a;return Object(u.a)(this,t),(a=Object(d.a)(this,Object(m.a)(t).call(this,e))).onChange=a.onChange.bind(Object(We.a)(Object(We.a)(a))),a}return Object(p.a)(t,e),Object(h.a)(t,[{key:"onChange",value:function(e){if(this.props.onChange){var t="0x"+e.target.value;this.props.onChange(t,Ie.test(t))}}},{key:"render",value:function(){var e=this.props,t=e.label,a=e.classes;return r.a.createElement(Ae.a,{label:t,className:a.textField,onChange:this.onChange,error:!Ie.test(this.props.value||""),value:(this.props.value||"").replace(/^0x/,""),InputProps:{startAdornment:r.a.createElement(Ke.a,{position:"start"},"0x")},placeholder:"(32 bytes)"})}}]),t}(n.Component),Re=Object(H.withStyles)(function(e){return Object(H.createStyles)({textField:{marginLeft:e.spacing.unit,marginRight:e.spacing.unit}})})(Le),Be=/^[1-9][0-9]*$/,Fe=/^-?[1-9][0-9]*$/,Me=function(e){function t(e){var a;return Object(u.a)(this,t),(a=Object(d.a)(this,Object(m.a)(t).call(this,e))).onChange=a.onChange.bind(Object(We.a)(Object(We.a)(a))),a}return Object(p.a)(t,e),Object(h.a)(t,[{key:"onChange",value:function(e){if(this.props.onChange){var t=e.target.value;(this.props.signed?Fe.test(t):Be.test(t))||""!=t.trim()?this.props.onChange(Object(V.bigNumberify)(t),!0):this.props.onChange(void 0,!0)}}},{key:"render",value:function(){var e=this.props,t=e.label,a=e.value,n=e.classes;return r.a.createElement(Ae.a,{label:t,className:n.textField,onChange:this.onChange,type:"number",value:null==a?"":a.toString(),error:null==a,placeholder:this.props.signed?"(Integer)":"(Unsigned Integer)"})}}]),t}(n.Component),qe=Object(H.withStyles)(function(e){return Object(H.createStyles)({textField:{marginLeft:e.spacing.unit,marginRight:e.spacing.unit}})})(Me),Ue=/^0x[0-9a-fA-F]{40}$/,Pe=function(e){function t(e){var a;return Object(u.a)(this,t),(a=Object(d.a)(this,Object(m.a)(t).call(this,e))).timerId=void 0,a.onChange=a.onChange.bind(Object(We.a)(Object(We.a)(a))),a.tryResolveName=a.tryResolveName.bind(Object(We.a)(Object(We.a)(a))),a.state={value:e.value||"",valid:void 0!==e.value&&Ue.test(e.value)},e.value&&e.value.includes(".")&&!e.value.endsWith(".")&&(a.timerId=setTimeout(a.tryResolveName,200)),a}return Object(p.a)(t,e),Object(h.a)(t,[{key:"onChange",value:function(e){if(e.target.value){var t=e.target.value,a=Ue.test(e.target.value);this.props.onChange&&this.props.onChange(t,a),t.includes(".")&&!t.endsWith(".")&&(this.timerId&&(clearTimeout(this.timerId),this.timerId=void 0),this.timerId=setTimeout(this.tryResolveName,200)),this.setState({value:t,valid:a})}}},{key:"tryResolveName",value:function(){var e=Object(c.a)(o.a.mark(function e(){var t;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.props.provider.resolveName(this.state.value);case 2:(t=e.sent)&&(this.setState({valid:!0}),this.props.onChange&&this.props.onChange(t,!0,this.state.value));case 4:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"componentWillUnmount",value:function(){this.timerId&&clearTimeout(this.timerId)}},{key:"render",value:function(){return r.a.createElement(Ae.a,{onChange:this.onChange,label:this.props.label,value:this.state.value,error:!this.state.valid,placeholder:"name.eth or 0x..."})}}]),t}(n.Component),$e=function(e){function t(e){var a;return Object(u.a)(this,t),(a=Object(d.a)(this,Object(m.a)(t).call(this,e))).onChange=a.onChange.bind(Object(We.a)(Object(We.a)(a))),a}return Object(p.a)(t,e),Object(h.a)(t,[{key:"onChange",value:function(e){this.props.onChange&&this.props.onChange(e.target.value,!0)}},{key:"render",value:function(){var e=this.props,t=e.label,a=e.value,n=e.classes;return r.a.createElement(Ae.a,{label:t,className:n.textField,placeholder:"(String)",onChange:this.onChange,value:a||""})}}]),t}(n.Component),Je=Object(H.withStyles)(function(e){return Object(H.createStyles)({textField:{marginLeft:e.spacing.unit,marginRight:e.spacing.unit}})})($e),ze=a(141),Ge=a.n(ze),He=a(140),Ve=a.n(He),Qe=a(84),Xe=a.n(Qe),Ye=function(e){function t(e){var a;return Object(u.a)(this,t),a=Object(d.a)(this,Object(m.a)(t).call(this,e)),e.onChange&&e.onChange(e.value||new Uint8Array,!0),a.onChange=a.onChange.bind(Object(We.a)(Object(We.a)(a))),a}return Object(p.a)(t,e),Object(h.a)(t,[{key:"onChange",value:function(e){this.props.onChange&&this.props.onChange((new TextEncoder).encode(e.target.value),!0)}},{key:"render",value:function(){var e=this.props,t=e.label,a=e.value,n=e.classes,l=null==a?"":(new TextDecoder).decode(a);return r.a.createElement(Ge.a,{className:n.formControl},r.a.createElement(Ve.a,{htmlFor:"component-simple"},t),r.a.createElement(Xe.a,{id:"component-simple",placeholder:"(Bytes)",onChange:this.onChange,value:l}))}}]),t}(n.Component),Ze=Object(H.withStyles)(function(e){return Object(H.createStyles)({formControl:{marginLeft:e.spacing.unit,marginRight:e.spacing.unit}})})(Ye),_e=function(e){function t(){return Object(u.a)(this,t),Object(d.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){var e=this.props,t=e.provider,a=e.label,n=e.type,l=e.value,i=e.onChange;e.classes;switch(n){case"bytes32":return r.a.createElement(Re,{label:a,onChange:i,value:l});case"uint256":return r.a.createElement(qe,{label:a,signed:!0,onChange:i,value:l});case"int256":return r.a.createElement(qe,{label:a,signed:!1,onChange:i,value:l});case"address":return r.a.createElement(Pe,{label:a,provider:t,onChange:i,value:l});case"bytes":return r.a.createElement(Ze,{label:a,onChange:i,value:l});case"string":return r.a.createElement(Je,{label:a,onChange:i,value:l});default:return r.a.createElement("span",null,"Unsupported type ",n," for ",a)}}}]),t}(n.Component),et=Object(H.withStyles)(function(e){return Object(H.createStyles)({textField:{marginLeft:e.spacing.unit,marginRight:e.spacing.unit}})})(_e),tt=a(237),at=a.n(tt),nt=function(e){function t(e){var a;return Object(u.a)(this,t),(a=Object(d.a)(this,Object(m.a)(t).call(this,e))).state={fields:Array(e.abi.inputs.length).fill({value:null,valid:!1})},a.onChange=a.onChange.bind(Object(We.a)(Object(We.a)(a))),a.onSubmit=a.onSubmit.bind(Object(We.a)(Object(We.a)(a))),a}return Object(p.a)(t,e),Object(h.a)(t,[{key:"onChange",value:function(e,t,a){var n=this.state.fields;n[e]={value:t,valid:a},this.setState({fields:n})}},{key:"onSubmit",value:function(e){this.props.onSubmit&&this.props.onSubmit(this.state.fields.map(function(e){return e.value}))}},{key:"render",value:function(){var e=this,t=this.props,a=t.abi,n=t.classes,l=t.provider,i=a.inputs.map(function(t,a){return r.a.createElement(et,{provider:l,key:t.name,label:t.name,type:t.type,value:e.state.fields[a].value,onChange:function(t,n){return e.onChange(a,t,n)}})});return r.a.createElement("div",null,i,r.a.createElement(at.a,{variant:"contained",className:n.button,color:"primary",disabled:!this.state.fields.reduce(function(e,t){return e&&t.valid},!0),onClick:this.onSubmit},"Submit"))}}]),t}(n.Component),rt=Object(H.withStyles)(function(e){return Object(H.createStyles)({textField:{marginLeft:e.spacing.unit,marginRight:e.spacing.unit},button:{margin:e.spacing.unit}})})(nt),lt=function(e){function t(e){var a;return Object(u.a)(this,t),(a=Object(d.a)(this,Object(m.a)(t).call(this,e))).onNewTxClick=function(e){a.setState({showTxTypeDialog:!0})},a.onNewTxClose=function(e){a.setState({showTxTypeDialog:!1})},a.onAddKeyholderClick=function(e){a.setState({showTxTypeDialog:!1,showAddKeyholderDialog:!0})},a.onAddKeyholderClose=function(e){a.setState({showAddKeyholderDialog:!1})},a.onSetThresholdClick=function(e){a.setState({showTxTypeDialog:!1,showSetThresholdDialog:!0})},a.onSetThresholdClose=function(e){a.setState({showSetThresholdDialog:!1})},a.onAddKeyholder=function(){var e=Object(c.a)(o.a.mark(function e(t){var n,r,l,i;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a.setState({showAddKeyholderDialog:!1}),n=a.props.contract.interface.functions.setKeyholderWeight,r=n.encode(t),e.next=5,a.props.contract.nextNonce();case 5:return l=e.sent,e.next=8,a.props.contract.submit(a.props.contract.address,0,r,l,[]);case 8:i=e.sent,a.setState({lastTxId:i.hash});case 10:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),a.onSetThreshold=function(e){},a.closeTxSnackbar=function(e,t){"clickaway"!=t&&a.setState({lastTxId:void 0})},a.state={showTxTypeDialog:!1,showAddKeyholderDialog:!1,showSetThresholdDialog:!1},a}return Object(p.a)(t,e),Object(h.a)(t,[{key:"componentDidMount",value:function(){}},{key:"componentWillUnmount",value:function(){}},{key:"render",value:function(){var e=this.props,t=e.classes,a=e.contract;return r.a.createElement(r.a.Fragment,null,r.a.createElement(we.a,{open:this.state.showTxTypeDialog,onClose:this.onNewTxClose,"aria-labelledby":"txtype-title"},r.a.createElement(Ce.a,{id:"txtype-title"},"Select Transaction Type"),r.a.createElement("div",null,r.a.createElement(I.a,null,r.a.createElement(R.a,{button:!0,onClick:this.onAddKeyholderClick,key:"addKeyholder"},r.a.createElement(F.a,null,r.a.createElement(ve.a,null)),r.a.createElement(q.a,{primary:"Add Keyholder"})),r.a.createElement(R.a,{button:!0,onClick:this.onSetThresholdClick,key:"setThreshold"},r.a.createElement(F.a,null,r.a.createElement(fe.a,null)),r.a.createElement(q.a,{primary:"Set Signing Threshold"}))))),r.a.createElement(we.a,{open:this.state.showAddKeyholderDialog,onClose:this.onAddKeyholderClose,"aria-labelledby":"addkeyholder-title"},r.a.createElement(Ce.a,{id:"addkeyholder-title"},"Add a Keyholder"),r.a.createElement(Ee.a,null,r.a.createElement(rt,{provider:this.props.provider,abi:a.interface.functions.setKeyholderWeight,onSubmit:this.onAddKeyholder}))),r.a.createElement(we.a,{open:this.state.showSetThresholdDialog,onClose:this.onSetThresholdClose,"aria-labelledby":"setthreshold-title"},r.a.createElement(Ce.a,{id:"setthreshold-title"},"Set Signing Threshold"),r.a.createElement(Ee.a,null,r.a.createElement(rt,{provider:this.props.provider,abi:a.interface.functions.setThreshold,onSubmit:this.onSetThreshold}))),r.a.createElement(Te.a,{anchorOrigin:{vertical:"bottom",horizontal:"left"},open:void 0!==this.state.lastTxId,autoHideDuration:6e3,onClose:this.closeTxSnackbar,ContentProps:{"aria-describedby":"message-id"},message:r.a.createElement("span",{id:"message-id"},"Transaction ",r.a.createElement(ee.a,{href:"https://etherscan.io/tx/"+this.state.lastTxId},this.state.lastTxId)," sent")}),r.a.createElement(Se.a,{color:"primary",onClick:this.onNewTxClick,"aria-label":"New Transaction",className:t.fab},r.a.createElement(pe.a,null)))}}]),t}(n.Component),it=Object(H.withStyles)(function(e){return Object(H.createStyles)({fab:{margin:e.spacing.unit,position:"absolute",bottom:2*e.spacing.unit,right:2*e.spacing.unit}})})(lt),st=function(e){function t(e){var a;return Object(u.a)(this,t),(a=Object(d.a)(this,Object(m.a)(t).call(this,e))).watcher=void 0,a.contract=void 0,a.state={balance:null,threshold:null,keyholders:null,showTxTypeDialog:!1,showAddKeyholderDialog:!1,showSetThresholdDialog:!1},a.watcher=new X(a.props.provider),a.contract=new v.ethers.Contract(a.props.wallet.address,Array.from(Q.a),a.props.provider.getSigner()),a}return Object(p.a)(t,e),Object(h.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.props.provider.getBalance(this.props.wallet.address).then(function(t){e.setState({balance:t})}),this.watcher.addMultisigWatch(this.props.wallet.address,function(t){e.setState({keyholders:t})}),this.contract.threshold().then(function(t){e.setState({threshold:t.toNumber()})})}},{key:"componentWillUnmount",value:function(){this.watcher.removeMultisigWatch(this.props.wallet.address)}},{key:"render",value:function(){var e=this.props,t=e.classes,a=(e.wallet,[r.a.createElement(ue.a,{key:"loading"},r.a.createElement(de.a,null,"Loading..."),r.a.createElement(de.a,null))]);if(null!==this.state.keyholders){var n=this.state.keyholders;a=Object.keys(n).map(function(e){return r.a.createElement(ue.a,{key:e},r.a.createElement(de.a,null,e),r.a.createElement(de.a,null,n[e]))})}return r.a.createElement(r.a.Fragment,null,r.a.createElement(it,{provider:this.props.provider,contract:this.contract}),r.a.createElement(G.a,{variant:"h6"},"Overview"),r.a.createElement(ae.a,{className:t.paper},r.a.createElement(Z.a,{container:!0,spacing:24,className:t.grid},r.a.createElement(Z.a,{item:!0,xs:6},r.a.createElement(G.a,null,"Address")),r.a.createElement(Z.a,{item:!0,xs:6},r.a.createElement(G.a,null,r.a.createElement(ee.a,{href:"https://etherscan.io/address/"+this.props.wallet.address},this.props.wallet.address))),r.a.createElement(Z.a,{item:!0,xs:6},r.a.createElement(G.a,null,"Balance")),r.a.createElement(Z.a,{item:!0,xs:6},r.a.createElement(G.a,null,null==this.state.balance?"Loading":v.ethers.utils.formatEther(this.state.balance)+" ether")),r.a.createElement(Z.a,{item:!0,xs:6},r.a.createElement(G.a,null,"Signing Threshold")),r.a.createElement(Z.a,{item:!0,xs:6},r.a.createElement(G.a,null,null==this.state.threshold?"Loading":this.state.threshold)))),r.a.createElement(G.a,{variant:"h6"},"Keyholders"),r.a.createElement(ae.a,{className:t.paper},r.a.createElement(re.a,{className:t.table},r.a.createElement(ie.a,null,r.a.createElement(ue.a,null,r.a.createElement(de.a,null,"Address"),r.a.createElement(de.a,null,"Weight"))),r.a.createElement(oe.a,null,a))))}}]),t}(n.Component),ot=Object(H.withStyles)(function(e){return Object(H.createStyles)({textField:{marginLeft:e.spacing.unit,marginRight:e.spacing.unit},button:{margin:e.spacing.unit},paper:{padding:e.spacing.unit,margin:e.spacing.unit,marginBottom:3*e.spacing.unit},grid:{padding:2*e.spacing.unit},table:{minwidth:700}})})(st),ct=function(e){function t(e){var a;return Object(u.a)(this,t),(a=Object(d.a)(this,Object(m.a)(t).call(this,e))).provider=void 0,a.watcher=void 0,a.address=void 0,a.onWalletListChange=function(){var e=Object(c.a)(o.a.mark(function e(t){var n,r;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=a.provider,e.next=3,Promise.all(Object.keys(t).map(function(){var e=Object(c.a)(o.a.mark(function e(a){var r;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.lookupAddress(a);case 2:return null==(r=e.sent)&&(r=a.slice(0,6)+"\u2026"+a.slice(a.length-4)),e.abrupt("return",{title:r,address:a,weight:t[a]});case 5:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}()));case 3:r=e.sent,a.setState({wallets:r});case 5:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),a.onWalletClick=function(e){return function(t){a.setState({selectedWallet:e})}},a.handleDrawerToggle=function(){a.setState(function(e){return{mobileOpen:!e.mobileOpen}})},a.provider=new v.ethers.providers.Web3Provider(ethereum),a.state={mobileOpen:!1,wallets:null,selectedWallet:null},a.watcher=new X(a.provider),a}return Object(p.a)(t,e),Object(h.a)(t,[{key:"componentDidMount",value:function(){var e=Object(c.a)(o.a.mark(function e(){var t;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ethereum.enable();case 2:(t=e.sent).length>0&&this.watcher.addOwnerWatch(t[0],this.onWalletListChange);case 4:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"componentWillUnmount",value:function(){this.address&&this.watcher.removeOwnerWatch(this.address)}},{key:"render",value:function(){var e=this,t=this.props,a=t.classes,n=t.theme,l=[r.a.createElement(R.a,{button:!0,disabled:!0,key:"loading"},r.a.createElement(F.a,null,r.a.createElement(D.a,null)),r.a.createElement(q.a,null,"Loading..."))];null!==this.state.wallets&&(l=this.state.wallets.map(function(t){return r.a.createElement(R.a,{button:!0,key:t.address,onClick:e.onWalletClick(t)},r.a.createElement(F.a,null,r.a.createElement(D.a,null)),r.a.createElement(q.a,null,t.title))}));var i=r.a.createElement("div",null,r.a.createElement("div",{className:a.toolbar}),r.a.createElement(E.a,null),r.a.createElement(I.a,null,l),l.length>0?r.a.createElement(E.a,null):"",r.a.createElement(I.a,null,r.a.createElement(R.a,{button:!0,key:"new"},r.a.createElement(F.a,null,r.a.createElement(N.a,null)),r.a.createElement(q.a,null,"New Multisig")))),s=r.a.createElement(G.a,{paragraph:!0},"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.");return null!==this.state.selectedWallet&&(s=r.a.createElement(ot,{provider:this.provider,wallet:this.state.selectedWallet})),r.a.createElement("div",{className:a.root},r.a.createElement(w.a,null),r.a.createElement(f.a,{position:"fixed",className:a.appBar},r.a.createElement(J.a,null,r.a.createElement(T.a,{color:"inherit","aria-label":"Open drawer",onClick:this.handleDrawerToggle,className:a.menuButton},r.a.createElement(P.a,null)),r.a.createElement(G.a,{variant:"h6",color:"inherit",noWrap:!0},null==this.state.selectedWallet?"Meta Multisig":"Multisig "+this.state.selectedWallet.title))),r.a.createElement("nav",{className:a.drawer},r.a.createElement(S.a,{smUp:!0,implementation:"css"},r.a.createElement(C.a,{variant:"temporary",anchor:"rtl"===n.direction?"right":"left",open:this.state.mobileOpen,onClose:this.handleDrawerToggle,classes:{paper:a.drawerPaper}},i)),r.a.createElement(S.a,{xsDown:!0,implementation:"css"},r.a.createElement(C.a,{classes:{paper:a.drawerPaper},variant:"permanent",open:!0},i))),r.a.createElement("main",{className:a.content},r.a.createElement("div",{className:a.toolbar}),s))}}]),t}(n.Component),ut=Object(H.withStyles)(function(e){return Object(H.createStyles)({root:{display:"flex"},drawer:Object(g.a)({},e.breakpoints.up("sm"),{width:240,flexShrink:0}),appBar:Object(g.a)({marginLeft:240},e.breakpoints.up("sm"),{width:"calc(100% - ".concat(240,"px)")}),menuButton:Object(g.a)({marginRight:20},e.breakpoints.up("sm"),{display:"none"}),toolbar:e.mixins.toolbar,drawerPaper:{width:240},content:{flexGrow:1,padding:3*e.spacing.unit}})},{withTheme:!0})(ct);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(ut,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[252,1,2]]]);
//# sourceMappingURL=main.09001d0b.chunk.js.map