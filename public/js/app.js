$(document).ready(function() {
  $("#version").html("v0.14");
  
  $("#searchbutton").click( function (e) {
    displayModal();
  });
  
  $("#searchfield").keydown( function (e) {
    if(e.keyCode == 13) {
      displayModal();
    }	
  });
  
  function displayModal() {
    $(  "#myModal").modal('show');

    $("#status").html("Searching...");
    $("#dialogtitle").html("Search for: "+$("#searchfield").val());
    $("#previous").hide();
    $("#next").hide();
    $.getJSON('/search/' + $("#searchfield").val() , function(data) {
      renderQueryResults(data);
    });
  }
  images = [];
  currentIndex = 0;
  $("#next").click( function(e) {
    currentIndex++;
    let maxImagesToRender = images.length - (currentIndex*4);
    let i;
    for(i = 0; i < maxImagesToRender; i++) {
      $(`#img${i}`).attr("src", images[i + (currentIndex*4)]);
      $(`#img${i}`).show(); 
    }
    //Hide the remaining input elements.
    for(; i <= 3; i++) {
      $(`#img${i}`).hide();
    }
    $("#previous").show();
    if(maxImagesToRender < 4) $(this).hide();
  });
  //[ url0, url1, url2, url3, url4, url5, url6, url7, url8, url9]
  $("#previous").click( function(e) {
    currentIndex--;
    for(let i = 0; i < 4; i++) {
      $(`#img${i}`).attr("src", images[i + (currentIndex*4)]);
      $(`#img${i}`).show();
    }
    $("#next").show();
    if(currentIndex == 0) $(this).hide();
  });

  function renderQueryResults(data) {
    images = [];
    if (data.error != undefined) {
      $("#status").html("Error: "+data.error);
    } else {
      currentIndex = 0;
      $("#status").html(""+data.num_results+" result(s)");
      let maxImagesToRender = (data.num_results >= 4)? 4: data.num_results;
      let i;
      for(i = 0; i < maxImagesToRender; i++) {
        console.log(data);
        images = data.results;
        $(`#img${i}`).attr("src", images[i]);
        
      }
      console.log("Current i: ", i);
      //Hide the remaining input elements.
      for(; i <= 3; i++) {
        $(`#img${i}`).hide();
      }
      
      if(data.num_results > 4) {
        $("#next").show();
      }
      
     }
   }
});
