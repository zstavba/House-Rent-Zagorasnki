class ErrorsController {
    
    notFound = (req: any, res: any, next: any) => {
        res.status(404);

        if(req.accepts("html")){
            res.render("dashboard/errors/404");

            return;
        }

        
    }

    errorMessage = (req:any, res: any, next: any) => {

    }
}


export default ErrorsController