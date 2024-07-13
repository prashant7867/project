const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req.res.next)).
        catch((error)=>next(err))
    }
}


export{asyncHandler}

// const asynchandler=()=>{}
// const asynchandler=(func)=>()=>{}
// const asynchandler=(func)=>async ()=>{}

// const asyncHandler=(fn)=>async(err,req,res,next)=>{
//      try{
//           await fn(req,res,next)
//      }catch(error){
//         res.status(err.code ||500).json({
//             success:false,
//             message:error.message
//         })
//      }
// }