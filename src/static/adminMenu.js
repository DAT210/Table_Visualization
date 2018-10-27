
$('form .submit-link').on({
    click: function (event) {
        event.preventDefault();
        $(this).closest('form').submit();
    }
});


$("#load-setup").click(function() {
    location.reload();
});


$("#create-new").click(function() {
    $(".addtable-box, .save-new-box, .update-box, .delete-box, .load-box, .removetable-box, .addwalls-box").css({
       'visibility' : 'hidden'
});
    $(".create-box").css({
       'visibility' : 'visible'
});
});


$("#save-new").click(function() {
    $(".addtable-box, .load-box, .delete-box, .create-box, .removetable-box, .addwalls-box, .update-box").css({
       'visibility' : 'hidden'
});
    $(".save-new-box").css({
       'visibility' : 'visible'
});
});



$("#update-current").click(function() {
    $(".addtable-box, .load-box, .delete-box, .create-box, .removetable-box, .addwalls-box, .save-new-box").css({
       'visibility' : 'hidden'
});
    $(".update-box").css({
       'visibility' : 'visible'
});
});



$("#delete").click(function() {
    $(".addtable-box, .load-box, .save-new-box, .update-box, .create-box, .removetable-box, .addwalls-box").css({
       'visibility' : 'hidden'
});
    $(".delete-box").css({
       'visibility' : 'visible'
});
});

$("#add-walls").click(function() {
    $(".addtable-box, .save-new-box, .update-box, .delete-box, .create-box, .removetable-box, .load-box").css({
       'visibility' : 'hidden'
});
    $(".addwalls-box").css({
       'visibility' : 'visible'
});
});

$("#add-tables").click(function() {
    $(".load-box, .save-new-box, .update-box, .delete-box, .create-box, .removetable-box, .addwalls-box").css({
       'visibility' : 'hidden'
});

    $(".addtable-box").css({
       'visibility' : 'visible'
});
});

$("#remove-tables").click(function() {
    $(".addtable-box, .save-new-box, .update-box, .delete-box, .create-box, .load-box, .addwalls-box").css({
       'visibility' : 'hidden'
});
    $(".removetable-box").css({
       'visibility' : 'visible'
});
});







var x, i, j, selElmnt, a, b, c;
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < selElmnt.length; j++) {
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
  });
}
function closeAllSelect(elmnt) {
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
document.addEventListener("click", closeAllSelect);




var widthSlider = document.getElementById("tableWidth");
var heightSlider = document.getElementById("tableHeight");
var output = document.getElementById("demo");

// Update the current slider value (each time you drag the slider handle)
widthSlider.oninput = function() {
   document.getElementById("box1").style.width = this.value + "px";
}

heightSlider.oninput = function() {
   document.getElementById("box1").style.height = this.value + "px";
}