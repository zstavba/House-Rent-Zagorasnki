
$(document).ready(() => {
    let formData = new FormData();
    let dataForm = new FormData();

    getImage = (event) => {
        event.preventDefault();
        let files = event.target.files[0];
        let fileReader = new FileReader();

        fileReader.onload = ((f) => {
            return (e) => {
                $('.image_preview').attr("src",e.target.result);
                $('.image_preview').fadeIn();
            }
        })(files);

        formData.append("file",files);

        fileReader.readAsDataURL(files);
    };

    $('.saveImage').click((event) => {
        event.preventDefault();
        $.ajax({
            method:"POST",
            url: "/dashboard/user/update/profile",
            data: formData,
            cache:false,
            processData:false,
            contentType:false,
            error: (result) => {
                $('.errorNotification').fadeIn();
                $('.error_message').html(result.responseJSON.message);
            }
        }).done(
            (result) => {
                console.log(result);
            }
        );
    });

    $('.saveData').click((event) => {
        dataForm.append("first_name",$('.first_name').val());
        dataForm.append("last_name",$('.last_name').val());
        dataForm.append("email",$('.email').val());
        dataForm.append("sex",$('.sex option:selected').val());

        $.ajax({
            method:"POST",
            url: "/dashboard/user/update/information",
            data: Object.fromEntries(dataForm),
            processData: true,
            "content-type": "application/json",
            dataType: "json",
            error: (result) => {
                $('.errorNotification').fadeIn();
                $('.error_message').html(result.responseJSON.message);
            }
        }).done(
            (result) => {
                $('.successMessage').fadeIn();
                $('.successMessage .sm-text').html(result.message);

                setTimeout(() => {
                    $('.successMessage').fadeOut();
                    $('.successMessage .sm-text').html("");
    
                },4000);
            }
        );

    });

});