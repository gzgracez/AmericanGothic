     $(window).load(function(){    
         
           $('#introtitle').click(function(){ 
                $('#introtitle').slideUp(1234,function(){
                   $(this).remove();
                });
            }); 
     
     }); //window