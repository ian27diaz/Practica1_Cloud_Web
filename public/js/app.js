//Variable que guarda las imagenes
//y el index para saber en que paginacion vas.
images = [];
currentIndex = 0;

$(document).ready(function () {
  $("#version").html("v0.14");

  $("#searchbutton").click(function (e) {
    displayModal();
  });

  $("#searchfield").keydown(function (e) {
    if (e.keyCode == 13) {
      displayModal();
    }
  });

  function displayModal() {
    $("#myModal").modal('show');

    $("#status").html("Searching...");
    $("#dialogtitle").html("Search for: " + $("#searchfield").val());
    $("#previous").hide();
    $("#next").hide();
    $.getJSON('/search/' + $("#searchfield").val(), function (data) {
      renderQueryResults(data);
    });
  }
  $("#next").click(function (e) {
    //increment the pagination index
    currentIndex++;
    //get maximum images to render in the next page, in case 
    //you only need to render less than 4 images.
    let maxImagesToRender = images.length - (currentIndex * 4);
    let i;
    //Render all the possible images.
    for (i = 0; i < maxImagesToRender; i++) {
      $(`#img${i}`).attr("src", images[i + (currentIndex * 4)]);
      $(`#img${i}`).show();
    }
    //Esconde los <img> que no se necesitan.
    for (; i <= 3; i++) {
      $(`#img${i}`).hide();
    }
    $("#previous").show();
    //Si ya no hay mas de cuatro significa que no debe de haber next.
    if (maxImagesToRender < 4) $(this).hide();
  });

  //Se renderizan las siguientes cuatro imagenes.
  $("#previous").click(function (e) {
    currentIndex--;
    for (let i = 0; i < 4; i++) {
      $(`#img${i}`).attr("src", images[i + (currentIndex * 4)]);
      $(`#img${i}`).show();
    }
    $("#next").show();
    //Si eres el indice 0, esconde el botón.
    if (currentIndex == 0) $(this).hide();
  });


  function renderQueryResults(data) {
    //vacio las imagenes.
    images = [];
    if (data.error != undefined) {
      $("#status").html("Error: " + data.error);
    } else {
      //Reinicio el index en nueva búsqueda.
      currentIndex = 0;
      $("#status").html("" + data.num_results + " result(s)");
      //Si hay menos de 4 imágenes en el query, esta variable
      //me ayuda a no renderizar los <img> que no se necesitan.
      let maxImagesToRender = (data.num_results >= 4) ? 4 : data.num_results;
      let i;
      //Se renderizan las imagenes que se pudieron renderizar.
      images = data.results;
      for (i = 0; i < maxImagesToRender; i++) {
        console.log(data);
        $(`#img${i}`).attr("src", images[i]);

      }
      console.log("Current i: ", i);
      //Esconde los <img> que no se necesitan.
      for (; i <= 3; i++) {
        $(`#img${i}`).hide();
      }
      $("#previous").hide();
      //Si hay mas de 4 results, entonces el boton next se hablita.
      if (data.num_results > 4) {
        $("#next").show();
      }

    }
  }
});
