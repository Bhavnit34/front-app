// function to transition the selected graph tile
function toggleTile(tileID) {
  var tile = document.getElementById(tileID);
  var tiles = document.getElementById('attrGraphWrapper').children;

  if ($(tile).css("display") != "none") { // i.e. we need to hide the tile
    var needToDrop = true; // this flag stops the function from running when transitions occur for expanding

    // first collapse the tile and then re-order
    $('#'+tileID).hide("slow").promise().done(function(){
        if(!needToDrop) { return; }

        // loop to find all the other tiles that we need to re-order
        for (var i = 0; i < tiles.length; i++) {
        if ($('#'+tiles[i].id).css("display") != "none") {
          if(tiles[i].id != tileID) {
            if(parseInt($('#'+tiles[i].id).css("order")) > parseInt(tile.style.order)){
              // decrement each tile order below the current by 1
              var currentOrder = parseInt($('#'+tiles[i].id).css("order"));
              $('#'+tiles[i].id).css("order", currentOrder - 1);

            }
          }
        }
      }
      // reset collapsed tile to last order
      var lastOrder = parseInt(document.getElementById('attrGraphWrapper').children.length);
      $('#'+tileID).css("order", lastOrder);

      // hide wrapper box if no graphs visible
      var hiddenCount = 0;
      for (var i = 0; i < tiles.length; i++) {
        if ($('#'+tiles[i].id).css("display") == "none") {
          hiddenCount++;
        }
      }
      if(hiddenCount == tiles.length) {
        $('.attrGraphWrapper').hide(500);
      }
      needToDrop = false;
    });



  } else { // else show a tile
    var needToExpand = true;
    $('.attrGraphWrapper').show(500).css("display", "flex").promise().done(function() {
        if(!needToExpand) { return; }

        // reassign orders of tiles so that recent appears at the top
        for (var i = 0; i < tiles.length; i++) {
          if ($('#'+tiles[i].id).css("display") != "none") {
            if (tiles[i].id != tileID) {
              // incremend the order of all other tiles
              var currentOrder = parseInt($('#' + tiles[i].id).css("order"));
              $('#' + tiles[i].id).css("order", currentOrder + 1);
            }
          }
        }
        // order selected tile at the top and display
        var newTile = '#' + tileID;
        $(newTile).css("order", 1);
        $(newTile).show("slow").css("display","inline");
        needToExpand = false;
      });
    }

}





