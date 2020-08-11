import React from 'react'
 const PageNotFound = () => {
     return (  
       <div className="p-fluid">
          <div className="p-grid">
            <div className="p-col-12">
              <div className="card card-w-title" >
                  <h2 
                    style={{
                       textAlign:"center" , 
                       marginTop:"200px" , 
                       marginBottom:"200px",
                       fontSize:"1cm",
                       fontStyle:"italic"
                       }} > 
                    Sorry! Page Not found. 
                  </h2>
              </div>
           </div>
         </div>
       </div>
     );
 }
  
 export default PageNotFound;