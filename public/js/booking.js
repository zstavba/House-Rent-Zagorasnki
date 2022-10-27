import { Editor } from "https://esm.sh/@tiptap/core";
import StarterKit from "https://esm.sh/@tiptap/starter-kit";
import Document from 'https://esm.sh/@tiptap/extension-document'
import Paragraph from 'https://esm.sh/@tiptap/extension-paragraph'
import Text from 'https://esm.sh/@tiptap/extension-text'
import Heading from 'https://esm.sh/@tiptap/extension-heading';


$(document).ready(() => {

    let bookingData = new FormData();

    let dnevnaEditor = new Editor({
        element: document.querySelector('.dnevnaEditor'),
        extensions: [
          StarterKit,
          Document,
          Paragraph,
          Text,
        ],
        content: '<p>Vpišite podatke za dnevno sobo !</p>',
      })
      
      let kopalnicaEditor =  new Editor({
        element: document.querySelector('.kopalnicaEditor'),
        extensions: [
          StarterKit,
          Document,
          Paragraph,
          Text,
        ],
        content: '<p>Vpišite podatke za kopalnico !</p>',
      })
      
      let  outsideEditor =  new Editor({
        element: document.querySelector('.outsideEditor'),
        extensions: [
          StarterKit,
          Document,
          Paragraph,
          Text,
        ],
        content: '<p>Vpišite podatke za zunanje prostore !</p>',
      })
      
      let sobaEditor = new Editor({
        element: document.querySelector('.kitchenEditor'),
        extensions: [
          StarterKit,
          Document,
          Paragraph,
          Text,
        ],
        content: '<p>Vpišite podatke za opremo v kuhinji !</p>',
      })
      
      
      let descriptionEditor = new Editor({
        element: document.querySelector('.deInit'),
        extensions: [
          StarterKit,
          Document,
          Paragraph,
          Text,
        ],
        content: '<p>Vpišite podatke za opremo v kuhinji !</p>',
      })

    let toggleSwitch = (event, className = '') => {
        if($(event.currentTarget).hasClass('bg-gray-200')){
            $(event.currentTarget).removeClass('bg-gray-200');
            $(event.currentTarget).addClass('bg-indigo-600');
            $(className).removeClass('translate-x-0');
            $(className).addClass('translate-x-5');
       }else{
            $(event.currentTarget).removeClass('bg-indigo-600');
            $(event.currentTarget).addClass('bg-gray-200');
            $(className).removeClass('translate-x-5');
            $(className).addClass('translate-x-0');
       }
    }

    /* Setting the counters START  */
    let count = 0; 
    let setInputCountPlus = (inputClassName) => {
        count = count + 1;
        $(inputClassName).val(count);
    }


    let setInputCountMinus = (inputClassName) => {
        count = count - 1;
        if(count <= 0)
            $(inputClassName).val(0);

        $(inputClassName).val(count);
    }

    $('.k_set_plus').click(() => {
       setInputCountPlus('.apartment_livingroom_choutch');
    });

    $('.k_set_minus').click(() => {
        setInputCountMinus('.apartment_livingroom_choutch');
     });

     $('.amb_plus').click(() => {
        setInputCountPlus('.apartment_marriage_big');
     });
 
     $('.amb_minus').click(() => {
         setInputCountMinus('.apartment_marriage_big');
      });

      $('.zp_plus').click(() => {
        setInputCountPlus('.apartment_marriage');
     });
 
     $('.zp_minus').click(() => {
         setInputCountMinus('.apartment_marriage');
      });

      $('.ep_plus').click(() => {
        setInputCountPlus('.apartment_one_bed');
     });
 
     $('.ep_minus').click(() => {
         setInputCountMinus('.apartment_one_bed');
    });
    /* Setting the counters END  */
    


 
    $('.parking_spot').click((event) => {
        toggleSwitch(event,`.parking_spot span`);
        bookingData.append("parking_spot", JSON.stringify({
            approved: true,
            description: $('parking_spot_description').val()
        }));
    });

    $('.house_wifi').click((event) => {
        toggleSwitch(event,`.house_wifi span`);
        bookingData.append("apartment_wifi", JSON.stringify({
            approved: true,
        }));
    });

    $('.house_pets').click((event) => {
        toggleSwitch(event,`.house_pets span`);
        bookingData.append("apartment_house_pets", JSON.stringify({
            approved: true,
        }));
    });
    
    $('.house_invalid_people').click((event) => {
        toggleSwitch(event,`.house_invalid_people span`);
        bookingData.append("apartment_invalid_people", JSON.stringify({
            approved: true,
        }));
    });

    $('.createBooking').click(() => {
        
        for(var file of document.getElementById('rent_images').files){
            bookingData.append("files",file);
        }
        bookingData.append('apartment_title',$('.apartment_name').val());
        let full_adress = ` ${$('.apartment_town').val()}, ${$('.apartment_city').val()} ${$('.apartment_zip_code').val()} ,${$(".apartment_country option:selected").val()}`
        bookingData.append("apartment_full_adress", full_adress);
        bookingData.append("apartment_one_bed",$('.apartment_one_bed').val());
        bookingData.append("apartment_marriage",$(".apartment_marriage").val());
        bookingData.append("apartment_livingroom_choutch",$('.apartment_livingroom_choutch').val());
        bookingData.append("apartment_marriage_big",$('.apartment_marriage_big').val());
        bookingData.append("apartment_living_room_description",dnevnaEditor.getHTML());
        bookingData.append('apartment_bathroom_description',kopalnicaEditor.getHTML());
        bookingData.append('apartment_outerspace_description',outsideEditor.getHTML());
        bookingData.append("apartment_kitchen_descritpion",sobaEditor.getHTML());
        bookingData.append('apartment_advanced_description',descriptionEditor.getHTML());
        bookingData.append('apartment_price',$('.apartment_price').val())


        $.ajax({
            method: "POST",
            url: "/dashboard/booking/create",
            data: bookingData,
            cache:false,
            processData:false,
            contentType:false,
            error: (response) => {
                $('.errorNotification').fadeIn();
                $('.error_message').html(response.responseJSON.message);

            }
        }).done((data) => {
            console.log(data);
        });
        
    });

    $('.openBookingModal').click(() => {
        $('.bookingModal').removeClass("opacity-0");
        $('.bookingModal').addClass("opacity-100");
        $('.bookingModal').addClass("z-10");
        $('.hidden-opacity').addClass('transition-opacity');
        $('.hidden-opacity').removeClass('hidden');

        $('.bookingModal .bm-content').removeClass("opacity-0");
        $('.bookingModal .bm-content').addClass("opacity-100");
    })


    
    $('.closeBookingModal').click(() => {
      $('.bookingModal').addClass("opacity-0");
      $('.bookingModal').removeClass("opacity-100");
      $('.bookingModal').removeClass("z-10");
      $('.hidden-opacity').removeClass('transition-opacity');
      $('.hidden-opacity').addClass('hidden');

      $('.bookingModal .bm-content').addClass("opacity-0");
      $('.bookingModal .bm-content').removeClass("opacity-100");
  })

});