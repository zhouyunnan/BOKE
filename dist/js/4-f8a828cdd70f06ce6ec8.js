(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{49:function(t,e,a){},55:function(t,e,a){"use strict";var s=a(49);a.n(s).a},64:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"page_"},[a("avue-form",{ref:"formData",attrs:{option:t.option},model:{value:t.obj,callback:function(e){t.obj=e},expression:"obj"}}),t._v(" "),a("div",{staticClass:"fbw"},[a("avue-ueditor",{attrs:{upload:t.upload},model:{value:t.text,callback:function(e){t.text=e},expression:"text"}})],1),t._v(" "),a("div",{staticClass:"btn"},[a("el-button",{attrs:{type:"primary",size:"medium"},on:{click:function(e){return t.save()}}},[t._v("发表")])],1)],1)};s._withStripped=!0;var i={data:function(){return{lms:[],label:[],obj:{show:"1"},text:"",upload:{action:"/app.php/home/UploadImg/index",props:{res:"data",name:"label",url:"value"}}}},created:function(){this.getlm(),this.getlabel()},computed:{option:function(){return{emptyBtn:!1,enter:!1,submitBtn:!1,column:[{label:"文章标题",prop:"name",span:12,rules:[{required:!0,message:"请输入姓名",trigger:"blur"}]},{label:"栏目",prop:"type",span:12,type:"select",dicData:this.lms,rules:[{required:!0,message:"请选择栏目",trigger:"blur"}]},{label:"标签",prop:"label",span:12,type:"select",drag:!0,multiple:!0,dicData:this.label},{label:"是否隐藏",prop:"show",span:12,type:"switch",dicData:[{label:"否",value:"1"},{label:"是",value:"0"}]}]}}},methods:{save:function(){var t=this,e=this.obj.label.length>0?this.obj.label.join(","):"",a=this.obj,s=a.show,i=a.name,n=a.type,l=this.text;if(/\S/.test(i))if(/\S/.test(n)){var r=this;this.$confirm("确认发布吗?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){r.$httpajax.post("/app.php/home/Ac/save",t.$qs.stringify({label:e,show:s,name:i,type:n,text:l})).then((function(t){var e=t.data;e.result?(r.$message({message:e.msg,type:"success"}),r.$refs.formData.resetFields(),r.text=""):r.$message.error(e.msg)})).catch((function(t){r.$message.error("网络错误")}))})).catch((function(){}))}else this.$message.error("请选择栏目");else this.$message.error("请填写文章标题")},getlm:function(){var t=this;this.data=[],this.$httpajax.post("/app.php/home/cloumn/getlist",this.$qs.stringify({type:1})).then((function(e){var a=e.data;if(a.result){for(var s=[],i=a.data,n=0;n<i.length;n++)s.push({label:i[n].name,value:i[n].id});t.lms=s}})).catch((function(){t.$message.error("网络错误")}))},getlabel:function(){var t=this;this.$httpajax.post("/app.php/home/label/getlist",this.$qs.stringify({})).then((function(e){var a=e.data;if(a.result){for(var s=[],i=a.data,n=0;n<i.length;n++)s.push({label:i[n].name,value:i[n].id});t.label=s}})).catch((function(){t.$message.error("网络错误")}))}}},n=(a(55),a(3)),l=Object(n.a)(i,s,[],!1,null,"7622089c",null);l.options.__file="src/views/active/add.vue";e.default=l.exports}}]);
//# sourceMappingURL=4-f8a828cdd70f06ce6ec8.js.map