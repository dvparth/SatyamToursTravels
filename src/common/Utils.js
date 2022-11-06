export function removeLicenseError() {
    const el = document.querySelector(".MuiDataGrid-main");
    console.log("el", el);
    console.log("el.childNodes[2]", el.childNodes[2]);
    console.log("el.childNodes[2].innerText", el.childNodes[2].innerText);
    if (el) {
        //el.childNodes[2].innerText = '';
    }
}