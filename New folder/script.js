const sidebarbutton=document.getElementById("sidebar");
const navigation=document.querySelector(".navigation");

sidebarbutton.addEventListener("click",function(){
  navigation.classList.toggle("show");

  const expanded=sidebarbutton.getAttribute("aria-expanded")==="true";
sidebarbutton.setAttribute("aria-expanded",!expanded);

});

