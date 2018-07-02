// Get the modal
$(function() {
    var modal = document.getElementById("myImageModal");
    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var modalImg = document.getElementById("imageZoom");

    $('.close').onclick = function () {
        modal.style.display = "none";
    }

    $('.img-zoom').on('click', function(){
        modal.style.display = "block";
        modalImg.src = this.src;
    });

});
